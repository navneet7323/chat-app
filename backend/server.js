const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

app.use(
  "/api/conversations",
  require("./routes/conversationRoutes")
);


app.use(
  "/api/messages",
  require("./routes/messageRoutes")
);

app.get("/", (req, res) => {
  res.send("Group Chat Backend is working!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});