const Message = require("../models/messageModel");
const { produceMessage } = require("../config/Kafka");
const admin = require("../config/firebase");

// ✅ Send message (publish to Kafka)
const sendMessage = async (req, res) => {
  try {
    const { from, to, text } = req.body;
    if (!to || !text) {
      return res.status(400).json({ message: " to, and text are required" });
    }

    //verify that "to" is also a valid Firebase user

    let toUser;
    try {
      toUser = await admin.auth().getUser(to);
    } catch {
      return res.status(400).json({ message: "Recepient user not found" });
    }

    const conversationId = [from, to].sort().join("_"); //always sorted

    const msgObj = {
      conversationId,
      from,
      to,
      text,
      createdAt: new Date(),
    };

    // Publish to Kafka
    await produceMessage("messages", msgObj);

    res.json({ success: true, message: "Message sent to Kafka", data: msgObj });
  } catch (err) {
    res.status(500).json({ message: "Failed to send message", error: err.message });
  }
};

// get recent messages
const getRecentMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.uid;

    // check if user is participant
    // if (!conversationId.includes(userId)) {
    //   return res.status(403).json({ message: "Not authorized to view this conversation" });
    // }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(messages.reverse());
  } catch (err) {
    console.error("Error in getRecentMessages:", err);
    res.status(500).json({ message: "Failed to fetch messages", error: err.message });
  }
};

module.exports = { sendMessage, getRecentMessages };
