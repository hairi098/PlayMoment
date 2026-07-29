/**
 * GET /api/public/invitation/:slug
 *
 * Load undangan publik berdasarkan slug.
 * Pakai SERVICE ROLE KEY agar tidak terhalang RLS policy.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://izszfloyozvxcvgyaulr.supabase.co";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug wajib diisi." });
  }

  // useRuntimeConfig() harus dipanggil di dalam handler (request context)
  const config = useRuntimeConfig(event);
  const serviceKey =
    (config.supabaseServiceRoleKey as string) ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "";

  if (!serviceKey) {
    console.error("[preview-api] SUPABASE_SERVICE_ROLE_KEY tidak tersedia");
    throw createError({ statusCode: 500, statusMessage: "Server configuration error." });
  }

  const supabase = createClient(SUPABASE_URL, serviceKey);

  const { data, error } = await supabase
    .from("invitations")
    .select(
      "id, editor_id, customer_id, judul, slug, tema, tema_slug, status, undangan_aktif, musik_aktif, rsvp_aktif, sound_effect_aktif, sound_typing_aktif, editor_data"
    )
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("[preview-api] Supabase error:", error.message, "slug:", slug);
    throw createError({ statusCode: 404, statusMessage: "Undangan tidak ditemukan." });
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "Undangan tidak ditemukan." });
  }

  return data;
});
