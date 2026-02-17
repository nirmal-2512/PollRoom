const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createPoll,
  getMyPolls,
  getPollById
} = require("../controllers/pollController");


router.post("/", createPoll);
router.get("/my", auth, getMyPolls);


router.get("/:id", getPollById);

module.exports = router;
