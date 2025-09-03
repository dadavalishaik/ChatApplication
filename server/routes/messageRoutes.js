// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../models/messageModel");

// get recent messages for conversation
router.get("/:conversationId/recent", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ createdAt: -1 }).limit(50);
    res.json(messages.reverse()); // return oldest-first
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages", error: err.message });
  }
});

module.exports = router;
