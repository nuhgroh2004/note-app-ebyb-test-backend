jest.mock("../src/config/db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("../src/utils/password", () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

jest.mock("../src/utils/token", () => ({
  signToken: jest.fn(),
}));

const { prisma } = require("../src/config/db");
const { hashPassword, comparePassword } = require("../src/utils/password");
const { signToken } = require("../src/utils/token");
const { registerUser, loginUser, loginWithGoogle } = require("../src/modules/auth/auth.service");

const originalFetch = global.fetch;

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  test("registerUser should create user and return token", async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null);
    hashPassword.mockResolvedValueOnce("hashed-password");
    prisma.user.create.mockResolvedValueOnce({
      id: 1,
      name: "User Test",
      email: "user@test.com",
      password: "hashed-password",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    signToken.mockReturnValueOnce("jwt-token");

    const result = await registerUser({
      name: "User Test",
      email: "user@test.com",
      password: "password123",
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "user@test.com" },
    });
    expect(hashPassword).toHaveBeenCalledWith("password123");
    expect(prisma.user.create).toHaveBeenCalled();
    expect(result.token).toBe("jwt-token");
    expect(result.user.email).toBe("user@test.com");
    expect(result.user.password).toBeUndefined();
  });

  test("loginUser should throw error when user not found", async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null);

    await expect(
      loginUser({ email: "missing@test.com", password: "password123" })
    ).rejects.toThrow("Invalid email or password");
  });

  test("loginUser should return token when password valid", async () => {
    prisma.user.findUnique.mockResolvedValueOnce({
      id: 99,
      name: "User Login",
      email: "login@test.com",
      password: "hashed-password",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    comparePassword.mockResolvedValueOnce(true);
    signToken.mockReturnValueOnce("jwt-login-token");

    const result = await loginUser({
      email: "login@test.com",
      password: "password123",
    });

    expect(comparePassword).toHaveBeenCalledWith("password123", "hashed-password");
    expect(result.token).toBe("jwt-login-token");
    expect(result.user.id).toBe(99);
  });

  test("loginWithGoogle should return token for existing user", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        aud: "test-google-client-id",
        email: "google-user@test.com",
        name: "Google User",
        email_verified: "true",
      }),
    });

    prisma.user.findUnique.mockResolvedValueOnce({
      id: 44,
      name: "Google User",
      email: "google-user@test.com",
      password: "hashed-password",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    signToken.mockReturnValueOnce("jwt-google-token");

    const result = await loginWithGoogle({
      idToken: "google-id-token",
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "google-user@test.com" },
    });
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(result.token).toBe("jwt-google-token");
    expect(result.user.email).toBe("google-user@test.com");
  });

  test("loginWithGoogle should create user when email not found", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        aud: "test-google-client-id",
        email: "new-google@test.com",
        name: "New Google User",
        email_verified: "true",
      }),
    });

    prisma.user.findUnique.mockResolvedValueOnce(null);
    hashPassword.mockResolvedValueOnce("hashed-random-password");
    prisma.user.create.mockResolvedValueOnce({
      id: 55,
      name: "New Google User",
      email: "new-google@test.com",
      password: "hashed-random-password",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    signToken.mockReturnValueOnce("jwt-google-token-new-user");

    const result = await loginWithGoogle({
      idToken: "google-id-token-new-user",
    });

    expect(hashPassword).toHaveBeenCalledTimes(1);
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    expect(result.token).toBe("jwt-google-token-new-user");
    expect(result.user.id).toBe(55);
  });
});
