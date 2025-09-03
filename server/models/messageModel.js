// models/messageModel.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, index: true },
  from: { type: String, required: true }, // firebase uid or user id
  to: { type: String, required: true },   // uid or room
  text: { type: String, required: true },
  meta: { type: Object, default: {} },
  delivered: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model("Message", messageSchema);
