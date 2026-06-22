const Pesanan = require("../models/Pesanan");
const Ternak = require("../models/Ternak");
const User = require("../models/user");

// GET pesanan untuk penjual yang sedang login
exports.getPesananPenjual = async (req, res) => {
  try {
    const penjualId = req.user.id;

    const pesanan = await Pesanan.findAll({
      where: { penjualId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(pesanan);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil pesanan penjual",
      error: error.message,
    });
  }
};

// GET pesanan milik pembeli yang sedang login
exports.getPesananPembeli = async (req, res) => {
  try {
    const pembeliId = req.user.id;

    const pesanan = await Pesanan.findAll({
      where: { pembeliId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(pesanan);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil pesanan pembeli",
      error: error.message,
    });
  }
};

// GET detail pesanan berdasarkan ID
exports.getPesananById = async (req, res) => {
  try {
    const { id } = req.params;

    const pesanan = await Pesanan.findByPk(id);

    if (!pesanan) {
      return res.status(404).json({
        message: "Pesanan tidak ditemukan",
      });
    }

    res.status(200).json(pesanan);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil detail pesanan",
      error: error.message,
    });
  }
};

// POST pembeli membuat pesanan
exports.createPesanan = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const pembeliId = req.user.id;
    const {
  ternakId,
  jumlah,
  metodePembayaran,
} = req.body;

    if (!ternakId || !jumlah) {
      return res.status(400).json({
        message: "ternakId dan jumlah wajib diisi",
      });
    }

    const pembeli = await User.findByPk(pembeliId);

    const ternak = await Ternak.findByPk(ternakId);

    if (!ternak) {
      return res.status(404).json({
        message: "Data ternak tidak ditemukan",
      });
    }

    if (!ternak.userId) {
      return res.status(400).json({
        message: "Ternak belum memiliki penjual",
      });
    }

    const total = Number(ternak.harga) * Number(jumlah);


        const pesanan = await Pesanan.create({
      pembeliId,
      penjualId: ternak.userId,
      ternakId: ternak.id,

      namaPembeli: pembeli?.nama || "Pembeli",
      namaTernak: ternak.nama,

      jumlah,
      total,

      metodePembayaran,

      status:
        metodePembayaran === "Transfer"
          ? "Sudah Dibayar"
          : "Menunggu",
    });
    console.log("METODE:", metodePembayaran);

    res.status(201).json({
      message: "Pesanan berhasil dibuat",
      data: pesanan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat pesanan",
      error: error.message,
    });
  }
};

// PATCH update status pesanan oleh penjual
exports.updateStatusPesanan = async (req, res) => {
  try {
    const penjualId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (
      !["Menunggu", "Diproses", "Selesai", "Dibatalkan"].includes(status)
    ) {
      return res.status(400).json({
        message: "Status tidak valid",
      });
    }

    const pesanan = await Pesanan.findOne({
      where: {
        id,
        penjualId,
      },
    });

    if (!pesanan) {
      return res.status(404).json({
        message: "Pesanan tidak ditemukan",
      });
    }

    pesanan.status = status;

    await pesanan.save();

    res.status(200).json({
      message: "Status pesanan berhasil diperbarui",
      data: pesanan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui status pesanan",
      error: error.message,
    });
  }
};