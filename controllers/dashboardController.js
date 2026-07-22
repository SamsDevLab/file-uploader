const prisma = require("../lib/prisma");
const dashboardModel = require("../models/dashboardModel");

async function renderDashboard(req, res) {
  const folders = await dashboardModel.getAllFolders(req);
  res.render("dashboard", { folders: folders });
}

async function addNewFolder(req, res) {
  await dashboardModel.addNewFolderToDb(req);
  res.redirect("/dashboard");
}

async function accessFolder(req, res) {
  const folderContents = await dashboardModel.getFolderContents(req);
  res.render("folder", { folderContents: folderContents });
}

async function renameFolder(req, res) {
  await dashboardModel.renameFolderInDb(req);
  const folders = await dashboardModel.getAllFolders(req);
  res.render("dashboard", { folders: folders });
}

module.exports = { renderDashboard, addNewFolder, accessFolder, renameFolder };
