# Notes Module

## Purpose
Manage CRUD notes/documents with calendar metadata and DB-level filtering per user.

## Flow
1. Authenticate user using Bearer token.
2. Validate payload and query parameters.
3. Execute Prisma query scoped by `userId`.
4. Return RESTful response with pagination for list endpoint.

## Endpoints
- `POST /api/notes`
- `GET /api/notes`
- `GET /api/notes/:id`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`

## Query Parameters
### List notes
- `page`: positive integer
- `limit`: 1-100
- `date`: `YYYY-MM-DD` to filter calendar date
- `startDate`: `YYYY-MM-DD` for range start
- `endDate`: `YYYY-MM-DD` for range end
- `entryType`: `note` or `document`
- `search`: keyword search in title/content/label/location
- `isStarred`: `true`/`false`
- `sort`: `noteDateDesc`, `noteDateAsc`, `updatedAtDesc`, `updatedAtAsc`, `createdAtDesc`

## Request Body
### Create note
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

### Update note
```json
{
  "title": "Updated title",
  "content": "Updated content",
  "noteDate": "2026-04-20"
}
```

## Dependencies
- Auth middleware (JWT)
- Prisma Client
