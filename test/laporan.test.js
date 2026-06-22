describe("Unit Test Modul Laporan", () => {
  test("Dummy Laporan Test", () => {
    expect(true).toBe(true);
  });
});const request = require("supertest");
const app = require("../app");
const db = require("../config/database");

describe("Unit Test Modul Laporan", () => {

test("GET /api/laporan berhasil", async () => {

const response = await request(app)
  .get("/api/laporan");

expect(response.statusCode).toBe(200);


});

test("POST /api/laporan berhasil", async () => {

const response = await request(app)
  .post("/api/laporan")
  .send({
    kategori: "Bug",
    deskripsi: "Testing laporan",
    userId: 1
  });

expect([200, 201]).toContain(response.statusCode);


});

test("GET /api/laporan/user/1 berhasil", async () => {


const response = await request(app)
  .get("/api/laporan/user/1");

expect(response.statusCode).toBe(200);


});

test("PATCH /api/laporan/999999/balas laporan tidak ditemukan", async () => {


const response = await request(app)
  .patch("/api/laporan/999999/balas")
  .send({
    balasan: "Test balasan",
    status: "Selesai"
  });

expect([404, 500]).toContain(response.statusCode);


});

afterAll(async () => {
await db.close();
});

});
