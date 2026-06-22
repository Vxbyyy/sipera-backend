const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");


require("./models/Ternak");
require("./models/user");
require("./models/Chat");
require("./models/Pesanan");

const ternakRoutes = require("./routes/ternakRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoutes");
const laporanRoutes = require("./routes/laporanRoutes");
const pesananRoutes = require("./routes/pesananRoutes");

const app = express();
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    message: "Terlalu banyak request, silakan coba lagi nanti.",
  },
});

//app.use(limiter);

app.use(cors());
app.use(express.json());

// agar file foto di folder uploads bisa diakses dari browser/frontend
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/ternak", ternakRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/laporan", laporanRoutes);
app.use("/api/pesanan", pesananRoutes);

module.exports = app;