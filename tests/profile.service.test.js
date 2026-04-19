jest.mock("../src/config/db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    note: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

const { prisma } = require("../src/config/db");
const {
  getProfile,
  getProfileDashboard,
} = require("../src/modules/profile/profile.service");

describe("Profile Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getProfile should return user profile", async () => {
    prisma.user.findUnique.mockResolvedValueOnce({
      id: 1,
      name: "User Test",
      email: "user@test.com",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    const profile = await getProfile(1);

    expect(profile.email).toBe("user@test.com");
  });

  test("getProfile should throw when user not found", async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null);

    await expect(getProfile(999)).rejects.toThrow("User not found");
  });

  test("getProfileDashboard should return dashboard data", async () => {
    prisma.user.findUnique.mockResolvedValueOnce({
      id: 1,
      name: "User Test",
      email: "user@test.com",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    prisma.$transaction.mockResolvedValueOnce([
      10,
      4,
      [{ id: 1, title: "Upcoming", noteDate: new Date("2026-04-21T00:00:00.000Z") }],
    ]);

    const result = await getProfileDashboard(1);

    expect(result.stats.totalNotes).toBe(10);
    expect(result.stats.notesThisMonth).toBe(4);
    expect(result.upcomingNotes.length).toBe(1);
  });
});
