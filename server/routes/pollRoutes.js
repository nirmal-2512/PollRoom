const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createPoll,
  getMyPolls,
  getPollById
} = require("../controllers/pollController");


// Protected
router.post("/", auth, createPoll);
router.get("/my", auth, getMyPolls);

// Public
router.get("/:id", getPollById);

module.exports = router;
