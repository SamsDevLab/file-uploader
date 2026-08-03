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

function handleUploadError(err, req, res, next) {
  if (err.statusCode === 413 || err.statusCode === 415) {
    req.session.statusCode = err.statusCode;
    req.session.message = err.message;

    res.redirect("/dashboard");
  } else return next();
}

module.exports = [errorHandler, handleUploadError];
