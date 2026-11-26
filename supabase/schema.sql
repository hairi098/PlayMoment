-- ============================================================
--  SUPABASE SCHEMA — Wedding Invitation App (PlayMoment)
--  Paste seluruh file ini ke Supabase SQL Editor lalu klik Run
-- ============================================================

create extension if not exists "pgcrypto";


-- ============================================================
--  1. ADMINS
-- ============================================================
create table if not exists admins (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  password   text not null,
  name       text not null,
  paket      text not null default 'Super Admin',
  created_at timestamptz not null default now()
);

insert into admins (email, password, name, paket) values
  ('admin@playmoment.com', 'admin123', 'Admin Utama', 'Super Admin')
on conflict (email) do nothing;


-- ============================================================
--  2. CUSTOMERS
-- ============================================================
create table if not exists customers (
  id             bigserial primary key,
  nama           text not null,
  email          text unique not null,
  password       text not null default '12345678',
  hp             text,
  paket          text not null default 'Basic',
  max_undangan   int not null default 1,
  status         text not null default 'aktif'
                 check (status in ('aktif','nonaktif')),
  color          text default '#7ecec4',
  expiry_date    timestamptz,
  tgl_daftar     date not null default current_date,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

insert into customers (id, nama, email, password, hp, paket, max_undangan, status, color, expiry_date, tgl_daftar) values
  (1, 'Budi Santoso',  'budi@email.com',   '12345678', '0812-3456-7890', 'Premium',  5, 'aktif',    '#7ecec4', now() + interval '30 days', '2026-01-10'),
  (2, 'Rina Wati',     'rina@email.com',   '12345678', '0813-2345-6789', 'Standard', 3, 'aktif',    '#f6ad55', now() + interval '14 days', '2026-01-15'),
  (3, 'Ani Lestari',   'ani@email.com',    '12345678', '0811-3456-7891', 'Basic',    1, 'aktif',    '#b794f4', now() + interval '7 days',  '2026-01-20'),
  (4, 'Hendra K.',     'hendra@email.com', '12345678', '0856-4567-8901', 'Premium',  5, 'nonaktif', '#68d391', now() + interval '30 days', '2026-01-25')
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('customers','id'), max(id)) from customers;


-- ============================================================
--  3. PROMOS
-- ============================================================
create table if not exists promos (
  id          bigserial primary key,
  code        text unique not null,
  label       text not null,
  type        text not null check (type in ('fixed','percent')),
  value       numeric(12,2) not null default 0,
  min_belanja numeric(12,2) not null default 0,
  max_diskon  numeric(12,2),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into promos (id, code, label, type, value, min_belanja, max_diskon, active) values
  (1, 'SURVEI',  'Diskon survei pelanggan',       'fixed',   29981, 0,     null,  true),
  (2, 'HEMAT10', 'Diskon 10% (maks. Rp 50.000)', 'percent', 10,    50000, 50000, true)
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('promos','id'), max(id)) from promos;


-- ============================================================
--  4. ORDERS
-- ============================================================
create table if not exists orders (
  id                      text primary key,
  invoice_code            text unique,
  customer_id             bigint references customers(id) on delete set null,
  nama                    text not null,
  email                   text not null,
  hp                      text,
  paket                   text not null,
  harga                   numeric(12,2) not null default 0,
  diskon                  numeric(12,2) not null default 0,
  kode_unik               int not null default 0,
  total                   text not null,
  tanggal                 text not null,
  status                  text not null default 'menunggu_konfirmasi'
                          check (status in ('menunggu_konfirmasi','pending','dikonfirmasi','batal')),
  max_undangan            int not null default 1,
  catatan                 text,
  catatan_admin           text,
  pembayaran_dikonfirmasi boolean not null default false,
  confirmed_at            timestamptz,
  login_password          text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

insert into orders (id, invoice_code, customer_id, nama, email, hp, paket, harga, total, tanggal, status, max_undangan, catatan, pembayaran_dikonfirmasi, confirmed_at) values
  ('1023','DEMO01', null,'Dewi Sari',    'dewi@email.com',   '0819-1111-2222','Premium',  129000,'129.000','27 Mei 2026','menunggu_konfirmasi',5, 'Transfer BCA',true, null),
  ('1022', null,    null,'Agus Pratama', 'agus@email.com',   '0812-9999-8888','Basic',    59000, '59.000', '26 Mei 2026','menunggu_konfirmasi',1, '',            false,null),
  ('1021', null,    3,   'Ani Lestari',  'ani@email.com',    '0811-3456-7891','Basic',    59000, '59.000', '25 Mei 2026','dikonfirmasi',       1, '',            false,'2026-05-25T10:00:00Z'),
  ('1020', null,    4,   'Hendra K.',    'hendra@email.com', '0856-4567-8901','Premium',  129000,'129.000','24 Mei 2026','dikonfirmasi',       5, '',            false,'2026-05-24T14:30:00Z'),
  ('1019', null,    null,'Siti Aminah',  'siti@email.com',   '0813-5555-6666','Prioritas',199000,'199.000','23 Mei 2026','batal',             99, 'Bukti transfer tidak valid',false,null)
on conflict (id) do nothing;


-- ============================================================
--  5. INVITATIONS
-- ============================================================
create table if not exists invitations (
  id            text primary key,
  editor_id     text unique not null,
  customer_id   bigint references customers(id) on delete cascade,
  customer_name text not null,
  email         text not null,
  judul         text not null,
  slug          text unique not null,
  paket         text not null,
  tanggal_acara text,
  tema          text default 'Elegant Rose',
  tema_slug     text default 'tema-1',
  status        text not null default 'draft'
                check (status in ('draft','aktif','nonaktif')),
  views         int not null default 0,
  link          text,
  foto          text,
  theme_color   text,
  thumb_bg      text default '#2a9d8f',
  thumb_color   text default '#fff',
  monogram      text,
  undangan_aktif     boolean not null default true,
  musik_aktif        boolean not null default true,
  rsvp_aktif         boolean not null default true,
  sound_effect_aktif boolean not null default false,
  sound_typing_aktif boolean not null default false,
  editor_data   jsonb not null default '{}',
  template_pesan_kirim text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

insert into invitations (
  id, editor_id, customer_id, customer_name, email,
  judul, slug, paket, tanggal_acara, tema, tema_slug,
  status, views, link, foto, theme_color, thumb_bg, thumb_color, monogram,
  editor_data
) values
(
  'INV-1001','1738012345101', 1,'Budi Santoso','budi@email.com',
  'The Wedding Of Budi & Rina','budi-rina-2026','Premium','Sabtu, 12 Jun 2026',
  'Elegant Rose','tema-1','aktif', 482,
  'undangan.id/budi-rina-2026', null,
  'linear-gradient(135deg, #c0737a 0%, #e8a0a6 100%)',
  '#c0392b','#fff','BR',
  '{"undangan":{"judul":"The Wedding Of Budi & Rina","nama1":"Budi Santoso","nama2":"Rina Indah","domain":"budi-rina-2026","kategori":"wedding","musik":"","musikUrl":"","tanggalAkad":"Sabtu, 12 Juni 2026","waktuAkad":"08.00 - 10.00 WIB","lokasiAkad":"Masjid Al-Ikhlas","alamatAkad":"Jl. Masjid No.1, Jakarta","linkMapsAkad":"","tanggalResepsi":"Sabtu, 12 Juni 2026","waktuResepsi":"11.00 - 14.00 WIB","lokasiResepsi":"Gedung Serbaguna","alamatResepsi":"Jl. Gedung No.2, Jakarta","linkMapsResepsi":"","galeri":[],"galeriLayout":"2col","mediaGallery":[],"images":{}},"sectionContents":{},"sectionStates":{},"customColors":{"tombol":"#c0737a","popup":"#1a2e45","efek":"#f472b6","text":"#1a2e45"},"textColors":{},"rsvpFields":[]}'
),
(
  'INV-1002','1738012345102', 2,'Rina Wati','rina@email.com',
  'The Wedding Of Mardam & Imah','mardam-imah-2026','Standard','Selasa, 26 Mei 2026',
  'Tropical Breeze','tema-1','draft', 210,
  'undangan.id/mardam-imah-2026', null,
  'linear-gradient(135deg, #2a9d8f 0%, #52b8ac 100%)',
  '#2a9d8f','#fff','MI',
  '{"undangan":{"judul":"The Wedding Of Mardam & Imah","nama1":"Mardam","nama2":"Imah","domain":"mardam-imah-2026","kategori":"wedding","galeri":[],"galeriLayout":"2col","mediaGallery":[],"images":{}},"sectionContents":{},"sectionStates":{},"customColors":{"tombol":"#2a9d8f","popup":"#1a2e45","efek":"#52b8ac","text":"#1a2e45"},"textColors":{},"rsvpFields":[]}'
)
on conflict (id) do nothing;


-- ============================================================
--  6. GUESTS
-- ============================================================
create table if not exists guests (
  id            bigserial primary key,
  invitation_id text not null references invitations(id) on delete cascade,
  nama          text not null,
  whatsapp      text,
  hadir         boolean,
  jumlah        int,
  extra_fields  jsonb default '{}',
  created_at    timestamptz not null default now()
);


-- ============================================================
--  7. UCAPAN
-- ============================================================
create table if not exists ucapan (
  id            bigserial primary key,
  invitation_id text not null references invitations(id) on delete cascade,
  nama          text not null,
  pesan         text,
  hadir         boolean,
  jumlah        int,
  extra_fields  jsonb default '{}',
  created_at    timestamptz not null default now()
);


-- ============================================================
--  8. FOTO ASSETS
-- ============================================================
create table if not exists foto_assets (
  id          text primary key,
  nama        text not null default 'Asset Foto',
  kategori    text not null default 'lainnya'
              check (kategori in ('background','couple','galeri','dekorasi','lainnya')),
  url         text not null,
  ukuran      text default '-',
  tipe        text default 'image/jpeg',
  deskripsi   text default '',
  uploaded_at timestamptz not null default now()
);


-- ============================================================
--  9. MUSIK ASSETS
-- ============================================================
create table if not exists musik_assets (
  id          text primary key,
  nama        text not null default 'Lagu Baru',
  artis       text default '-',
  url         text not null,
  ukuran      text default '-',
  durasi      text default '-',
  tipe        text default 'audio/mp3',
  deskripsi   text default '',
  uploaded_at timestamptz not null default now()
);


-- ============================================================
--  INDEXES
-- ============================================================
create index if not exists idx_invitations_customer  on invitations(customer_id);
create index if not exists idx_invitations_slug      on invitations(slug);
create index if not exists idx_invitations_editor_id on invitations(editor_id);
create index if not exists idx_invitations_status    on invitations(status);
create index if not exists idx_orders_email          on orders(email);
create index if not exists idx_orders_customer       on orders(customer_id);
create index if not exists idx_orders_status         on orders(status);
create index if not exists idx_guests_invitation     on guests(invitation_id);
create index if not exists idx_ucapan_invitation     on ucapan(invitation_id);
create index if not exists idx_foto_assets_kategori  on foto_assets(kategori);
create index if not exists idx_inv_editordata_gin    on invitations using gin(editor_data);


-- ============================================================
--  UPDATED_AT TRIGGER
-- ============================================================
create or replace function trigger_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_customers_updated_at
  before update on customers
  for each row execute procedure trigger_set_updated_at();

create or replace trigger trg_orders_updated_at
  before update on orders
  for each row execute procedure trigger_set_updated_at();

create or replace trigger trg_invitations_updated_at
  before update on invitations
  for each row execute procedure trigger_set_updated_at();


-- ============================================================
--  VIEWS
-- ============================================================
create or replace view v_invitation_summary as
select
  i.id, i.editor_id, i.judul, i.slug, i.status, i.tema, i.tema_slug,
  i.tanggal_acara, i.views, i.thumb_bg, i.thumb_color, i.monogram,
  i.undangan_aktif, i.musik_aktif, i.rsvp_aktif,
  count(distinct g.id) as jumlah_tamu,
  count(distinct u.id) as jumlah_ucapan,
  c.nama               as customer_nama,
  c.email              as customer_email,
  c.paket,
  c.status             as customer_status
from invitations i
left join customers c on c.id = i.customer_id
left join guests    g on g.invitation_id = i.id
left join ucapan    u on u.invitation_id = i.id
group by i.id, c.id;

create or replace view v_customer_quota as
select
  c.id, c.nama, c.email, c.paket, c.max_undangan, c.status, c.expiry_date,
  count(i.id)                               as used_undangan,
  greatest(0, c.max_undangan - count(i.id)) as remaining_undangan,
  (c.status = 'aktif'
    and greatest(0, c.max_undangan - count(i.id)) > 0
  )                                         as can_create
from customers c
left join invitations i on i.customer_id = c.id
group by c.id;

create or replace view v_pending_orders as
select
  o.*,
  c.nama as customer_nama_existing
from orders o
left join customers c on lower(c.email) = lower(o.email)
where o.status in ('menunggu_konfirmasi','pending')
order by o.created_at desc;


-- ============================================================
--  CEK EXPIRY CUSTOMER (tambahan)
--  Ganti angka 1 dengan id customer yang bermasalah
-- ============================================================
select
  id,
  nama,
  email,
  status,
  expiry_date,
  now() as sekarang,
  coalesce(expiry_date < now(), false) as sudah_expired
from customers
where id = 1;


-- ============================================================
--  MIGRATION — Sync kolom dedicated dari editor_data
--  Jalankan SEKALI di Supabase SQL Editor setelah deploy terbaru
-- ============================================================

-- 1. Pastikan kolom sound_effect_aktif & sound_typing_aktif ada
--    (sudah ada di schema awal, tapi jaga-jaga jika DB lama)
alter table invitations
  add column if not exists sound_effect_aktif boolean not null default false,
  add column if not exists sound_typing_aktif boolean not null default false;

-- 2. Sync semua kolom dedicated dari editor_data yang sudah tersimpan di JSONB
--    Ini memperbaiki data lama yang kolom-nya masih default karena saveEditorSnapshot
--    sebelumnya tidak menulis ke kolom tersebut.
update invitations
set
  undangan_aktif     = coalesce((editor_data->>'undanganAktif')::boolean,     undangan_aktif,     true),
  musik_aktif        = coalesce((editor_data->>'musikAktif')::boolean,        musik_aktif,        true),
  rsvp_aktif         = coalesce((editor_data->>'rsvpAktif')::boolean,         rsvp_aktif,         true),
  sound_effect_aktif = coalesce((editor_data->>'soundEffectAktif')::boolean,  sound_effect_aktif, false),
  sound_typing_aktif = coalesce((editor_data->>'soundTypingAktif')::boolean,  sound_typing_aktif, false),
  tema_slug          = coalesce(editor_data->>'temaSlug',                     tema_slug,          'tema-1'),
  tanggal_acara      = coalesce(
                         editor_data->'undangan'->>'tanggalAkad',
                         tanggal_acara
                       ),
  judul              = coalesce(
                         nullif(editor_data->'undangan'->>'judul', ''),
                         judul
                       )
where editor_data != '{}';

-- 3. Update view v_invitation_summary agar juga include sound kolom baru
create or replace view v_invitation_summary as
select
  i.id, i.editor_id, i.judul, i.slug, i.status, i.tema, i.tema_slug,
  i.tanggal_acara, i.views, i.thumb_bg, i.thumb_color, i.monogram,
  i.undangan_aktif, i.musik_aktif, i.rsvp_aktif,
  i.sound_effect_aktif, i.sound_typing_aktif,
  count(distinct g.id) as jumlah_tamu,
  count(distinct u.id) as jumlah_ucapan,
  c.nama               as customer_nama,
  c.email              as customer_email,
  c.paket,
  c.status             as customer_status
from invitations i
left join customers c on c.id = i.customer_id
left join guests    g on g.invitation_id = i.id
left join ucapan    u on u.invitation_id = i.id
group by i.id, c.id;

-- 4. Tambah index untuk kolom yang sering di-query
create index if not exists idx_inv_undangan_aktif on invitations(undangan_aktif);
create index if not exists idx_inv_musik_aktif    on invitations(musik_aktif);

-- ============================================================
--  VERIFIKASI — cek hasil migration
-- ============================================================
select
  id,
  slug,
  judul,
  tema_slug,
  undangan_aktif,
  musik_aktif,
  rsvp_aktif,
  sound_effect_aktif,
  sound_typing_aktif,
  tanggal_acara
from invitations
order by created_at desc;


-- ============================================================
-- RLS POLICIES — Admin Asset Management
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- foto_assets: admin bisa insert/update/delete via service key (bypass RLS otomatis)
-- Tidak perlu policy tambahan karena service_role sudah bypass RLS

-- Namun jika ada policy yang terlalu ketat, pastikan ini ada:
-- (foto_assets & musik_assets sudah punya SELECT policy untuk anon di atas)

-- Insert/Update/Delete untuk foto_assets dan musik_assets
-- hanya bisa dari server (service_role) — tidak dari anon
-- Ini sudah otomatis karena service_role bypass RLS

-- Verifikasi policy yang aktif:
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
order by tablename, cmd;


-- ============================================================
-- MIGRATION: Sync kolom status dengan undangan_aktif
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- Update undangan yang undangan_aktif=false → status='nonaktif'
-- Update undangan yang undangan_aktif=true  → status='aktif' (kalau masih 'draft' biarkan)
update invitations
set status = case
  when undangan_aktif = false then 'nonaktif'
  when undangan_aktif = true and status = 'nonaktif' then 'aktif'
  else status  -- biarkan 'draft' / 'aktif' tidak berubah
end
where true;
