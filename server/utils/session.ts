/**
 * Sesi login bertanda tangan (HMAC-SHA256), dipakai untuk melindungi endpoint server.
 * Format token: base64url(payload).base64url(signature)
 * Auto-import di server/*: signSession(), getSession(), requireSession().
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import type { H3Event } from "h3";

export interface SessionPayload {
  role: "admin" | "customer";
  email: string;
  id?: string | number | null;
  exp: number; // epoch ms
}

// Masa berlaku token. Ubah di sini kalau mau lebih pendek/panjang.
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret(event?: H3Event): string {
  let secret = "";
  try {
    secret = (useRuntimeConfig(event).sessionSecret as string) || "";
  } catch {
    // abaikan, coba env langsung
  }
  secret = secret || process.env.SESSION_SECRET || "";
  if (!secret && process.env.NODE_ENV !== "production") {
    // Hanya untuk development lokal. Di production WAJIB set SESSION_SECRET.
    return "dev-only-insecure-secret";
  }
  return secret;
}

const b64 = (buf: Buffer | string) => Buffer.from(buf).toString("base64url");
const sign = (data: string, secret: string) =>
  createHmac("sha256", secret).update(data).digest();

/** Buat token. Mengembalikan null kalau SESSION_SECRET belum diset (fail closed). */
export function signSession(
  data: Omit<SessionPayload, "exp">,
  event?: H3Event,
): string | null {
  const secret = getSecret(event);
  if (!secret) return null;
  const payload: SessionPayload = { ...data, exp: Date.now() + SESSION_TTL_MS };
  const body = b64(JSON.stringify(payload));
  return `${body}.${b64(sign(body, secret))}`;
}

/** Baca & verifikasi token dari header Authorization: Bearer <token>. null kalau tidak valid. */
export function getSession(event: H3Event): SessionPayload | null {
  const secret = getSecret(event);
  if (!secret) return null;

  const header = getRequestHeader(event, "authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = sign(body, secret);
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (!payload?.exp || payload.exp < Date.now()) return null;
    if (payload.role !== "admin" && payload.role !== "customer") return null;
    return payload;
  } catch {
    return null;
  }
}
