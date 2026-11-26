/**
 * Helper Supabase untuk sisi server (Nitro).
 * Folder server/utils otomatis di-auto-import di semua file server/*,
 * jadi cukup panggil getSupabaseServiceKey() / createSupabaseAdmin() tanpa import.
 */
import { createClient } from "@supabase/supabase-js";
import type { H3Event } from "h3";

// URL project Supabase. Bisa di-override lewat env SUPABASE_URL.
const DEFAULT_SUPABASE_URL = "https://izszfloyozvxcvgyaulr.supabase.co";

/** Ambil service role key dari runtime config / env. Kosong kalau belum diset. */
export function getSupabaseServiceKey(event?: H3Event): string {
  try {
    const config = useRuntimeConfig(event);
    return (
      (config.supabaseServiceRoleKey as string) ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      ""
    );
  } catch {
    return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  }
}

/** Client Supabase dengan service role key (bypass RLS) — HANYA dipakai di server. */
export function createSupabaseAdmin(serviceKey: string) {
  return createClient(
    process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL,
    serviceKey
  );
}
