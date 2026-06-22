const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllTernak,
  updateUserStatus,
  deleteUser,
} = require("../controllers/adminController");

const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

router.get("/users", verifyToken, allowRoles("admin"), getAllUsers);
router.get("/ternak", verifyToken, allowRoles("admin"), getAllTernak);

router.patch(
  "/users/:id/status",
  verifyToken,
  allowRoles("admin"),
  updateUserStatus
);

router.delete("/users/:id", verifyToken, allowRoles("admin"), deleteUser);

module.exports = router;