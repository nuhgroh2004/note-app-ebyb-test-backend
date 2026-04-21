# Auth Module Documentation

## Tujuan
Menangani registrasi, login, dan login Google, lalu menghasilkan token JWT untuk autentikasi endpoint private.

## Teknologi dan Dependensi
- express + express-rate-limit
- prisma user repository
- bcryptjs untuk hash/verify password
- jsonwebtoken untuk sign token
- Google tokeninfo endpoint untuk validasi idToken

File utama:
- src/modules/auth/auth.routes.js
- src/modules/auth/auth.controller.js
- src/modules/auth/auth.service.js
- src/modules/auth/auth.validation.js

## Endpoint
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/google

## Implementasi Inti
### 1) Rate limiter per endpoint auth
```js
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});
router.post('/register', authRateLimiter, register);
```

### 2) Validasi payload
```js
const validation = validateRegisterPayload(req.body);
if (!validation.isValid) {
  return next(new AppError('Validation error', 422, validation.errors));
}
```

### 3) Register service
```js
const hashedPassword = await hashPassword(password);
const createdUser = await prisma.user.create({ data: { name, email, password: hashedPassword } });
const token = signToken({ userId: createdUser.id });
```

### 4) Google login verification
```js
const response = await fetch(`${GOOGLE_TOKENINFO_ENDPOINT}?id_token=${encodeURIComponent(idToken)}`);
if (!response.ok) throw new AppError('Invalid Google token', 401);
```

## Contoh Request dan Hasil
### Register
Request:
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "User Test",
  "email": "user@test.com",
  "password": "password123"
}
```

Response sukses (201):
```json
{
  "message": "Register success",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "name": "User Test",
      "email": "user@test.com",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

### Login
Request:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "password123"
}
```

Response sukses (200):
```json
{
  "message": "Login success",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "name": "User Test",
      "email": "user@test.com",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

### Google Login
Request:
```http
POST /api/auth/google
Content-Type: application/json

{
  "idToken": "google-id-token"
}
```

Response sukses (200):
```json
{
  "message": "Google login success",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "name": "Google User",
      "email": "google-user@test.com",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

## Validasi Penting
- name: 3-100 karakter
- email: format email valid
- password: 8-72 karakter
- idToken: 20-4096 karakter

## Error Umum
- 409 Email already registered
- 401 Invalid email or password
- 401 Invalid Google token
- 422 Validation error
