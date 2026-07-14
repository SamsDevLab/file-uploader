const userModel = require("../models/userModel");

async function renderLoginForm(req, res) {
  res.render("auth/login");
}

async function renderSignupForm(req, res) {
  res.render("auth/signup");
}

async function addUserToDb(req, res, next) {
  const { passwordConfirmation, ...userData } = req.body;
  const newUserData = userData;
  const newUserId = await userModel.addNewUser(newUserData);

  // req.login(newUserId.id, function (err) {
  //   if (err) {
  //     return next(err);
  //   }
  //   return res.redirect("/");
  // });
}

module.exports = { renderLoginForm, renderSignupForm, addUserToDb };
