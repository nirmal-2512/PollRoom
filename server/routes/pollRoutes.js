const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createPoll,
  getMyPolls,
  getPollById,
  votePoll   // 👈 add this
} = require("../controllers/pollController");


// create poll (protected)
router.post("/polls", auth, createPoll);

// my polls
router.get("/my", auth, getMyPolls);

// vote
router.post("/:id/vote", votePoll);

// get poll
router.get("/:id", getPollById);

module.exports = router;
