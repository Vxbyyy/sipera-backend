const request = require("supertest");
const app = require("../app");
const db = require("../config/database");

describe("Unit Test Modul Ternak", () => {

  let token = "";

  const penjualData = {
    nama: "Penjual Test",
    email: `penjual${Date.now()}@test.com`,
    password: "123456",
    role: "penjual"
  };

    beforeAll(async () => {

      const register = await request(app)
        .post("/api/auth/register")
        .send(penjualData);

      console.log("REGISTER RESPONSE:", register.body);

      const login = await request(app)
        .post("/api/auth/login")
        .send({
          email: penjualData.email,
          password: penjualData.password
        });

      console.log("LOGIN RESPONSE:", login.body);

      token = login.body.token;
    });

  test("GET /api/ternak berhasil menampilkan data ternak", async () => {

    const response = await request(app)
      .get("/api/ternak");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /api/ternak berhasil menambahkan data ternak", async () => {

    const response = await request(app)
      .post("/api/ternak")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nama: "Kerbau Test",
        jenis: "Kerbau",
        harga: 100000000,
        usia: "6 Tahun",
        kondisi: "Sehat",
        stok: 2,
        lokasi: "Toraja Utara",
        deskripsi: "Data ternak untuk unit test"
      });

    console.log(response.body);

    expect(response.statusCode).toBe(201);
  });

  test("GET detail ternak tidak ditemukan", async () => {

  const response = await request(app)
    .get("/api/ternak/999999")
    .set("Authorization", `Bearer ${token}`);

  expect(response.statusCode).toBe(404);

});

test("PUT ternak tidak ditemukan", async () => {

  const response = await request(app)
    .put("/api/ternak/999999")
    .set("Authorization", `Bearer ${token}`)
    .send({
      nama: "Test",
      jenis: "Kerbau",
      harga: 1000,
      usia: "1 Tahun",
      kondisi: "Sehat",
      stok: 1,
      lokasi: "Toraja",
      deskripsi: "Test"
    });

  expect(response.statusCode).toBe(404);

});

test("DELETE ternak tidak ditemukan", async () => {

  const response = await request(app)
    .delete("/api/ternak/999999")
    .set("Authorization", `Bearer ${token}`);

  expect(response.statusCode).toBe(404);

});

  afterAll(async () => {
    await db.close();
  });

});