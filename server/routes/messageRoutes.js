const express = require("express");
const router = express.Router();
const {sendMessage,getRecentMessages} = require("../controllers/messageController");
const verifyFirebaseToken = require("../middlewares/authMiddleware");

// POST -> send message via Kafka
router.post("/", verifyFirebaseToken, sendMessage);

// GET -> fetch recent messages
router.get("/:conversationId/recent", verifyFirebaseToken, getRecentMessages);

module.exports = router;
