/**
 * Hash password (scrypt, bawaan Node — tanpa dependency baru).
 * Format tersimpan: scrypt$<salt hex>$<hash hex>
 * Password lama yang masih teks biasa tetap bisa diverifikasi (legacy).
 */
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const PREFIX = "scrypt$";

export const isHashedPassword = (stored: string) =>
  String(stored || "").startsWith(PREFIX);

export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, 64);
  return `${PREFIX}${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  stored = String(stored || "");
  if (!isHashedPassword(stored)) {
    // Legacy: password lama masih teks biasa
    return stored.length > 0 && stored === plain;
  }
  const [, saltHex, hashHex] = stored.split("$");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(plain, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
