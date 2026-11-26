/**
 * POST /api/auth/update-profile
 * Customer yang sedang login mengubah profil sendiri (nama, email, WhatsApp, password).
 * Wajib header Authorization: Bearer <token>. Hanya baris milik customer itu yang bisa diubah.
 * Body: { nama, email, hp, password? }
 */
export default defineEventHandler(async (event) => {
  const fail = (status: number, message: string) => {
    setResponseStatus(event, status);
    return { success: false, message };
  };

  const session = getSession(event);
  if (!session || session.role !== "customer" || !session.id) {
    return fail(401, "Sesi login berakhir. Silakan login ulang.");
  }

  const body = (await readBody(event)) || {};
  const nama = String(body.nama || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "").trim();
  const hpRaw = String(body.hp || "").trim();
  const digits = normalizePhoneDigits(hpRaw);

  if (nama.length < 2 || nama.length > 80) return fail(400, "Nama tidak boleh kosong.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    return fail(400, "Format email tidak valid.");
  }
  if (hpRaw && (digits.length < 8 || digits.length > 13)) {
    return fail(400, "Nomor WhatsApp tidak valid.");
  }
  if (password && (password.length < 8 || password.length > 100)) {
    return fail(400, "Password minimal 8 karakter.");
  }

  const serviceKey = getSupabaseServiceKey(event);
  if (!serviceKey) return fail(500, "Konfigurasi server belum lengkap. Hubungi admin.");
  const supabase = createSupabaseAdmin(serviceKey);

  // Email / WhatsApp tidak boleh dipakai akun lain
  const { data: sameEmail, error: e1 } = await supabase
    .from("customers")
    .select("id")
    .ilike("email", email.replace(/[\\%_]/g, (c) => `\\${c}`))
    .neq("id", session.id)
    .limit(1);
  if (e1) return fail(500, "Gagal memeriksa data. Coba lagi.");
  if (sameEmail?.length) return fail(409, "Email sudah dipakai akun lain.");

  if (digits) {
    const variants = [`+62${digits}`, `62${digits}`, `0${digits}`, digits];
    const { data: sameHp, error: e2 } = await supabase
      .from("customers")
      .select("id")
      .in("hp", variants)
      .neq("id", session.id)
      .limit(1);
    if (e2) return fail(500, "Gagal memeriksa data. Coba lagi.");
    if (sameHp?.length) return fail(409, "Nomor WhatsApp sudah dipakai akun lain.");
  }

  const patch: Record<string, any> = {
    nama,
    email,
    hp: digits ? `+62${digits}` : "-",
    updated_at: new Date().toISOString(),
  };
  if (password) patch.password = hashPassword(password);

  const { data: row, error } = await supabase
    .from("customers")
    .update(patch)
    .eq("id", session.id)
    .select()
    .single();

  if (error || !row) {
    console.error("[auth/update-profile]", error?.message);
    return fail(500, "Gagal menyimpan. Coba lagi.");
  }

  const token = signSession({ role: "customer", email: row.email, id: row.id }, event);
  return {
    success: true,
    token,
    user: { name: row.nama, email: row.email, hp: row.hp },
  };
});
