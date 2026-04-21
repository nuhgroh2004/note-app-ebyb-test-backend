const { prisma } = require("../../config/db");
const AppError = require("../../utils/appError");

function isInvalidUserReferenceError(error) {
  if (!error || error.code !== "P2003") {
    return false;
  }

  const fieldName = String(error.meta?.field_name || "").toLowerCase();
  return fieldName.includes("userid");
}

function buildDateRange(date) {
  const start = new Date(date);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return {
    gte: start,
    lt: end,
  };
}

function buildSortOrder(sort) {
  if (sort === "noteDateAsc") {
    return [{ noteDate: "asc" }, { id: "asc" }];
  }

  if (sort === "noteDateDesc") {
    return [{ noteDate: "desc" }, { id: "desc" }];
  }

  if (sort === "updatedAtAsc") {
    return [{ updatedAt: "asc" }, { id: "asc" }];
  }

  if (sort === "createdAtDesc") {
    return [{ createdAt: "desc" }, { id: "desc" }];
  }

  return [{ updatedAt: "desc" }, { id: "desc" }];
}

async function createNote(userId, payload) {
  try {
    return await prisma.note.create({
      data: {
        title: payload.title,
        content: payload.content,
        noteDate: payload.noteDate,
        entryType: payload.entryType,
        label: payload.label,
        color: payload.color,
        time: payload.time,
        isStarred: payload.isStarred,
        location: payload.location,
        userId,
      },
    });
  } catch (error) {
    if (isInvalidUserReferenceError(error)) {
      throw new AppError("Invalid token", 401);
    }

    throw error;
  }
}

async function listNotes(userId, query) {
  const skip = (query.page - 1) * query.limit;
  const where = { userId };

  if (query.search) {
    where.OR = [
      { title: { contains: query.search } },
      { content: { contains: query.search } },
      { label: { contains: query.search } },
      { location: { contains: query.search } },
    ];
  }

  if (query.date) {
    where.noteDate = buildDateRange(query.date);
  } else if (query.startDate || query.endDate) {
    const nextDateRange = {};

    if (query.startDate) {
      nextDateRange.gte = query.startDate;
    }

    if (query.endDate) {
      const dayAfterEndDate = new Date(query.endDate);
      dayAfterEndDate.setUTCDate(dayAfterEndDate.getUTCDate() + 1);
      nextDateRange.lt = dayAfterEndDate;
    }

    where.noteDate = nextDateRange;
  }

  if (query.entryType) {
    where.entryType = query.entryType;
  }

  if (query.isStarred !== null && query.isStarred !== undefined) {
    where.isStarred = query.isStarred;
  }

  const [total, notes] = await prisma.$transaction([
    prisma.note.count({ where }),
    prisma.note.findMany({
      where,
      orderBy: buildSortOrder(query.sort),
      skip,
      take: query.limit,
    }),
  ]);

  return {
    items: notes,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
  };
}

async function getNoteById(userId, noteId) {
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId,
    },
  });

  if (!note) {
    throw new AppError("Note not found", 404);
  }

  return note;
}

async function updateNote(userId, noteId, payload) {
  await getNoteById(userId, noteId);

  return prisma.note.update({
    where: {
      id: noteId,
    },
    data: payload,
  });
}

async function deleteNote(userId, noteId) {
  await getNoteById(userId, noteId);

  await prisma.note.delete({
    where: {
      id: noteId,
    },
  });
}

module.exports = {
  createNote,
  listNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
