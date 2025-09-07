const Message = require("../models/messageModel");
const { produceMessage } = require("../config/Kafka");
const admin = require("../config/firebase");
const User = require("../models/userModel");

//send message
const sendMessage = async (req, res) => {
  try {
    const { text, to } = req.body;
    const from = req.user.uid; // 👈 logged-in user from Firebase token

    if (!to || !text) {
      return res.status(400).json({ message: "Recipient and text are required" });
    }

    // verify recipient exists in DB
    const toUser = await User.findById(to);
    if (!toUser) {
      return res.status(400).json({ message: "Recipient user not found in DB" });
    }

    const conversationId = [from,to].sort().join("_");

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

//reading message
const readMessages = async (req, res) => {
  try {
    try {
      const { conversationId } = req.params;
      const userId = req.user.uid; // from Firebase token

      // Update only messages TO the current user
      const result = await Message.updateMany(
        { conversationId, to: userId, read: false },
        { $set: { read: true } }
      );

      res.json({ success: true, message: "Messages marked as read" });
    } catch (err) {
      res.status(500).json({ message: "Failed to mark as read", error: err.message });
    }
  } catch (error) {

  }
}

//unread messages
const unreadMessages = async (req, res) => {

  try {
    const userId = req.user.uid;

    const unread = await Message.aggregate([
      { $match: { to: userId, read: false } },
      {
        $group: {
          _id: "$conversationId",
          count: { $sum: 1 },
          latestMessage: { $last: "$$ROOT" },
        },
      },
    ])

    res.json({ success: true, unread });

  } catch (error) {

  }
}


//for delivery of messages

const deliveredMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const result = await Message.updateMany(
      { conversationId, to: userId, delivered: false },
      { $set: { delivered: true } }
    );

    res.json({ success: true, modifiedCount: result.modifiedCount });

  } catch (err) {
    res.status(500).json({ message: "Failed to mark delivered", error: err.message });
  }
}

module.exports = { sendMessage, getRecentMessages, readMessages, unreadMessages, deliveredMessage };
