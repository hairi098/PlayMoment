<template>
  <div class="dashboard-layout" @click="closeDropdown">
    <!-- ===== SIDEBAR (desktop only) ===== -->
    <DashboardSidebar class="sidebar-slot" :user="user" />

    <!-- ===== MAIN AREA ===== -->
    <div class="main-area">
      <!-- ===== TOPBAR ===== -->
      <header class="topbar">
        <button
          class="topbar-menu mobile-only"
          aria-label="Menu"
          @click.stop="drawerOpen = !drawerOpen"
        >
          <span></span><span></span><span></span>
        </button>
        <h1 class="topbar-title">Bantuan</h1>
        <p class="topbar-welcome desktop-only">
          Hubungi admin jika Anda butuh bantuan
        </p>

        <!-- Avatar + Dropdown -->
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
        <!-- ===== HERO CARD ===== -->
        <div class="hero-card">
          <div class="hero-icon-wrap">
            <svg viewBox="0 0 24 24" fill="#16a34a" width="36" height="36">
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
              />
              <path
                d="M12.004 2C6.477 2 2.004 6.473 2.004 12c0 1.989.579 3.842 1.580 5.404L2 22l4.733-1.557C8.158 21.412 10.038 22 12.004 22 17.531 22 22 17.527 22 12c0-5.52-4.469-10-9.996-10z"
              />
            </svg>
          </div>
          <div class="hero-text">
            <p class="hero-title">Butuh bantuan?</p>
            <p class="hero-sub">Admin kami siap membantu Anda setiap saat</p>
          </div>
        </div>

        <!-- ===== TOPIC BUTTONS ===== -->
        <div class="topic-section">
          <p class="topic-label">Pilih topik bantuan</p>
          <div class="topic-grid">
            <button
              v-for="(topic, i) in topics"
              :key="i"
              class="topic-btn"
              @click="openWA(topic.message)"
            >
              <div class="topic-icon" :style="{ background: topic.bg }">
                <span v-html="topic.svg"></span>
              </div>
              <span class="topic-name">{{ topic.label }}</span>
              <svg
                class="topic-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="14"
                height="14"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ===== CTA UTAMA ===== -->
        <a :href="waLink()" target="_blank" class="btn-wa-main">
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
            />
            <path
              d="M12.004 2C6.477 2 2.004 6.473 2.004 12c0 1.989.579 3.842 1.580 5.404L2 22l4.733-1.557C8.158 21.412 10.038 22 12.004 22 17.531 22 22 17.527 22 12c0-5.52-4.469-10-9.996-10z"
            />
          </svg>
          Chat dengan Admin WhatsApp
        </a>

        <!-- ===== INFO JAM OPERASIONAL ===== -->
        <div class="info-card">
          <div class="info-row">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7ecec4"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              width="16"
              height="16"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <p class="info-text">
              Jam operasional:
              <strong>Senin – Minggu, 08.00 – 21.00 WIB</strong>
            </p>
          </div>
          <div class="info-row">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7ecec4"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              width="16"
              height="16"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p class="info-text">
              Rata-rata respon dalam <strong>kurang dari 1 jam</strong>
            </p>
          </div>
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
import { ref } from "vue";
import DashboardSidebar from "~/components/DashboardSidebar.vue";
import DashboardBottomNav from "~/components/DashboardBottomNav.vue";
import { useCustomerIdentity } from "~/composables/useCustomerIdentity";

// ===== GANTI DENGAN NOMOR WA ADMIN =====
const ADMIN_WA = "6281234567890"; // format: 62xxxxxxxxxx

const drawerOpen = ref(false);
const dropdownOpen = ref(false);
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};
const closeDropdown = () => {
  dropdownOpen.value = false;
};

const handleEditProfile = () => {
  closeDropdown();
  navigateTo("/pengaturan");
};
const handleTutorial = () => {
  closeDropdown();
  navigateTo("/tutorial");
};
const handleLogout = () => {
  closeDropdown();
  return logoutAndRedirect("/login");
};

const { user, logoutAndRedirect } = useCustomerIdentity();

function getInitials(name) {
  if (!name) return "?";
  return String(name).trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

// ===== WA HELPERS =====
const waLink = (msg = "Halo Admin, saya butuh bantuan.") =>
  `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`;

const openWA = (msg) => window.open(waLink(msg), "_blank");

// ===== TOPIC BUTTONS =====
const topics = [
  {
    label: "Buat Undangan",
    message: "Halo Admin, saya butuh bantuan untuk membuat undangan digital.",
    bg: "#e8f7f5",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3,5 12,13 21,5"/></svg>`,
  },
  {
    label: "Kelola Tamu",
    message:
      "Halo Admin, saya butuh bantuan untuk mengelola daftar tamu undangan.",
    bg: "#ede9fe",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    label: "Paket & Harga",
    message:
      "Halo Admin, saya ingin bertanya mengenai paket dan harga yang tersedia.",
    bg: "#fef3c7",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  },
  {
    label: "Pembayaran",
    message: "Halo Admin, saya ada kendala terkait pembayaran.",
    bg: "#dbeafe",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  },
  {
    label: "Kendala Teknis",
    message: "Halo Admin, saya mengalami kendala teknis pada aplikasi.",
    bg: "#fee2e2",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  },
  {
    label: "Lainnya",
    message: "Halo Admin, saya ingin bertanya sesuatu.",
    bg: "#f0f7f6",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
];
</script>

<style scoped>
/* ===== BASE / MOBILE FIRST ===== */
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

/* ===== TOPBAR ===== */
.topbar {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  background: #fff;
  border-bottom: 1px solid #edf2f7;
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 10px;
  min-height: 56px;
  box-sizing: border-box;
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
  /* larger tap target on mobile */
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.topbar-welcome {
  flex: 1;
  font-size: 14px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}
.topbar-avatar {
  width: 40px;
  height: 40px;
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
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.5px;
  user-select: none;
  line-height: 1;
}

/* ===== DROPDOWN ===== */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  /* Clamp: never wider than 90vw, never narrower than 200px */
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
  /* comfortable tap target */
  min-height: 44px;
  box-sizing: border-box;
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
  transition: opacity 0.15s, transform 0.15s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ===== SCROLL BODY ===== */
.scroll-body {
  flex: 1;
  /* bottom padding = bottom-nav height + breathing room */
  padding: 16px 12px 90px;
  overflow-y: auto;
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
}

/* ===== HERO CARD ===== */
.hero-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(26, 46, 69, 0.07);
  border: 1.5px solid #e2f4f2;
  border-left: 5px solid #7ecec4;
  box-sizing: border-box;
}
.hero-icon-wrap {
  width: 52px;
  height: 52px;
  background: #dcfce7;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.hero-text {
  min-width: 0; /* allow text to shrink */
}
.hero-title {
  font-size: 16px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 4px;
}
.hero-sub {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

/* ===== TOPIC SECTION ===== */
.topic-section {
  margin-bottom: 16px;
}
.topic-label {
  font-size: 11px;
  font-weight: 800;
  color: #1a2e45;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0 0 10px;
}
.topic-grid {
  display: grid;
  /* 1 column on very small screens */
  grid-template-columns: 1fr;
  gap: 8px;
}
.topic-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 1.5px solid #e2f4f2;
  border-radius: 14px;
  padding: 12px 14px;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: box-shadow 0.18s, transform 0.18s, border-color 0.18s;
  width: 100%;
  box-sizing: border-box;
  /* tap-friendly */
  min-height: 56px;
}
.topic-btn:active {
  transform: scale(0.98);
}
.topic-btn:hover {
  box-shadow: 0 4px 14px rgba(26, 46, 69, 0.1);
  transform: translateY(-1px);
  border-color: #7ecec4;
}
.topic-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.topic-name {
  flex: 1;
  font-size: 13px;
  font-weight: 700;
  color: #1a2e45;
  min-width: 0;
}
.topic-arrow {
  flex-shrink: 0;
}

/* ===== CTA WA ===== */
.btn-wa-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 15px 16px;
  background: #16a34a;
  color: #fff;
  border-radius: 14px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 800;
  font-family: inherit;
  box-shadow: 0 4px 16px rgba(22, 163, 74, 0.3);
  transition: background 0.2s, transform 0.18s, box-shadow 0.18s;
  margin-bottom: 14px;
  box-sizing: border-box;
  /* comfortable tap height */
  min-height: 52px;
}
.btn-wa-main:active {
  transform: scale(0.98);
}
.btn-wa-main:hover {
  background: #15803d;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(22, 163, 74, 0.35);
}

/* ===== INFO CARD ===== */
.info-card {
  background: #f8fffe;
  border: 1.5px solid #e2f4f2;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
}
.info-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.info-row svg {
  flex-shrink: 0;
  margin-top: 1px;
}
.info-text {
  font-size: 12px;
  color: #4b5563;
  margin: 0;
  line-height: 1.6;
}
.info-text strong {
  color: #1a2e45;
}

/* ===== DRAWER ===== */
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
  width: min(260px, 80vw);
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
.drawer :deep(.sidebar) {
  width: 100% !important;
  min-width: 0 !important;
  height: 100% !important;
  min-height: 100% !important;
  position: relative !important;
  top: auto !important;
  box-sizing: border-box;
}

/* ===== VISIBILITY HELPERS ===== */
.mobile-only {
  display: flex;
}
.desktop-only {
  display: none;
}

/* ===== BREAKPOINT: small phone (360–479px) ===== */
@media (min-width: 360px) {
  .topbar {
    padding: 12px 16px;
  }
  .scroll-body {
    padding: 16px 14px 90px;
  }
  .hero-card {
    padding: 18px;
  }
}

/* ===== BREAKPOINT: large phone / small tablet (480–639px) ===== */
@media (min-width: 480px) {
  .topbar-title {
    font-size: 19px;
  }
  .scroll-body {
    padding: 18px 18px 90px;
  }
  .topic-grid {
    grid-template-columns: 1fr 1fr;
  }
  .hero-icon-wrap {
    width: 56px;
    height: 56px;
  }
  .hero-title {
    font-size: 17px;
  }
  .hero-sub {
    font-size: 13px;
  }
  .btn-wa-main {
    font-size: 15px;
  }
}

/* ===== BREAKPOINT: tablet (640–1023px) ===== */
@media (min-width: 640px) {
  .topbar {
    padding: 14px 24px;
    min-height: 62px;
  }
  .topbar-title {
    font-size: 20px;
  }
  .scroll-body {
    padding: 24px 24px 90px;
    max-width: 720px;
  }
  .hero-card {
    padding: 22px 24px;
    border-radius: 18px;
    gap: 18px;
  }
  .hero-icon-wrap {
    width: 60px;
    height: 60px;
    border-radius: 16px;
  }
  .hero-title {
    font-size: 18px;
  }
  .btn-wa-main {
    font-size: 15px;
    padding: 16px;
  }
  .info-card {
    padding: 16px 20px;
  }
  .info-text {
    font-size: 13px;
  }
}

/* ===== BREAKPOINT: desktop (1024px+) ===== */
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
  .topbar {
    padding: 16px 32px;
  }
  .scroll-body {
    padding: 32px 40px 48px;
    max-width: 800px;
  }
  .hero-card {
    padding: 24px 28px;
  }
  .hero-title {
    font-size: 19px;
  }
  .topic-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
  .topic-btn {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 18px 16px;
    min-height: 90px;
  }
  .topic-arrow {
    display: none;
  }
  .topic-name {
    font-size: 13px;
  }
  .btn-wa-main {
    font-size: 16px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
}

/* ===== BREAKPOINT: wide desktop (1280px+) ===== */
@media (min-width: 1280px) {
  .scroll-body {
    padding: 36px 48px 56px;
    max-width: 900px;
  }
  .hero-title {
    font-size: 20px;
  }
}
</style>