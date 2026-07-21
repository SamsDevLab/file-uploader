const prisma = require("../lib/prisma");

async function renderDashboard(req, res) {
  const userId = req.user;
  const folders = await prisma.folder.findMany({
    where: {
      authorId: userId,
    },
  });

  res.render("dashboard", { folders: folders });
}

async function addNewFolderToDb(req, res) {
  const userId = req.user;
  const folderName = req.body.newFolder;

  await prisma.folder.create({
    data: {
      authorId: userId,
      name: folderName,
    },
  });

  res.redirect("/dashboard");
}

module.exports = { renderDashboard, addNewFolderToDb };
