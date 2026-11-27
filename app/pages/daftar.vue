<template>
  <div class="auth-page">
    <div class="auth-header">
      <span class="header-logo">
        <img src="/playmoment/logo-teal.png" alt="PlayMoment Logo" class="logo-img" />
        <span class="logo-text">
          <span class="logo-play">Play</span><span class="logo-moment">Moment</span>
        </span>
      </span>
    </div>

    <div class="auth-body">
      <h1 class="auth-title">Daftar<br />PlayMoment</h1>
      <p class="auth-sub">Buat akun gratis. Undangan bisa dibuat setelah paket dikonfirmasi admin.</p>

      <p v-if="notice" class="info-note">{{ notice }}</p>

      <div v-if="errorMsg" class="error-alert">{{ errorMsg }}</div>

      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="field">
          <label for="nama">Nama <span class="req">*</span></label>
          <input id="nama" v-model="form.nama" type="text" placeholder="Nama Kamu" autocomplete="name" required />
        </div>

        <div class="field" :class="{ 'has-error': hpTaken }">
          <label for="hp">WhatsApp Aktif <span class="req">*</span></label>
          <div class="hp-wrap">
            <span class="hp-prefix">+62</span>
            <input id="hp" v-model="form.hp" type="tel" inputmode="numeric" placeholder="81234xxxxxx" autocomplete="tel-national" required @input="hpTaken = false" @blur="checkTaken('hp')" />
          </div>
          <p v-if="hpTaken" class="field-error">
            Nomor WhatsApp ini sudah terdaftar.
            <NuxtLink :to="loginLink">Silakan login.</NuxtLink>
          </p>
        </div>

        <div class="field" :class="{ 'has-error': emailTaken }">
          <label for="email">E-Mail Aktif <span class="req">*</span></label>
          <input id="email" v-model="form.email" type="email" placeholder="nama@gmail.com" autocomplete="email" required @input="emailTaken = false" @blur="checkTaken('email')" />
          <p v-if="emailTaken" class="field-error">
            Email ini sudah terdaftar.
            <NuxtLink :to="loginLink">Silakan login.</NuxtLink>
          </p>
        </div>

        <div class="field">
          <label for="password">Password <span class="req">*</span></label>
          <div class="input-wrap">
            <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="Minimal 8 Karakter" autocomplete="new-password" minlength="8" required />
            <button type="button" class="toggle-pw" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
            </button>
          </div>
        </div>

        <button type="submit" class="btn-submit" :class="{ loading }" :disabled="loading || emailTaken || hpTaken">
          <span v-if="!loading">Daftar →</span>
          <span v-else class="spinner"></span>
        </button>
      </form>

      <p class="auth-footer">
        Sudah punya akun?
        <NuxtLink :to="loginLink" class="link-admin">Masuk.</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useAccountStore } from "~/stores/useAccountStore";

const form = reactive({ nama: "", hp: "", email: "", password: "" });
const showPassword = ref(false);
const loading = ref(false);
const errorMsg = ref("");
const accountStore = useAccountStore();
const notify = useNotify();
const route = useRoute();

// Tujuan setelah daftar (mis. checkout paket / atur-undangan). Hanya path internal.
const redirectTarget = computed(() => {
  const t = typeof route.query.redirect === "string" ? route.query.redirect : "";
  return t.startsWith("/") && !t.startsWith("//") && !t.startsWith("/admin") ? t : "";
});
const notice = computed(() => {
  if (route.query.reason === "pilih-paket")
    return "Daftar dulu untuk melanjutkan pembelian paket.";
  if (route.query.reason === "pilih-tema")
    return "Daftar dulu untuk memilih tema dan membuat undangan.";
  return "";
});
const loginLink = computed(() =>
  redirectTarget.value
    ? { path: "/login", query: { redirect: redirectTarget.value, reason: route.query.reason } }
    : "/login",
);

// Sudah login → langsung ke tujuan / dashboard
if (import.meta.client) {
  const user = accountStore.currentUser;
  if (user?.role === "admin") navigateTo("/admin/dashboard");
  else if (user?.role === "customer") navigateTo(redirectTarget.value || "/dashboard");
}

// Cek lebih awal apakah email / WhatsApp sudah terdaftar
const emailTaken = ref(false);
const hpTaken = ref(false);
const checkTaken = async (field) => {
  const value = String(form[field] || "").trim();
  if (!value) return;
  try {
    const res = await $fetch("/api/auth/check-availability", {
      method: "POST",
      body: { [field]: value },
    });
    if (field === "email") emailTaken.value = !!res.emailTaken;
    else hpTaken.value = !!res.hpTaken;
  } catch {
    // abaikan; server tetap memeriksa saat form dikirim
  }
};

const handleRegister = async () => {
  if (loading.value || emailTaken.value || hpTaken.value) return;
  loading.value = true;
  errorMsg.value = "";
  try {
    const res = await $fetch("/api/auth/register", {
      method: "POST",
      body: { ...form },
    });
    if (!res.success) {
      errorMsg.value = res.message;
      return;
    }
    accountStore.setCurrentUser({ ...res.user, sessionToken: res.token });
    await accountStore.loadAll(true);
    notify.success("Akun berhasil dibuat. Selamat datang!");
    await navigateTo(redirectTarget.value || "/dashboard");
  } catch (err) {
    errorMsg.value =
      err?.data?.message || "Terjadi kesalahan, coba lagi.";
    if (!err?.data?.message) {
      notify.error("Tidak bisa terhubung ke server", {
        description: "Periksa koneksi internet lalu coba lagi.",
      });
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.hp-wrap { display: flex; align-items: stretch; border: 1px solid #d1d5db; border-radius: 12px; overflow: hidden; background: #fff; }
.hp-prefix { display: flex; align-items: center; padding: 0 14px; background: #f3f4f6; color: #374151; font-weight: 600; border-right: 1px solid #e5e7eb; }
.hp-wrap input { border: 0 !important; border-radius: 0 !important; flex: 1; min-width: 0; }

* {
  box-sizing: border-box;
}

.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  padding: 80px 24px 40px;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
}

.auth-title {
  font-size: 32px;
  font-weight: 800;
  color: #1a2e45;
  line-height: 1.2;
  margin: 0 0 12px;
  letter-spacing: -0.5px;
}

.auth-sub {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px;
}

.auth-notice {
  font-size: 14px;
  color: #1a2e45;
  margin: 0 0 28px;
  line-height: 1.5;
}
.auth-notice strong {
  font-weight: 700;
}

/* ── Alerts ── */
.error-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff5f5;
  border: 1.5px solid #fed7d7;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  color: #c53030;
  font-weight: 600;
  margin-bottom: 16px;
}
.info-alert {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #f0f7f6;
  border: 1.5px solid #b2e4de;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  color: #1a2e45;
  font-weight: 600;
  margin-bottom: 16px;
  line-height: 1.5;
}
.info-alert svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: #2a9d8f;
}

/* ── Form ── */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-error {
  margin: 0;
  font-size: 13px;
  color: #c53030;
}
.field-error a {
  font-weight: 700;
  color: #149284;
  text-decoration: underline;
}
.field.has-error input,
.field.has-error .hp-wrap {
  border-color: #fc8181;
}

.field label {
  font-size: 14px;
  font-weight: 600;
  color: #1a2e45;
}

.req {
  color: #e53e3e;
}

.field input,
.input-wrap input {
  width: 100%;
  padding: 13px 16px;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  font-size: 14px;
  color: #1a2e45;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
}
.field input::placeholder,
.input-wrap input::placeholder {
  color: #9ca3af;
}
.field input:focus,
.input-wrap input:focus {
  border-color: #7ecec4;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.input-wrap input {
  padding-right: 48px;
}

.toggle-pw {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  padding: 4px;
  transition: color 0.2s;
}
.toggle-pw:hover {
  color: #1a2e45;
}

/* ── Submit ── */
.btn-submit {
  width: 100%;
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
  letter-spacing: 0.2px;
}
.btn-submit:hover:not(:disabled) {
  background: #bef8f1;
  transform: translateY(-1px);
}
.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
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

/* ── Footer ── */
.auth-footer {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}
.link-admin {
  color: #7ecec4;
  font-weight: 600;
  text-decoration: none;
}
.link-admin:hover {
  text-decoration: underline;
}
.info-note {
  margin: 0 0 14px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(126, 206, 196, 0.15);
  color: #0a7060;
  font-size: 13px;
  font-weight: 600;
}
</style>

