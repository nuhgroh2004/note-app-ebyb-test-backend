# REST API Documentation

## Base URL
### Local
- http://localhost:8080

### Production (Railway)
- https://note-app-ebyb-test-backend-production.up.railway.app

## Global Response Pattern
### Success
```json
{
  "message": "...",
  "data": {}
}
```

### Validation error
```json
{
  "message": "Validation error",
  "errors": [
    { "field": "name", "message": "Name must be 3-100 characters" }
  ]
}
```

## Health Endpoints
### GET /
Response 200:
```json
{ "message": "Notes App API is running" }
```

### GET /api/health
Response 200:
```json
{
  "status": "ok",
  "database": "connected"
}
```

Response 500 (contoh):
```json
{
  "status": "error",
  "database": "disconnected",
  "message": "DB connection failed"
}
```

## Authentication Header
Untuk endpoint private, sertakan:
```http
Authorization: Bearer <token>
```

## Auth Module
### POST /api/auth/register
Body:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

Response 201:
```json
{
  "message": "Register success",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

### POST /api/auth/login
Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response 200:
```json
{
  "message": "Login success",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

### POST /api/auth/google
Body:
```json
{
  "idToken": "google-id-token"
}
```

Response 200:
```json
{
  "message": "Google login success",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "name": "Google User",
      "email": "google-user@example.com",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

## Notes Module (Bearer Token Required)
### POST /api/notes
Body:
```json
{
  "title": "Meeting Notes",
  "content": "Discuss release plan",
  "noteDate": "2026-04-19",
  "entryType": "note",
  "label": "Kerja",
  "color": "green",
  "time": "09:00",
  "isStarred": false,
  "location": "All Docs"
}
```

Response 201:
```json
{
  "message": "Note created",
  "data": {
    "id": 1,
    "title": "Meeting Notes",
    "content": "Discuss release plan",
    "noteDate": "2026-04-19T00:00:00.000Z",
    "entryType": "note",
    "label": "Kerja",
    "color": "green",
    "time": "09:00",
    "isStarred": false,
    "location": "All Docs",
    "userId": 1,
    "createdAt": "2026-04-19T01:00:00.000Z",
    "updatedAt": "2026-04-19T01:00:00.000Z"
  }
}
```

### GET /api/notes
Contoh query:
- /api/notes?page=1&limit=10&date=2026-04-19
- /api/notes?page=1&limit=20&entryType=document&search=proposal&sort=updatedAtDesc
- /api/notes?page=1&limit=100&startDate=2026-04-01&endDate=2026-04-30

Response 200:
```json
{
  "message": "Notes fetched",
  "data": {
    "items": [
      {
        "id": 10,
        "title": "Proposal A",
        "content": "...",
        "noteDate": "2026-04-20T00:00:00.000Z",
        "entryType": "document",
        "label": "Dokumen",
        "color": "blue",
        "time": "",
        "isStarred": false,
        "location": "All Docs",
        "createdAt": "2026-04-20T08:00:00.000Z",
        "updatedAt": "2026-04-20T09:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### GET /api/notes/:id
Response 200:
```json
{
  "message": "Note fetched",
  "data": {
    "id": 10,
    "title": "Proposal A",
    "content": "...",
    "noteDate": "2026-04-20T00:00:00.000Z",
    "entryType": "document",
    "label": "Dokumen",
    "color": "blue",
    "time": "",
    "isStarred": false,
    "location": "All Docs",
    "createdAt": "2026-04-20T08:00:00.000Z",
    "updatedAt": "2026-04-20T09:00:00.000Z"
  }
}
```

### PUT /api/notes/:id
Body:
```json
{
  "title": "Updated Title",
  "content": "Updated Content",
  "noteDate": "2026-04-20",
  "isStarred": true,
  "location": "All Docs"
}
```

Response 200:
```json
{
  "message": "Note updated",
  "data": {
    "id": 10,
    "title": "Updated Title",
    "isStarred": true,
    "updatedAt": "2026-04-21T08:00:00.000Z"
  }
}
```

### DELETE /api/notes/:id
Response 200:
```json
{
  "message": "Note deleted"
}
```

### Notes Query Validation Rules
- page: positive integer
- limit: 1-100
- date/startDate/endDate: format YYYY-MM-DD
- startDate <= endDate
- entryType: note | document
- isStarred: boolean
- search: max 100
- sort: noteDateDesc | noteDateAsc | updatedAtDesc | updatedAtAsc | createdAtDesc

## Profile Module (Bearer Token Required)
### GET /api/profile
Response 200:
```json
{
  "message": "Profile fetched",
  "data": {
    "id": 1,
    "name": "User Test",
    "email": "user@test.com",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-04-21T00:00:00.000Z"
  }
}
```

### GET /api/profile/dashboard
Response 200:
```json
{
  "message": "Profile dashboard fetched",
  "data": {
    "profile": {
      "id": 1,
      "name": "User Test",
      "email": "user@test.com",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-04-21T00:00:00.000Z"
    },
    "stats": {
      "totalNotes": 10,
      "notesThisMonth": 4
    },
    "upcomingNotes": [
      {
        "id": 100,
        "title": "Meeting Mingguan",
        "noteDate": "2026-04-22T00:00:00.000Z"
      }
    ]
  }
}
```

## cURL Examples
### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"User Test","email":"user@test.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'
```

### List notes
```bash
curl "http://localhost:8080/api/notes?page=1&limit=10&sort=updatedAtDesc" \
  -H "Authorization: Bearer <token>"
```

### Get profile dashboard
```bash
curl http://localhost:8080/api/profile/dashboard \
  -H "Authorization: Bearer <token>"
```
