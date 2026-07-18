const express = require("express");
const { getAnalyticsTasks } = require("../controllers/analyticsController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/tasks", auth, getAnalyticsTasks);

module.exports = router;
