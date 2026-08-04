<template>
  <div>
    <!-- Full screen loading — hijau penuh, logo + spinner -->
    <div v-if="!isHydrated" id="preview-init-loading">
      <div class="plc">
        <div class="plc-logo-wrap">
          <svg class="plc-spin-ring" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="5"/>
            <circle cx="50" cy="50" r="44" fill="none" stroke="#fff" stroke-width="5"
              stroke-linecap="round" stroke-dasharray="80 196"/>
          </svg>
          <img src="/playmoment/logo-white.png" alt="PlayMoment" />
        </div>
      </div>
    </div>
    <component
      v-else-if="currentThemeComponent"
      :is="currentThemeComponent"
      :preview-mode="true"
    />
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
  nextTick,
} from "vue";
import { useRoute } from "vue-router";
import { useUndanganStore } from "@/stores/useUndanganStore";
import { useAccountStore } from "@/stores/useAccountStore";
import { hydrateUndanganStoreFromPublicSlug } from "~/composables/useInvitationEditorHydration";

const route = useRoute();
const store = useUndanganStore();
const accountStore = useAccountStore();

// Halaman preview hanya berjalan di client — SSR dimatikan
definePageMeta({ ssr: false });

// Inline loading style — tampil segera saat HTML diterima browser, sebelum JS load
useHead({
  style: [{
    innerHTML: `
      html, body { margin:0; padding:0; background:#5bbfb5; }
      #preview-init-loading {
        position: fixed; inset: 0; z-index: 9999;
        background: #5bbfb5;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.3s ease;
      }
      #preview-init-loading .plc {
        display: flex; align-items: center; justify-content: center;
      }
      #preview-init-loading .plc-logo-wrap {
        position: relative; width: 96px; height: 96px;
        display: flex; align-items: center; justify-content: center;
      }
      #preview-init-loading .plc-spin-ring {
        position: absolute; inset: 0; width: 100%; height: 100%;
        animation: plc-spin 1.1s linear infinite;
      }
      #preview-init-loading img {
        width: 58px; height: 58px; object-fit: contain; position: relative; z-index: 1;
      }
      @keyframes plc-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    `
  }]
});

// ── OG / SEO Meta — reaktif dari store setelah hydration
// judulPengaturan = metadata title (tidak terhubung ke cover tema)
// thumbnailWa     = foto khusus WA preview (tidak terhubung ke fotoCouple)
const siteUrl = useRuntimeConfig().public.siteUrl || "https://playmoment.id";
const pageSlug = computed(() => route.params.slug || "");
const ogTitle = computed(() =>
  store.undangan.judulPengaturan || store.undangan.judul || "Undangan Digital - PlayMoment"
);
const ogDesc = computed(() =>
  store.undangan.deskripsi ||
  "Tanpa Mengurangi Rasa Hormat. Kami Bermaksud Mengundang Bapak/Ibu/Saudara/i Pada Acara Pernikahan Kami."
);
const ogImage = computed(() => {
  if (store.undangan.thumbnailWa) return store.undangan.thumbnailWa;
  const couple = store.undangan.fotoCouple;
  if (couple && !couple.startsWith("/assets")) return couple;
  return "";
});

useSeoMeta({
  title: ogTitle,
  ogTitle: ogTitle,
  description: ogDesc,
  ogDescription: ogDesc,
  ogImage: ogImage,
  ogType: "website",
  ogUrl: computed(() => `${siteUrl}/preview/${pageSlug.value}`),
  twitterCard: "summary_large_image",
  twitterTitle: ogTitle,
  twitterDescription: ogDesc,
  twitterImage: ogImage,
});

import Tema1 from "@/components/themes/v1/Tema1.vue";
import Tema2 from "@/components/themes/v2/Tema2.vue";
import Tema3 from "@/components/themes/Tema3.vue";
import Tema4 from "@/components/themes/Tema4.vue";

const THEME_MAP = {
  "tema-1": Tema1,
  "tema-2": Tema2,
  "tema-3": Tema3,
  "tema-4": Tema4,
};

const currentThemeComponent = computed(
  () => THEME_MAP[store.temaSlug] || THEME_MAP["tema-1"] || null,
);

// Flag: jangan mount tema sebelum data ter-hydrate
// Mencegah Tema1.onMounted jalan dengan data kosong → loading screen stuck
const isHydrated = ref(false);

function applyPersistedPayload(data) {
  if (!data || typeof data !== "object") return;
  if (data.editorId) store.editorId = data.editorId;
  if (data.slug) store.slug = data.slug;
  if (data.temaSlug) store.temaSlug = data.temaSlug;
  if (data.customColors) Object.assign(store.customColors, data.customColors);
  if (data.textColors) Object.assign(store.textColors, data.textColors);
  if (data.sectionStates)
    Object.assign(store.sectionStates, data.sectionStates);
  if (data.undangan) Object.assign(store.undangan, data.undangan);
  if (data.sectionContents)
    Object.assign(store.sectionContents, data.sectionContents);
  if (data.rsvpFields) store.rsvpFields = data.rsvpFields;
  if (data.daftarTamu) store.daftarTamu = data.daftarTamu;
  if (data.soundEffectAktif !== undefined)
    store.soundEffectAktif = data.soundEffectAktif;
  if (data.soundTypingAktif !== undefined)
    store.soundTypingAktif = data.soundTypingAktif;
  if (data.musikAktif !== undefined) store.musikAktif = data.musikAktif;
  if (data.undanganAktif !== undefined)
    store.undanganAktif = data.undanganAktif;
  if (data.rsvpAktif !== undefined) store.rsvpAktif = data.rsvpAktif;
}

// BroadcastChannel untuk sync real-time dari editor
let _bc = null;

function setupBroadcastChannel(publicSlug) {
  try {
    _bc = new BroadcastChannel("undangan-preview-sync");
    _bc.onmessage = (e) => {
      const { type, slug, payload, customColors } = e.data || {};
      if (type === "SYNC" && (!slug || slug === publicSlug)) {
        applyPersistedPayload(payload);
      } else if (type === "COLORS") {
        if (customColors) Object.assign(store.customColors, customColors);
      }
    };
  } catch (e) {}
}

// Fallback: tetap dengar storage event (browser lama / Safari)
function onStorageChange(e) {
  if (e.key === "undangan-store" && e.newValue) {
    try {
      applyPersistedPayload(JSON.parse(e.newValue));
    } catch (err) {
      console.warn("Preview: gagal sync dari localStorage", err);
    }
  }
}

function applyGuestNameFromQuery() {
  const raw = route.query.to;
  if (!raw) return;
  const nama = decodeURIComponent(String(raw)).trim();
  if (!nama) return;
  store.undangan.namaTamu = nama;
}

onMounted(async () => {
  const publicSlug = route.params.slug;
  console.log("[preview] 1. slug:", publicSlug);

  if (!publicSlug) {
    // Tidak ada slug — tampilkan error
    showError({ statusCode: 404, statusMessage: "Undangan tidak ditemukan." });
    return;
  }

  store.slug = String(publicSlug);

  // Load undangan via server API (pakai service role, bypass RLS)
  let invitation = null;
  try {
    invitation = await accountStore.loadPublicInvitationBySlug(String(publicSlug));
  } catch (e) {
    console.error("[preview] loadPublicInvitationBySlug error:", e);
  }
  console.log("[preview] 2. invitation loaded:", invitation?.slug);

  if (!invitation) {
    showError({ statusCode: 404, statusMessage: "Undangan tidak ditemukan." });
    return;
  }

  // Setup BroadcastChannel untuk terima update real-time dari editor
  setupBroadcastChannel(String(publicSlug));

  // Tunggu nextTick agar Pinia state sudah stabil sebelum hydration
  await nextTick();

  const result = hydrateUndanganStoreFromPublicSlug(String(publicSlug));
  console.log("[preview] 3. hydration result:", result);

  if (result === "expired") {
    showError({
      statusCode: 402,
      statusMessage: "Masa aktif undangan telah berakhir.",
      data: { reason: "expired" },
    });
    return;
  }
  if (result === "nonaktif") {
    showError({
      statusCode: 403,
      statusMessage: "Undangan ini sedang tidak aktif.",
      data: { reason: "nonaktif" },
    });
    return;
  }
  if (!result) {
    showError({
      statusCode: 404,
      statusMessage: "Undangan tidak ditemukan.",
    });
    return;
  }

  // ✅ Update warna loading background agar serasi dengan tema
  const tombol = store.customColors?.tombol || '#5bbfb5';
  const el = document.getElementById('preview-init-loading');
  if (el) {
    el.style.background = tombol;
    el.style.transition = 'background 0.3s ease';
  }
  document.documentElement.style.background = tombol;
  document.body.style.background = tombol;

  // ✅ Data sudah siap — mount komponen tema
  console.log("[preview] 4. isHydrated = true, temaSlug:", store.temaSlug);
  isHydrated.value = true;

  applyGuestNameFromQuery();
  window.addEventListener("storage", onStorageChange);
});

watch(
  () => route.query.to,
  () => applyGuestNameFromQuery(),
);

onUnmounted(() => {
  window.removeEventListener("storage", onStorageChange);
  try { _bc?.close(); } catch (e) {}
});
</script>
