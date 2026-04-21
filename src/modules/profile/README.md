# Profile Module Documentation

## Tujuan
Menyediakan endpoint profil user dan ringkasan dashboard user berdasarkan data notes.

## Teknologi dan Dependensi
- Express router + controller + service
- JWT auth middleware
- Prisma (User + Note)

File utama:
- src/modules/profile/profile.routes.js
- src/modules/profile/profile.controller.js
- src/modules/profile/profile.service.js

## Endpoint
- GET /api/profile
- GET /api/profile/dashboard

Kedua endpoint wajib Bearer token.

## Potongan Kode Penting
### 1) Select field profil aman
```js
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
});
```

### 2) Hitung statistik dashboard
```js
const [totalNotes, notesThisMonth, upcomingNotes] = await prisma.$transaction([
  prisma.note.count({ where: { userId } }),
  prisma.note.count({ where: { userId, noteDate: { gte: startMonth, lt: nextMonth } } }),
  prisma.note.findMany({
    where: { userId, noteDate: { gte: startToday } },
    orderBy: [{ noteDate: 'asc' }, { id: 'asc' }],
    take: 5,
  }),
]);
```

## Contoh Request dan Hasil
### Profile detail
Request:
```http
GET /api/profile
Authorization: Bearer <token>
```

Response sukses (200):
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

### Profile dashboard
Request:
```http
GET /api/profile/dashboard
Authorization: Bearer <token>
```

Response sukses (200):
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

## Error Umum
- 401 Unauthorized
- 404 User not found
