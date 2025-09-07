// consumers/messageConsumer.js
const { Kafka } = require("kafkajs");
const Message = require("../models/messageModel");
const { cacheRecentMessage, getSocketIdForUser } = require("../config/redisClient");

async function startMessageConsumer(io) {
  const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || "chat-app-consumer",
    brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  });

  const consumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP || "message-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "messages", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const value = message.value.toString();
        const msgObj = JSON.parse(value);

        // persist to MongoDB
        const saved = await Message.create({
          conversationId: msgObj.conversationId || `${msgObj.from}_${msgObj.to}`,
          from: msgObj.from,
          to: msgObj.to,
          text: msgObj.text,
          meta: msgObj.meta || {},
          createdAt: msgObj.createdAt || new Date(),
        });

        // cache in Redis
        await cacheRecentMessage(saved.conversationId, saved);

        // ----- REAL-TIME DELIVERY -----
        const recipientSocketId = await getSocketIdForUser(saved.to);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("new_message", saved);
          console.log(`Delivered via Socket.IO to: ${saved.to}`);
        } else {
          console.log(`Recipient offline: ${saved.to}`);
        }

        // ----- DELIVERED ACK TO SENDER -----
        const senderSocketId = await getSocketIdForUser(saved.from);
        if (senderSocketId) {
          io.to(senderSocketId).emit("message_delivered", {
            messageId: saved._id,
            conversationId: saved.conversationId,
          });
        }

      } catch (err) {
        console.error("Error in eachMessage:", err);
      }
    },
  });

  console.log("Kafka message consumer started");
}

module.exports = { startMessageConsumer };









