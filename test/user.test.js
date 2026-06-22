const db = require("../config/database");
const User = require("../models/user");

describe("Unit Test Modul User", () => {

  beforeAll(async () => {
    await db.sync();
  });

  test("Berhasil menambahkan user", async () => {

    const user = await User.create({
    nama: "User Testing",
    email: `user${Date.now()}@test.com`,
    password: "123456",
    role: "pembeli"
  });

    expect(user.nama).toBe("User Testing");
  });

  test("Berhasil menampilkan data user", async () => {

    const users = await User.findAll();

    expect(Array.isArray(users)).toBe(true);
  });

  afterAll(async () => {
    await db.close();
  });

});