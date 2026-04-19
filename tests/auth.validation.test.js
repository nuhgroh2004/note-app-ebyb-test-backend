const {
  validateRegisterPayload,
  validateLoginPayload,
} = require("../src/modules/auth/auth.validation");

describe("Auth Validation", () => {
  test("validateRegisterPayload should fail for invalid payload", () => {
    const result = validateRegisterPayload({
      name: "A",
      email: "invalid-email",
      password: "123",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test("validateRegisterPayload should pass for valid payload", () => {
    const result = validateRegisterPayload({
      name: "User Name",
      email: "user@test.com",
      password: "password123",
    });

    expect(result.isValid).toBe(true);
    expect(result.data.email).toBe("user@test.com");
  });

  test("validateLoginPayload should fail for invalid payload", () => {
    const result = validateLoginPayload({
      email: "wrong",
      password: "123",
    });

    expect(result.isValid).toBe(false);
  });

  test("validateLoginPayload should pass for valid payload", () => {
    const result = validateLoginPayload({
      email: "user@test.com",
      password: "password123",
    });

    expect(result.isValid).toBe(true);
  });
});
