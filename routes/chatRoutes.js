const express = require("express");
const router = express.Router();

const {
  getConversations,
  getMessages,
  sendMessage,
  searchPenjual,
} = require("../controllers/chatController");

const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

router.get(
  "/conversations",
  verifyToken,
  allowRoles("penjual", "pembeli"),
  getConversations
);

router.get(
  "/search-penjual",
  verifyToken,
  allowRoles("pembeli"),
  searchPenjual
);

router.get(
  "/messages/:partnerId",
  verifyToken,
  allowRoles("penjual", "pembeli"),
  getMessages
);

router.post(
  "/",
  verifyToken,
  allowRoles("penjual", "pembeli"),
  sendMessage
);

module.exports = router;