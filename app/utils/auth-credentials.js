/** Password default akun customer demo & saat admin konfirmasi tanpa isi password. */
export const DEFAULT_CUSTOMER_PASSWORD = "12345678";

/** Akun admin tetap (demo). Customer pakai password di account-store. */
export const ADMIN_USERS = [
  {
    email: "admin@playmoment.com",
    password: "admin123",
    role: "admin",
    name: "Admin Utama",
    paket: "Super Admin",
  },
];

export function generateTempPassword(length = 10) {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

export function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}
