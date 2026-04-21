# Notes App Backend Documentation

## 1. Ringkasan
Backend menyediakan REST API untuk fitur:
- Auth (register, login, login Google)
- Notes (CRUD + filter + pagination + sorting)
- Profile (detail profil + dashboard statistik)

Arsitektur backend:
- Express router -> controller -> service -> Prisma
- Middleware auth JWT untuk endpoint private
- Error handling terpusat

## 2. Teknologi yang Digunakan
- Node.js + Express.js
- Prisma ORM
- MySQL
- JWT (jsonwebtoken)
- bcryptjs
- helmet
- express-rate-limit
- Jest + Supertest (testing)

## 3. Dependensi
### Runtime dependencies
- @prisma/client
- bcryptjs
- dotenv
- express
- express-rate-limit
- helmet
- jsonwebtoken

### Dev dependencies
- jest
- nodemon
- prisma
- supertest

Sumber: package.json

## 4. Instalasi
### Prasyarat
- Node.js
- MySQL aktif

### Install paket
```bash
npm install
```

### Setup environment
Buat file .env berdasarkan .env.example
```env
PORT=8080
DATABASE_URL=""
JWT_SECRET=""
JWT_EXPIRES_IN="7d"
GOOGLE_CLIENT_ID=""
```

### Migrasi database
```bash
npm run migrate:deploy
```

### Seed (opsional)
```bash
npm run seed
```

### Jalankan development
```bash
npm run dev
```

### Jalankan production
```bash
npm run start
```

## 5. Lokasi Implementasi
- Boot server: src/server.js
- App setup + CORS + health: src/app.js
- Router aggregator: src/routes/index.js
- DB client: src/config/db.js

### Modul
- Auth: src/modules/auth
- Notes: src/modules/notes
- Profile: src/modules/profile

### Middleware
- JWT guard: src/middlewares/authMiddleware.js
- Error handler: src/middlewares/errorHandler.js
- Not found handler: src/middlewares/notFoundHandler.js

## 6. Endpoint Cepat
- GET /
- GET /api/health
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/google
- POST /api/notes
- GET /api/notes
- GET /api/notes/:id
- PUT /api/notes/:id
- DELETE /api/notes/:id
- GET /api/profile
- GET /api/profile/dashboard

Detail request/response ada di docs/API.md.

## 7. Pola Response API
### Success
```json
{
  "message": "...",
  "data": { }
}
```

### Validation error
```json
{
  "message": "Validation error",
  "errors": [
    { "field": "title", "message": "Title must be 3-150 characters" }
  ]
}
```

## 8. Potongan Kode Penting
### 1) Binding server Railway-friendly
```js
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 2) JWT auth middleware
```js
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return next(new AppError('Unauthorized', 401));
}
const payload = verifyToken(token);
req.userId = payload.userId;
```

### 3) Transaction list notes
```js
const [total, notes] = await prisma.$transaction([
  prisma.note.count({ where }),
  prisma.note.findMany({ where, orderBy, skip, take }),
]);
```

## 9. Testing
Jalankan seluruh test:
```bash
npm test
```

File test utama:
- tests/app.test.js
- tests/auth.service.test.js
- tests/notes.service.test.js
- tests/profile.service.test.js

## 10. Dokumentasi Modul
- Auth module docs: src/modules/auth/README.md
- Notes module docs: src/modules/notes/README.md
- Profile module docs: src/modules/profile/README.md
- API docs lengkap: docs/API.md
