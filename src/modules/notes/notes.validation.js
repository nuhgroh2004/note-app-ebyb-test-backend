const AppError = require("../../utils/appError");

function parseDateOnly(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeNotePayload(payload) {
  return {
    title: String(payload.title || "").trim(),
    content: payload.content === undefined ? "" : String(payload.content).trim(),
    noteDate: String(payload.noteDate || "").trim(),
  };
}

function validateCreateNotePayload(payload) {
  const errors = [];
  const data = normalizeNotePayload(payload);
  const parsedDate = parseDateOnly(data.noteDate);

  if (data.title.length < 3 || data.title.length > 150) {
    errors.push({ field: "title", message: "Title must be 3-150 characters" });
  }

  if (data.content.length > 5000) {
    errors.push({ field: "content", message: "Content max length is 5000 characters" });
  }

  if (!parsedDate) {
    errors.push({ field: "noteDate", message: "noteDate must use YYYY-MM-DD format" });
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      title: data.title,
      content: data.content,
      noteDate: parsedDate,
    },
  };
}

function validateUpdateNotePayload(payload) {
  const errors = [];
  const data = {};

  if (payload.title !== undefined) {
    const title = String(payload.title).trim();

    if (title.length < 3 || title.length > 150) {
      errors.push({ field: "title", message: "Title must be 3-150 characters" });
    } else {
      data.title = title;
    }
  }

  if (payload.content !== undefined) {
    const content = String(payload.content).trim();

    if (content.length > 5000) {
      errors.push({ field: "content", message: "Content max length is 5000 characters" });
    } else {
      data.content = content;
    }
  }

  if (payload.noteDate !== undefined) {
    const parsedDate = parseDateOnly(String(payload.noteDate).trim());

    if (!parsedDate) {
      errors.push({ field: "noteDate", message: "noteDate must use YYYY-MM-DD format" });
    } else {
      data.noteDate = parsedDate;
    }
  }

  if (Object.keys(data).length === 0 && errors.length === 0) {
    errors.push({
      field: "payload",
      message: "At least one field (title, content, noteDate) must be provided",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    data,
  };
}

function validateListNotesQuery(query) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const parsedDate = query.date ? parseDateOnly(query.date) : null;

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError("page must be a positive integer", 422);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError("limit must be between 1 and 100", 422);
  }

  if (query.date && !parsedDate) {
    throw new AppError("date must use YYYY-MM-DD format", 422);
  }

  return {
    page,
    limit,
    date: parsedDate,
  };
}

function validateNoteIdParam(noteId) {
  const parsedId = Number(noteId);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    throw new AppError("Invalid note id", 422);
  }

  return parsedId;
}

module.exports = {
  validateCreateNotePayload,
  validateUpdateNotePayload,
  validateListNotesQuery,
  validateNoteIdParam,
};
