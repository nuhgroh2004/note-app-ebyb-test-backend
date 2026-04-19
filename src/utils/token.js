const jwt = require("jsonwebtoken");

function signToken(payload) {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  signToken,
  verifyToken,
};
