const express = require("express");

const {
  createCard,
  getCards,
  updateCard,
  deleteCard,
  updateCardPosition,
} = require("../controllers/cardController");

const auth = require("../middleware/auth");

const router = express.Router();

// Create Card
router.post("/", auth, createCard);

// Get All Cards of a List
router.get("/:listId", auth, getCards);

// Update Card
router.put("/:id", auth, updateCard);

// Update Card Positions (Drag & Drop)
router.put("/reorder", auth, updateCardPosition);

// Delete Card
router.delete("/:id", auth, deleteCard);

module.exports = router;