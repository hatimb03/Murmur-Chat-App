// controllers/messageController.js
const messageModel = require("../models/messageModel");
const getUserDataFromRequest = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const getMessages = async function (req, res) {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      error: true,
      message: "Invalid userId format",
    });
  }

  try {
    const userData = await getUserDataFromRequest(req);
    const ourUserId = userData.userId;

    const messages = await messageModel
      .find({
        sender: { $in: [userId, ourUserId] },
        recipient: { $in: [userId, ourUserId] },
      })
      .sort({ createdAt: 1 });

    if (!messages || messages.length === 0) {
      return res.status(200).json({
        error: false,
        message: "No messages found",
        data: [],
      });
    }

    return res.status(200).json({
      error: false,
      messages,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: err.message || "Internal Server Error",
    });
  }
};

module.exports = { getMessages };
