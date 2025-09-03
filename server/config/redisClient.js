// config/redisClient.js
const IORedis = require("ioredis");

let redisClient;

async function initRedis() {
  redisClient = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");
  redisClient.on("connect", () => console.log("Redis connected"));
  redisClient.on("error", (err) => console.error("Redis error", err));
}

// helper: mark user online/offline & store socketId -> uid
async function setUserOnline(uid, socketId) {
  await redisClient.hset("online_users", uid, socketId);
}

async function setUserOffline(uid) {
  await redisClient.hdel("online_users", uid);
}

async function getSocketIdForUser(uid) {
  return await redisClient.hget("online_users", uid);
}

async function cacheRecentMessage(conversationId, messageObj) {
  // store last 50 messages per conversation as JSON strings
  const key = `conversation:${conversationId}:messages`;
  await redisClient.lpush(key, JSON.stringify(messageObj));
  await redisClient.ltrim(key, 0, 49);
}

module.exports = {
  initRedis,
  redisClient,
  setUserOnline,
  setUserOffline,
  getSocketIdForUser,
  cacheRecentMessage,
};
