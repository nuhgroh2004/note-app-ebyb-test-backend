const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const notesRoutes = require("../modules/notes/notes.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/notes", notesRoutes);

module.exports = router;
