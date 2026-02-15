const Poll = require("../models/Poll");


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
