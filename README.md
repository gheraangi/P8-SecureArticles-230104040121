🛡️ Secure Articles API
Praktikum 8 — Web Security Essentials

Nama: GHEFIRA NUR FATIMA
NIM: 230104040121

📌 1. Deskripsi Proyek

Secure Articles API adalah proyek backend Node.js + Express yang menerapkan best practices keamanan modern.
API ini menyediakan fitur otentikasi berbasis JWT, manajemen artikel, dan perlindungan keamanan tingkat lanjut seperti:

CORS Whitelist

Helmet Security Headers

Rate Limiting

XSS Sanitization

NoSQL Injection Prevention

Secure Cookies

Audit Logging + Correlation ID

Role-based Access Control (RBAC)

Proyek ini merupakan implementasi praktikum Web Security untuk memastikan API aman dari serangan umum.

📂 2. Struktur Folder
src/
 ├── app.js
 ├── server.js
 ├── config/
 │    └── db.js
 ├── routes/
 │    ├── auth.routes.js
 │    └── articles.routes.js
 ├── middlewares/
 │    ├── auth.js
 │    ├── sanitize.js
 │    ├── correlation.js
 │    └── auditLog.js
 ├── utils/
 │    └── logger.js
 ├── models/
 │    ├── user.model.js
 │    └── article.model.js
 ├── validators/
 │    ├── validate.js
 │    └── article.schema.js

🔐 3. Fitur Keamanan
✔ 1. CORS Whitelist

Hanya origin tertentu yang boleh mengakses API.

CORS_WHITELIST=http://localhost:3000

✔ 2. HTTP Security Headers (Helmet)

Helmet melindungi dari:

XSS sniffing

Clickjacking

MIME type sniffing

Cross-Origin leaks

✔ 3. Rate Limiting

Melindungi dari spam & brute force.

max: 200 req / menit


Login route memiliki limiter tambahan.

✔ 4. JWT Authentication + Refresh Token

Dua token:

Access Token — pendek

Refresh Token — panjang (via HttpOnly cookie)

✔ 5. Secure Cookies

Cookie refresh-token memakai:

HttpOnly

Secure

SameSite=Strict

Mencegah CSRF & XSS cookie theft.

✔ 6. XSS Sanitization

Dipakai middleware:

sanitize-html

xss-clean

Semua input dari:

req.body

req.query

req.params

dibersihkan dari tag <script> dan atribut berbahaya.

✔ 7. NoSQL Injection Protection

Express Mongo Sanitize:

import mongoSanitize from "express-mongo-sanitize";


Membersihkan payload:

$ne

$gt

$regex

$or

$where

✔ 8. Role-based Authorization

Hak akses:

Role	Keterangan
user	CRUD artikel milik sendiri
admin	Bisa DELETE artikel siapa pun
✔ 9. Audit Logging + Correlation ID

Setiap request memiliki:

UUID (trace ID)

Logging via pino-pretty

Audit mencatat:

login_success

login_failed

invalid_token

forbidden_delete_attempt
… dll

📌 4. Menjalankan Proyek
1. Install dependency
npm install

2. Jalankan server
node src/server.js


Server akan tampil:

AUTH ROUTES LOADED
Logout route registered
Server running on port 3000

🧪 5. Testing Checklist
🔹 CORS
curl -H "Origin: http://evil.com" http://localhost:3000/health
→ Not allowed by CORS

🔹 XSS Test
POST /api/articles
{ "title": "<script>alert(1)</script>" }
→ title disanitasi (“scriptalert(1)/script”)

🔹 NoSQL Injection
POST /api/auth/login
{ "email": { "$ne": null }, "password": "aaa" }
→ 401

🔹 JWT Token

Token palsu:

Bearer abc.def.ghi
→ 401 invalid token

🔹 Role Test

User bukan admin melakukan DELETE:

→ 403 Admin Only

🌐 6. Endpoint API
AUTH
Method	Endpoint	Keterangan
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
POST	/api/auth/refresh	Refresh token
POST	/api/auth/logout	Clear cookies
ARTICLES
Method	Endpoint	Keterangan
GET	/api/articles	Public list
POST	/api/articles	Create (login required)
PUT	/api/articles/:id	Update (owner/admin)
DELETE	/api/articles/:id	Admin only
🏁 7. Kesimpulan

Proyek ini telah memenuhi seluruh aspek keamanan dalam Web Security Essentials:

Input sanitization ✔

Cookie hardening ✔

Authentication + Refresh tokens ✔

Secure headers ✔

Brute-force protection ✔

NoSQL Injection defense ✔

Detailed logging with correlationId ✔

Role-based authorization ✔

API kini aman, profesional, dan siap diwariskan ke production environment.

📎 8. Lisensi

Proyek ini dibuat untuk keperluan pembelajaran Praktikum WSE 2025.