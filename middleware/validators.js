const { body } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const validateUserSignUp = [
  body("email")
    .trim()
    .isLength(1)
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Must be a valid email address"),
  body("password")
    .trim()
    .isLength(1)
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password.");
    }
    return true;
  }),
  handleValidationErrors,
];

module.exports = validateUserSignUp;
