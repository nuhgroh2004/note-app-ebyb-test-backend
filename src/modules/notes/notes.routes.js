const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const notesController = require("./notes.controller");

const router = express.Router();

router.use(authMiddleware);

router.post("/", notesController.create);
router.get("/", notesController.list);
router.get("/:id", notesController.detail);
router.put("/:id", notesController.update);
router.delete("/:id", notesController.remove);

module.exports = router;
