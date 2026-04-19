# REST API Documentation

## Base URL
- `http://localhost:3000`

## Health
- `GET /`
- `GET /api/health`

## Auth Module
### Register
- `POST /api/auth/register`
- Body:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

### Login
- `POST /api/auth/login`
- Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## Notes Module (Bearer Token Required)
### Create note
- `POST /api/notes`
- Body:
```json
{
  "title": "My Note",
  "content": "Content",
  "noteDate": "2026-04-19"
}
```

### List notes
- `GET /api/notes?page=1&limit=10&date=2026-04-19`

### Get note detail
- `GET /api/notes/:id`

### Update note
- `PUT /api/notes/:id`
- Body:
```json
{
  "title": "Updated Title",
  "content": "Updated Content",
  "noteDate": "2026-04-20"
}
```

### Delete note
- `DELETE /api/notes/:id`

## Profile Module (Bearer Token Required)
### Profile detail
- `GET /api/profile`

### Profile dashboard
- `GET /api/profile/dashboard`

## Authentication Header
Use Bearer token from login/register:
- `Authorization: Bearer <token>`
