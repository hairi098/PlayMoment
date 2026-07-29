<template>
  <div class="dashboard-layout" @click="closeDropdown">
    <DashboardSidebar class="sidebar-slot" :user="user" />

    <div class="main-area">
      <!-- TOPBAR -->
      <header class="topbar">
        <button
          class="topbar-menu mobile-only"
          aria-label="Menu"
          @click.stop="drawerOpen = !drawerOpen"
        >
          <span></span><span></span><span></span>
        </button>
        <h1 class="topbar-title">Pengaturan</h1>
        <p class="topbar-welcome desktop-only">Kelola informasi akun Anda</p>

        <div class="avatar-wrap" @click.stop="toggleDropdown">
          <button class="topbar-avatar" aria-label="Profil">
            <span class="topbar-avatar-initials">{{ getInitials(user?.name) }}</span>
          </button>

          <Transition name="dropdown">
            <div v-if="dropdownOpen" class="profile-dropdown">
              <div class="dropdown-header">
                <div class="dropdown-avatar">
                  <span style="font-size:13px;font-weight:800;color:#fff;user-select:none;">{{ getInitials(user?.name) }}</span>
                </div>
                <div class="dropdown-userinfo">
                  <p class="dropdown-paket">{{ user.paket }}</p>
                  <p class="dropdown-name">{{ user.name }}</p>
                  <p class="dropdown-email">{{ user.email }}</p>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" @click.stop="handleEditProfile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </button>
              <button class="dropdown-item" @click.stop="handleTutorial">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Tutorial
              </button>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item dropdown-logout" @click.stop="handleLogout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </Transition>
        </div>
      </header>

      <!-- SCROLL BODY -->
      <div class="scroll-body">
        <div class="card">

          <!-- AVATAR INISIAL -->
          <div class="photo-section">
            <div class="photo-wrap">
              <div class="avatar-initials">
                {{ getInitials(user.name) }}
              </div>
            </div>
          </div>

          <!-- PAKET AKTIF (read-only) -->
          <div class="paket-info">
            <div class="paket-info-left">
              <span class="paket-label">Paket Aktif</span>
              <span class="paket-expiry">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Berlaku s.d. {{ user.paketExpiry }}
              </span>
            </div>
            <span class="paket-badge">{{ user.paket }}</span>
          </div>

          <div class="divider"></div>

          <!-- FORM FIELDS -->
          <div class="form-stack">

            <div class="form-group">
              <label class="form-label">Nama <span class="req">*</span></label>
              <input type="text" class="form-input" v-model="form.name" placeholder="Masukkan nama lengkap" />
            </div>

            <div class="form-group">
              <label class="form-label">WhatsApp Aktif <span class="req">*</span></label>
              <input type="tel" class="form-input" v-model="form.whatsapp" placeholder="Contoh: 081234567890" />
            </div>

            <div class="form-group">
              <label class="form-label">E-Mail Aktif <span class="req">*</span></label>
              <input type="email" class="form-input" v-model="form.email" placeholder="Masukkan email" />
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-wrap">
                <input
                  :type="showPass ? 'text' : 'password'"
                  class="form-input has-toggle"
                  v-model="form.password"
                  placeholder="••••••••"
                />
                <button class="eye-btn" @click="showPass = !showPass" type="button">
                  <svg v-if="!showPass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
              <p class="field-hint">Kosongkan Password jika tidak ingin merubahnya</p>
            </div>

          </div>

          <p v-if="saveError" class="msg-error">⚠ {{ saveError }}</p>
          <p v-if="saveSuccess" class="msg-success">✓ Profil berhasil diperbarui!</p>
          <button class="btn-update" @click="saveForm" :disabled="isSaving">
            {{ isSaving ? "Menyimpan..." : "Update Profile" }}
          </button>
        </div>
      </div>

      <DashboardBottomNav class="mobile-only" />
    </div>

    <Transition name="drawer">
      <div v-if="drawerOpen" class="drawer-overlay" @click="drawerOpen = false">
        <div class="drawer" @click.stop>
          <DashboardSidebar :user="user" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import DashboardSidebar from "~/components/DashboardSidebar.vue";
import DashboardBottomNav from "~/components/DashboardBottomNav.vue";
import { useCustomerIdentity } from "~/composables/useCustomerIdentity";
import { supabase } from "~/lib/supabase";

const drawerOpen = ref(false);
const dropdownOpen = ref(false);
const toggleDropdown = () => { dropdownOpen.value = !dropdownOpen.value; };
const closeDropdown = () => { dropdownOpen.value = false; };

const handleEditProfile = () => { closeDropdown(); navigateTo("/pengaturan"); };
const handleTutorial = () => { closeDropdown(); navigateTo("/tutorial"); };
const handleLogout = () => { closeDropdown(); return logoutAndRedirect("/login"); };

const { user, customerSource, accountStore, logoutAndRedirect } = useCustomerIdentity();

// INISIAL NAMA
function getInitials(name) {
  if (!name) return "?";
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// FORM
const showPass = ref(false);
const isSaving = ref(false);
const saveError = ref("");
const saveSuccess = ref(false);

const form = ref({
  name: user.value.name,
  whatsapp: customerSource.value?.hp || "",
  email: user.value.email,
  password: "",
});

watch(
  () => [user.value?.name, user.value?.email, customerSource.value?.hp],
  () => {
    // refresh isi form kalau user berubah (mis. setelah login)
    form.value.name = user.value.name;
    form.value.email = user.value.email;
    form.value.whatsapp = customerSource.value?.hp || "";
  },
  { immediate: true },
);

const saveForm = async () => {
  saveError.value = "";
  saveSuccess.value = false;

  const customerId = customerSource.value?.id;
  if (!customerId) {
    saveError.value = "ID customer tidak ditemukan. Coba login ulang.";
    return;
  }

  if (!form.value.name.trim()) {
    saveError.value = "Nama tidak boleh kosong.";
    return;
  }
  if (!form.value.email.trim()) {
    saveError.value = "Email tidak boleh kosong.";
    return;
  }

  isSaving.value = true;

  try {
    // Siapkan data yang akan diupdate
    const updates = {
      nama:  form.value.name.trim(),
      email: form.value.email.trim(),
      hp:    form.value.whatsapp.trim(),
    };

    // Kalau password diisi, ikut diupdate
    if (form.value.password.trim()) {
      updates.password = form.value.password.trim();
    }

    const { error } = await supabase
      .from("customers")
      .update(updates)
      .eq("id", customerId);

    if (error) throw error;

    // Sinkronisasi store supaya tampilan langsung terupdate
    const customer = accountStore.customers.find((c) => c.id === customerId);
    if (customer) {
      customer.nama  = updates.nama;
      customer.email = updates.email;
      customer.hp    = updates.hp;
    }

    // Reset password field setelah berhasil
    form.value.password = "";
    saveSuccess.value = true;
    setTimeout(() => { saveSuccess.value = false; }, 3000);

  } catch (err) {
    saveError.value = err?.message || "Gagal menyimpan. Coba lagi.";
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
* { box-sizing: border-box; }

.dashboard-layout {
  display: flex;
  min-height: 100dvh;
  background: #f0f7f6;
  font-family: "Nunito", "Segoe UI", sans-serif;
}
.sidebar-slot { display: none; }
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* TOPBAR */
.topbar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #edf2f7;
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 12px;
  min-height: 56px;
}
.topbar-menu {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 6px;
  flex-shrink: 0;
  min-width: 40px;
  min-height: 40px;
  align-items: center;
  justify-content: center;
}
.topbar-menu span {
  display: block;
  width: 22px;
  height: 2.5px;
  background: #1a2e45;
  border-radius: 2px;
}
.topbar-title {
  flex: 1;
  font-size: 18px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0;
}
.topbar-welcome {
  flex: 1;
  font-size: 14px;
  color: #6b7280;
}
.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}
.topbar-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7ecec4, #2a9d8f);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.topbar-avatar:hover { background: linear-gradient(135deg, #6abfb4, #228b7e); }
.topbar-avatar-initials {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.5px;
  user-select: none;
  line-height: 1;
}

/* DROPDOWN */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: clamp(200px, 80vw, 240px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(26, 46, 69, 0.15);
  overflow: hidden;
  z-index: 200;
}
.dropdown-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px 12px;
}
.dropdown-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7ecec4, #2a9d8f);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dropdown-paket { font-size: 10px; font-weight: 700; color: #7ecec4; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 2px; }
.dropdown-name { font-size: 13px; font-weight: 800; color: #1a2e45; margin: 0 0 1px; }
.dropdown-email { font-size: 11px; color: #9ca3af; margin: 0; word-break: break-all; }
.dropdown-divider { height: 1px; background: #f0f4f8; }
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  min-height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #1a2e45;
  font-family: inherit;
  transition: background 0.15s;
  text-align: left;
}
.dropdown-item:hover { background: #f7fafa; }
.dropdown-logout { color: #e53e3e; }
.dropdown-logout:hover { background: #fff5f5; }
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s, transform 0.15s; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px) scale(0.97); }

/* SCROLL BODY */
.scroll-body {
  flex: 1;
  padding: 16px 14px 90px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
}

/* CARD */
.card {
  background: #fff;
  border: 1.5px solid #e2f4f2;
  border-radius: 18px;
  padding: 24px 18px;
  box-shadow: 0 2px 10px rgba(26, 46, 69, 0.05);
}

/* AVATAR INISIAL */
.photo-section { display: flex; justify-content: center; margin-bottom: 20px; }
.photo-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.avatar-initials {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7ecec4, #2a9d8f);
  border: 4px solid #7ecec4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* PAKET INFO */
.paket-info {
  display: flex; align-items: center; justify-content: space-between;
  background: #f8fffe; border: 1.5px solid #e2f4f2;
  border-left: 4px solid #7ecec4;
  border-radius: 10px; padding: 12px 16px; margin-bottom: 18px;
}
.paket-info-left { display: flex; flex-direction: column; gap: 3px; }
.paket-label { font-size: 13px; font-weight: 600; color: #6b7280; }
.paket-expiry {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 600; color: #2a9d8f;
}
.paket-badge {
  background: #1a2e45; color: #7ecec4;
  font-size: 11px; font-weight: 700;
  border-radius: 20px; padding: 4px 14px;
  white-space: nowrap;
}
.divider { height: 1px; background: #f0f4f8; margin-bottom: 18px; }

/* FORM */
.form-stack { display: flex; flex-direction: column; gap: 16px; margin-bottom: 22px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; font-weight: 700; color: #1a2e45; }
.req { color: #e53e3e; }
.form-input {
  width: 100%; padding: 12px 14px;
  border: 1.5px solid #d1e9e7; border-radius: 10px;
  font-size: 14px; font-weight: 500; color: #1a2e45;
  font-family: inherit; background: #f0f7f6; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-input:focus { border-color: #7ecec4; box-shadow: 0 0 0 3px rgba(126,206,196,0.15); }
.form-input.has-toggle { padding-right: 44px; }

.input-wrap { position: relative; }
.eye-btn {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #9ca3af;
  padding: 4px; display: flex; align-items: center;
  min-width: 32px; min-height: 32px; justify-content: center;
  transition: color 0.15s;
}
.eye-btn:hover { color: #1a2e45; }
.field-hint { font-size: 11px; color: #9ca3af; margin: 0; font-weight: 500; }

/* BTN UPDATE */
.btn-update {
  width: 100%; padding: 14px;
  background: #7ecec4; border: none; border-radius: 50px;
  font-size: 15px; font-weight: 800; color: #1a2e45;
  cursor: pointer; font-family: inherit;
  transition: background 0.2s, transform 0.2s;
  min-height: 48px;
}
.btn-update:hover { background: #6abfb4; transform: translateY(-2px); }
.btn-update:active { transform: scale(0.98); }
.btn-update:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* FEEDBACK MESSAGES */
.msg-error {
  font-size: 13px; font-weight: 600; color: #e53e3e;
  background: #fff5f5; border: 1px solid #feb2b2;
  border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; margin-top: -6px;
}
.msg-success {
  font-size: 13px; font-weight: 600; color: #2a9d8f;
  background: #f0fdf9; border: 1px solid #b2f0e8;
  border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; margin-top: -6px;
}

/* DRAWER */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 300;
}
.drawer {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: min(240px, 80vw);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #1a2e45;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
}
.drawer > :first-child {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  width: 100% !important;
  min-width: 0 !important;
}
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.25s; }
.drawer-enter-active .drawer, .drawer-leave-active .drawer { transition: transform 0.25s ease; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .drawer, .drawer-leave-to .drawer { transform: translateX(-100%); }
.drawer :deep(.sidebar) {
  width: 100% !important;
  min-width: 0 !important;
  height: 100% !important;
  min-height: 100% !important;
  position: relative !important;
  top: auto !important;
  box-sizing: border-box;
}

/* HELPERS */
.mobile-only { display: flex; }
.desktop-only { display: none; }

@media (min-width: 640px) {
  .scroll-body { padding: 24px 24px 90px; }
  .card { padding: 24px; }
}
@media (min-width: 1024px) {
  .mobile-only { display: none !important; }
  .desktop-only { display: block; }
  .sidebar-slot { display: flex; }
  .topbar { padding: 14px 32px; }
  .scroll-body { padding: 32px 40px 48px; }
}
</style>