const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Pesanan = db.define("Pesanan", {
  pembeliId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  penjualId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  ternakId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  namaPembeli: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  namaTernak: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  jumlah: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },

  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  metodePembayaran: {
    type: DataTypes.ENUM("COD", "Transfer"),
    allowNull: false,
    defaultValue: "COD",
  },

  status: {
    type: DataTypes.ENUM(
      "Menunggu",
      "Sudah Dibayar",
      "Diproses",
      "Selesai",
      "Dibatalkan"
    ),
    allowNull: false,
    defaultValue: "Menunggu",
  },
});

module.exports = Pesanan;