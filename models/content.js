const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    index: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Content", contentSchema);
