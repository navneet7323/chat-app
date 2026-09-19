const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Test route
app.get("/", (req, res) => {
    res.send("WhatsApp Clone API is running");
});

// Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});