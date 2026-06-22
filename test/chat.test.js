const request = require("supertest");
const app = require("../app");
const db = require("../config/database");

describe("Unit Test Modul Chat", () => {

  let tokenPembeli;
  let tokenPenjual;
  let penjualId;

  beforeAll(async () => {

    const pembeliEmail = `pembeli${Date.now()}@test.com`;
    const penjualEmail = `penjual${Date.now()}@test.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        nama: "Pembeli Chat",
        email: pembeliEmail,
        password: "123456",
        role: "pembeli"
      });

    await request(app)
      .post("/api/auth/register")
      .send({
        nama: "Penjual Chat",
        email: penjualEmail,
        password: "123456",
        role: "penjual"
      });

    const loginPembeli = await request(app)
      .post("/api/auth/login")
      .send({
        email: pembeliEmail,
        password: "123456"
      });

    tokenPembeli = loginPembeli.body.token;
    console.log("LOGIN PEMBELI:", loginPembeli.body);

    const loginPenjual = await request(app)
      .post("/api/auth/login")
      .send({
        email: penjualEmail,
        password: "123456"
      });

    tokenPenjual = loginPenjual.body.token;
    console.log("LOGIN PENJUAL:", loginPenjual.body);
    penjualId = loginPenjual.body.user.id;

  });

  test("GET conversations tanpa token", async () => {

    const response = await request(app)
      .get("/api/chat/conversations");

    expect(response.statusCode).toBe(401);

  });

  test("GET search penjual dengan token", async () => {

    const response = await request(app)
      .get("/api/chat/search-penjual?nama=Penjual")
      .set("Authorization", `Bearer ${tokenPembeli}`);

    expect(response.statusCode).toBe(200);

  });

  test("POST kirim pesan berhasil", async () => {

    const response = await request(app)
      .post("/api/chat")
      .set("Authorization", `Bearer ${tokenPembeli}`)
      .send({
        receiverId: penjualId,
        message: "Halo dari test"
      });

    expect([200,201]).toContain(response.statusCode);

  });

  test("GET messages berhasil", async () => {

    const response = await request(app)
      .get(`/api/chat/messages/${penjualId}`)
      .set("Authorization", `Bearer ${tokenPembeli}`);

    expect(response.statusCode).toBe(200);

  });

  test("GET conversations berhasil", async () => {

    const response = await request(app)
      .get("/api/chat/conversations")
      .set("Authorization", `Bearer ${tokenPembeli}`);

    expect(response.statusCode).toBe(200);

  });

  afterAll(async () => {
    await db.close();
  });

});