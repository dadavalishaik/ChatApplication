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

    const conversationId = [from, to].sort().join("_");

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
// const getRecentMessages = async (req, res) => {
//   try {
//     const { conversationId } = req.params;
//     const userId = req.user.uid;


//     const messages = await Message.find({ conversationId })
//       .sort({ createdAt: -1 })
//       .limit(50);

//     res.json(messages.reverse());
//   } catch (err) {
//     console.error("Error in getRecentMessages:", err);
//     res.status(500).json({ message: "Failed to fetch messages", error: err.message });
//   }
// };



const getRecentMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.uid; // safer optional chaining

    if (!userId) {
      console.error("userId is undefined");
      return res.status(400).json({ message: "User not authenticated" });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(messages.reverse());
  } catch (err) {
    console.error("Error in getRecentMessages:", err);
    res.status(500).json({ message: "Failed to fetch messages", error: err.message });
  }
};


//reading message
// const readMessages = async (req, res) => {
//   try {
//     try {
//       const { conversationId } = req.params;
//       const userId = req.user.uid; // from Firebase token

//       // Update only messages TO the current user
//       const result = await Message.updateMany(
//         { conversationId, to: userId, read: false },
//         { $set: { read: true } }
//       );

//       res.json({ success: true, message: "Messages marked as read" });
//     } catch (err) {
//       res.status(500).json({ message: "Failed to mark as read", error: err.message });
//     }
//   } catch (error) {

//   }
// }


const readMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user ? req.user.uid : null;

    console.log("Read Messages Request:", { conversationId, userId });

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Update only messages TO the current user
    const result = await Message.updateMany(
      { conversationId, to: userId, read: false },
      { $set: { read: true } }
    );

    console.log("Update Result:", result);

    res.json({ success: true, message: "Messages marked as read" });
  } catch (err) {
    console.error("Error in readMessages:", err);
    res.status(500).json({ message: "Failed to mark as read", error: err.message });
  }
};





// Get unread messages count
const unreadMessages = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Aggregate unread messages per conversation
    const unread = await Message.aggregate([
      { $match: { to: userId, read: false } },
      {
        $group: {
          _id: "$conversationId",
          count: { $sum: 1 },
          latestMessage: { $last: "$$ROOT" }, // optional: latest unread message
        },
      },
    ]);

    // Calculate total unread messages across all conversations
    const totalUnread = unread.reduce((acc, convo) => acc + convo.count, 0);

    res.json({
      success: true,
      totalUnread,       // total unread messages
      perConversation: unread, // unread count per conversation
    });
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread messages",
      error: error.message
    });
  }
};



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
