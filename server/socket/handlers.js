// socket/handlers.js
const { produceMessage } = require("../config/Kafka");
const { redisClient, setUserOnline, setUserOffline, getSocketIdForUser } = require("../config/redisClient");
const admin = require("../config/firebase"); // your firebase admin instance
const User = require("../models/userModel")

// helper to verify firebase idToken if client sends it on connection
async function verifyToken(idToken) {
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded; // contains uid, email, etc.
  } catch (err) {
    console.warn("Token verification failed", err.message);
    return null;
  }
}

function socketHandler(io, socket) {
  console.log("Socket connected:", socket.id);

  // Expect client to send 'authenticate' after connecting with idToken
  socket.on("authenticate", async ({ idToken }) => {
    const decoded = await verifyToken(idToken);
    if (!decoded) return socket.disconnect();

    const uid = decoded.uid;
    socket.uid = uid;

    //lookup mongo_db user using firebaseUid 
    const mongoUser = await User.findOne({ firebaseUid: decoded.uid });

    if (!mongoUser) {
      console.error("user not found:", decoded.uid);
      return socket.disconnect();
    }

    socket.uid = mongoUser._id.toString();


    // store in redis
    await setUserOnline(socket.uid, socket.id);

    socket.join(uid);
    console.log(`User ${uid} authenticated on socket ${socket.id}`);
    io.emit("user_status", { uid: socket.uid, online: true });

    socket.emit("authenticated", { uid: socket.uid });
  });


  // Client sends message

  socket.on("send_message", async (payload) => {
    try {
      // quick minimal validation
      if (!payload || !payload.text || !payload.to) {
        return socket.emit("error", { message: "Invalid message payload" });
      }

      // If you want to be strict: ensure socket.uid === payload.from
      // but some clients may let server set 'from' to socket.uid
      payload.from = socket.uid
      payload.createdAt = new Date().toISOString();

      payload.conversationId = [payload.from, payload.to].sort().join("_");

      // produce to kafka topic 'messages'
      await produceMessage("messages", payload);

      // send immediate ack to sender
      socket.emit("message_sent", { tempId: payload.tempId || null, status: "queued", payload });

      //deilver instantly to receipent if online
      const recipientSocket = await getSocketIdForUser(payload.to);
      if (recipientSocket) {
        io.to(recipientSocket).emit("receive_message", payload);
        console.log(`Recipient online: ${payload.to}`);

        payload.delivered = true;
        await produceMessage("delivery_updates", {
          conversationId: payload.conversationId,
          messageId: payload._id,
          to: payload.to,
          deliveredAt: new Date()
        });
        console.log(`delivered message to ${payload.to}`);
      }
      else {
        console.log(`Recipient offline: ${payload.to}`);
      }
    } catch (err) {
      console.error("send_message error:", err);
      socket.emit("error", { message: "Failed to send message" });
    }

  });

  //for read messages
  // socket.on("read_message", async ({ conversationId, messageId }) => {
  //   try {
  //     await produceMessage("read_updates", {
  //       conversationId,
  //       messageId,
  //       readBy: socket.uid,
  //       readAt: new Date()
  //     })
  //     const senderSocket = await getSocketIdForUser(payload.from);
  //     if (senderSocket) {
  //       io.to(senderSocket).emit("message read", { messageId, conversationId });
  //     }
  //   } catch (err) {
  //     console.error("read_message error:", err);
  //   }
  // })


  socket.on("read_message", async ({ conversationId, messageId, from }) => {
    try {
      await produceMessage("read_updates", {
        conversationId,
        messageId,
        readBy: socket.uid,
        readAt: new Date()
      })
      const message = await message.findById(messageId);
      if (message && message.from) {
        const senderSocket = await getSocketIdForUser(message.from);
        if (senderSocket) {
          io.to(senderSocket).emit("message read", { messageId, conversationId });
        }
      }
    } catch (err) {
      console.error("read_message error:", err);
    }
  })


  socket.on("disconnect", async () => {
    const uid = socket.uid;
    console.log("Socket disconnected:", socket.id, "uid:", uid);
    if (uid) {
      await setUserOffline(uid);

      //notify others are in Offline
      io.emit("user_status", { uid, online: false });
    }
  });

  

}

module.exports = { socketHandler };


















