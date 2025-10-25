const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

dotenv.config();
const connectDb = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
// app.get("/", (req, res) => res.send("PingLink backend running 🚀"));

// Start server first
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);

  // Connect DB asynchronously AFTER server starts
  connectDb()
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

  // Initialize Gmail / OTP setup safely
  // wrap in try/catch and async function if needed
});
