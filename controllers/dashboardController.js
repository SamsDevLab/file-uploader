const prisma = require("../lib/prisma");
const dashboardModel = require("../models/dashboardModel");
const fs = require("fs/promises");

async function renderDashboard(req, res) {
  const files = await dashboardModel.getAllFiles(req);
  const folders = await dashboardModel.getAllFolders(req);
  res.render("dashboard", { folders: folders, files: files });
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

async function deleteFolder(req, res) {
  await dashboardModel.deleteFolderFromDb(req);
  const folders = await dashboardModel.getAllFolders(req);
  res.render("dashboard", { folders: folders });
}

async function addFile(req, res) {
  await dashboardModel.addFileToDb(req);
  res.redirect("/dashboard");
}

async function renameFile(req, res) {
  await dashboardModel.renameFileInDb(req);
  res.redirect("/dashboard");
}

async function deleteFile(req, res) {
  const deletedFilename = await dashboardModel.deleteFileFromDb(req);

  try {
    await fs.unlink(`public/uploads/${deletedFilename}`);
    console.log("File successfully deleted");
  } catch (err) {
    console.error("Error deleting file:", err.message);
  }

  res.redirect("/dashboard");
}

module.exports = {
  renderDashboard,
  addNewFolder,
  accessFolder,
  renameFolder,
  deleteFolder,
  addFile,
  renameFile,
  deleteFile,
};
