const Poll = require("../models/Poll");

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

    if (!poll.voters) poll.voters = [];

    if (poll.voters.includes(req.ip)) {
      return res.status(400).json({
        message: "You already voted",
      });
    }

    poll.voters.push(req.ip);

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

    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    if (!question || !options || options.length < 2) {
      return res.status(400).json({
        message: "Provide question and at least 2 options",
      });
    }

    const poll = await Poll.create({
      question,
      options: options.map((opt) => ({
        text: opt,
        votes: 0,
      })),
      user: req.user._id, // ⭐ CRITICAL LINE
    });

    res.status(201).json(poll);

  } catch (err) {
    console.error("CREATE POLL ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};



exports.getMyPolls = async (req, res) => {
  try {

    console.log("LOGGED USER:", req.user);

    const polls = await Poll.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(polls);

  } catch (err) {
    console.error("GET MY POLLS ERROR:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};


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
