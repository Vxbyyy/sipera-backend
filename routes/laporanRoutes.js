const express = require("express");
const router = express.Router();

const {
  createLaporan,
  getAllLaporan,
  balasLaporan,
  getLaporanUser,
  balasKembaliUser,
} = require("../controllers/laporanController");

// tambah laporan
router.post("/", createLaporan);

// semua laporan admin
router.get("/", getAllLaporan);

// laporan milik user
router.get("/user/:userId", getLaporanUser);

// admin membalas
router.patch("/:id/balas", balasLaporan);

// user membalas kembali
router.patch("/:id/balas-user", balasKembaliUser);

module.exports = router;