const standardizeFilePath = (req, res, next) => {
  const userId = req.user;
  const folderId = req.params.id;
  const fileData = req.file;

  const ext = fileData.originalname.split(".").pop();

  if (folderId == undefined) {
    const filePath = `users/${userId}/dashboard/${crypto.randomUUID()}.${ext}`;
    req.filePath = filePath;
    next();
  } else {
    const filePath = `users/${userId}/folders/${folderId}/${crypto.randomUUID()}.${ext}`;
    req.filePath = filePath;
    next();
  }
};

module.exports = standardizeFilePath;
