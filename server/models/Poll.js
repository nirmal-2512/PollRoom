const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },

  options: [
    {
      text: String,
      votes: {
        type: Number,
        default: 0,
      },
    },
  ],

  // ⭐ THIS IS WHAT YOU ARE MISSING
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  voters: [String], // anti-abuse
});

module.exports = mongoose.model("Poll", pollSchema);
