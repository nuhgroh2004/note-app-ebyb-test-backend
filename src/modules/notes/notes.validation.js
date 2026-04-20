const AppError = require("../../utils/appError");

const NOTE_ENTRY_TYPES = ["note", "document"];
const NOTE_COLORS = ["green", "blue", "purple", "amber", "red"];
const NOTE_LOCATIONS = ["All Docs", "Tasks", "Imagine", "Shared With Me"];
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseBoolean(value) {
  if (value === true || value === false) {
    return value;
  }

  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "true" || normalized === "1") {
    return true;
  }

  if (normalized === "false" || normalized === "0") {
    return false;
  }

  return null;
}

function parseDateOnly(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseEntryType(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return NOTE_ENTRY_TYPES.includes(normalized) ? normalized : null;
}

function parseColor(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return NOTE_COLORS.includes(normalized) ? normalized : null;
}

function parseLocation(value) {
  const normalized = String(value || "").trim();
  return NOTE_LOCATIONS.includes(normalized) ? normalized : null;
}

function parseTime(value) {
  const normalized = String(value || "").trim();

  if (!normalized) {
    return "";
  }

  return TIME_REGEX.test(normalized) ? normalized : null;
}

function normalizeNotePayload(payload) {
  return {
    title: String(payload.title || "").trim(),
    content: payload.content === undefined ? "" : String(payload.content).trim(),
    noteDate: String(payload.noteDate || "").trim(),
    entryType: payload.entryType,
    label: payload.label,
    color: payload.color,
    time: payload.time,
    isStarred: payload.isStarred,
    location: payload.location,
  };
}

function validateCreateNotePayload(payload) {
  const errors = [];
  const data = normalizeNotePayload(payload);
  const parsedDate = parseDateOnly(data.noteDate);
  const parsedEntryType = parseEntryType(data.entryType || "note");
  const parsedColor = parseColor(data.color || "");
  const parsedTime = parseTime(data.time);
  const parsedIsStarred = parseBoolean(data.isStarred);
  const parsedLocation = parseLocation(data.location || "All Docs");
  const normalizedLabel = String(data.label || "").trim();

  if (data.title.length < 3 || data.title.length > 150) {
    errors.push({ field: "title", message: "Title must be 3-150 characters" });
  }

  if (data.content.length > 20000) {
    errors.push({ field: "content", message: "Content max length is 20000 characters" });
  }

  if (!parsedDate) {
    errors.push({ field: "noteDate", message: "noteDate must use YYYY-MM-DD format" });
  }

  if (!parsedEntryType) {
    errors.push({ field: "entryType", message: "entryType must be note or document" });
  }

  if (data.color !== undefined && !parsedColor) {
    errors.push({ field: "color", message: "color must be one of green, blue, purple, amber, red" });
  }

  if (parsedTime === null) {
    errors.push({ field: "time", message: "time must use HH:mm format" });
  }

  if (data.isStarred !== undefined && parsedIsStarred === null) {
    errors.push({ field: "isStarred", message: "isStarred must be boolean" });
  }

  if (!parsedLocation) {
    errors.push({ field: "location", message: "location is invalid" });
  }

  if (normalizedLabel.length > 100) {
    errors.push({ field: "label", message: "label max length is 100 characters" });
  }

  const entryType = parsedEntryType || "note";
  const fallbackLabel = entryType === "document" ? "Dokumen" : "Kerja";
  const fallbackColor = entryType === "document" ? "blue" : "green";
  const resolvedTime = entryType === "document" ? "" : (parsedTime || "");

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      title: data.title,
      content: data.content,
      noteDate: parsedDate,
      entryType,
      label: normalizedLabel || fallbackLabel,
      color: parsedColor || fallbackColor,
      time: resolvedTime,
      isStarred: parsedIsStarred ?? false,
      location: parsedLocation || "All Docs",
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

    if (content.length > 20000) {
      errors.push({ field: "content", message: "Content max length is 20000 characters" });
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

  if (payload.entryType !== undefined) {
    const parsedEntryType = parseEntryType(payload.entryType);

    if (!parsedEntryType) {
      errors.push({ field: "entryType", message: "entryType must be note or document" });
    } else {
      data.entryType = parsedEntryType;
    }
  }

  if (payload.label !== undefined) {
    const label = String(payload.label).trim();

    if (label.length > 100) {
      errors.push({ field: "label", message: "label max length is 100 characters" });
    } else {
      data.label = label;
    }
  }

  if (payload.color !== undefined) {
    const parsedColor = parseColor(payload.color);

    if (!parsedColor) {
      errors.push({ field: "color", message: "color must be one of green, blue, purple, amber, red" });
    } else {
      data.color = parsedColor;
    }
  }

  if (payload.time !== undefined) {
    const parsedTime = parseTime(payload.time);

    if (parsedTime === null) {
      errors.push({ field: "time", message: "time must use HH:mm format" });
    } else {
      data.time = parsedTime;
    }
  }

  if (payload.isStarred !== undefined) {
    const parsedIsStarred = parseBoolean(payload.isStarred);

    if (parsedIsStarred === null) {
      errors.push({ field: "isStarred", message: "isStarred must be boolean" });
    } else {
      data.isStarred = parsedIsStarred;
    }
  }

  if (payload.location !== undefined) {
    const parsedLocation = parseLocation(payload.location);

    if (!parsedLocation) {
      errors.push({ field: "location", message: "location is invalid" });
    } else {
      data.location = parsedLocation;
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
  const parsedStartDate = query.startDate ? parseDateOnly(query.startDate) : null;
  const parsedEndDate = query.endDate ? parseDateOnly(query.endDate) : null;
  const parsedEntryType = query.entryType ? parseEntryType(query.entryType) : null;
  const parsedIsStarred = query.isStarred === undefined ? null : parseBoolean(query.isStarred);
  const search = String(query.search || "").trim();
  const sort = String(query.sort || "updatedAtDesc").trim();

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError("page must be a positive integer", 422);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError("limit must be between 1 and 100", 422);
  }

  if (query.date && !parsedDate) {
    throw new AppError("date must use YYYY-MM-DD format", 422);
  }

  if (query.startDate && !parsedStartDate) {
    throw new AppError("startDate must use YYYY-MM-DD format", 422);
  }

  if (query.endDate && !parsedEndDate) {
    throw new AppError("endDate must use YYYY-MM-DD format", 422);
  }

  if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
    throw new AppError("startDate must be less than or equal to endDate", 422);
  }

  if (query.entryType && !parsedEntryType) {
    throw new AppError("entryType must be note or document", 422);
  }

  if (parsedIsStarred === null && query.isStarred !== undefined) {
    throw new AppError("isStarred must be boolean", 422);
  }

  if (search.length > 100) {
    throw new AppError("search max length is 100 characters", 422);
  }

  const allowedSortValues = [
    "noteDateDesc",
    "noteDateAsc",
    "updatedAtDesc",
    "updatedAtAsc",
    "createdAtDesc",
  ];

  if (!allowedSortValues.includes(sort)) {
    throw new AppError("sort is invalid", 422);
  }

  return {
    page,
    limit,
    date: parsedDate,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    search,
    entryType: parsedEntryType,
    isStarred: parsedIsStarred,
    sort,
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
