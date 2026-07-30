const standardizeFilePath = (req, res, next) => {
  const userId = req.user;
  const folderId = req.params.id;
  const fileData = req.file;

  const ext = fileData.originalname.split(".").pop();

  if (folderId === undefined) {
    const filePath = `uploads/users/${userId}/dashboard/${crypto.randomUUID()}.${ext}`;
    req.file.filePath = filePath;
    next();
  } else {
    const filePath = `uploads/users/${userId}/folders/${folderId}/${crypto.randomUUID()}.${ext}`;
    req.file.filePath = filePath;
    next();
  }
};

module.exports = standardizeFilePath;
