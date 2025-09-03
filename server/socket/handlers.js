// socket/handlers.js
const { produceMessage } = require("../config/Kafka");
const { setUserOnline, setUserOffline, getSocketIdForUser } = require("../config/redisClient");
const admin = require("../config/firebase"); // your firebase admin instance

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
    if (!decoded) {
      socket.emit("unauthorized");
      return socket.disconnect();
    }

    const uid = decoded.uid;
    socket.uid = uid;
    await setUserOnline(uid, socket.id);
    socket.join(uid); // join a room with the UID for direct messaging
    console.log(`User ${uid} authenticated on socket ${socket.id}`);

    socket.emit("authenticated", { uid });
  });

  // Client sends message
  // payload: { conversationId, to, from, text, meta }
  socket.on("send_message", async (payload) => {
    try {
      // quick minimal validation
      if (!payload || !payload.text || !payload.to) {
        return socket.emit("error", { message: "Invalid message payload" });
      }

      // If you want to be strict: ensure socket.uid === payload.from
      // but some clients may let server set 'from' to socket.uid
      payload.from = socket.uid || payload.from || "anonymous";
      payload.createdAt = new Date().toISOString();

      // produce to kafka topic 'messages'
      await produceMessage("messages", payload);

      // send immediate ack to sender
      socket.emit("message_sent", { tempId: payload.tempId || null, status: "queued", payload });
    } catch (err) {
      console.error("send_message error:", err);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("disconnect", async () => {
    const uid = socket.uid;
    console.log("Socket disconnected:", socket.id, "uid:", uid);
    if (uid) {
      await setUserOffline(uid);
    }
  });
}

module.exports = { socketHandler };
