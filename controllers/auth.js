async function renderLoginForm(req, res) {
  res.render("auth/login");
}

async function renderSignupForm(req, res) {
  res.render("auth/signup");
}

module.exports = { renderLoginForm, renderSignupForm };
