const userModel = require("../models/userModel");

async function renderLoginForm(req, res) {
  const errorMessages = req.session.messages;
  req.session.messages = [];

  res.render("auth/login", { errors: errorMessages });
}

async function renderSignupForm(req, res) {
  res.render("auth/signup");
}

async function addUserToDb(req, res, next) {
  const { passwordConfirmation, ...userData } = req.body;
  const newUserData = userData;
  const newUserId = await userModel.addNewUser(newUserData);

  req.login(newUserId, function (err) {
    if (err) {
      return next(err);
    }
    console.log("You're logged in!");
    res.redirect("/dashboard");
  });
}

function logOut(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    console.log("You're logged out!");
    res.redirect("/");
  });
}

module.exports = { renderLoginForm, renderSignupForm, addUserToDb, logOut };
