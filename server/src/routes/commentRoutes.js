const express = require("express");

const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const auth = require("../middleware/auth");

const router = express.Router();

// Create Comment
router.post("/", auth, createComment);


router.get("/:cardId", auth, getComments);

// Update Comment
router.put("/:id", auth, updateComment);

// Delete Comment
router.delete("/:id", auth, deleteComment);

module.exports = router;