const Vote = require("../models/Vote");
const Poll = require("../models/Poll");
const hash = require("../utils/hash");


// CAST VOTE
exports.castVote = async (req, res) => {
  try {
    const { pollId, optionIndex, voterId } = req.body;

    // Validate poll exists
    const poll = await Poll.findById(pollId);
    if (!poll)
      return res.status(404).json({ message: "Poll not found" });

    if (optionIndex >= poll.options.length)
      return res.status(400).json({ message: "Invalid option" });

    // Hash identifiers
    const voterHash = hash(voterId);
    const ipHash = hash(req.ip);

    // Create vote
    await Vote.create({
      pollId,
      optionIndex,
      voterHash,
      ipHash
    });

    // 🔥 Aggregate results (VERY important design)
    const results = await Vote.aggregate([
      { $match: { pollId: poll._id } },
      {
        $group: {
          _id: "$optionIndex",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format results
    const formatted = poll.options.map((option, index) => {
      const found = results.find(r => r._id === index);
      return {
        option,
        votes: found ? found.count : 0
      };
    });

    res.json(formatted);

    const io = req.app.get("io");
    io.to(pollId.toString()).emit("voteUpdated", formatted);

  } catch (err) {

    // for duplicate votes
    if (err.code === 11000) {
      return res.status(409).json({
        message: "You have already voted on this poll"
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};
