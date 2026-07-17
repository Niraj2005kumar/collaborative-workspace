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

router.post("/", auth, createCard);

router.get("/:listId", auth, getCards);

router.put("/:id", auth, updateCard);


router.put("/reorder", auth, updateCardPosition);


router.delete("/:id", auth, deleteCard);

module.exports = router;