const express = require("express");
const { getDashboardStats } = require("../controllers/dashboardController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/stats", auth, getDashboardStats);

module.exports = router;
