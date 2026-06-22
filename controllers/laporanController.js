const Laporan = require("../models/Laporan");
const User = require("../models/user");

// CREATE LAPORAN
exports.createLaporan = async (req, res) => {
  try {
    const laporan = await Laporan.create({
      kategori: req.body.kategori,
      deskripsi: req.body.deskripsi,
      userId: req.body.userId,
      status: "Menunggu",
    });

    res.status(201).json(laporan);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SEMUA LAPORAN (ADMIN)
exports.getAllLaporan = async (req, res) => {
  try {
    const laporan = await Laporan.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "nama", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(laporan);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};

// GET LAPORAN USER
exports.getLaporanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const laporan = await Laporan.findAll({
      where: {
        userId,
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(laporan);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil laporan user",
      error: error.message,
    });
  }
};

// BALAS ADMIN
exports.balasLaporan = async (req, res) => {
  try {

    const { id } = req.params;
    const { balasan, status } = req.body;

    const laporan = await Laporan.findByPk(id);

    if (!laporan) {
      return res.status(404).json({
        message: "Laporan tidak ditemukan",
      });
    }

    if (balasan !== undefined) {
      laporan.balasan = balasan;
    }

    if (status !== undefined) {
      laporan.status = status;
    }

    await laporan.save();

    res.status(200).json({
      message: "Laporan berhasil diperbarui",
      laporan,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// USER BALAS KEMBALI
exports.balasKembaliUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { balasanUser } = req.body;

    const laporan = await Laporan.findByPk(id);

    if (!laporan) {
      return res.status(404).json({
        message: "Laporan tidak ditemukan",
      });
    }

    laporan.balasanUser = balasanUser;

    // status kembali menunggu admin
    laporan.status = "Menunggu";

    await laporan.save();

    res.status(200).json({
      message: "Balasan user berhasil dikirim",
      laporan,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};