const express = require("express");
const rateLimit = require("express-rate-limit");
const { register, login } = require("./auth.controller");

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);

module.exports = router;
