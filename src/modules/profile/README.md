# Profile Module

## Purpose
Provide profile information and dashboard summary for authenticated user.

## Flow
1. Authenticate request using Bearer token.
2. Read user profile from database.
3. Build dashboard statistics from notes data.
4. Return profile and summary in REST response.

## Endpoints
- `GET /api/profile`
- `GET /api/profile/dashboard`

## Response Summary
### Profile
- `id`
- `name`
- `email`
- `createdAt`
- `updatedAt`

### Dashboard
- `profile`
- `stats.totalNotes`
- `stats.notesThisMonth`
- `upcomingNotes` (max 5 notes)

## Dependencies
- Auth middleware (JWT)
- Prisma Client
