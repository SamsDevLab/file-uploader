function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const errorMessages = err.errors;

  res.status(statusCode).json({
    success: false,
    error: {
      status: statusCode,
      messages: errorMessages,
    },
  });
}

module.exports = errorHandler;
