const request = require("supertest");
const app = require("../app");
const db = require("../config/database");

require("../models/user");

describe("Unit Test Modul Auth", () => {

  let token = "";

  const userData = {
  nama: "Suci Test",
  email: `suci${Date.now()}@test.com`,
  password: "123456",
  role: "pembeli",
  noTelepon: "08123456789",
  alamat: "Toraja"
};

  beforeAll(async () => {
    await db.sync();
  });

  test("POST /api/auth/register berhasil", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send(userData);

  console.log(response.body);

  expect(response.statusCode).toBe(201);
});

    test("POST /api/auth/register email duplikat", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(response.statusCode).toBe(400);
  });

    test("POST /api/auth/register email tidak valid", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        nama: "Suci",
        email: "email-salah",
        password: "123456",
        role: "pembeli"
      });

    expect(response.statusCode).toBe(400);
  });

    test("POST /api/auth/register password terlalu pendek", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        nama: "Suci",
        email: "suci123@test.com",
        password: "123",
        role: "pembeli"
      });

    expect(response.statusCode).toBe(400);
  });

    test("POST /api/auth/login berhasil", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: userData.email,
        password: userData.password
      });

    token = response.body.token;

    expect(response.statusCode).toBe(200);
    expect(token).toBeDefined();
  });

    test("POST /api/auth/login password salah", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: userData.email,
        password: "salah123"
      });

    expect(response.statusCode).toBe(401);
  });

    test("POST /api/auth/login email tidak ditemukan", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "tidakada@test.com",
        password: "123456"
      });

    expect(response.statusCode).toBe(404);
  });

    test("GET /api/auth/profile tanpa token", async () => {
    const response = await request(app)
      .get("/api/auth/profile");

    expect(response.statusCode).toBe(401);
  });

    test("GET /api/auth/profile berhasil", async () => {
    const response = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

    test("PUT /api/auth/profile berhasil", async () => {
    const response = await request(app)
      .put("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nama: "Suci Update",
        noTelepon: "08111111111",
        alamat: "Makale"
      });

    expect(response.statusCode).toBe(200);
  });

    test("PUT /api/auth/profile nama kosong", async () => {
    const response = await request(app)
      .put("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nama: ""
      });

    expect(response.statusCode).toBe(400);
  });

  afterAll(async () => {
    await db.close();
  });

});