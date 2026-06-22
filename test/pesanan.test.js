const request = require("supertest");
const app = require("../app");
const db = require("../config/database");

describe("Unit Test Modul Pesanan", () => {

  let tokenPembeli;
  let tokenPenjual;
  let ternakId;

  beforeAll(async () => {

    const penjualEmail = `penjual${Date.now()}@test.com`;
    const pembeliEmail = `pembeli${Date.now()}@test.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        nama: "Penjual Test",
        email: penjualEmail,
        password: "123456",
        role: "penjual"
      });

    await request(app)
      .post("/api/auth/register")
      .send({
        nama: "Pembeli Test",
        email: pembeliEmail,
        password: "123456",
        role: "pembeli"
      });

    const loginPenjual = await request(app)
      .post("/api/auth/login")
      .send({
        email: penjualEmail,
        password: "123456"
      });

    tokenPenjual = loginPenjual.body.token;

    const loginPembeli = await request(app)
      .post("/api/auth/login")
      .send({
        email: pembeliEmail,
        password: "123456"
      });

    tokenPembeli = loginPembeli.body.token;

    const ternak = await request(app)
      .post("/api/ternak")
      .set("Authorization", `Bearer ${tokenPenjual}`)
      .send({
        nama: "Kerbau Pesanan",
        jenis: "Kerbau",
        harga: 5000000,
        usia: "2 Tahun",
        kondisi: "Sehat",
        stok: 1,
        lokasi: "Toraja",
        deskripsi: "Testing"
      });
    console.log("TERNAK RESPONSE:", ternak.body);
    expect(ternak.statusCode).toBe(201);
    ternakId = ternak.body.data.id;

  });

  test("GET pesanan penjual tanpa token", async () => {

    const response = await request(app)
      .get("/api/pesanan/penjual");

    expect(response.statusCode).toBe(401);

  });

  test("GET pesanan pembeli tanpa token", async () => {

    const response = await request(app)
      .get("/api/pesanan/pembeli");

    expect(response.statusCode).toBe(401);

  });

  test("POST pesanan valid", async () => {

    const response = await request(app)
      .post("/api/pesanan")
      .set("Authorization", `Bearer ${tokenPembeli}`)
      .send({
        ternakId,
        jumlah: 1
      });

    expect([200,201]).toContain(response.statusCode);

  });

  test("GET pesanan pembeli dengan token", async () => {

    const response = await request(app)
      .get("/api/pesanan/pembeli")
      .set("Authorization", `Bearer ${tokenPembeli}`);

    expect(response.statusCode).toBe(200);

  });

  test("GET pesanan penjual dengan token", async () => {

    const response = await request(app)
      .get("/api/pesanan/penjual")
      .set("Authorization", `Bearer ${tokenPenjual}`);

    expect(response.statusCode).toBe(200);

  });
test("POST pesanan tanpa ternakId", async () => {

  const response = await request(app)
    .post("/api/pesanan")
    .set("Authorization", `Bearer ${tokenPembeli}`)
    .send({
      jumlah: 1
    });

  expect(response.statusCode).toBe(400);

});

test("POST pesanan ternak tidak ditemukan", async () => {

  const response = await request(app)
    .post("/api/pesanan")
    .set("Authorization", `Bearer ${tokenPembeli}`)
    .send({
      ternakId: 999999,
      jumlah: 1
    });

  expect(response.statusCode).toBe(404);

});
  afterAll(async () => {
    await db.close();
  });

});