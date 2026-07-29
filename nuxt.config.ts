// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],

  devtools: {
    enabled: false,
  },

  css: ["~/assets/css/main.css", "~/assets/css/admin-shared.css"],

  // Runtime config — siteUrl dipakai untuk OG meta di halaman preview
  runtimeConfig: {
    // Server-side only (tidak expose ke client/browser)
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://playmoment.id",
    },
  },

  routeRules: {
    "/api/**": {
      cors: true,
    },
    "/preview/**": {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    },
  },

  compatibilityDate: "2024-07-11",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
  
});
