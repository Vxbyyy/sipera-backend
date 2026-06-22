const express = require("express");
const { body, validationResult } = require("express-validator");

const router = express.Router();
const authController = require("../controllers/authController");

const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Input tidak valid",
      errors: errors.array(),
    });
  }

  next();
};

router.post(
  "/register",
  [
    body("nama").notEmpty().withMessage("Nama wajib diisi"),
    body("email").isEmail().withMessage("Email tidak valid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
    body("role")
      .isIn(["pembeli", "penjual", "admin"])
      .withMessage("Role tidak valid"),
  ],
  validateRequest,
  authController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email tidak valid"),
    body("password").notEmpty().withMessage("Password wajib diisi"),
  ],
  validateRequest,
  authController.login
);

// Ambil profil user login
router.get(
  "/profile",
  verifyToken,
  allowRoles("admin", "penjual", "pembeli"),
  authController.getProfile
);

// Update profil user login
router.put(
  "/profile",
  verifyToken,
  allowRoles("admin", "penjual", "pembeli"),
  [
    body("nama").optional().notEmpty().withMessage("Nama tidak boleh kosong"),
    body("noTelepon").optional(),
    body("alamat").optional(),
    body("namaBank").optional(),
    body("nomorRekening").optional(),
    body("namaPemilikRekening").optional(),
  ],
  validateRequest,
  authController.updateProfile
);

module.exports = router;