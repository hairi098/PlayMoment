<template>
  <div class="dashboard-layout" @click="closeDropdown">
    <!-- ===== SIDEBAR (desktop only) ===== -->
    <DashboardSidebar class="sidebar-slot" :user="user" />

    <!-- ===== MAIN AREA ===== -->
    <div class="main-area">
      <!-- ===== TOPBAR ===== -->
      <header class="topbar">
        <!-- Mobile: hamburger -->
        <button
          class="topbar-menu mobile-only"
          aria-label="Menu"
          @click.stop="drawerOpen = !drawerOpen"
        >
          <span></span><span></span><span></span>
        </button>
        <h1 class="topbar-title">Dashboard</h1>
        <!-- Desktop: welcome text -->
        <p class="topbar-welcome desktop-only">
          Selamat datang, <strong>{{ user.name }}</strong> 👋
        </p>

        <!-- Avatar + Dropdown -->
        <div class="avatar-wrap" @click.stop="toggleDropdown">
          <button class="topbar-avatar" aria-label="Profil">
            <span class="topbar-avatar-initials">{{ getInitials(user?.name) }}</span>
          </button>

          <!-- Dropdown Menu -->
          <Transition name="dropdown">
            <div v-if="dropdownOpen" class="profile-dropdown">
              <div class="dropdown-header">
                <div class="dropdown-avatar dropdown-avatar-initials">
                  <span>{{ getInitials(user?.name) }}</span>
                </div>
                <div class="dropdown-userinfo">
                  <p class="dropdown-paket">{{ user.paket }}</p>
                  <p class="dropdown-name">{{ user.name }}</p>
                  <p class="dropdown-email">{{ user.email }}</p>
                </div>
              </div>

              <div class="dropdown-divider"></div>

              <button class="dropdown-item" @click.stop="handleEditProfile">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="16"
                  height="16"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  />
                </svg>
                Edit Profile
              </button>

              <button class="dropdown-item" @click.stop="handleTutorial">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="16"
                  height="16"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Tutorial
              </button>

              <div class="dropdown-divider"></div>

              <button
                class="dropdown-item dropdown-logout"
                @click.stop="handleLogout"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="16"
                  height="16"
                >
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

      <!-- ===== SCROLL BODY ===== -->
      <div class="scroll-body">
        <div class="dashboard-grid">
          <!-- ===== PROFILE CARD ===== -->
          <section class="profile-card">
            <div class="profile-avatar-wrap">
              <div class="profile-avatar profile-avatar-initials">
                {{ getInitials(user?.name) }}
              </div>
            </div>

            <div class="profile-info-box">
              <p class="profile-name">{{ user.name }}</p>
              <p class="profile-email">{{ user.email }}</p>
            </div>

            <p class="paket-label">Masa Aktif Paket</p>
            <p class="paket-name">{{ user.paket }}</p>

            <div class="countdown-row">
              <div
                v-for="(item, i) in countdown"
                :key="i"
                class="countdown-box"
              >
                <span class="countdown-num">{{ item.value }}</span>
                <span class="countdown-unit">{{ item.unit }}</span>
              </div>
            </div>

            <button class="btn-perpanjang" @click="navigateTo('/paket')">
              Perpanjang Masa Aktif
            </button>
          </section>

          <!-- ===== UPGRADE BANNER ===== -->
          <section class="upgrade-banner">
            <p class="upgrade-text">
              Tingkatkan paket Anda untuk<br />mendapatkan lebih banyak fitur
            </p>
            <button class="btn-upgrade" @click="navigateTo('/paket')">
              Upgrade Paket
            </button>
          </section>

          <!-- ===== INVITATION BY DATE ===== -->
          <section class="stats-section">
            <div class="stats-header">
              <h2 class="stats-title">Invitation by Date</h2>
              <div class="stats-filters">
                <input
                  type="text"
                  class="filter-input"
                  v-model="filterDate"
                  placeholder="DD/MM/YYYY"
                />
                <select class="filter-select" v-model="filterPeriode">
                  <option>7 Hari Terakhir</option>
                  <option>30 Hari Terakhir</option>
                  <option>3 Bulan Terakhir</option>
                  <option>Semua</option>
                </select>
              </div>
            </div>

            <div class="stat-cards">
              <div v-for="(s, i) in stats" :key="i" class="stat-card">
                <div class="stat-icon-wrap">
                  <span v-html="s.svg"></span>
                </div>
                <div class="stat-info">
                  <p class="stat-num">{{ s.value }}</p>
                  <p class="stat-label">{{ s.label }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- ===== BOTTOM NAV (mobile only) ===== -->
      <DashboardBottomNav class="mobile-only" />
    </div>

    <!-- ===== MOBILE DRAWER ===== -->
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import DashboardSidebar from "~/components/DashboardSidebar.vue";
import DashboardBottomNav from "~/components/DashboardBottomNav.vue";
import { useAccountStore } from "~/stores/useAccountStore";
import { useCustomerIdentity } from "~/composables/useCustomerIdentity";

// ===== DRAWER =====
const drawerOpen = ref(false);

// ===== DROPDOWN =====
const dropdownOpen = ref(false);
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};
const closeDropdown = () => {
  dropdownOpen.value = false;
};

const handleEditProfile = () => {
  closeDropdown();
  drawerOpen.value = false;
  navigateTo("/pengaturan");
};
const handleTutorial = () => {
  closeDropdown();
  drawerOpen.value = false;
  navigateTo("/tutorial");
};
const handleLogout = () => {
  closeDropdown();
  drawerOpen.value = false;
  logoutAndRedirect("/login");
};

const accountStore = useAccountStore();
const { user, customerSource, logoutAndRedirect } = useCustomerIdentity();

function getInitials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const userExpiry = computed(() =>
  user.value.expiryDate
    ? new Date(user.value.expiryDate)
    : new Date(Date.now() + 29 * 86400000),
);

// ===== COUNTDOWN =====
const countdown = ref([
  { value: "29", unit: "Hari" },
  { value: "11", unit: "Jam" },
  { value: "58", unit: "Menit" },
  { value: "12", unit: "Detik" },
]);

let timer = null;
const updateCountdown = () => {
  const diff = userExpiry.value - Date.now();
  if (diff <= 0) {
    countdown.value = [
      { value: "00", unit: "Hari" },
      { value: "00", unit: "Jam" },
      { value: "00", unit: "Menit" },
      { value: "00", unit: "Detik" },
    ];
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  countdown.value = [
    { value: String(d).padStart(2, "0"), unit: "Hari" },
    { value: String(h).padStart(2, "0"), unit: "Jam" },
    { value: String(m).padStart(2, "0"), unit: "Menit" },
    { value: String(s).padStart(2, "0"), unit: "Detik" },
  ];
};

onMounted(() => {
  updateCountdown();
  timer = setInterval(updateCountdown, 1000);

  // Load editor_data agar stats tamu & ucapan akurat
  const invs = accountStore.customerInvitations;
  invs.filter(inv => !inv.editorData && inv.editorId)
      .forEach(inv => accountStore.loadInvitationEditorData(inv.editorId));
});
onUnmounted(() => clearInterval(timer));

// ===== FILTERS =====
const filterDate = ref("29/03/2026");
const filterPeriode = ref("7 Hari Terakhir");

// ===== STATS =====
// ===== STATS =====
const stats = computed(() => {
  const invs = accountStore.customerInvitations;
  const totalUndangan = invs.length;

  // Hitung total tamu dan ucapan dari semua daftarTamu
  let totalTamu = 0;
  let totalUcapan = 0;
  invs.forEach(inv => {
    const daftarTamu = inv.editorData?.daftarTamu;
    if (Array.isArray(daftarTamu)) {
      // Hitung total semua tamu (termasuk yang belum konfirmasi)
      totalTamu += daftarTamu.length;
      totalUcapan += daftarTamu.filter(t => t.ucapan && String(t.ucapan).trim()).length;
    }
  });

  return [
    {
      label: "Undangan Dibuat",
      value: totalUndangan,
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3,5 12,13 21,5"/></svg>`,
    },
    {
      label: "Tamu Undangan",
      value: totalTamu,
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    },
    {
      label: "Ucapan & Do'a",
      value: totalUcapan,
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    },
  ];
});
</script>

<style scoped>
/* ===========================
   LAYOUT
=========================== */
.dashboard-layout {
  display: flex;
  min-height: 100dvh;
  background: #f0f7f6;
  font-family: "Nunito", "Segoe UI", sans-serif;
}

.sidebar-slot {
  display: none;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* ===========================
   TOPBAR
=========================== */
.topbar {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  background: #fff;
  border-bottom: 1px solid #edf2f7;
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 12px;
}

.topbar-menu {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
  flex-shrink: 0;
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
  font-size: 20px;
  font-weight: 800;
  color: #1a2e45;
}

.topbar-welcome {
  flex: 1;
  font-size: 15px;
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
.topbar-avatar:hover {
  background: linear-gradient(135deg, #6abfb4, #228b7e);
}
.topbar-avatar-initials {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.5px;
  user-select: none;
  line-height: 1;
}

/* ===========================
   PROFILE DROPDOWN
=========================== */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 230px;
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
.dropdown-avatar-initials span {
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  user-select: none;
  line-height: 1;
  letter-spacing: 0.5px;
}

.dropdown-paket {
  font-size: 10px;
  font-weight: 700;
  color: #7ecec4;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 2px;
}
.dropdown-name {
  font-size: 13px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 1px;
}
.dropdown-email {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
  word-break: break-all;
}

.dropdown-divider {
  height: 1px;
  background: #f0f4f8;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
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
.dropdown-item:hover {
  background: #f7fafa;
}
.dropdown-logout {
  color: #e53e3e;
}
.dropdown-logout:hover {
  background: #fff5f5;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/* ===========================
   SCROLL BODY
=========================== */
.scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 96px;
}

.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ===========================
   PROFILE CARD
=========================== */
.profile-card {
  background: #1a2e45;
  border-radius: 24px;
  padding: 0 20px 24px;
  text-align: center;
  overflow: visible;
}

.profile-avatar-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  padding-top: 20px;
}

.profile-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7ecec4, #2a9d8f);
  border: 4px solid #7ecec4;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
.profile-avatar-initials {
  font-size: 30px;
  font-weight: 800;
  color: #fff;
  user-select: none;
  letter-spacing: 1px;
  line-height: 1;
}

.profile-info-box {
  background: #7ecec4;
  border-radius: 12px;
  padding: 10px 20px;
  margin-bottom: 16px;
  border: 2px dashed rgba(255, 255, 255, 0.4);
}
.profile-name {
  font-size: 16px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 2px;
}
.profile-email {
  font-size: 13px;
  color: #1a2e45;
  opacity: 0.8;
  margin: 0;
}

.paket-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 4px;
}
.paket-name {
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 16px;
}

.countdown-row {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 20px;
  flex-wrap: nowrap;
}
.countdown-box {
  background: #7ecec4;
  border-radius: 10px;
  padding: 8px 4px;
  flex: 1;
  min-width: 0;
  text-align: center;
}
.countdown-num {
  display: block;
  font-size: 20px;
  font-weight: 900;
  color: #1a2e45;
  line-height: 1;
}
.countdown-unit {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #1a2e45;
  margin-top: 4px;
}

.btn-perpanjang {
  width: 100%;
  background: #7ecec4;
  color: #1a2e45;
  border: none;
  border-radius: 50px;
  padding: 14px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.2s,
    transform 0.2s;
}
.btn-perpanjang:hover {
  background: #6abfb4;
  transform: translateY(-2px);
}

/* ===========================
   UPGRADE BANNER
=========================== */
.upgrade-banner {
  background: #b2e4de;
  border-radius: 20px;
  padding: 24px 20px;
  text-align: center;
}
.upgrade-text {
  font-size: 14px;
  color: #1a2e45;
  line-height: 1.6;
  margin: 0 0 14px;
}
.btn-upgrade {
  background: #1a2e45;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 13px 32px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  width: 100%;
  transition:
    background 0.2s,
    transform 0.2s;
}
.btn-upgrade:hover {
  background: #243d5c;
  transform: translateY(-2px);
}

/* ===========================
   STATS SECTION
=========================== */
.stats-section {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
}
.stats-title {
  font-size: 16px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0;
}

.stats-filters {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-input {
  background: #f0f7f6;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  padding: 7px 12px;
  font-size: 12px;
  color: #1a2e45;
  font-weight: 600;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
  width: 110px;
}
.filter-input:focus {
  border-color: #7ecec4;
}

.filter-select {
  background: #f0f7f6;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  padding: 7px 12px;
  font-size: 12px;
  color: #1a2e45;
  font-weight: 600;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
  cursor: pointer;
}
.filter-select:focus {
  border-color: #7ecec4;
}

.stat-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.stat-card {
  background: #f8fffe;
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1.5px solid #e2f4f2;
  border-left: 4px solid #7ecec4;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
.stat-card:hover {
  box-shadow: 0 4px 16px rgba(126, 206, 196, 0.15);
  transform: translateY(-1px);
}
.stat-icon-wrap {
  width: 46px;
  height: 46px;
  background: #e8f7f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-num {
  font-size: 24px;
  font-weight: 900;
  color: #1a2e45;
  margin: 0 0 2px;
}
.stat-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  margin: 0;
}

/* ===========================
   MOBILE DRAWER
=========================== */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 300;
}
.drawer {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
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

.drawer-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
}
.drawer-user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1.5px solid #7ecec4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.drawer-user-name {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 2px;
}
.drawer-user-email {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  word-break: break-all;
}
.drawer-footer {
  flex-shrink: 0;
  padding: 0 0 16px;
  background: inherit;
}
.drawer-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin: 8px 16px 8px;
}
.drawer-action {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 13px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  font-family: inherit;
  transition: background 0.15s;
  text-align: left;
}
.drawer-action:hover {
  background: rgba(255, 255, 255, 0.08);
}
.drawer-logout {
  color: #f87171;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s;
}
.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform 0.25s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .drawer,
.drawer-leave-to .drawer {
  transform: translateX(-100%);
}

/* Override sidebar di dalam drawer agar responsif */
.drawer :deep(.sidebar) {
  width: 100% !important;
  min-width: 0 !important;
  height: 100% !important;
  min-height: 100% !important;
  position: relative !important;
  top: auto !important;
  box-sizing: border-box;
}

/* ===========================
   HELPERS
=========================== */
.mobile-only {
  display: flex;
}
.desktop-only {
  display: none;
}

/* ===========================
   RESPONSIVE — TABLET 640px+
=========================== */
@media (min-width: 640px) {
  .scroll-body {
    padding: 24px 24px 100px;
  }

  .stat-cards {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .stat-card {
    flex: 1;
    min-width: calc(50% - 6px);
  }
}

/* ===========================
   RESPONSIVE — DESKTOP 1024px+
=========================== */
@media (min-width: 1024px) {
  .mobile-only {
    display: none !important;
  }
  .desktop-only {
    display: block;
  }

  .sidebar-slot {
    display: flex;
  }

  .scroll-body {
    padding: 32px 32px 40px;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: 320px 1fr;
    grid-template-rows: auto auto;
    gap: 24px;
    align-items: start;
  }

  .profile-card {
    grid-column: 1;
    grid-row: 1 / 3;
  }
  .upgrade-banner {
    grid-column: 2;
    grid-row: 1;
  }
  .stats-section {
    grid-column: 2;
    grid-row: 2;
  }

  .stat-cards {
    flex-direction: row;
    flex-wrap: nowrap;
  }
  .stat-card {
    flex: 1;
    min-width: 0;
  }
}

/* ===========================
   RESPONSIVE — WIDE 1280px+
=========================== */
@media (min-width: 1280px) {
  .dashboard-grid {
    grid-template-columns: 360px 1fr;
    gap: 28px;
  }
}
</style>