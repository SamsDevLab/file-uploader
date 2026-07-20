const requireAuth = (req, res, next) => {
  if (req.user === undefined) {
    const error = new Error("Authentication failed!");
    error.statusCode = 400;
    error.errors = ["User must be logged in to view dashboard"];

    return next(error);
  }

  next();
};

module.exports = requireAuth;
