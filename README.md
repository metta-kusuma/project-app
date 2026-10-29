# Bun + ElysiaJS + Drizzle + MySQL API

Proyek backend API menggunakan **Bun**, **ElysiaJS**, **Drizzle ORM**, dan **MySQL**.

## Struktur Proyek

```
src/
├── index.ts                 # Entry point server Elysia
├── db/
│   ├── index.ts             # Koneksi database pool mysql2 + Drizzle instance
│   └── schema.ts            # Schema tabel Drizzle (users, sessions)
├── routes/
│   ├── users-route.ts       # Routing ElysiaJS untuk user
│   └── auth-route.ts        # Routing ElysiaJS untuk autentikasi/login
└── services/
    ├── users-service.ts     # Business logic untuk registrasi & logout user
    └── auth-service.ts      # Business logic untuk autentikasi & session user
drizzle/                     # File migration Drizzle
drizzle.config.ts            # Konfigurasi Drizzle Kit
.env.example                 # Template konfigurasi environment
package.json
tsconfig.json
```

## Setup & Instalasi

1. Salin `.env.example` ke `.env` dan sesuaikan koneksi database MySQL:
   ```bash
   cp .env.example .env
   ```

2. Generate migration Drizzle:
   ```bash
   bun run db:generate
   ```

3. Jalankan migration ke database:
   ```bash
   bun run db:migrate
   ```
   *(atau `bun run db:push` untuk langsung push schema ke DB development)*

## Menjalankan Server

- Mode development (hot-reload):
  ```bash
  bun run dev
  ```
- Mode production:
  ```bash
  bun run start
  ```
- Type check:
  ```bash
  bun run typecheck
  ```

## Endpoint API

### Users
- `GET /` — Health check / welcome message
- `GET /api/users` — Daftar semua user
- `GET /api/users/:id` — Detail user berdasarkan ID
- `POST /api/users` — Registrasi user baru
  - **Request Body**:
    ```json
    {
      "name": "Eko",
      "email": "eko@localhost",
      "password": "rahasia"
    }
    ```
  - **Response Success (200)**:
    ```json
    {
      "data": "OK"
    }
    ```
  - **Response Error (400)**:
    ```json
    {
      "error": "Email sudah terdaftar"
    }
    ```
- `DELETE /api/users/logout` — Logout user (menghapus session)
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```
  - **Response Success (200)**:
    ```json
    {
      "data": "OK"
    }
    ```
  - **Response Error (401)**:
    ```json
    {
      "error": "Unauthorized"
    }
    ```
- `DELETE /api/users/:id` — Hapus user berdasarkan ID

### Auth
- `POST /api/login` — Login user
  - **Request Body**:
    ```json
    {
      "email": "eko@localhost",
      "password": "rahasia"
    }
    ```
  - **Response Success (200)**:
    ```json
    {
      "data": "550e8400-e29b-41d4-a716-446655440000"
    }
    ```
  - **Response Error (400)**:
    ```json
    {
      "error": "Email atau Password salah"
    }
    ```
- `GET /api/login/current` — Dapatkan data user yang sedang login
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```
  - **Response Success (200)**:
    ```json
    {
      "data": {
        "id": 1,
        "name": "Eko",
        "email": "eko@localhost",
        "created_at": "2026-10-29T03:00:00.000Z"
      }
    }
    ```
  - **Response Error (401)**:
    ```json
    {
      "error": "Unauthorized"
    }
    ```
