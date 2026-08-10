const prisma = require("../lib/prisma");
const supabase = require("../config/supabase");
const fs = require("fs/promises");
const path = require("node:path");

function truncatePropertyForDisplay(objArr, property, maxLength = 10) {
  return objArr.map((object) => {
    if (object[property].length <= maxLength) {
      return { ...object, truncatedName: null };
    }

    return {
      ...object,
      truncatedName: object[property].trim().slice(0, maxLength) + "...",
    };
  });
}

async function getAllDashboardFiles(req) {
  const userId = req.user;

  const files = await prisma.file.findMany({
    where: {
      authorId: userId,
      folderId: null,
    },
    orderBy: {
      originalname: "asc",
    },
  });

  if (files.length === 0) {
    return null;
  } else {
    const newFilesArr = await truncatePropertyForDisplay(files, "originalname");
    return newFilesArr;
  }
}

async function getAllFolders(req) {
  const userId = req.user;
  const folders = await prisma.folder.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (folders.length === 0) {
    return null;
  } else {
    const newFoldersArr = await truncatePropertyForDisplay(folders, "name");
    return newFoldersArr;
  }
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
    orderBy: {
      originalname: "asc",
    },
  });

  const newFilesArr = await truncatePropertyForDisplay(files, "originalname");

  const folderNameAndFiles = {
    folderName: folderContents.name,
    files: newFilesArr,
  };

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

  const targetedFolderFiles = await prisma.file.findMany({
    where: { folderId: folderId },
  });

  if (targetedFolderFiles.length !== 0) {
    const filesToRemove = targetedFolderFiles.map((file) => file.filePath);
    const response = await supabase.storage
      .from("uploads")
      .remove(filesToRemove);
  }

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

async function deleteFileFromStorageAndDb(req) {
  const fileId = Number(req.params.id);

  const fileToDelete = await prisma.file.findUnique({
    where: { id: fileId },
  });

  const { data, error } = await supabase.storage
    .from("uploads")
    .remove([fileToDelete.filePath]);
  if (error) {
    console.error(error);
  } else console.log("File deleted successfully!");

  await prisma.file.delete({
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
  deleteFileFromStorageAndDb,
  getFileDetailsFromDb,
  downloadFileFromStorage,
};
