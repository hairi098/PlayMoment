-- ============================================================
--  MIGRASI: SISTEM CREDIT PLAYMOMENT
--  Jalankan SEKALI di Supabase SQL Editor (aman diulang, pakai IF NOT EXISTS).
--  Biaya per undangan: Basic 20 · Premium 15 · Prioritas 10
--  (angka biaya diatur di app/config/paket.js → creditPerUndangan)
-- ============================================================

-- 1. Saldo credit di customer
alter table customers
  add column if not exists credits int not null default 0 check (credits >= 0);

-- 2. Catat biaya credit yang dipakai tiap undangan
alter table invitations
  add column if not exists credit_cost int not null default 0;

-- 3. Riwayat credit (ledger) — semua tambah/kurang saldo tercatat di sini
create table if not exists credit_transactions (
  id            bigserial primary key,
  customer_id   bigint not null references customers(id) on delete cascade,
  delta         int not null,                 -- + tambah, - kurang
  balance_after int not null,
  type          text not null check (type in ('grant','spend','refund','adjust')),
  ref           text,                         -- id undangan / 'order:<id>' / dll
  note          text,
  created_at    timestamptz not null default now()
);

-- Satu ref hanya boleh sekali per type → mencegah potong/tambah ganda
create unique index if not exists credit_tx_type_ref_uniq
  on credit_transactions (type, ref) where ref is not null;
create index if not exists credit_tx_customer_idx
  on credit_transactions (customer_id, created_at desc);

-- Tabel ini hanya diakses server (service_role bypass RLS), anon/authenticated ditutup
alter table credit_transactions enable row level security;


-- 4. Fungsi atomik (dipanggil dari server pakai service role)

-- Potong credit. Gagal kalau saldo kurang.
create or replace function spend_credits(
  p_customer_id bigint, p_amount int, p_ref text, p_note text default null
) returns int language plpgsql as $$
declare v_balance int;
begin
  if p_amount is null or p_amount <= 0 then raise exception 'invalid_amount'; end if;

  update customers
     set credits = credits - p_amount
   where id = p_customer_id and credits >= p_amount
   returning credits into v_balance;

  if not found then raise exception 'insufficient_credits'; end if;

  insert into credit_transactions (customer_id, delta, balance_after, type, ref, note)
  values (p_customer_id, -p_amount, v_balance, 'spend', p_ref, p_note);

  return v_balance;
end $$;

-- Kembalikan credit dari 1 pemotongan (hanya bisa sekali per ref)
create or replace function refund_credits(p_customer_id bigint, p_ref text)
returns int language plpgsql as $$
declare v_amount int; v_balance int;
begin
  select -delta into v_amount
    from credit_transactions
   where customer_id = p_customer_id and type = 'spend' and ref = p_ref;

  if v_amount is null then raise exception 'spend_not_found'; end if;

  update customers set credits = credits + v_amount
   where id = p_customer_id returning credits into v_balance;

  insert into credit_transactions (customer_id, delta, balance_after, type, ref, note)
  values (p_customer_id, v_amount, v_balance, 'refund', p_ref, 'Pengembalian credit');

  return v_balance;
end $$;

-- Tambah / koreksi credit (type: 'grant' untuk pembelian paket, 'adjust' untuk manual admin)
create or replace function grant_credits(
  p_customer_id bigint, p_amount int, p_type text, p_ref text, p_note text default null
) returns int language plpgsql as $$
declare v_balance int;
begin
  if p_type not in ('grant','adjust') then raise exception 'invalid_type'; end if;
  if p_amount is null or p_amount = 0 then raise exception 'invalid_amount'; end if;

  update customers set credits = credits + p_amount
   where id = p_customer_id and credits + p_amount >= 0
   returning credits into v_balance;

  if not found then raise exception 'insufficient_credits'; end if;

  insert into credit_transactions (customer_id, delta, balance_after, type, ref, note)
  values (p_customer_id, p_amount, v_balance, p_type, p_ref, p_note);

  return v_balance;
end $$;

-- PENTING: tutup akses fungsi dari anon key (kalau tidak, siapa pun bisa isi credit sendiri)
revoke all on function spend_credits(bigint, int, text, text)          from public, anon, authenticated;
revoke all on function refund_credits(bigint, text)                    from public, anon, authenticated;
revoke all on function grant_credits(bigint, int, text, text, text)    from public, anon, authenticated;
grant execute on function spend_credits(bigint, int, text, text)       to service_role;
grant execute on function refund_credits(bigint, text)                 to service_role;
grant execute on function grant_credits(bigint, int, text, text, text) to service_role;


-- 5. (OPSIONAL) Isi credit awal untuk customer lama sesuai paketnya.
--    Hapus tanda komentar kalau mau dipakai. Sesuaikan angka dengan paket.js.
-- update customers set credits = case paket
--     when 'Basic' then 50 when 'Premium' then 100 when 'Prioritas' then 200 else 0 end
--  where credits = 0;
