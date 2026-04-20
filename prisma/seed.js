const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash("password123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@ebyb.test" },
    update: {
      name: "Admin EBYB",
      password: defaultPassword,
    },
    create: {
      name: "Admin EBYB",
      email: "admin@ebyb.test",
      password: defaultPassword,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "user@ebyb.test" },
    update: {
      name: "User Demo",
      password: defaultPassword,
    },
    create: {
      name: "User Demo",
      email: "user@ebyb.test",
      password: defaultPassword,
    },
  });

  await prisma.note.deleteMany();

  await prisma.note.createMany({
    data: [
      {
        title: "Project kickoff",
        content: "Finalize API scope and timeline.",
        noteDate: new Date("2026-04-20T00:00:00.000Z"),
        entryType: "note",
        label: "Kerja",
        color: "green",
        time: "09:00",
        isStarred: true,
        location: "All Docs",
        userId: adminUser.id,
      },
      {
        title: "Prepare release notes",
        content: "Collect completed tasks before release.",
        noteDate: new Date("2026-04-21T00:00:00.000Z"),
        entryType: "document",
        label: "Dokumen",
        color: "blue",
        time: null,
        isStarred: false,
        location: "All Docs",
        userId: adminUser.id,
      },
      {
        title: "Personal reminder",
        content: "Review pending notes for this week.",
        noteDate: new Date("2026-04-22T00:00:00.000Z"),
        entryType: "note",
        label: "Pribadi",
        color: "purple",
        time: "18:00",
        isStarred: false,
        location: "All Docs",
        userId: demoUser.id,
      },
    ],
  });

  console.log("Seed completed: users and notes inserted.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
