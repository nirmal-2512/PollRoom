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



// CREATE POLL (Protected)
exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || options.length < 2) {
      return res.status(400).json({
        message: "Provide a question and at least 2 options"
      });
    }

    // Remove duplicates (nice senior touch)
    const uniqueOptions = [...new Set(options)];

    const poll = await Poll.create({
      question,
      options: uniqueOptions,
      createdBy: req.user
    });

    res.status(201).json(poll);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// GET MY POLLS (Dashboard)
exports.getMyPolls = async (req, res) => {
  try {
    const polls = await Poll
      .find({ createdBy: req.user })
      .sort({ createdAt: -1 });

    res.json(polls);

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};



// PUBLIC — View Poll by ID
exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll)
      return res.status(404).json({ message: "Poll not found" });

    res.json(poll);

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
