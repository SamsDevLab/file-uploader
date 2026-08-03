const prisma = require("../lib/prisma");
const dashboardModel = require("../models/dashboardModel");

async function renderDashboard(req, res) {
  const files = await dashboardModel.getAllDashboardFiles(req);
  const folders = await dashboardModel.getAllFolders(req);

  const statusCode = await req.flash("statusCode")[0];
  const errorMessage = (await req.flash("errorMessage")[0]) || null;

  res.status(statusCode || 200).render("dashboard", {
    folderId: null,
    folders: folders,
    files: files,
    errorMessage,
  });
}

async function addNewFolder(req, res) {
  await dashboardModel.addNewFolderToDb(req);
  res.redirect("/dashboard");
}

async function renderFolder(req, res) {
  const folderId = req.params.id;
  const folderContents = await dashboardModel.getFolderContents(req);

  const statusCode = await req.flash("statusCode")[0];
  const errorMessage = (await req.flash("errorMessage")[0]) || null;

  res.status(statusCode || 200).render("folder", {
    folderId: folderId,
    folderContents: folderContents,
    errorMessage,
  });
}

async function renameFolder(req, res) {
  await dashboardModel.renameFolderInDb(req);
  const folders = await dashboardModel.getAllFolders(req);
  const files = await dashboardModel.getAllDashboardFiles(req);
  res.render("dashboard", { folderId: null, folders: folders, files: files });
}

async function deleteFolder(req, res) {
  await dashboardModel.deleteFolderFromDb(req);
  const folders = await dashboardModel.getAllFolders(req);
  const files = await dashboardModel.getAllDashboardFiles(req);

  res.render("dashboard", { folderId: null, folders: folders, files: files });
}

async function addFile(req, res) {
  await dashboardModel.addFileToDb(req);
  res.redirect("/dashboard");
}

async function addFileToFolder(req, res) {
  await dashboardModel.addFileToFolderAndDb(req);
  const folderId = Number(req.params.id);
  res.redirect(`/dashboard/folders/${folderId}`);
}

async function renameFile(req, res) {
  await dashboardModel.renameFileInDb(req);
  const folderId = req.body.folderId || null;

  if (folderId !== null) {
    res.redirect(`/dashboard/folders/${folderId}`);
  } else res.redirect("/dashboard/");
}

async function deleteFile(req, res) {
  const folderId = req.body.folderId || null;
  await dashboardModel.deleteFileFromStorageAndDb(req);

  if (folderId !== null) {
    res.redirect(`/dashboard/folders/${folderId}`);
  } else res.redirect("/dashboard/");
}

async function viewFileDetails(req, res) {
  const fileDetails = await dashboardModel.getFileDetailsFromDb(req);
  fileDetails.createdAt = fileDetails.createdAt.toLocaleString();

  res.render("fileDetails", { fileDetails: fileDetails });
}

async function downloadFile(req, res) {
  const file = await dashboardModel.downloadFileFromStorage(req);
  res.redirect(file);
}

module.exports = {
  renderDashboard,
  addNewFolder,
  renderFolder,
  renameFolder,
  deleteFolder,
  addFile,
  addFileToFolder,
  renameFile,
  deleteFile,
  viewFileDetails,
  downloadFile,
};
