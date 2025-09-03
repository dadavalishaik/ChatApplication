// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db"); // your existing db connection
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { initKafkaProducer } = require("./config/Kafka");
const { initRedis, redisClient } = require("./config/redisClient");
const { socketHandler } = require("./socket/handlers");
const { startMessageConsumer } = require("./consumers/messageConsumer");

connectDB();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/", userRoutes);
app.use("/messages", messageRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// initialize redis and kafka
initRedis().catch((err) => {
  console.error("Redis init failed", err);
});
initKafkaProducer().catch((err) => {
  console.error("Kafka init failed", err);
});

// socket.io-redis adapter (uncomment if you run multiple node instances)

io.on("connection", (socket) => socketHandler(io, socket));

/* start Kafka consumer that will persist messages & emit them */
startMessageConsumer(io).catch((err) => {
  console.error("Message consumer failed:", err);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
