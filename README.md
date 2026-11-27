# Editor Tipe Halaman (Tema 2) — PlayMoments

Klik teks di halaman -> modal "Edit Text" (teks, Italic/Bold, rata, font, warna, ukuran, jarak atas, Delete Element, Simpan).
Tidak perlu install paket tambahan.

## 1. Salin file baru (ekstrak zip ke root proyek, struktur sama dengan `app/`)
- app/config/editor-types.js            -> pemetaan tema -> tipe editor ("scroll" | "page")
- app/utils/page-defaults.js            -> isi awal halaman, daftar font, token {{nama_tamu}}
- app/composables/usePageEditor.js      -> halaman & elemen (tambah/hapus/geser/edit)
- app/components/themes/PageStage.vue   -> render 1 halaman (dipakai editor & tamu)
- app/components/themes/TemaPage.vue    -> tampilan tamu per halaman (geser/tombol)
- app/components/editor/PageEditor.vue  -> editor + modal Edit Text

## 2. Ubah 3 file lama (lihat patches/tema-halaman.patch, ~15 baris)
- app/pages/edit-undangan/[slug].vue
- app/pages/preview/[slug].vue
- app/pages/preview-tema/[slug].vue

Data disimpan di store.sectionContents.pages.items -> ikut autosave Supabase.
Teks dirender sebagai teks biasa (tanpa v-html).
