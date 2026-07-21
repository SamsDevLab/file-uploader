async function renderDashboard(req, res) {
  res.render("dashboard");
}

async function addNewFolderToDb(req, res) {
  res.render("dashboard", { showModal: false });
  console.log(req.body);
  console.log(req.user);
}

module.exports = { renderDashboard, addNewFolderToDb };
