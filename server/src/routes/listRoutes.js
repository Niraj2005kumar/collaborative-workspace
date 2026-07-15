const express = require("express");

const {
  createList,
  getLists,
  updateList,
  deleteList,
  updateListPosition,
} = require("../controllers/listController");

const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, createList);

router.get("/:boardId", auth, getLists);

router.put("/reorder", auth, updateListPosition);

router.put("/:id", auth, updateList);

router.delete("/:id", auth, deleteList);

module.exports = router;