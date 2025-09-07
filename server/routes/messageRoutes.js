const express = require("express");
const router = express.Router();
const { sendMessage, getRecentMessages, readMessages, unreadMessages, deliveredMessage } = require("../controllers/messageController");
const verifyFirebaseToken = require("../middlewares/authMiddleware");

// POST -> send message via Kafka
router.post("/", verifyFirebaseToken, sendMessage);

// GET -> fetch recent messages
router.get("/:conversationId/recent", verifyFirebaseToken, getRecentMessages);

//Reading message
router.put("/:conversationId/read", verifyFirebaseToken, readMessages);

//Unread message
router.get("/unread", verifyFirebaseToken, unreadMessages);

//for delivered messages
router.put("/:conversationId/delivered", verifyFirebaseToken, deliveredMessage)


module.exports = router;
