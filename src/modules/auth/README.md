# Auth Module

## Purpose
Handle user authentication using email and password.

## Flow
1. Validate request payload.
2. For register: check unique email, hash password, create user.
3. For login: verify email and password.
4. Return JWT token and user profile summary.

## Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`

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

## Dependencies
- Prisma Client
- bcryptjs
- jsonwebtoken
- express-rate-limit
