const validateFileUpload = (req, res, next) => {
  const fileSizeLimit = 6 * 1024 * 1024;

  if (req.file.size > fileSizeLimit) {
    return next({ statusCode: 413, message: "File must be 6MB or smaller" });
  }

  const acceptedMimetypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/zip",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!acceptedMimetypes.includes(req.file.mimetype)) {
    return next({
      statusCode: 415,
      message: "This file type is not supported",
    });
  }

  return next();
};

module.exports = validateFileUpload;
