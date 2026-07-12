const express = require("express");

const {
  createList,
  getLists,
  updateList,
  deleteList,
} = require("../controllers/listController");

const auth = require("../middleware/auth");

const router = express.Router();

// Create List
router.post("/", auth, createList);

// Get All Lists of a Board
router.get("/:boardId", auth, getLists);

// Update List
router.put("/:id", auth, updateList);

// Delete List
router.delete("/:id", auth, deleteList);

module.exports = router;