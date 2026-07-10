const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/login", authController.renderLoginForm);

router.get("/signup", authController.renderSignupForm);

module.exports = router;
