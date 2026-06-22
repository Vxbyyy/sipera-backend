const Ternak = require("../models/Ternak");
const User = require("../models/user");

// GET semua data ternak
exports.getAll = async (req, res) => {
  try {
    const data = await Ternak.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data ternak",
      error: error.message,
    });
  }
};

// GET detail ternak berdasarkan ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Ternak.findByPk(id);

    if (!data) {
      return res.status(404).json({
        message: "Data ternak tidak ditemukan",
      });
    }

    if (
      req.user?.role === "penjual" &&
      Number(data.userId) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        message: "Anda tidak memiliki akses ke data ternak ini",
      });
    }

    const penjual = data.userId
      ? await User.findByPk(data.userId, {
          attributes: [
            "id",
            "nama",
            "email",
            "noTelepon",
            "alamat",
            "namaBank",
            "nomorRekening",
            "namaPemilikRekening",
          ],
        })
      : null;

    res.status(200).json({
      ...data.toJSON(),
      penjual,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil detail ternak",
      error: error.message,
    });
  }
};

// POST tambah data ternak + foto
exports.create = async (req, res) => {
  try {
    const {
      nama,
      jenis,
      harga,
      usia,
      kondisi,
      stok,
      lokasi,
      deskripsi,
    } = req.body;

    const foto = req.file ? req.file.filename : null;

    const data = await Ternak.create({
      nama,
      jenis,
      harga,
      usia,
      kondisi,
      stok,
      lokasi,
      deskripsi,
      userId: req.user ? req.user.id : null,
      foto,
    });

    res.status(201).json({
      message: "Data ternak berhasil ditambahkan",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menambahkan data ternak",
      error: error.message,
    });
  }
};

// PUT edit data ternak + optional foto
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Ternak.findByPk(id);

    if (!data) {
      return res.status(404).json({
        message: "Data ternak tidak ditemukan",
      });
    }

    if (
      req.user?.role === "penjual" &&
      Number(data.userId) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        message: "Anda tidak memiliki akses untuk mengubah data ternak ini",
      });
    }

    const {
      nama,
      jenis,
      harga,
      usia,
      kondisi,
      stok,
      lokasi,
      deskripsi,
    } = req.body;

    const foto = req.file ? req.file.filename : data.foto;

    await data.update({
      nama,
      jenis,
      harga,
      usia,
      kondisi,
      stok,
      lokasi,
      deskripsi,
      foto,
    });

    res.status(200).json({
      message: "Data ternak berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui data ternak",
      error: error.message,
    });
  }
};

// DELETE hapus data ternak
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Ternak.findByPk(id);

    if (!data) {
      return res.status(404).json({
        message: "Data ternak tidak ditemukan",
      });
    }

    if (
      req.user?.role === "penjual" &&
      Number(data.userId) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        message: "Anda tidak memiliki akses untuk menghapus data ternak ini",
      });
    }

    await data.destroy();

    res.status(200).json({
      message: "Data ternak berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus data ternak",
      error: error.message,
    });
  }
}; 