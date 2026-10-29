# Bun + ElysiaJS + Drizzle + MySQL API

Proyek backend API menggunakan **Bun**, **ElysiaJS**, **Drizzle ORM**, dan **MySQL**.

## Struktur Proyek

```
src/
├── index.ts          # Entry point server Elysia
├── db/
│   ├── index.ts      # Koneksi database pool mysql2 + Drizzle instance
│   └── schema.ts     # Schema tabel Drizzle (contoh: users)
└── routes/
    └── index.ts      # Route group API (contoh: CRUD /api/users)
drizzle/              # File migration Drizzle
drizzle.config.ts     # Konfigurasi Drizzle Kit
.env.example          # Template konfigurasi environment
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

- `GET /` — Health check / welcome message
- `GET /api/users` — Daftar semua user
- `GET /api/users/:id` — Detail user berdasarkan ID
- `POST /api/users` — Tambah user baru (body: `{ name: string, email: string }`)
- `DELETE /api/users/:id` — Hapus user berdasarkan ID
