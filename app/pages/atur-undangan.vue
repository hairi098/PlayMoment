<template>
  <div class="page">
    <!-- Header fixed — sama seperti login -->
    <div class="auth-header">
      <span class="header-logo">
        <img
          src="/playmoment/logo-teal.png"
          alt="PlayMoment Logo"
          class="logo-img"
        />
        <span class="logo-text">
          <span class="logo-play">Play</span
          ><span class="logo-moment">Moment</span>
        </span>
      </span>
    </div>

    <!-- Credit tidak cukup -->
    <div v-if="noCredit" class="auth-body no-credit">
      <div class="nc-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 class="nc-title">Credit tidak cukup</h1>
      <p class="nc-text">
        Kamu perlu menambah credit untuk membuat undangan baru.
      </p>

      <dl class="nc-detail">
        <div><dt>Dibutuhkan</dt><dd>{{ quota.cost }} credit</dd></div>
        <div><dt>Saldo kamu</dt><dd>{{ quota.credits }} credit</dd></div>
      </dl>

      <a
        class="nc-btn primary"
        href="https://wa.me/6281250335005?text=Halo%20admin%2C%20saya%20mau%20top%20up%20credit%20PlayMoment"
        target="_blank"
        rel="noopener"
        >Top up credit</a
      >
      <NuxtLink v-if="upgradeTarget" to="/paket" class="nc-btn outline"
        >Upgrade ke {{ upgradeTarget }}</NuxtLink
      >
      <NuxtLink to="/dashboard" class="nc-back">Kembali ke dashboard</NuxtLink>
    </div>

    <div v-else class="auth-body">
      <h1 class="auth-title">Atur Link Undangan</h1>
      <p class="auth-sub">
        Buat link undangan unik yang akan dibagikan ke tamu.
      </p>

      <div v-if="selectedTema" class="tema-chip">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        Tema: {{ selectedTema }}
      </div>

      <!-- Info box -->
      <div class="info-box">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#92833a"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="flex-shrink: 0; margin-top: 2px"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          Gunakan huruf kecil dan tanda (-) sebagai pengganti spasi.
          <span class="info-example">Contoh: adam-dan-hawa</span>
        </div>
      </div>

      <div class="field">
        <label for="link">Link Undangan <span class="req">*</span></label>
        <div
          class="link-input-wrap"
          :class="{ error: linkError, success: linkSuccess }"
        >
          <span class="link-prefix">playmoment.id/</span>
          <input
            id="link"
            v-model="form.link"
            type="text"
            class="link-input"
            placeholder="Cth. abu-dan-faizah"
            @input="validateLink"
            @blur="validateLink"
            autocomplete="off"
            spellcheck="false"
          />
          <div v-if="linkSuccess" class="link-status">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div v-if="linkError" class="link-status">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        </div>
        <p v-if="linkError" class="field-error">{{ linkError }}</p>
        <p v-if="quotaError" class="field-error">{{ quotaError }}</p>
        <p v-else-if="quota.max > 0" class="quota-hint">
          Kuota undangan: {{ quota.used }} /
          {{ quota.max >= 99 ? "∞" : quota.max }} digunakan
        </p>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button class="btn-back" @click="$router.back()">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          class="btn-next"
          :disabled="!canProceed || isSubmitting"
          :class="{
            disabled: !canProceed || isSubmitting,
            loading: isSubmitting,
          }"
          @click="handleNext"
        >
          <span v-if="isSubmitting" class="spinner" aria-hidden="true" />
          {{ isSubmitting ? "Membuka editor..." : "Selanjutnya →" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { getThemeSlugByName } from "~/config/themes";
import { PAKET_CATALOG, resolvePaketEntry } from "~/config/paket";
import { createEditorId } from "~/utils/invitation-id";
import { useAccountStore } from "~/stores/useAccountStore";
import { useUndanganStore } from "~/stores/useUndanganStore";
import { useCustomerQuota } from "~/composables/useCustomerQuota";

const router = useRouter();
const route = useRoute();
const accountStore = useAccountStore();
const undanganStore = useUndanganStore();
const { quota, canCreateInvitation, currentCustomer } = useCustomerQuota();

if (import.meta.client) {
  const user = accountStore.currentUser;
  const isLoggedIn = user?.role === "customer" || user?.role === "admin";
  if (!isLoggedIn) {
    const tema = route.query.tema ? `?tema=${route.query.tema}` : "";
    navigateTo({
      path: "/login",
      query: { redirect: `/atur-undangan${tema}`, reason: "pilih-tema" },
    });
  }
}

const isSubmitting = ref(false);
const quotaError = ref("");
const noCredit = ref(false);
// Basic → Premium, Premium → Prioritas, Prioritas (tertinggi) → tombol disembunyikan
const upgradeTarget = computed(() => {
  const ids = PAKET_CATALOG.map((p) => p.id);
  const now = resolvePaketEntry(currentCustomer.value?.paket)?.id;
  const next = PAKET_CATALOG[ids.indexOf(now) + 1];
  return next?.adminName || "";
});
const selectedTema = computed(() => route.query.tema || "");
const form = ref({ link: "" });
const linkError = ref("");
const linkSuccess = ref(false);

const validateLink = () => {
  const val = form.value.link.trim();
  if (!val) {
    linkError.value = "";
    linkSuccess.value = false;
    return;
  }
  if (/\s/.test(val)) {
    linkError.value =
      "Tidak boleh ada spasi, gunakan tanda (-) sebagai pengganti.";
    linkSuccess.value = false;
    return;
  }
  if (/[A-Z]/.test(val)) {
    linkError.value = "Gunakan huruf kecil semua.";
    linkSuccess.value = false;
    return;
  }
  if (!/^[a-z0-9-]+$/.test(val)) {
    linkError.value = "Hanya boleh huruf kecil, angka, dan tanda (-).";
    linkSuccess.value = false;
    return;
  }
  if (val.length < 3) {
    linkError.value = "Minimal 3 karakter.";
    linkSuccess.value = false;
    return;
  }
  linkError.value = "";
  linkSuccess.value = true;
};

const canProceed = computed(
  () => form.value.link && linkSuccess.value && !linkError.value,
);

const handleNext = async () => {
  if (!canProceed.value || isSubmitting.value) return;
  quotaError.value = "";
  if (!canCreateInvitation.value) {
    if (currentCustomer.value?.status === "aktif") {
      noCredit.value = true;
    } else {
      quotaError.value =
        "Akun belum aktif. Pastikan pesanan sudah dikonfirmasi admin.";
    }
    return;
  }
  isSubmitting.value = true;
  try {
    const publicSlug = form.value.link.trim();
    const temaSlug =
      getThemeSlugByName(selectedTema.value) || selectedTema.value;
    const editorId = createEditorId();

    // await dulu supaya data masuk DB sebelum navigasi
    const created = await accountStore.addInvitation({
      editorId,
      slug: publicSlug,
      link: `playmoment.id/${publicSlug}`,
      tema: selectedTema.value || temaSlug,
      status: "draft",
      customerId: currentCustomer.value?.id,
    });
    if (!created) {
      if (accountStore.lastInvitationError.startsWith("Credit tidak cukup")) {
        noCredit.value = true;
      } else {
        quotaError.value =
          accountStore.lastInvitationError || "Gagal membuat undangan.";
      }
      isSubmitting.value = false;
      return;
    }

    undanganStore.editorId = editorId;
    undanganStore.slug = publicSlug;
    undanganStore.undangan.domain = publicSlug;
    if (temaSlug) {
      undanganStore.setTema(temaSlug);
      undanganStore.applyTemaColors(temaSlug);
    }

    // Navigasi setelah data tersimpan — loading tetap di halaman editor
    router.push({
      path: `/edit-undangan/${editorId}`,
      query: temaSlug ? { tema: temaSlug } : {},
    });
  } catch (err) {
    console.error("Gagal simpan undangan:", err);
    quotaError.value = "Terjadi kesalahan. Coba lagi.";
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
}

/* ── Header ── */
.auth-header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e8ecf0;
  z-index: 10;
}
.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.3px;
}
.logo-img {
  height: 24px;
  width: auto;
}
.logo-play {
  color: #1a2e45;
}
.logo-moment {
  color: #7ecec4;
}

/* ── Body ── */
.auth-body {
  flex: 1;
  padding: 80px 24px 48px;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
}

/* ── Credit tidak cukup ── */
.no-credit {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: center;
  padding-top: 120px;
}
.nc-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #475569;
}
.nc-title { font-size: 20px; font-weight: 700; color: #1a2e45; margin: 0 0 6px; }
.nc-text { font-size: 14px; line-height: 1.6; color: #64748b; margin: 0 0 24px; }
.nc-detail {
  margin: 0 0 24px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  text-align: left;
}
.nc-detail > div {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  font-size: 14px;
}
.nc-detail > div + div { border-top: 1px solid #e2e8f0; }
.nc-detail dt { color: #64748b; }
.nc-detail dd { margin: 0; font-weight: 600; color: #1a2e45; }
.nc-btn {
  display: block;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}
.nc-btn.primary { background: #2a9d8f; color: #fff; }
.nc-btn.primary:hover { background: #228b7e; }
.nc-btn.outline { border: 1px solid #cbd5e1; color: #1a2e45; background: #fff; }
.nc-btn.outline:hover { background: #f8fafc; }
.nc-back { font-size: 13px; color: #64748b; text-decoration: none; margin-top: 6px; }
.nc-back:hover { color: #1a2e45; }

.auth-title {
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  color: #1a2e45;
  line-height: 1.2;
  margin: 0 0 10px;
  letter-spacing: -0.5px;
}
.auth-sub {
  font-size: 14px;
  text-align: center;
  color: #6b7280;
  margin: 0 0 20px;
}

/* Tema chip */
.tema-chip {
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #f0faf9;
  color: #3d9e91;
  border: 1px solid #c8ede9;
  border-radius: 50px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 700;
  margin: 0 auto 20px;
}
/* Info box */
.info-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 11px 13px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #92400e;
  line-height: 1.55;
}
.info-example {
  display: block;
  margin-top: 3px;
  color: #b45309;
  font-weight: 700;
}

/* Field */
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 28px;
}
.field label {
  font-size: 14px;
  font-weight: 600;
  color: #1a2e45;
}
.req {
  color: #e53e3e;
}

.link-input-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.link-input-wrap:focus-within {
  border-color: #7ecec4;
  box-shadow: 0 0 0 3px rgba(126, 206, 196, 0.15);
}
.link-input-wrap.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
.link-input-wrap.success {
  border-color: #22c55e;
}

.link-prefix {
  padding: 13px 10px 13px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #9ca3af;
  background: #f8fafc;
  white-space: nowrap;
  border-right: 1.5px solid #e2e8f0;
  flex-shrink: 0;
}
.link-input {
  flex: 1;
  padding: 13px 10px;
  font-size: 14px;
  color: #1a2e45;
  border: none;
  outline: none;
  font-family: inherit;
  min-width: 0;
  background: transparent;
}
.link-input::placeholder {
  color: #9ca3af;
}
.link-status {
  padding: 0 12px;
  display: flex;
  align-items: center;
}
.field-error {
  font-size: 12px;
  color: #ef4444;
}
.quota-hint {
  font-size: 12px;
  color: #0a7060;
  font-weight: 600;
}

/* Actions */
.actions {
  display: flex;
  gap: 10px;
}
.btn-back {
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 999px;
  border: 1.5px solid #d1d5db;
  background: #fff;
  color: #1a2e45;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;
  flex-shrink: 0;
}
.btn-back:hover {
  border-color: #7ecec4;
  background: #f0faf9;
}

.btn-next {
  flex: 1;
  padding: 15px;
  background: #7ecec4;
  color: #1a2e45;
  border: none;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  font-family: inherit;
  letter-spacing: 0.2px;
}
.btn-next:hover:not(.disabled) {
  background: #bef8f1;
  transform: translateY(-1px);
}
.btn-next.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-next.loading {
  opacity: 0.8;
  cursor: wait;
}

.spinner {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  border: 2.5px solid rgba(26, 46, 69, 0.3);
  border-top-color: #1a2e45;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
