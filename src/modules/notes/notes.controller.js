const AppError = require("../../utils/appError");
const asyncHandler = require("../../utils/asyncHandler");
const {
  createNote,
  listNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("./notes.service");
const {
  validateCreateNotePayload,
  validateUpdateNotePayload,
  validateListNotesQuery,
  validateNoteIdParam,
} = require("./notes.validation");

const create = asyncHandler(async (req, res, next) => {
  const validation = validateCreateNotePayload(req.body);

  if (!validation.isValid) {
    return next(new AppError("Validation error", 422, validation.errors));
  }

  const note = await createNote(req.userId, validation.data);

  return res.status(201).json({
    message: "Note created",
    data: note,
  });
});

const list = asyncHandler(async (req, res) => {
  const query = validateListNotesQuery(req.query);
  const result = await listNotes(req.userId, query);

  return res.status(200).json({
    message: "Notes fetched",
    data: result,
  });
});

const detail = asyncHandler(async (req, res) => {
  const noteId = validateNoteIdParam(req.params.id);
  const note = await getNoteById(req.userId, noteId);

  return res.status(200).json({
    message: "Note fetched",
    data: note,
  });
});

const update = asyncHandler(async (req, res, next) => {
  const noteId = validateNoteIdParam(req.params.id);
  const validation = validateUpdateNotePayload(req.body);

  if (!validation.isValid) {
    return next(new AppError("Validation error", 422, validation.errors));
  }

  const note = await updateNote(req.userId, noteId, validation.data);

  return res.status(200).json({
    message: "Note updated",
    data: note,
  });
});

const remove = asyncHandler(async (req, res) => {
  const noteId = validateNoteIdParam(req.params.id);
  await deleteNote(req.userId, noteId);

  return res.status(200).json({
    message: "Note deleted",
  });
});

module.exports = {
  create,
  list,
  detail,
  update,
  remove,
};
