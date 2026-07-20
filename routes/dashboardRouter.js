const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const requireAuth = require("../middleware/requireAuth");

router.get("/", requireAuth, dashboardController.renderDashboard);

module.exports = router;
