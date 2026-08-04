function handleAuthenticationError(err, req, res, next) {
  if (err.statusCode === 400) {
    const statusCode = err.statusCode || 500;
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

module.exports = [handleAuthenticationError, handleUploadError];
