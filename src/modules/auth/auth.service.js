const { prisma } = require("../../config/db");
const { randomBytes } = require("crypto");
const AppError = require("../../utils/appError");
const { hashPassword, comparePassword } = require("../../utils/password");
const { signToken } = require("../../utils/token");

const GOOGLE_TOKENINFO_ENDPOINT = "https://oauth2.googleapis.com/tokeninfo";
const DEFAULT_GOOGLE_CLIENT_ID =
  "682901587483-492tqbud3m76gr868maeean7o46sial5.apps.googleusercontent.com";

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function resolveGoogleClientId() {
  return process.env.GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;
}

function normalizeGoogleDisplayName(name, email) {
  const normalizedName = String(name || "").trim();

  if (normalizedName) {
    return normalizedName.slice(0, 100);
  }

  const emailLocalPart = String(email || "")
    .split("@")[0]
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .trim();

  if (emailLocalPart.length >= 3) {
    return emailLocalPart.slice(0, 100);
  }

  return "Google User";
}

function isGoogleEmailVerified(value) {
  return value === true || value === "true";
}

async function verifyGoogleIdToken(idToken) {
  if (typeof fetch !== "function") {
    throw new AppError("Google login unavailable on server runtime", 500);
  }

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), 10_000);

  try {
    const response = await fetch(
      `${GOOGLE_TOKENINFO_ENDPOINT}?id_token=${encodeURIComponent(idToken)}`,
      {
        method: "GET",
        signal: timeoutController.signal,
      }
    );

    if (!response.ok) {
      throw new AppError("Invalid Google token", 401);
    }

    const payload = await response.json();
    const expectedClientId = resolveGoogleClientId();

    if (String(payload.aud || "") !== expectedClientId) {
      throw new AppError("Google token audience mismatch", 401);
    }

    if (!isGoogleEmailVerified(payload.email_verified)) {
      throw new AppError("Google account email is not verified", 401);
    }

    const email = String(payload.email || "").trim().toLowerCase();

    if (!email) {
      throw new AppError("Google account email is missing", 401);
    }

    return {
      email,
      name: normalizeGoogleDisplayName(payload.name, email),
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new AppError("Google login timeout", 504);
    }

    throw new AppError("Google login failed", 401);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function registerUser({ name, email, password }) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = await hashPassword(password);

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = signToken({ userId: createdUser.id });

  return {
    token,
    user: sanitizeUser(createdUser),
  };
}

async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({ userId: user.id });

  return {
    token,
    user: sanitizeUser(user),
  };
}

async function loginWithGoogle({ idToken }) {
  const googleAccount = await verifyGoogleIdToken(idToken);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: googleAccount.email,
    },
  });

  if (existingUser) {
    const token = signToken({ userId: existingUser.id });

    return {
      token,
      user: sanitizeUser(existingUser),
    };
  }

  const randomPassword = randomBytes(32).toString("hex");
  const hashedPassword = await hashPassword(randomPassword);

  const createdUser = await prisma.user.create({
    data: {
      name: googleAccount.name,
      email: googleAccount.email,
      password: hashedPassword,
    },
  });

  const token = signToken({ userId: createdUser.id });

  return {
    token,
    user: sanitizeUser(createdUser),
  };
}

module.exports = {
  registerUser,
  loginUser,
  loginWithGoogle,
};
