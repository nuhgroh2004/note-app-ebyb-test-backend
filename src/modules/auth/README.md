# Auth Module

## Purpose
Handle user authentication using email/password and Google account.

## Flow
1. Validate request payload.
2. For register: check unique email, hash password, create user.
3. For login: verify email and password.
4. For Google login: verify Google ID token, then find/create user by email.
5. Return JWT token and user profile summary.

## Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`

## Request Body
### Register
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

### Login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Google Login
```json
{
  "idToken": "google-id-token"
}
```

## Dependencies
- Prisma Client
- bcryptjs
- jsonwebtoken
- express-rate-limit
- Google TokenInfo API (oauth2.googleapis.com/tokeninfo)
