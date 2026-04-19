const request = require("supertest");

jest.mock("../src/config/db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    note: {
      create: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
  testDatabaseConnection: jest.fn(),
}));

const { testDatabaseConnection } = require("../src/config/db");
const app = require("../src/app");

describe("API test", () => {
  test("GET / should return welcome message", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Notes App API is running" });
  });

  test("GET /api/health should return connected when DB is healthy", async () => {
    testDatabaseConnection.mockResolvedValueOnce(true);

    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      database: "connected",
    });
  });

  test("GET /api/health should return error when DB is down", async () => {
    testDatabaseConnection.mockRejectedValueOnce(new Error("DB connection failed"));

    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      status: "error",
      database: "disconnected",
      message: "DB connection failed",
    });
  });
});
