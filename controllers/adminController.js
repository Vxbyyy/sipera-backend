const User = require("../models/user");
const Ternak = require("../models/Ternak");


// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "nama",
        "email",
        "role",
        "noTelepon",
        "alamat",
        "status",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data pengguna",
      error: error.message,
    });
  }
};

// GET /api/admin/ternak
const getAllTernak = async (req, res) => {
  try {
    const ternak = await Ternak.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(ternak);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data ternak",
      error: error.message,
    });
  }
};

// PATCH /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Aktif", "Ditangguhkan"].includes(status)) {
      return res.status(400).json({
        message: "Status tidak valid. Gunakan Aktif atau Ditangguhkan.",
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "Pengguna tidak ditemukan",
      });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      message: "Status pengguna berhasil diperbarui",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui status pengguna",
      error: error.message,
    });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "Pengguna tidak ditemukan",
      });
    }

    // Admin tidak boleh menghapus akun admin lain atau dirinya sendiri
    if (user.role === "admin") {
      return res.status(403).json({
        message: "Akun admin tidak boleh dihapus.",
      });
    }

    await user.destroy();

    res.status(200).json({
      message: "Pengguna berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus pengguna",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getAllTernak,
  updateUserStatus,
  deleteUser,
};