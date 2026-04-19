const AppError = require("../../utils/appError");
const asyncHandler = require("../../utils/asyncHandler");
const { registerUser, loginUser } = require("./auth.service");
const {
  validateRegisterPayload,
  validateLoginPayload,
} = require("./auth.validation");

const register = asyncHandler(async (req, res, next) => {
  const validation = validateRegisterPayload(req.body);

  if (!validation.isValid) {
    return next(new AppError("Validation error", 422, validation.errors));
  }

  const result = await registerUser(validation.data);

  return res.status(201).json({
    message: "Register success",
    data: result,
  });
});

const login = asyncHandler(async (req, res, next) => {
  const validation = validateLoginPayload(req.body);

  if (!validation.isValid) {
    return next(new AppError("Validation error", 422, validation.errors));
  }

  const result = await loginUser(validation.data);

  return res.status(200).json({
    message: "Login success",
    data: result,
  });
});

module.exports = {
  register,
  login,
};
