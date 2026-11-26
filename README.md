# PlayMoment

Platform undangan pernikahan digital: pelanggan memilih tema, mengedit undangan lewat editor, lalu membagikan link undangan. Admin mengelola pelanggan, pesanan, promo, dan aset lewat dashboard.

**Stack:** Nuxt 4 · Vue 3 · Nuxt UI v4 · Tailwind CSS v4 · Pinia (+ persistedstate) · Supabase

## Mulai cepat

```bash
npm install
cp .env.example .env     # lalu isi nilainya
npm run dev              # http://localhost:3000
```

Setup database: jalankan isi `supabase/schema.sql` di Supabase SQL Editor.

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Build production |
| `npm run preview` | Preview hasil build |
| `npm run lint` / `lint:fix` | Cek / perbaiki lint |
| `npm run typecheck` | Type check |

## Environment variable

| Variable | Keterangan |
| --- | --- |
| `NUXT_PUBLIC_SITE_URL` | URL publik website (untuk OG image & link preview) |
| `SUPABASE_URL` | URL project Supabase (opsional, ada default di `server/utils/supabase.ts`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **server-only**, jangan pernah di-expose ke client |

## Struktur folder

```
app/
├─ assets/css/          CSS global (main.css, admin-shared.css)
├─ components/
│  ├─ layout/           Navbar, footer, loading, tombol WhatsApp
│  ├─ admin/            Komponen khusus dashboard admin
│  ├─ dashboard/        Sidebar & bottom-nav dashboard customer
│  ├─ editor/           Komponen khusus editor undangan
│  └─ themes/           Tema undangan (Tema1.vue, Tema2.vue, ...)
├─ composables/         Logic reusable (useAuth, useKirimUndangan, ...)
├─ config/              Konfigurasi & katalog (paket.js, themes.js)
├─ layouts/             Layout halaman (admin.vue)
├─ lib/                 Client library (supabase.js)
├─ middleware/          Route middleware (auth.global.js)
├─ pages/               Routing — struktur folder = URL, jangan dipindah sembarangan
├─ stores/              Pinia stores (account, undangan, asset)
└─ utils/               Helper murni tanpa state (promo, kuota, id undangan, auth-routes)

server/
├─ api/                 Endpoint (auth/, admin/, public/)
├─ middleware/          preview-og.ts (OG tags untuk bot WhatsApp/Telegram)
└─ utils/               Helper server (supabase.ts — auto-import)

public/                 File statis; path-nya dipakai langsung sebagai URL
supabase/schema.sql     Skema database
```

## Konvensi

- **Komponen** dikelompokkan per fungsi di `app/components/<grup>/`. Nama auto-import tetap tanpa prefix folder (`<AppFooter />`), diatur di `nuxt.config.ts`.
- **Tema baru**: buat `app/components/themes/TemaN.vue`, daftarkan di `app/config/themes.js`, lalu di peta tema (`temaMap`) pada halaman editor & preview.
- **Harga & paket** hanya diatur di `app/config/paket.js` (single source of truth).
- **Akses Supabase dari server** lewat `getSupabaseServiceKey()` & `createSupabaseAdmin()` di `server/utils/supabase.ts`, jangan bikin client baru per file.
- **Aset di `public/`**: path-nya bisa tersimpan di database/undangan yang sudah dibuat, jadi jangan di-rename tanpa migrasi data.
- Line ending **LF** (lihat `.editorconfig` & `.gitattributes`).
