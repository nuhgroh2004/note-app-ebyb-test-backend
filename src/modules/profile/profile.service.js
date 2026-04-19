const { prisma } = require("../../config/db");
const AppError = require("../../utils/appError");

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}

async function getProfileDashboard(userId) {
  const profile = await getProfile(userId);

  const today = new Date();
  const startToday = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  const startMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  const nextMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1));

  const [totalNotes, notesThisMonth, upcomingNotes] = await prisma.$transaction([
    prisma.note.count({ where: { userId } }),
    prisma.note.count({
      where: {
        userId,
        noteDate: {
          gte: startMonth,
          lt: nextMonth,
        },
      },
    }),
    prisma.note.findMany({
      where: {
        userId,
        noteDate: {
          gte: startToday,
        },
      },
      orderBy: [{ noteDate: "asc" }, { id: "asc" }],
      take: 5,
      select: {
        id: true,
        title: true,
        noteDate: true,
      },
    }),
  ]);

  return {
    profile,
    stats: {
      totalNotes,
      notesThisMonth,
    },
    upcomingNotes,
  };
}

module.exports = {
  getProfile,
  getProfileDashboard,
};
