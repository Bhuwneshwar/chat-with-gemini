// scheme define
const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    userId: String,
    conversations: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);
