const validateFileUpload = (req, res, next) => {
  const fileSizeLimit = 6 * 1024 * 1024;

  if (req.file.size > fileSizeLimit) {
    return next({ statusCode: 413, message: "File must be 6MB or smaller" });
  }

  // if (req.file.size > fileSizeLimit) {
  //   // req.file.error = sizeLimitErr;
  //   next(fileSizeError);
  // } else console.log("File is acceptable size");

  //   const allowedMimetypes = [
  //     "image/jpeg",
  //     "image/png",
  //     "image/gif",
  //     "image/webp",
  //     "application/pdf",
  //     "text/plain",
  //     "application/zip",
  //     "application/msword",
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //   ];

  //   if (allowedMimetypes.includes(req.file.mimetype)) {
  //     next();
  //   } else console.log("It ain't here, bruh!");
};

module.exports = validateFileUpload;
