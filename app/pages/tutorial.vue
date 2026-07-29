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
        <h1 class="topbar-title">Tutorial</h1>
        <p class="topbar-welcome desktop-only">Panduan lengkap penggunaan aplikasi</p>

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
              <button
                class="dropdown-item"
                @click.stop="navigateTo('/pengaturan')"
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
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  />
                </svg>
                Edit Profile
              </button>
              <button
                class="dropdown-item"
                @click.stop="navigateTo('/tutorial')"
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Tutorial
              </button>
              <div class="dropdown-divider"></div>
              <button
                class="dropdown-item dropdown-logout"
                @click.stop="logoutAndRedirect('/login')"
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

      <!-- SCROLL BODY -->
      <div class="scroll-body">
        <!-- HERO -->
        <div class="hero-banner">
          <div class="hero-left">
            <div class="hero-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7ecec4"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="28"
                height="28"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h2 class="hero-title">Pusat Tutorial</h2>
              <p class="hero-desc">
                Pilih topik yang ingin kamu pelajari. Setiap topik berisi
                panduan lengkap step-by-step.
              </p>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat">
              <span class="hero-stat-num">{{ topics.length }}</span>
              <span class="hero-stat-label">Topik</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hero-stat-num">{{ totalTutorials }}</span>
              <span class="hero-stat-label">Tutorial</span>
            </div>
          </div>
        </div>

        <!-- SEARCH -->
        <div class="search-wrap">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            width="16"
            height="16"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            class="search-input"
            v-model="searchQuery"
            placeholder="Cari topik tutorial..."
          />
          <button
            v-if="searchQuery"
            class="search-clear"
            @click="searchQuery = ''"
          >
            ✕
          </button>
        </div>

        <!-- TOPIC GRID -->
        <div class="topics-grid">
          <div
            v-for="topic in filteredTopics"
            :key="topic.id"
            class="topic-card"
            @click="navigateTo('/tutorial/' + topic.slug)"
          >
            <div class="topic-icon-wrap" :style="{ background: topic.bgColor }">
              <span v-html="topic.svg"></span>
            </div>
            <div class="topic-body">
              <div class="topic-top">
                <h3 class="topic-title">{{ topic.title }}</h3>
                <span v-if="topic.isNew" class="badge-new">Baru</span>
              </div>
              <p class="topic-desc">{{ topic.desc }}</p>
              <div class="topic-footer">
                <span class="topic-count">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="12"
                    height="12"
                  >
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  {{ topic.count }} tutorial
                </span>
                <span class="topic-duration">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="12"
                    height="12"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {{ topic.duration }}
                </span>
              </div>
            </div>
            <div class="topic-arrow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="16"
                height="16"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div v-if="filteredTopics.length === 0" class="empty-state">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d1d5db"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            width="48"
            height="48"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p>
            Topik "<strong>{{ searchQuery }}</strong
            >" tidak ditemukan.
          </p>
        </div>

        <!-- BANTUAN BANNER -->
        <div class="help-banner">
          <div class="help-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7ecec4"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              width="22"
              height="22"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              />
            </svg>
          </div>
          <div class="help-text">
            <p class="help-title">Masih bingung?</p>
            <p class="help-sub">
              Hubungi tim support kami, siap membantu 24/7.
            </p>
          </div>
          <button class="btn-bantuan" @click="navigateTo('/bantuan')">
            Hubungi Kami
          </button>
        </div>
      </div>

      <DashboardBottomNav class="mobile-only" />
    </div>

    <!-- MOBILE DRAWER -->
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
import { ref, computed } from "vue";
import DashboardSidebar from "~/components/DashboardSidebar.vue";
import DashboardBottomNav from "~/components/DashboardBottomNav.vue";
import { useCustomerIdentity } from "~/composables/useCustomerIdentity";

const drawerOpen = ref(false);
const dropdownOpen = ref(false);
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};
const closeDropdown = () => {
  dropdownOpen.value = false;
};
const searchQuery = ref("");

const { user, logoutAndRedirect } = useCustomerIdentity();

function getInitials(name) {
  if (!name) return "?";
  return String(name).trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

const topics = ref([
  {
    id: 1,
    slug: "memulai",
    title: "Memulai / Onboarding",
    desc: "Daftar akun, login pertama kali, dan kenali fitur-fitur utama aplikasi.",
    count: 4,
    duration: "10 menit",
    bgColor: "#e8f7f5",
    isNew: false,
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  },
  {
    id: 2,
    slug: "membuat-undangan",
    title: "Membuat Undangan",
    desc: "Cara membuat undangan digital dari nol hingga siap dibagikan ke tamu.",
    count: 5,
    duration: "15 menit",
    bgColor: "#eef2ff",
    isNew: false,
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  },
  {
    id: 3,
    slug: "kelola-tamu",
    title: "Kelola Tamu",
    desc: "Tambah, impor, kategorikan tamu, dan pantau status RSVP dengan mudah.",
    count: 5,
    duration: "12 menit",
    bgColor: "#fef3c7",
    isNew: false,
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    id: 4,
    slug: "kirim-undangan",
    title: "Kirim Undangan",
    desc: "Bagikan undangan via WhatsApp, link, atau QR code ke seluruh daftar tamu.",
    count: 4,
    duration: "8 menit",
    bgColor: "#f0fdf4",
    isNew: false,
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  },
  {
    id: 5,
    slug: "desain-kustomisasi",
    title: "Desain & Kustomisasi",
    desc: "Ubah template, warna, font, foto, musik latar, dan animasi undangan.",
    count: 7,
    duration: "20 menit",
    bgColor: "#fdf4ff",
    isNew: false,
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  },
  {
    id: 6,
    slug: "paket-pembayaran",
    title: "Paket & Pembayaran",
    desc: "Pilih paket yang sesuai, lakukan pembayaran, dan perpanjang masa aktif.",
    count: 3,
    duration: "6 menit",
    bgColor: "#fff7ed",
    isNew: false,
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  },
  {
    id: 7,
    slug: "akun-pengaturan",
    title: "Akun & Pengaturan",
    desc: "Kelola profil, keamanan akun, notifikasi, dan preferensi aplikasi.",
    count: 4,
    duration: "8 menit",
    bgColor: "#f0f9ff",
    isNew: false,
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  },
  {
    id: 8,
    slug: "integrasi",
    title: "Integrasi (RSVP, Maps, dll)",
    desc: "Aktifkan fitur RSVP, embed Google Maps, musik latar, dan galeri foto.",
    count: 6,
    duration: "15 menit",
    bgColor: "#fff1f2",
    isNew: true,
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  },
]);

const totalTutorials = computed(() =>
  topics.value.reduce((s, t) => s + t.count, 0),
);

const filteredTopics = computed(() => {
  if (!searchQuery.value.trim()) return topics.value;
  const q = searchQuery.value.toLowerCase();
  return topics.value.filter(
    (t) =>
      t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q),
  );
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.dashboard-layout {
  display: flex;
  min-height: 100vh;
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
  min-height: 100vh;
}

/* TOPBAR */
.topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #edf2f7;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
}
.topbar-welcome {
  position: absolute !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  flex: none !important;
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  pointer-events: none;
  text-align: center !important;
}
.topbar-menu {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 5px;
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
  font-size: 17px;
  font-weight: 900;
  color: #1a2e45;
  margin: 0;
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
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
.profile-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(26, 46, 69, 0.15);
  min-width: 220px;
  overflow: hidden;
  z-index: 200;
}
.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
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
  font-weight: 800;
  color: #7ecec4;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 1px;
}
.dropdown-name {
  font-size: 13px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 1px;
}
.dropdown-email {
  font-size: 11px;
  color: #6b7280;
  margin: 0;
}
.dropdown-divider {
  height: 1px;
  background: #f0f4f8;
  margin: 4px 0;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
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

/* SCROLL BODY */
.scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* HERO */
.hero-banner {
  background: linear-gradient(135deg, #1a2e45 0%, #243d5c 100%);
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.hero-left {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.hero-icon {
  width: 52px;
  height: 52px;
  background: rgba(126, 206, 196, 0.15);
  border: 1.5px solid rgba(126, 206, 196, 0.3);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.hero-title {
  font-size: 18px;
  font-weight: 900;
  color: #fff;
  margin: 0 0 4px;
}
.hero-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
  margin: 0;
  line-height: 1.5;
}
.hero-stats {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 12px 0;
}
.hero-stat {
  flex: 1;
  text-align: center;
}
.hero-stat-num {
  display: block;
  font-size: 22px;
  font-weight: 900;
  color: #7ecec4;
}
.hero-stat-label {
  display: block;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
  margin-top: 2px;
}
.hero-stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
}

/* SEARCH */
.search-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1.5px solid #e2f4f2;
  border-radius: 12px;
  padding: 10px 14px;
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: #1a2e45;
  font-family: inherit;
}
.search-input::placeholder {
  color: #9ca3af;
  font-weight: 500;
}
.search-clear {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #9ca3af;
  padding: 0;
  transition: color 0.15s;
}
.search-clear:hover {
  color: #1a2e45;
}

/* TOPIC GRID */
.topics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.topic-card {
  background: #fff;
  border: 1.5px solid #e8f0f7;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    transform 0.2s,
    border-color 0.2s;
}
.topic-card:hover {
  box-shadow: 0 6px 24px rgba(26, 46, 69, 0.1);
  transform: translateY(-2px);
  border-color: #7ecec4;
}
.topic-icon-wrap {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.topic-body {
  flex: 1;
  min-width: 0;
}
.topic-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.topic-title {
  font-size: 14px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0;
}
.badge-new {
  font-size: 10px;
  font-weight: 800;
  color: #e11d48;
  background: #fff1f2;
  border-radius: 20px;
  padding: 2px 8px;
  flex-shrink: 0;
  letter-spacing: 0.3px;
}
.topic-desc {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  margin: 0 0 10px;
  line-height: 1.5;
}
.topic-footer {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.topic-count,
.topic-duration {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
}
.topic-arrow {
  color: #d1d5db;
  flex-shrink: 0;
  margin-top: 2px;
  transition: color 0.2s;
}
.topic-card:hover .topic-arrow {
  color: #7ecec4;
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* HELP BANNER */
.help-banner {
  background: #f8fffe;
  border: 1.5px solid #e2f4f2;
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.help-icon {
  width: 44px;
  height: 44px;
  background: #e8f7f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.help-text {
  flex: 1;
}
.help-title {
  font-size: 13px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 2px;
}
.help-sub {
  font-size: 11px;
  color: #6b7280;
  margin: 0;
}
.btn-bantuan {
  padding: 9px 18px;
  background: #1a2e45;
  border: none;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  color: #7ecec4;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
  flex-shrink: 0;
  white-space: nowrap;
}
.btn-bantuan:hover {
  background: #243d5c;
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

.mobile-only {
  display: flex;
}
.desktop-only {
  display: none;
}

@media (min-width: 640px) {
  .scroll-body {
    padding: 24px 24px 100px;
  }
  .topics-grid {
    grid-template-columns: 1fr 1fr;
  }
}
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
  .hero-banner {
    flex-direction: row;
    align-items: center;
  }
  .hero-left {
    flex: 1;
  }
  .hero-stats {
    width: 260px;
    flex-shrink: 0;
  }
}
@media (min-width: 1280px) {
  .topics-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>