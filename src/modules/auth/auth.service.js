const { prisma } = require("../../config/db");
const AppError = require("../../utils/appError");
const { hashPassword, comparePassword } = require("../../utils/password");
const { signToken } = require("../../utils/token");

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
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

module.exports = {
  registerUser,
  loginUser,
};
