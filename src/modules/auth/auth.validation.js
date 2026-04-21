function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateRegisterPayload(payload) {
  const errors = [];
  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");

  if (name.length < 3 || name.length > 100) {
    errors.push({ field: "name", message: "Name must be 3-100 characters" });
  }

  if (!isValidEmail(email)) {
    errors.push({ field: "email", message: "Email is invalid" });
  }

  if (password.length < 8 || password.length > 72) {
    errors.push({ field: "password", message: "Password must be 8-72 characters" });
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: { name, email, password },
  };
}

function validateLoginPayload(payload) {
  const errors = [];
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");

  if (!isValidEmail(email)) {
    errors.push({ field: "email", message: "Email is invalid" });
  }

  if (password.length < 8 || password.length > 72) {
    errors.push({ field: "password", message: "Password must be 8-72 characters" });
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: { email, password },
  };
}

function validateGoogleLoginPayload(payload) {
  const errors = [];
  const idToken = String(payload.idToken || "").trim();

  if (idToken.length < 20 || idToken.length > 4096) {
    errors.push({ field: "idToken", message: "Google idToken is invalid" });
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: { idToken },
  };
}

module.exports = {
  validateRegisterPayload,
  validateLoginPayload,
  validateGoogleLoginPayload,
};
