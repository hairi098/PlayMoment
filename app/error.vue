<template>
  <div class="error-page">
    <div class="error-card">
      <div class="error-code">{{ displayCode }}</div>
      <div class="error-icon" :class="iconClass">
        <span v-html="iconSvg"></span>
      </div>
      <h1 class="error-title">{{ displayTitle }}</h1>
      <p class="error-message">{{ displayMessage }}</p>

      <div class="error-actions">
        <button
          v-if="showLoginBtn"
          type="button"
          class="btn-primary"
          @click="goLogin"
        >
          Login Sekarang
        </button>
        <button type="button" class="btn-secondary" @click="goHome">
          Kembali ke Beranda
        </button>
        <button
          v-if="canGoBack"
          type="button"
          class="btn-ghost"
          @click="goBack"
        >
          Halaman Sebelumnya
        </button>
      </div>

      <p v-if="hint" class="error-hint">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
});

const statusCode = computed(() => props.error?.statusCode || 500);
const authType = computed(() => props.error?.data?.authType || null);
const reason = computed(() => props.error?.data?.reason || null);
const redirectPath = computed(() => props.error?.data?.redirect || "");

// Undangan dinonaktifkan pemilik (bukan akses ditolak biasa)
const isNonaktif = computed(
  () => statusCode.value === 403 && reason.value === "nonaktif",
);

// Masa aktif undangan habis (akun customer expired)
const isExpired = computed(
  () => statusCode.value === 402 && reason.value === "expired",
);

const displayCode = computed(() => {
  if (statusCode.value === 404) return "404";
  if (statusCode.value === 403) return "403";
  if (statusCode.value === 402) return "402";
  if (statusCode.value === 401) return "401";
  return String(statusCode.value);
});

const displayTitle = computed(() => {
  if (statusCode.value === 404) return "Halaman Tidak Ditemukan";
  if (isExpired.value) return "Masa Aktif Habis";
  if (isNonaktif.value) return "Undangan Tidak Tersedia";
  if (statusCode.value === 403 && authType.value === "admin")
    return "Akses Admin Ditolak";
  if (statusCode.value === 401 && authType.value === "customer")
    return "Login Diperlukan";
  if (statusCode.value === 403) return "Akses Ditolak";
  if (statusCode.value === 401) return "Autentikasi Diperlukan";
  return props.error?.statusMessage || "Terjadi Kesalahan";
});

const displayMessage = computed(() => {
  if (isExpired.value)
    return "Masa aktif paket undangan ini telah berakhir. Undangan tidak dapat diakses hingga diperpanjang oleh pemiliknya.";
  if (isNonaktif.value)
    return "Undangan ini sedang dinonaktifkan oleh pemiliknya dan tidak dapat diakses saat ini.";
  if (props.error?.message) return props.error.message;
  if (statusCode.value === 404)
    return "URL yang Anda cari tidak ada atau sudah dipindahkan. Periksa kembali alamat halaman.";
  return "Maaf, terjadi masalah saat memuat halaman ini. Silakan coba lagi.";
});

const hint = computed(() => {
  if (isExpired.value)
    return "Hubungi pemilik undangan untuk memperpanjang masa aktif paket.";
  if (isNonaktif.value)
    return "Silakan hubungi pemilik undangan untuk informasi lebih lanjut.";
  if (statusCode.value === 403 && authType.value === "admin")
    return "Gunakan akun admin untuk masuk ke panel administrator.";
  if (statusCode.value === 401 && authType.value === "customer")
    return "Setelah login, Anda dapat membuat dan mengelola undangan digital.";
  if (statusCode.value === 404)
    return "Tip: pastikan link ditulis dengan benar, atau gunakan menu navigasi.";
  return "";
});

// Tombol login TIDAK muncul untuk undangan nonaktif atau expired
const showLoginBtn = computed(
  () =>
    !isNonaktif.value &&
    !isExpired.value &&
    (statusCode.value === 401 ||
      statusCode.value === 403 ||
      authType.value === "admin" ||
      authType.value === "customer"),
);

const iconClass = computed(() => {
  if (statusCode.value === 404) return "icon-404";
  if (statusCode.value === 402) return "icon-402";
  if (statusCode.value === 403) return "icon-403";
  if (statusCode.value === 401) return "icon-401";
  return "icon-500";
});

const iconSvg = computed(() => {
  if (statusCode.value === 404) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="40" height="40"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="8" x2="14" y2="14"/><line x1="14" y1="8" x2="8" y2="14"/></svg>`;
  }
  if (statusCode.value === 402) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="40" height="40"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  }
  if (statusCode.value === 403 || statusCode.value === 401) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="40" height="40"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
  }
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="40" height="40"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
});

const canGoBack = import.meta.client && typeof window !== "undefined";

useHead({
  title: `${displayCode.value} — ${displayTitle.value}`,
  htmlAttrs: { lang: "id" },
});

const goLogin = async () => {
  const query = {};
  if (redirectPath.value) query.redirect = redirectPath.value;
  if (authType.value === "admin") query.reason = "admin";
  else if (authType.value === "customer") query.reason = "customer";

  await clearError();
  await navigateTo({ path: "/login", query });
};

const goHome = () => {
  clearError({ redirect: "/" });
};

const goBack = () => {
  if (import.meta.client && window.history.length > 1) {
    window.history.back();
  } else {
    goHome();
  }
};
</script>

<style scoped>
.error-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: linear-gradient(160deg, #f0f7f6 0%, #e8f4f2 45%, #f7fafc 100%);
  font-family: "Nunito", "Segoe UI", sans-serif;
}

.error-card {
  width: 100%;
  max-width: 440px;
  background: #fff;
  border-radius: 24px;
  padding: 36px 28px 32px;
  text-align: center;
  box-shadow: 0 12px 48px rgba(26, 46, 69, 0.1);
  border: 1.5px solid #e2f4f2;
}

.error-code {
  font-size: 56px;
  font-weight: 900;
  color: #7ecec4;
  line-height: 1;
  letter-spacing: -2px;
  margin-bottom: 8px;
}

.error-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.icon-404 {
  background: rgba(126, 206, 196, 0.15);
  color: #2a9d8f;
}
.icon-402 {
  background: rgba(99, 102, 241, 0.12);
  color: #4f46e5;
}
.icon-403,
.icon-401 {
  background: rgba(246, 173, 85, 0.15);
  color: #c07a00;
}
.icon-500 {
  background: rgba(248, 113, 113, 0.12);
  color: #c53030;
}

.error-title {
  font-size: 22px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 10px;
}

.error-message {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.65;
  margin: 0 0 24px;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-primary,
.btn-secondary,
.btn-ghost {
  width: 100%;
  padding: 13px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  border: none;
  transition:
    background 0.2s,
    transform 0.15s;
}

.btn-primary {
  background: #1a2e45;
  color: #7ecec4;
}
.btn-primary:hover {
  background: #243d5c;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #7ecec4;
  color: #1a2e45;
}
.btn-secondary:hover {
  background: #6abfb4;
}

.btn-ghost {
  background: transparent;
  color: #6b7280;
  border: 1.5px solid #e2e8f0;
}
.btn-ghost:hover {
  background: #f7fafc;
}

.error-hint {
  margin: 20px 0 0;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.5;
}
</style>
