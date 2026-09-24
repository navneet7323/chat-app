const Conversation = require("../models/Conversation");

const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;

    const currentUserId = req.user.userId;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    if (currentUserId === userId) {
      return res.status(400).json({
        message: "You cannot create a conversation with yourself",
      });
    }

    // Check if conversation already exists
    const existingConversation =
      await Conversation.findOne({
        participants: {
          $all: [currentUserId, userId],
        },
      });

    if (existingConversation) {
      return res.status(200).json({
        message: "Conversation already exists",
        conversation: existingConversation,
      });
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants: [currentUserId, userId],
    });

    res.status(201).json({
      message: "Conversation created",
      conversation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      conversations,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  createConversation,
  getConversations,
};