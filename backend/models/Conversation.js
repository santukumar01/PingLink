const mongoose = require("mongoose");

const conversationScheme = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    unreadCount: [{ type: Number, default: 0 }],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationScheme);

module.exports = Conversation;
