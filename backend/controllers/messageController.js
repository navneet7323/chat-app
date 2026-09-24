const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const senderId = req.user.userId;

    if (!conversationId || !text) {
      return res.status(400).json({
        message: "conversationId and text are required",
      });
    }

    // Check conversation
    const conversation = await Conversation.findById(
      conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // Check whether user belongs to conversation
    const isParticipant =
      conversation.participants.some(
        (participant) =>
          participant.toString() === senderId
      );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not part of this conversation",
      });
    }

    // Create message
    const message = await Message.create({
      conversationId,
      sender: senderId,
      text,
    });

    res.status(201).json({
      message: "Message sent",
      data: message,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET MESSAGES
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const userId = req.user.userId;

    // Find conversation
    const conversation = await Conversation.findById(
      conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // Check participant
    const isParticipant =
      conversation.participants.some(
        (participant) =>
          participant.toString() === userId
      );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not part of this conversation",
      });
    }

    // Get messages
    const messages = await Message.find({
      conversationId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};