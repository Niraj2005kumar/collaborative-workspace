const express = require("express");
const { searchEverything } = require("../controllers/searchController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, searchEverything);

module.exports = router;
