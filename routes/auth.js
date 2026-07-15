const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const validateUserSignUp = require("../middleware/validators");

router.get("/login", authController.renderLoginForm);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true,
  }),
);

router.get("/signup", authController.renderSignupForm);
router.post("/signup", validateUserSignUp, authController.addUserToDb);

router.get("/logout", authController.logOut);

module.exports = router;
