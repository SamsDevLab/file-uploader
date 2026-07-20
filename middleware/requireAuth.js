const requireAuth = (req, res, next) => {
  if (req.user === undefined) {
    const error = { statusCode: 400 };

    const errors = [];
    errors.push("User must be logged in to view dashboard");

    error.errors = errors;

    return next(error);
  }

  next();
};

module.exports = requireAuth;
