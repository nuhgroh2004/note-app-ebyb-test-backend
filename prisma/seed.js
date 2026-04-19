const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: "Admin EBYB",
        email: "admin@ebyb.test",
      },
      {
        name: "User Demo",
        email: "user@ebyb.test",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed: users inserted.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
