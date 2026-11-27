/**
 * POST /api/credits/<action>
 *
 * Semua perubahan saldo credit lewat sini (server-side, atomik di database),
 * jadi tidak bisa dimanipulasi dari browser.
 *
 *   create-invitation  (customer / admin)
 *     body: { row: {...kolom tabel invitations}, customerId? (khusus admin) }
 *     → potong credit sesuai paket (Basic 20 · Premium 15 · Prioritas 10), lalu insert undangan.
 *       Kalau insert gagal, credit otomatis dikembalikan.
 *
 *   grant  (admin saja)
 *     body: { customerId, amount, type?: 'grant' | 'adjust', ref?, note? }
 *     → tambah / koreksi credit. `ref` yang sama untuk type yang sama hanya diproses sekali.
 *
 * Wajib header `Authorization: Bearer <token>` dari /api/auth/login.
 * Butuh migrasi: supabase/credits-migration.sql
 */
import { getCreditCost } from "~/config/paket";

const isObj = (v: unknown) =>
  v !== null && typeof v === "object" && !Array.isArray(v);

function fail(event: any, status: number, message: string, extra: object = {}) {
  setResponseStatus(event, status);
  return { ok: false, message, ...extra };
}

const errText = (e: any) => `${e?.message || ""} ${e?.details || ""}`;

export default defineEventHandler(async (event) => {
  const action = getRouterParam(event, "action");
  const session = getSession(event);
  if (!session) return fail(event, 401, "Login diperlukan.");

  const serviceKey = getSupabaseServiceKey(event);
  if (!serviceKey) return fail(event, 500, "Service key tidak dikonfigurasi.");
  const supabase = createSupabaseAdmin(serviceKey);

  const body = (await readBody(event)) || {};

  // ── Buat undangan (potong credit) ─────────────────────────
  if (action === "create-invitation") {
    const row = body.row;
    if (!isObj(row) || !row.id || !row.slug) {
      return fail(event, 400, "Data undangan tidak valid.");
    }

    const customerId =
      session.role === "admin" ? body.customerId : session.id;
    if (!customerId) return fail(event, 400, "Customer tidak ditemukan.");

    const { data: customer, error: custErr } = await supabase
      .from("customers")
      .select("id, nama, email, paket, status, credits")
      .eq("id", customerId)
      .maybeSingle();
    if (custErr) return fail(event, 500, custErr.message);
    if (!customer) return fail(event, 404, "Customer tidak ditemukan.");
    if (customer.status !== "aktif") {
      return fail(event, 403, "Akun belum aktif. Hubungi admin.");
    }

    const cost = getCreditCost(customer.paket);
    const ref = String(row.id);

    const { data: balance, error: spendErr } = await supabase.rpc(
      "spend_credits",
      {
        p_customer_id: customer.id,
        p_amount: cost,
        p_ref: ref,
        p_note: `Buat undangan ${row.slug}`,
      },
    );
    if (spendErr) {
      const t = errText(spendErr);
      if (t.includes("insufficient_credits")) {
        return fail(
          event,
          402,
          `Credit tidak cukup. Butuh ${cost} credit, saldo kamu ${customer.credits ?? 0}.`,
          { cost, credits: customer.credits ?? 0 },
        );
      }
      if (spendErr.code === "23505") {
        return fail(event, 409, "Undangan ini sudah pernah dibuat.");
      }
      return fail(event, 500, spendErr.message);
    }

    // Identitas & biaya selalu ditentukan server, bukan dari client
    const { data: invitation, error: insErr } = await supabase
      .from("invitations")
      .insert({
        ...row,
        customer_id: customer.id,
        customer_name: customer.nama,
        email: customer.email,
        paket: customer.paket,
        credit_cost: cost,
      })
      .select()
      .single();

    if (insErr) {
      // Gagal simpan → kembalikan credit
      await supabase.rpc("refund_credits", {
        p_customer_id: customer.id,
        p_ref: ref,
      });
      if (insErr.code === "23505") {
        return fail(event, 409, "Link undangan sudah dipakai, coba link lain.");
      }
      return fail(event, 500, insErr.message);
    }

    return { ok: true, data: invitation, credits: balance, cost };
  }

  // ── Tambah / koreksi credit (admin) ───────────────────────
  if (action === "grant") {
    if (session.role !== "admin") return fail(event, 403, "Akses ditolak.");

    const customerId = body.customerId;
    const amount = Math.trunc(Number(body.amount));
    const type = body.type === "adjust" ? "adjust" : "grant";
    const ref = body.ref ? String(body.ref) : null;

    if (!customerId || !Number.isFinite(amount) || amount === 0) {
      return fail(event, 400, "Jumlah credit tidak valid.");
    }
    if (type === "grant" && amount < 0) {
      return fail(event, 400, "Gunakan koreksi untuk mengurangi credit.");
    }

    const { data: balance, error } = await supabase.rpc("grant_credits", {
      p_customer_id: customerId,
      p_amount: amount,
      p_type: type,
      p_ref: ref,
      p_note: body.note ? String(body.note).slice(0, 200) : null,
    });

    if (error) {
      if (error.code === "23505") {
        // ref sudah pernah diproses → anggap sukses (idempotent)
        const { data: cur } = await supabase
          .from("customers")
          .select("credits")
          .eq("id", customerId)
          .maybeSingle();
        return { ok: true, duplicate: true, credits: cur?.credits ?? 0 };
      }
      if (errText(error).includes("insufficient_credits")) {
        return fail(event, 400, "Saldo tidak boleh jadi minus.");
      }
      return fail(event, 500, error.message);
    }

    return { ok: true, credits: balance };
  }

  return fail(event, 404, `Aksi tidak dikenal: ${action}`);
});
