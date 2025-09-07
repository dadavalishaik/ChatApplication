// config/redisClient.js
const IORedis = require("ioredis");

let redisClient;

async function initRedis() {
  if (!redisClient) {
    redisClient = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");
    redisClient.on("connect", () => console.log("Redis connected"));
    redisClient.on("error", (err) => console.error("Redis error", err));
  }
  return redisClient;
}


// helper: mark user online/offline & store socketId -> uid
async function setUserOnline(uid, socketId) {
  if (!redisClient) await initRedis(); // ensure client exists
  console.log(`Setting user online: ${uid} -> ${socketId}`);
  await redisClient.hset("online_users", uid, socketId);
}

async function setUserOffline(uid) {
  if (!redisClient) {
    console.error("redis not initialized");
  }
  await redisClient.hdel("online_users", uid);
}

async function getSocketIdForUser(uid) {
  if (!redisClient) await initRedis();
  const socketId = await redisClient.hget("online_users", uid);
  console.log(`getSocketIdForUser(${uid}) -> ${socketId}`);
  return socketId;
}

async function cacheRecentMessage(conversationId, messageObj) {
  if (!redisClient) return;
  const key = `conversation:${conversationId}:messages`;
  await redisClient.lpush(key, JSON.stringify(messageObj));
  await redisClient.ltrim(key, 0, 49);
}

module.exports = {
  initRedis,
  setUserOnline,
  setUserOffline,
  getSocketIdForUser,
  cacheRecentMessage,
};


