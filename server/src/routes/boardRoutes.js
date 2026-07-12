const express = require("express");

const {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
} = require("../controllers/boardController");

const auth = require("../middleware/auth");

const router = express.Router();

// Create Board
router.post("/", auth, createBoard);

// Get All Boards of a Workspace
router.get("/:workspaceId", auth, getBoards);

// Update Board
router.put("/:id", auth, updateBoard);

// Delete Board
router.delete("/:id", auth, deleteBoard);

module.exports = router;