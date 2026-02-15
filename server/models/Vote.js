const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true
    },

    optionIndex: {
      type: Number,
      required: true
    },

    voterHash: {
      type: String,
      required: true
    },

    ipHash: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// 🔥 Compound indexes (VERY IMPORTANT)

voteSchema.index({ pollId: 1, voterHash: 1 }, { unique: true });
voteSchema.index({ pollId: 1, ipHash: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
