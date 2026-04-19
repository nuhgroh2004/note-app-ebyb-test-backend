const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  await prisma.$queryRaw`SELECT 1`;
  return true;
}

module.exports = {
  prisma,
  testDatabaseConnection,
};
