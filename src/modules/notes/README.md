# Notes Module Documentation

## Tujuan
Modul Notes mengelola CRUD catatan/dokumen per user, termasuk filtering, sorting, dan pagination untuk kebutuhan dashboard dan kalender.

## Teknologi dan Dependensi
- Express router + controller + service
- JWT auth middleware
- Prisma note repository
- Query validation layer

File utama:
- src/modules/notes/notes.routes.js
- src/modules/notes/notes.controller.js
- src/modules/notes/notes.service.js
- src/modules/notes/notes.validation.js

## Endpoint
Semua endpoint notes wajib Bearer token.
- POST /api/notes
- GET /api/notes
- GET /api/notes/:id
- PUT /api/notes/:id
- DELETE /api/notes/:id

## Query Parameters List
- page: integer > 0
- limit: 1..100
- date: YYYY-MM-DD
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
- entryType: note | document
- search: string max 100
- isStarred: true | false
- sort: noteDateDesc | noteDateAsc | updatedAtDesc | updatedAtAsc | createdAtDesc

## Potongan Kode Penting
### 1) Scope query berdasarkan userId
```js
const where = { userId };
if (query.entryType) where.entryType = query.entryType;
if (query.isStarred !== null && query.isStarred !== undefined) {
  where.isStarred = query.isStarred;
}
```

### 2) Full text-like search sederhana
```js
where.OR = [
  { title: { contains: query.search } },
  { content: { contains: query.search } },
  { label: { contains: query.search } },
  { location: { contains: query.search } },
];
```

### 3) Pagination + transaction
```js
const skip = (query.page - 1) * query.limit;
const [total, notes] = await prisma.$transaction([
  prisma.note.count({ where }),
  prisma.note.findMany({ where, orderBy: buildSortOrder(query.sort), skip, take: query.limit }),
]);
```

### 4) Mapping P2003 ke 401 Invalid token
```js
if (isInvalidUserReferenceError(error)) {
  throw new AppError('Invalid token', 401);
}
```

## Contoh Request dan Hasil
### Create Note
Request:
```http
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

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

Response sukses (201):
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

### List Notes
Request:
```http
GET /api/notes?page=1&limit=10&entryType=document&search=proposal&sort=updatedAtDesc
Authorization: Bearer <token>
```

Response sukses (200):
```json
{
  "message": "Notes fetched",
  "data": {
    "items": [
      {
        "id": 10,
        "title": "Proposal A",
        "entryType": "document"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Update Note
Request:
```http
PUT /api/notes/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "isStarred": true
}
```

Response sukses (200):
```json
{
  "message": "Note updated",
  "data": {
    "id": 1,
    "title": "Updated title",
    "isStarred": true
  }
}
```

### Delete Note
Request:
```http
DELETE /api/notes/1
Authorization: Bearer <token>
```

Response sukses (200):
```json
{
  "message": "Note deleted"
}
```

## Validasi Penting
- title: 3-150 karakter
- content: max 20000
- noteDate: format YYYY-MM-DD
- color: green | blue | purple | amber | red
- location: All Docs | Tasks | Imagine | Shared With Me
- time: HH:mm

## Error Umum
- 401 Unauthorized / Invalid token
- 404 Note not found
- 422 Validation error
