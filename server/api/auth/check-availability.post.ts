/**
 * POST /api/auth/check-availability
 * Body: { email?, hp? }  →  { emailTaken, hpTaken }
 * Dipakai form daftar untuk memberi tahu lebih awal kalau email / WhatsApp sudah terdaftar.
 */
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 5 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 40;
}

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";
  if (tooMany(ip)) {
    setResponseStatus(event, 429);
    return { emailTaken: false, hpTaken: false };
  }

  const body = (await readBody(event)) || {};
  const email = String(body.email || "").trim().toLowerCase();
  const digits = normalizePhoneDigits(body.hp);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 120;
  const validHp = digits.length >= 8 && digits.length <= 13;

  const serviceKey = getSupabaseServiceKey(event);
  if (!serviceKey || (!validEmail && !validHp)) {
    return { emailTaken: false, hpTaken: false };
  }

  try {
    return await findDuplicates(createSupabaseAdmin(serviceKey), {
      email: validEmail ? email : undefined,
      digits: validHp ? digits : undefined,
    });
  } catch {
    return { emailTaken: false, hpTaken: false };
  }
});
