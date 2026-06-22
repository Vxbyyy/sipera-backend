const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Laporan = sequelize.define("Laporan", {
  kategori: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "Menunggu",
  },

  balasan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  balasanUser: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// RELASI
Laporan.belongsTo(User, {
  foreignKey: "userId",
});

User.hasMany(Laporan, {
  foreignKey: "userId",
});

module.exports = Laporan;