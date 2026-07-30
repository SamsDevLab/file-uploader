const prisma = require("../lib/prisma");
const supabase = require("../config/supabase");
const fs = require("fs/promises");
const path = require("node:path");

async function getAllDashboardFiles(req) {
  const userId = req.user;

  const files = await prisma.file.findMany({
    where: {
      authorId: userId,
      folderId: null,
    },
  });

  if (files.length === 0) {
    return null;
  } else return files;
}

async function getAllFolders(req) {
  const userId = req.user;
  const folders = await prisma.folder.findMany({
    where: {
      authorId: userId,
    },
  });

  if (folders.length === 0) {
    return null;
  } else return folders;
}

async function addFileToDb(req) {
  const userId = req.user;

  const { originalname, mimetype, filePath, size } = req.file;

  const result = await prisma.file.create({
    data: {
      authorId: userId,
      originalname: originalname,
      mimetype: mimetype,
      filePath: filePath,
      size: size,
    },
  });
}

async function addFileToFolderAndDb(req) {
  const folderId = Number(req.params.id);
  const userId = req.user;

  const { originalname, mimetype, filePath, size } = req.file;

  await prisma.file.create({
    data: {
      authorId: userId,
      originalname: originalname,
      mimetype: mimetype,
      filePath: filePath,
      size: size,
      folderId: folderId,
    },
  });
}

async function addNewFolderToDb(req) {
  const userId = req.user;
  const folderName = req.body.newFolder;

  await prisma.folder.create({
    data: {
      authorId: userId,
      name: folderName,
    },
  });
}

async function getFolderContents(req) {
  const folderId = Number(req.params.id);
  const currentUserId = req.user;

  const [folderContents] = await prisma.folder.findMany({
    where: {
      id: folderId,
      authorId: currentUserId,
    },
  });

  const files = await prisma.file.findMany({
    where: {
      authorId: folderContents.authorId,
      folderId: folderContents.id,
    },
  });

  const folderNameAndFiles = { folderName: folderContents.name, files: files };

  return folderNameAndFiles;
}

async function renameFolderInDb(req) {
  const folderId = Number(req.params.id);
  const newFolderName = req.body.renameFolder;

  const updatedFolder = await prisma.folder.update({
    where: { id: folderId },
    data: { name: newFolderName },
  });
}

async function deleteFolderFromDb(req) {
  const folderId = Number(req.params.id);
  await prisma.folder.delete({
    where: { id: folderId },
  });
}

async function renameFileInDb(req) {
  const fileId = Number(req.params.id);
  const newFileName = req.body.renameFile;

  await prisma.file.update({
    where: { id: fileId },
    data: { originalname: newFileName },
  });
}

async function deleteFileFromDb(req) {
  const fileId = Number(req.params.id);
  const deletedFile = await prisma.file.delete({
    where: { id: fileId },
  });
}

async function getFileDetailsFromDb(req) {
  const fileId = Number(req.params.id);

  const fileDetails = await prisma.file.findUnique({
    where: { id: fileId },
  });

  return fileDetails;
}

async function downloadFileFromStorage(req) {
  const fileId = Number(req.params.id);
  const fileDetails = await prisma.file.findUnique({
    where: { id: fileId },
  });

  const { data, error } = await supabase.storage
    .from("uploads")
    .createSignedUrl(`${fileDetails.filePath}`, 60, {
      download: fileDetails.originalname,
    });

  if (error) {
    console.error(error);
  } else {
    return data.signedUrl;
  }
}

module.exports = {
  getAllFolders,
  addFileToDb,
  addFileToFolderAndDb,
  addNewFolderToDb,
  getFolderContents,
  renameFolderInDb,
  deleteFolderFromDb,
  getAllDashboardFiles,
  renameFileInDb,
  deleteFileFromDb,
  getFileDetailsFromDb,
  downloadFileFromStorage,
};
