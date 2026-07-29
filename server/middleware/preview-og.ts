/**
 * Server middleware: OG tags untuk bot/scraper di halaman /preview/[slug]
 *
 * Bot dideteksi via User-Agent. Browser biasa di-pass ke Nuxt SPA.
 * Middleware ini menggantikan server/routes/preview/[slug].ts yang menyebabkan
 * browser biasa mendapat 204 No Content.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://izszfloyozvxcvgyaulr.supabase.co";

const BOT_UA_PATTERN =
  /whatsapp|facebookexternalhit|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|googlebot|bingbot|applebot|curl|wget|python-requests|node-fetch/i;

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  // Hanya handle path /preview/[slug]
  const match = url.pathname.match(/^\/preview\/([^/]+)$/);
  if (!match) return; // bukan preview route, lanjut ke handler berikutnya

  const ua = getHeader(event, "user-agent") || "";

  // Bukan bot — biarkan Nuxt SPA render halaman ini
  if (!BOT_UA_PATTERN.test(ua)) return;

  const slug = match[1];
  if (!slug) return;

  // Pakai service role key agar tidak terhalang RLS
  const config = useRuntimeConfig(event);
  const serviceKey =
    (config.supabaseServiceRoleKey as string) ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "";

  const supabase = createClient(SUPABASE_URL, serviceKey || SUPABASE_URL);

  const { data: inv } = await supabase
    .from("invitations")
    .select("judul, slug, editor_data, foto, status, undangan_aktif")
    .eq("slug", slug)
    .single();

  if (!inv) return;

  const editorData = typeof inv.editor_data === "object" ? inv.editor_data : {};
  const undangan = typeof editorData?.undangan === "object" ? editorData.undangan : {};

  const title =
    undangan?.judulPengaturan || inv.judul || "Undangan Digital - PlayMoment";

  const description =
    undangan?.deskripsi ||
    "Tanpa Mengurangi Rasa Hormat. Kami Bermaksud Mengundang Bapak/Ibu/Saudara/i Pada Acara Pernikahan Kami.";

  const image =
    undangan?.thumbnailWa ||
    (undangan?.fotoCouple && !String(undangan.fotoCouple).startsWith("/assets")
      ? undangan.fotoCouple
      : null) ||
    inv.foto ||
    "";

  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || "https://playmoment.id";
  const pageUrl = `${siteUrl}/preview/${slug}`;

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${escapeHtml(pageUrl)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  ${image ? `<meta property="og:image" content="${escapeHtml(String(image))}" />` : ""}
  <meta property="og:locale" content="id_ID" />
  <meta property="og:site_name" content="PlayMoment" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  ${image ? `<meta name="twitter:image" content="${escapeHtml(String(image))}" />` : ""}
</head>
<body>
  <p>Memuat undangan... <a href="${escapeHtml(pageUrl)}">Klik di sini</a></p>
</body>
</html>`;

  setHeader(event, "Content-Type", "text/html; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=300, s-maxage=300");
  return html;
});
