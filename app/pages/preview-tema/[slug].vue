<template>
  <!-- Halaman preview tema kosong/dummy untuk pilih tema -->
  <div class="pt-page">
    <!-- ── TOP BAR ── -->
    <div class="pt-topbar">
      <button class="pt-back-btn" @click="$router.back()">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
          <path stroke-linecap="round" stroke-linejoin="round" d="m15 19-7-7 7-7"/>
        </svg>
      </button>
      <div class="pt-topbar-center">
        <span class="pt-topbar-title">{{ temaInfo?.name || 'Preview Tema' }}</span>
        <span class="pt-topbar-sub">Tampilan Demo</span>
      </div>
      <button class="pt-share-btn" @click="handleShare">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      </button>
    </div>

    <!-- ── PHONE FRAME ── -->
    <div class="pt-frame-wrapper">
      <div class="pt-phone-frame">
        <!-- Render tema demo menggunakan data dummy -->
        <component
          :is="currentThemeComponent"
          v-if="currentThemeComponent && !loading"
          :preview-mode="true"
          :demo-mode="true"
        />
        <!-- Loading skeleton -->
        <div v-else-if="loading" class="pt-loading">
          <div class="pt-skeleton pt-skeleton-hero"></div>
          <div class="pt-skeleton-grid">
            <div class="pt-skeleton pt-skeleton-btn"></div>
            <div class="pt-skeleton pt-skeleton-btn"></div>
          </div>
          <div class="pt-skeleton pt-skeleton-text"></div>
          <div class="pt-skeleton pt-skeleton-text w60"></div>
          <div class="pt-skeleton pt-skeleton-img"></div>
          <div class="pt-skeleton pt-skeleton-text"></div>
          <div class="pt-skeleton pt-skeleton-text w80"></div>
        </div>
        <!-- Tema tidak ditemukan -->
        <div v-else class="pt-not-found">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#d1d5db" stroke-width="1.4">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>Tema tidak ditemukan</p>
        </div>
      </div>
    </div>

    <!-- ── BOTTOM ACTION BAR ── -->
    <div class="pt-bottombar">
      <!-- Harga -->
      <div class="pt-price-block">
        <span class="pt-price-label">Harga</span>
        <div class="pt-price-row">
          <span class="pt-price-now">
            {{ temaInfo?.price === 0 ? 'Gratis' : `Rp ${formatPrice(temaInfo?.price)}` }}
          </span>
          <span class="pt-price-was" v-if="temaInfo?.oldPrice">
            Rp {{ formatPrice(temaInfo?.oldPrice) }}
          </span>
          <span class="pt-badge-free" v-if="temaInfo?.price === 0">FREE</span>
          <span class="pt-badge-disc" v-else-if="temaInfo?.oldPrice">DISKON</span>
        </div>
      </div>
      <!-- Actions -->
      <div class="pt-action-row">
        <button class="pt-btn-gunakan" @click="handleGunakan">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Gunakan Tema Ini
        </button>
      </div>
    </div>

    <!-- ── TOAST ── -->
    <Transition name="toast-pop">
      <div v-if="toast" class="pt-toast">{{ toast }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAllThemes } from "~/config/themes";
import { useAuth } from "~/composables/useAuth";

const route = useRoute();
const router = useRouter();
const { requireCustomerForSelect } = useAuth();

const temaSlug = computed(() => route.params.tema);
const loading = ref(true);
const toast = ref("");

// ── Ambil info tema dari config ──
const allThemes = getAllThemes();
const temaInfo = computed(() => allThemes.find(t => t.slug === temaSlug.value) || null);

// ── Map tema slug ke komponen ──
const THEME_MAP = {
  tema1: defineAsyncComponent(() => import("@/components/themes/v1/Tema1.vue")),
  tema2: defineAsyncComponent(() => import("@/components/themes/v2/Tema2.vue")),
};

const currentThemeComponent = computed(() => {
  if (!temaSlug.value) return null;
  return THEME_MAP[temaSlug.value] || null;
});

onMounted(() => {
  // Simulasi loading komponen (beri waktu async component)
  setTimeout(() => { loading.value = false; }, 600);
});

// ── Gunakan tema → wajib login customer dulu ──
function handleGunakan() {
  if (
    !requireCustomerForSelect({
      path: "/atur-undangan",
      query: { tema: temaSlug.value }
    })
  ) {
    return;
  }
  router.push({
    path: "/atur-undangan",
    query: { tema: temaSlug.value }
  });
}

// ── Share ──
function handleShare() {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({
      title: temaInfo.value?.name || "Preview Tema",
      text: `Lihat tema undangan: ${temaInfo.value?.name || temaSlug.value}`,
      url,
    });
  } else {
    navigator.clipboard.writeText(url).then(() => {
      showToast("Link disalin!");
    });
  }
}

function showToast(msg) {
  toast.value = msg;
  setTimeout(() => { toast.value = ""; }, 2200);
}

function formatPrice(val) {
  if (!val) return "0";
  return Number(val).toLocaleString("id-ID");
}
</script>

<style scoped>
/* ── PAGE ROOT ── */
.pt-page {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: #111827;
  overflow: hidden;
}

/* ── TOP BAR ── */
.pt-topbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  background: rgba(17,24,39,.96);
  border-bottom: 1px solid rgba(255,255,255,.08);
  backdrop-filter: blur(8px);
}
.pt-back-btn, .pt-share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px; height: 38px;
  border: none;
  background: rgba(255,255,255,.09);
  border-radius: 10px;
  color: #e5e7eb;
  cursor: pointer;
  transition: background .15s;
}
.pt-back-btn:hover, .pt-share-btn:hover { background: rgba(255,255,255,.15); }
.pt-topbar-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}
.pt-topbar-title {
  font-size: 14px;
  font-weight: 700;
  color: #f9fafb;
  letter-spacing: -.01em;
}
.pt-topbar-sub {
  font-size: 10px;
  color: #7ecec4;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
}

/* ── FRAME WRAPPER ── */
.pt-frame-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 70px 20px 160px;
}

/* ── PHONE FRAME ── */
.pt-phone-frame {
  width: 100%;
  max-width: 390px;
  height: calc(100dvh - 230px);
  max-height: 720px;
  border-radius: 36px;
  overflow: hidden;
  box-shadow:
    0 0 0 9px #1f2937,
    0 0 0 11px #374151,
    0 40px 80px rgba(0,0,0,.7);
  background: #fff;
  position: relative;
}
.pt-phone-frame > * {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

/* ── LOADING SKELETON ── */
.pt-loading {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow: hidden;
}
.pt-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 10px;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.pt-skeleton-hero   { height: 180px; border-radius: 16px; }
.pt-skeleton-grid   { display: flex; gap: 10px; }
.pt-skeleton-btn    { height: 42px; flex: 1; border-radius: 12px; }
.pt-skeleton-text   { height: 14px; }
.pt-skeleton-text.w60 { width: 60%; }
.pt-skeleton-text.w80 { width: 80%; }
.pt-skeleton-img    { height: 120px; border-radius: 14px; }

/* ── NOT FOUND ── */
.pt-not-found {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px; height: 100%;
  text-align: center; padding: 32px;
  color: #9ca3af;
}
.pt-not-found p { font-size: 15px; font-weight: 700; color: #374151; margin: 0; }

/* ── BOTTOM BAR ── */
.pt-bottombar {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 100;
  background: rgba(17,24,39,.97);
  border-top: 1px solid rgba(255,255,255,.08);
  backdrop-filter: blur(8px);
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}
.pt-price-block {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.pt-price-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .04em;
}
.pt-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pt-price-now {
  font-size: 18px;
  font-weight: 800;
  color: #f9fafb;
}
.pt-price-was {
  font-size: 12px;
  color: #6b7280;
  text-decoration: line-through;
}
.pt-badge-free {
  background: #d1fae5; color: #065f46;
  font-size: 10px; font-weight: 800;
  padding: 2px 8px; border-radius: 20px;
  letter-spacing: .04em;
}
.pt-badge-disc {
  background: #fee2e2; color: #991b1b;
  font-size: 10px; font-weight: 800;
  padding: 2px 8px; border-radius: 20px;
  letter-spacing: .04em;
}
.pt-action-row {
  display: flex;
  gap: 10px;
}
.pt-btn-gunakan {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  background: #7ecec4;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: background .15s, transform .12s;
}
.pt-btn-gunakan:hover { background: #5ab8ac; }
.pt-btn-gunakan:active { transform: scale(.98); }

/* ── TOAST ── */
.pt-toast {
  position: fixed;
  bottom: 140px; left: 50%; transform: translateX(-50%);
  z-index: 9999;
  background: rgba(0,0,0,.8);
  color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  backdrop-filter: blur(6px);
  white-space: nowrap;
}
.toast-pop-enter-active { transition: opacity .25s, transform .25s; }
.toast-pop-leave-active { transition: opacity .2s, transform .2s; }
.toast-pop-enter-from, .toast-pop-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }
</style>