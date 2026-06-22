const { DataTypes } = require("sequelize");
const db = require("../config/database");

const User = db.define("User", {
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM("admin", "penjual", "pembeli"),
    allowNull: false,
  },

  noTelepon: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  alamat: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  namaBank: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  nomorRekening: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  namaPemilikRekening: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  status: {
    type: DataTypes.ENUM("Aktif", "Ditangguhkan"),
    allowNull: false,
    defaultValue: "Aktif",
  },
});

module.exports = User;