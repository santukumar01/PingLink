const mongoose = require("mongoose");

const messageschmea = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String },
    imgaeOrVideo: { type: String },
    contentType: { type: String, enum: ["image", "video", "text"] },
    reactions: [
      {
        user: mongoose.Schema.Types.ObjectId,
        ref: "User",
        emoji: String,
      },
    ],
    messageStatus: { type: String, default: "send" },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageschmea);
module.exports = Message;
