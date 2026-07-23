const prisma = require("../lib/prisma");

async function getAllFolders(req) {
  const userId = req.user;
  const folders = await prisma.folder.findMany({
    where: {
      authorId: userId,
    },
  });

  return folders;
}

async function addFileToDb(req) {
  const userId = req.user;
  const { originalname, mimetype, filename, size } = req.file;

  await prisma.file.create({
    data: {
      authorId: userId,
      originalname: originalname,
      mimetype: mimetype,
      filename: filename,
      size: size,
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

  return folderContents;
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

module.exports = {
  getAllFolders,
  addFileToDb,
  addNewFolderToDb,
  getFolderContents,
  renameFolderInDb,
  deleteFolderFromDb,
};
