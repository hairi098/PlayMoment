/**
 * POST /api/auth/verify-session
 * Cek apakah customer dengan email tertentu masih ada di DB.
 * Dipakai saat app load untuk invalidate session yang sudah dihapus admin.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://izszfloyozvxcvgyaulr.supabase.co";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const email = String(body?.email || "").trim().toLowerCase();

  if (!email) return { exists: false };

  const config = useRuntimeConfig(event);
  const serviceKey = (config.supabaseServiceRoleKey as string) || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!serviceKey) return { exists: true }; // fallback aman

  const supabase = createClient(SUPABASE_URL, serviceKey);
  const { data, error } = await supabase
    .from("customers")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (error) return { exists: true }; // fallback aman jika error
  return { exists: !!data };
});
