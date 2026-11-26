/**
 * POST /api/auth/register
 *
 * Daftar akun customer sendiri (tanpa harus beli dulu).
 * Akun dibuat dengan kuota undangan 0, jadi belum bisa membuat undangan
 * sampai admin mengonfirmasi pesanan paket (confirmOrder mengisi paket & kuota).
 *
 * Request body: { nama, hp, email, password }
 * Response: { success, token, user, message? }
 */

const NO_PACKAGE = "Belum ada paket";

// Pembatas sederhana: maks 5 pendaftaran per IP per jam (in-memory, per instance)
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 3600_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";
  if (tooMany(ip)) {
    setResponseStatus(event, 429);
    return { success: false, message: "Terlalu banyak percobaan. Coba lagi nanti." };
  }

  const body = (await readBody(event)) || {};
  const nama = String(body.nama || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const digits = normalizePhoneDigits(body.hp);

  const fail = (status: number, message: string) => {
    setResponseStatus(event, status);
    return { success: false, message };
  };

  if (nama.length < 2 || nama.length > 80) return fail(400, "Nama wajib diisi.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    return fail(400, "Format email tidak valid.");
  }
  if (digits.length < 8 || digits.length > 13) {
    return fail(400, "Nomor WhatsApp tidak valid.");
  }
  if (password.length < 8 || password.length > 100) {
    return fail(400, "Password minimal 8 karakter.");
  }

  const serviceKey = getSupabaseServiceKey(event);
  if (!serviceKey) return fail(500, "Konfigurasi server belum lengkap. Hubungi admin.");
  const supabase = createSupabaseAdmin(serviceKey);

  // Cegah akun ganda: email atau nomor WhatsApp yang sama harus login
  let dup;
  try {
    dup = await findDuplicates(supabase, { email, digits });
  } catch (e: any) {
    console.error("[auth/register] cek duplikat gagal:", e?.message);
    return fail(500, "Gagal memeriksa data. Coba lagi.");
  }
  if (dup.emailTaken) return fail(409, "Email sudah terdaftar. Silakan login.");
  if (dup.hpTaken) return fail(409, "Nomor WhatsApp sudah terdaftar. Silakan login.");

  const { data: row, error } = await supabase
    .from("customers")
    .insert({
      nama,
      email,
      password: hashPassword(password),
      hp: `+62${digits}`,
      paket: NO_PACKAGE,
      max_undangan: 0,
      status: "aktif",
      tgl_daftar: new Date().toISOString().slice(0, 10),
    })
    .select()
    .single();

  if (error || !row) {
    if ((error as any)?.code === "23505") {
      return fail(409, "Email sudah terdaftar. Silakan login.");
    }
    console.error("[auth/register]", error?.message);
    return fail(500, "Gagal mendaftar. Coba lagi.");
  }

  const token = signSession(
    { role: "customer", email: row.email, id: row.id },
    event,
  );
  if (!token) {
    console.error("[auth/register] SESSION_SECRET belum diset di env");
    return fail(500, "Konfigurasi server belum lengkap. Hubungi admin.");
  }

  return {
    success: true,
    token,
    user: {
      role: "customer",
      name: row.nama,
      email: row.email,
      paket: row.paket,
      id: row.id,
      status: row.status,
      maxUndangan: row.max_undangan,
      loginAt: new Date().toISOString(),
    },
  };
});
