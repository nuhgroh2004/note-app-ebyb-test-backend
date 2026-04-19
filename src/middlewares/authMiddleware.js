const AppError = require("../utils/appError");
const { verifyToken } = require("../utils/token");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    return next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
}

module.exports = authMiddleware;
