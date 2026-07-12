const express = require("express");

const {
  createCard,
  getCards,
  updateCard,
  deleteCard,
} = require("../controllers/cardController");

const auth = require("../middleware/auth");

const router = express.Router();


router.post("/", auth, createCard);


router.get("/:listId", auth, getCards);


router.put("/:id", auth, updateCard);


router.delete("/:id", auth, deleteCard);

module.exports = router;