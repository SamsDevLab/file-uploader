function errorHandler(err, req, res, next) {
  // change the name of this when done with the others - this will be handleFormErrors or something like that

  if (err.statusCode === 400) {
    const statusCode = err.statusCode || 500; // 400 status code
    const errorMessages = err.errors;
    res.status(statusCode).json({
      success: false,
      error: {
        status: statusCode,
        messages: errorMessages,
      },
    });
  } else next(err);
}

async function handleUploadError(err, req, res, next) {
  if (err.statusCode === 413 || err.statusCode === 415) {
    await req.flash("statusCode", err.statusCode);
    await req.flash("errorMessage", err.message);

    if (err.folder !== null) {
      req.session.save((error) => {
        if (error) {
          return next(error);
        }
        res.redirect(`/dashboard/folders/${err.folderId}`);
      });
    } else
      req.session.save((error) => {
        if (error) {
          return next(error);
        }
        res.redirect("/dashboard");
      });
  } else return next();
}

module.exports = [errorHandler, handleUploadError];
