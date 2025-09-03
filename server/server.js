const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());


app.use(cors({ origin: "http://localhost:5173" }));

// Routes
app.use("/", userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
