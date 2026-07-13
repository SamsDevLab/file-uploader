const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validateUserSignUp = require("../middleware/validators");

router.get("/login", authController.renderLoginForm);

router.get("/signup", authController.renderSignupForm);
router.post("/signup", validateUserSignUp, authController.addUserToDb);

module.exports = router;
