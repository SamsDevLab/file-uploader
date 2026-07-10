async function getHomepage(req, res) {
  res.render("index");
}

module.exports = { getHomepage };
