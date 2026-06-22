const express = require("express");
const multer = require("multer");
const path = require("path");
const { body, validationResult } = require("express-validator");

const router = express.Router();
const controller = require("../controllers/ternakController");

const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Input data ternak tidak valid",
      errors: errors.array(),
    });
  }

  next();
};

const fs = require("fs");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const ternakValidation = [
  body("nama").notEmpty().withMessage("Nama ternak wajib diisi"),
  body("jenis").notEmpty().withMessage("Jenis ternak wajib diisi"),
  body("harga").isNumeric().withMessage("Harga harus berupa angka"),
  body("usia").notEmpty().withMessage("Usia wajib diisi"),
  body("kondisi").notEmpty().withMessage("Kondisi wajib diisi"),
  body("stok").isNumeric().withMessage("Stok harus berupa angka"),
  body("lokasi").notEmpty().withMessage("Lokasi wajib diisi"),
  body("deskripsi").notEmpty().withMessage("Deskripsi wajib diisi"),
];

// Semua user boleh melihat daftar ternak
router.get("/", controller.getAll);

// Detail ternak boleh dilihat penjual, pembeli, dan admin
router.get(
  "/:id",
  verifyToken,
  allowRoles("penjual", "pembeli", "admin"),
  controller.getById
);

// Hanya penjual yang boleh menambahkan ternak
router.post(
  "/",
  verifyToken,
  allowRoles("penjual"),
  upload.single("foto"),
  ternakValidation,
  validateRequest,
  controller.create
);

// Hanya penjual yang boleh mengedit ternak miliknya
router.put(
  "/:id",
  verifyToken,
  allowRoles("penjual"),
  upload.single("foto"),
  ternakValidation,
  validateRequest,
  controller.update
);

// Hanya penjual yang boleh menghapus ternak miliknya
router.delete(
  "/:id",
  verifyToken,
  allowRoles("penjual"),
  controller.remove
);

module.exports = router;