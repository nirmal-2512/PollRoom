const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },

    options: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 2,
        message: "Poll must have at least 2 options"
      }
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

pollSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Poll", pollSchema);
