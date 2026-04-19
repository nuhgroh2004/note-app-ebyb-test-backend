const { prisma } = require("../../config/db");
const AppError = require("../../utils/appError");

function buildDateRange(date) {
  const start = new Date(date);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return {
    gte: start,
    lt: end,
  };
}

async function createNote(userId, payload) {
  return prisma.note.create({
    data: {
      title: payload.title,
      content: payload.content,
      noteDate: payload.noteDate,
      userId,
    },
  });
}

async function listNotes(userId, query) {
  const skip = (query.page - 1) * query.limit;
  const where = { userId };

  if (query.date) {
    where.noteDate = buildDateRange(query.date);
  }

  const [total, notes] = await prisma.$transaction([
    prisma.note.count({ where }),
    prisma.note.findMany({
      where,
      orderBy: [{ noteDate: "desc" }, { id: "desc" }],
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
