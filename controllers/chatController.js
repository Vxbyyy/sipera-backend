const { Op } = require("sequelize");
const Chat = require("../models/Chat");
const User = require("../models/user");

// GET /api/chat/conversations
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      order: [["createdAt", "DESC"]],
    });

    const partnerMap = new Map();

    chats.forEach((chat) => {
      const partnerId =
        Number(chat.senderId) === Number(userId)
          ? Number(chat.receiverId)
          : Number(chat.senderId);

      if (!partnerMap.has(partnerId)) {
        partnerMap.set(partnerId, chat);
      }
    });

    const partnerIds = Array.from(partnerMap.keys());

    if (partnerIds.length === 0) {
      return res.status(200).json([]);
    }

    const users = await User.findAll({
      where: {
        id: partnerIds,
      },
      attributes: ["id", "nama", "email", "role"],
    });

    const conversations = users.map((user) => {
      const lastChat = partnerMap.get(Number(user.id));

      return {
        userId: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        lastMessage: lastChat?.message || "",
        lastTime: lastChat?.createdAt || null,
      };
    });

    conversations.sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil daftar chat",
      error: error.message,
    });
  }
};

// GET /api/chat/search-penjual?nama=lulu
exports.searchPenjual = async (req, res) => {
  try {
    const { nama } = req.query;

    if (!nama || !nama.trim()) {
      return res.status(400).json({
        message: "Nama penjual wajib diisi",
      });
    }

    const penjual = await User.findAll({
      where: {
        role: "penjual",
        nama: {
          [Op.like]: `%${nama.trim()}%`,
        },
      },
      attributes: ["id", "nama", "email", "role"],
      limit: 10,
      order: [["nama", "ASC"]],
    });

    res.status(200).json(penjual);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mencari penjual",
      error: error.message,
    });
  }
};

// GET /api/chat/messages/:partnerId
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { partnerId } = req.params;

    const messages = await Chat.findAll({
      where: {
        [Op.or]: [
          {
            senderId: userId,
            receiverId: partnerId,
          },
          {
            senderId: partnerId,
            receiverId: userId,
          },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil pesan",
      error: error.message,
    });
  }
};

// POST /api/chat
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, message } = req.body;

    if (!receiverId || !message || !message.trim()) {
      return res.status(400).json({
        message: "receiverId dan message wajib diisi",
      });
    }

    const receiver = await User.findByPk(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "Penerima pesan tidak ditemukan",
      });
    }

    const chat = await Chat.create({
      senderId,
      receiverId,
      message: message.trim(),
    });

    res.status(201).json({
      message: "Pesan berhasil dikirim",
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengirim pesan",
      error: error.message,
    });
  }
};