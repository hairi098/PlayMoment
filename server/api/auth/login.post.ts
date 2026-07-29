/**
 * POST /api/auth/login
 *
 * Server-side authentication endpoint.
 * Pakai SERVICE ROLE KEY (tidak exposed ke client) untuk query customers table.
 *
 * Request body: { email: string, password: string }
 * Response: { success, user, message? }
 */

import { createClient } from "@supabase/supabase-js";
import { ADMIN_USERS } from "~/utils/auth-credentials";

const SUPABASE_URL = "https://izszfloyozvxcvgyaulr.supabase.co";

// SERVICE ROLE KEY — baca dari runtime config Nuxt (diset via .env)
// Tidak boleh expose ke client sama sekali
function getServiceKey(): string {
  try {
    const config = useRuntimeConfig();
    return (config.supabaseServiceRoleKey as string) || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  } catch {
    return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  }
}

function normalizeEmail(email: string) {
  return (email || "").trim().toLowerCase();
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
    return {
      success: true,
      user: { ...user, loginAt: new Date().toISOString() },
    };
  }

  // Cek customer dari Supabase pakai service key
  const SERVICE_KEY = getServiceKey();
  if (!SERVICE_KEY) {
    // Fallback: kalau service key belum diset, log warning
    console.warn("[auth/login] SUPABASE_SERVICE_ROLE_KEY belum diset di env");
    return {
      success: false,
      message: "Konfigurasi server belum lengkap. Hubungi admin.",
    };
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
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

  if (customer.password !== password) {
    return { success: false, message: "Email atau password salah." };
  }

  return {
    success: true,
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
