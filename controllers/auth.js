async function renderLoginForm(req, res) {
  res.render("auth/login");
}

async function renderSignupForm(req, res) {
  res.render("auth/signup");
}

async function addUserToDb(req, res) {
  // console.log(req.body);
}

module.exports = { renderLoginForm, renderSignupForm, addUserToDb };
