const AppError = require("../utils/appError");

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errors: error.details,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
}

module.exports = errorHandler;
