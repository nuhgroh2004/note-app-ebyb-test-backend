const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const profileController = require("./profile.controller");

const router = express.Router();

router.use(authMiddleware);

router.get("/", profileController.detail);
router.get("/dashboard", profileController.dashboard);

module.exports = router;
