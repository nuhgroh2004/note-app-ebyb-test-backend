const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Admin EBYB",
        email: "admin@ebyb.test",
        password: defaultPassword,
      },
      {
        name: "User Demo",
        email: "user@ebyb.test",
        password: defaultPassword,
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
