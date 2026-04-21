const {
  validateRegisterPayload,
  validateLoginPayload,
  validateGoogleLoginPayload,
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

  test("validateGoogleLoginPayload should fail for invalid payload", () => {
    const result = validateGoogleLoginPayload({
      idToken: "short-token",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test("validateGoogleLoginPayload should pass for valid payload", () => {
    const result = validateGoogleLoginPayload({
      idToken: "this-is-a-valid-google-id-token-placeholder-with-sufficient-length",
    });

    expect(result.isValid).toBe(true);
    expect(result.data.idToken).toContain("valid-google-id-token");
  });
});
