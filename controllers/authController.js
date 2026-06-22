const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getSafeUser = (user) => {
  return {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    noTelepon: user.noTelepon,
    alamat: user.alamat,
    namaBank: user.namaBank,
    nomorRekening: user.nomorRekening,
    namaPemilikRekening: user.namaPemilikRekening,
    status: user.status,
  };
};

exports.register = async (req, res) => {
  try {
    const {
      nama,
      email,
      password,
      role,
      noTelepon,
      alamat,
      namaBank,
      nomorRekening,
      namaPemilikRekening,
    } = req.body;

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email sudah digunakan",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nama,
      email,
      password: hashedPassword,
      role,
      noTelepon,
      alamat,
      namaBank,
      nomorRekening,
      namaPemilikRekening,
    });

    res.status(201).json({
      message: "Registrasi berhasil",
      user: getSafeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      message: "Registrasi gagal",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Email tidak ditemukan",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Password salah",
      });
    }

    if (user.status === "Ditangguhkan") {
      return res.status(403).json({
        message: "Akun Anda sedang ditangguhkan. Silakan hubungi admin.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: getSafeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      message: "Login gagal",
      error: error.message,
    });
  }
};

// GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Profil berhasil diambil",
      user: getSafeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil profil",
      error: error.message,
    });
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const {
      nama,
      noTelepon,
      alamat,
      namaBank,
      nomorRekening,
      namaPemilikRekening,
    } = req.body;

    await user.update({
      nama: nama ?? user.nama,
      noTelepon: noTelepon ?? user.noTelepon,
      alamat: alamat ?? user.alamat,
      namaBank: namaBank ?? user.namaBank,
      nomorRekening: nomorRekening ?? user.nomorRekening,
      namaPemilikRekening:
        namaPemilikRekening ?? user.namaPemilikRekening,
    });

    res.status(200).json({
      message: "Profil berhasil diperbarui",
      user: getSafeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui profil",
      error: error.message,
    });
  }
};