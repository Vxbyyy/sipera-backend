const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Ternak = db.define("Ternak", {
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  jenis: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  harga: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  usia: {
    type: DataTypes.STRING,
  },

  kondisi: {
    type: DataTypes.STRING,
  },

  stok: {
    type: DataTypes.INTEGER,
  },

  lokasi: {
    type: DataTypes.STRING,
  },

  deskripsi: {
    type: DataTypes.TEXT,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  foto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Ternak;