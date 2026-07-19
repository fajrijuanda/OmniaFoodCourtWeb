# Omnia Portal

Next.js app khusus portal Omnia. Landing page berada di project terpisah `D:\Omnia\Landing`.

## Setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

Default env:

```txt
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_LANDING_URL=http://localhost:3000
```

## Routes

- `/login`: login JWT ke Nest API.
- `/register`: registrasi trial 3 hari dengan pilihan 1 dari seluruh sub-industri dan Tier Starter otomatis.
- `/oauth/callback`: menerima token dari OAuth Google/GitHub API lalu menyimpan session portal.
- `/admin/settings`: CRUD industri, sub-industri, tier, fitur, mapping fitur tier, dan akun. Hanya untuk `super_admin`.
- `/portal`: portal tenant/demo.
- `/portal/[...slug]`: route nested portal tenant/demo.
