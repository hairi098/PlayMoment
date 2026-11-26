/**
 * POST /api/auth/login
 *
 * Server-side authentication endpoint.
 * Pakai SERVICE ROLE KEY (tidak exposed ke client) untuk query customers table.
 *
 * Request body: { email: string, password: string }
 * Response: { success, user, message? }
 */

import { ADMIN_USERS } from "~/utils/auth-credentials";

function normalizeEmail(email: string) {
  return (email || "").trim().toLowerCase();
}

function sessionSecretMissing() {
  console.error("[auth/login] SESSION_SECRET belum diset di env");
  return {
    success: false,
    message: "Konfigurasi server belum lengkap. Hubungi admin.",
  };
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const email = normalizeEmail(body?.email || "");
  const password = String(body?.password || "").trim();

  if (!email || !password) {
    return { success: false, message: "Email dan password wajib diisi." };
  }

  // Cek admin dulu (tetap hardcoded)
  const admin = (ADMIN_USERS as any[]).find(
    (u: any) =>
      normalizeEmail(u.email) === email && u.password === password,
  );
  if (admin) {
    const { password: _pw, ...user } = admin;
    const token = signSession({ role: "admin", email: normalizeEmail(admin.email) }, event);
    if (!token) return sessionSecretMissing();
    return {
      success: true,
      token,
      user: { ...user, loginAt: new Date().toISOString() },
    };
  }

  // Cek customer dari Supabase pakai service key
  const SERVICE_KEY = getSupabaseServiceKey();
  if (!SERVICE_KEY) {
    // Fallback: kalau service key belum diset, log warning
    console.warn("[auth/login] SUPABASE_SERVICE_ROLE_KEY belum diset di env");
    return {
      success: false,
      message: "Konfigurasi server belum lengkap. Hubungi admin.",
    };
  }

  const supabase = createSupabaseAdmin(SERVICE_KEY);
  const { data: rows, error } = await supabase
    .from("customers")
    .select("*")
    .ilike("email", email)
    .limit(1);

  if (error || !rows || rows.length === 0) {
    return { success: false, message: "Email atau password salah." };
  }

  const customer = rows[0];

  if (customer.status !== "aktif") {
    return {
      success: false,
      message: "Akun belum aktif. Tunggu admin mengonfirmasi pesanan.",
    };
  }

  if (!verifyPassword(password, customer.password)) {
    return { success: false, message: "Email atau password salah." };
  }

  // Password lama (teks biasa) otomatis di-hash saat login berhasil
  if (!isHashedPassword(customer.password)) {
    await supabase
      .from("customers")
      .update({ password: hashPassword(password) })
      .eq("id", customer.id);
  }

  const token = signSession(
    { role: "customer", email: normalizeEmail(customer.email), id: customer.id },
    event,
  );
  if (!token) return sessionSecretMissing();

  return {
    success: true,
    token,
    user: {
      role: "customer",
      name: customer.nama,
      email: customer.email,
      paket: customer.paket,
      id: customer.id,
      status: customer.status,
      maxUndangan: customer.max_undangan,
      loginAt: new Date().toISOString(),
    },
  };
});
