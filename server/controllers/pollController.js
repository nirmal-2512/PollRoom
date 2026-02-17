const Poll = require("../models/Poll");

// ✅ VOTE CONTROLLER
exports.votePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    const { optionIndex } = req.body;

    if (optionIndex === undefined) {
      return res.status(400).json({
        message: "Option index is required",
      });
    }

    // ✅ Prevent multiple votes from same IP
    if (!poll.voters) poll.voters = [];

    if (poll.voters.includes(req.ip)) {
      return res.status(400).json({
        message: "You already voted",
      });
    }

    poll.voters.push(req.ip);

    // ✅ Increment vote
    poll.options[optionIndex].votes += 1;

    await poll.save();

    res.json(poll);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Voting failed",
    });
  }
};


exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({
        message: "Question and at least 2 options required",
      });
    }

    const poll = await Poll.create({
      question,
      options: options.map((opt) => ({
        text: opt,
        votes: 0,
      })),
      user: req.user._id,
    });

    res.status(201).json(poll);

  } catch (err) {
    res.status(500).json({
      message: "Failed to create poll",
    });
  }
};
