<template>
  <div class="al-root" :class="{ 'al-sidebar-open': sidebarOpen }" @click="closeAll">
    <!-- ══ OVERLAY mobile ══ -->
    <Transition name="al-overlay">
      <div v-if="sidebarOpen" class="al-overlay" @click.stop="sidebarOpen = false" />
    </Transition>

    <!-- ══ SIDEBAR ══ -->
    <aside class="al-sidebar" @click.stop>
      <!-- Brand -->
      <div class="al-brand">
        <img src="/playmoment/logo-white.png" alt="PlayMoment" class="al-logo" />
        <span class="al-brand-text">
          <span class="al-brand-play">Play</span><span class="al-brand-moment">Moment</span>
        </span>
        <span class="al-admin-tag">Admin</span>
        <!-- Close button mobile -->
        <button class="al-sidebar-close" aria-label="Tutup sidebar" @click="sidebarOpen = false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- User Info -->
      <div class="al-user">
        <div class="al-user-avatar">{{ userInitial }}</div>
        <div class="al-user-info">
          <p class="al-user-name">{{ currentUser?.name || 'Admin' }}</p>
          <span class="al-user-role">Super Admin</span>
        </div>
      </div>

      <!-- Nav -->
      <nav class="al-nav">
        <p class="al-nav-label">Menu Utama</p>
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="al-nav-item" @click="sidebarOpen = false">
          <span class="al-nav-icon" v-html="item.icon" />
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="al-nav-badge">{{ item.badge }}</span>
        </NuxtLink>
      </nav>

      <!-- Logout -->
      <div class="al-sidebar-footer">
        <button class="al-logout" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- ══ MAIN AREA ══ -->
    <div class="al-main">
      <!-- Topbar -->
      <header class="al-topbar">
        <!-- Hamburger -->
        <button class="al-hamburger" aria-label="Buka menu" @click.stop="sidebarOpen = !sidebarOpen">
          <span /><span /><span />
        </button>

        <!-- Page title slot -->
        <div class="al-topbar-title">
          <slot name="title">
            <h1 class="al-page-title">{{ pageTitle }}</h1>
          </slot>
        </div>

        <!-- Actions slot (tombol tambah, search, dll) -->
        <div class="al-topbar-actions">
          <slot name="actions" />

          <!-- Profile dropdown -->
          <div class="al-profile-wrap" @click.stop="profileOpen = !profileOpen">
            <button class="al-profile-btn" aria-label="Profil admin">
              <span class="al-profile-initial">{{ userInitial }}</span>
            </button>
            <Transition name="al-dropdown">
              <div v-if="profileOpen" class="al-profile-dropdown" @click.stop>
                <div class="al-pd-header">
                  <div class="al-pd-avatar">{{ userInitial }}</div>
                  <div>
                    <p class="al-pd-role">Super Admin</p>
                    <p class="al-pd-name">{{ currentUser?.name }}</p>
                    <p class="al-pd-email">{{ currentUser?.email }}</p>
                  </div>
                </div>
                <div class="al-pd-divider" />
                <button class="al-pd-logout" @click="handleLogout">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="al-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAccountStore } from "~/stores/useAccountStore";
import { useCustomerIdentity } from "~/composables/useCustomerIdentity";

const route = useRoute();
const accountStore = useAccountStore();
const { logoutAndRedirect } = useCustomerIdentity();

const sidebarOpen = ref(false);
const profileOpen = ref(false);

const currentUser = computed(() => accountStore.currentUser);
const userInitial = computed(() => {
  const name = currentUser.value?.name || "A";
  return name.charAt(0).toUpperCase();
});

const pageTitle = computed(() => {
  const map = {
    "/admin/dashboard": "Dashboard",
    "/admin/pesanan": "Kelola Pesanan",
    "/admin/customers": "Data Customer",
    "/admin/promo": "Kelola Promo",
    "/admin/buat-akun": "Buat Akun Customer",
    "/admin/asset": "Kelola Asset",
    "/admin/undangan": "Semua Undangan",
    "/admin/laporan": "Laporan",
    "/admin/pengaturan": "Pengaturan",
  };
  return map[route.path] || "Admin Panel";
});

const pendingCount = computed(() => accountStore.pendingOrders?.length || 0);

const navItems = computed(() => [
  {
    to: "/admin/dashboard", label: "Dashboard",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`,
  },
  {
    to: "/admin/pesanan", label: "Kelola Pesanan",
    badge: pendingCount.value || null,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  },
  {
    to: "/admin/customers", label: "Data Customer",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    to: "/admin/undangan", label: "Semua Undangan",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  },
  {
    to: "/admin/promo", label: "Kelola Promo",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  },
  {
    to: "/admin/buat-akun", label: "Buat Akun",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`,
  },
  {
    to: "/admin/asset", label: "Kelola Asset",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17h7M17.5 14v6"/></svg>`,
  },
  {
    to: "/admin/laporan", label: "Laporan",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  },
  {
    to: "/admin/pengaturan", label: "Pengaturan",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  },
]);

function closeAll() {
  profileOpen.value = false;
}

async function handleLogout() {
  await logoutAndRedirect("/login");
}
</script>

<style>
/* ── Admin Layout — Global (non-scoped agar slot konten bisa pakai) ── */
.al-root {
  display: flex;
  min-height: 100dvh;
  background: #f0f4f8;
  font-family: "Nunito", "Segoe UI", sans-serif;
  position: relative;
}

/* ── Overlay mobile ── */
.al-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 35, 0.45);
  z-index: 199;
  backdrop-filter: blur(2px);
}
.al-overlay-enter-active, .al-overlay-leave-active { transition: opacity 0.25s; }
.al-overlay-enter-from, .al-overlay-leave-to { opacity: 0; }

/* ══ SIDEBAR ══ */
.al-sidebar {
  width: 252px;
  min-width: 252px;
  background: #1a2e45;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100dvh;
  overflow-y: auto;
  z-index: 200;
  transition: transform 0.28s cubic-bezier(.4,0,.2,1);
  flex-shrink: 0;
}
.al-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 18px 16px 16px;
  border-bottom: 1px solid rgba(255,255,255,.07);
}
.al-logo { height: 26px; width: auto; }
.al-brand-text { font-size: 17px; font-weight: 800; letter-spacing: -.4px; }
.al-brand-play { color: #fff; }
.al-brand-moment { color: #7ecec4; }
.al-admin-tag {
  margin-left: auto;
  font-size: 9px; font-weight: 800; letter-spacing: .8px;
  background: rgba(126,206,196,.18); color: #7ecec4;
  border: 1px solid rgba(126,206,196,.25);
  padding: 3px 7px; border-radius: 6px; text-transform: uppercase;
}
.al-sidebar-close {
  display: none;
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,.5); padding: 4px; margin-left: 2px;
  border-radius: 6px;
}
.al-sidebar-close:hover { color: #fff; background: rgba(255,255,255,.08); }
</style>

<style>
/* ── User info ── */
.al-user {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,.07);
}
.al-user-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: linear-gradient(135deg, #7ecec4, #2a9d8f);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 800; color: #fff; flex-shrink: 0;
}
.al-user-name { font-size: 13px; font-weight: 700; color: #fff; margin: 0 0 3px; }
.al-user-role {
  font-size: 10px; font-weight: 700; color: #f6ad55;
  background: rgba(246,173,85,.15); padding: 2px 7px;
  border-radius: 20px; text-transform: uppercase; letter-spacing: .4px;
}

/* ── Nav ── */
.al-nav {
  flex: 1; padding: 10px 10px; display: flex;
  flex-direction: column; gap: 1px; overflow-y: auto;
}
.al-nav-label {
  font-size: 9px; font-weight: 800; color: rgba(255,255,255,.28);
  text-transform: uppercase; letter-spacing: 1px;
  padding: 10px 10px 4px; margin: 0;
}
.al-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 10px;
  font-size: 13.5px; font-weight: 600;
  color: rgba(255,255,255,.55); text-decoration: none;
  transition: background .18s, color .18s;
  position: relative;
}
.al-nav-item:hover { background: rgba(255,255,255,.07); color: #fff; }
.al-nav-item.router-link-active {
  background: rgba(126,206,196,.14);
  color: #7ecec4; font-weight: 700;
}
.al-nav-item.router-link-active .al-nav-icon { color: #7ecec4; }
.al-nav-icon { flex-shrink: 0; display: flex; }
.al-nav-badge {
  margin-left: auto;
  background: #ef4444; color: #fff;
  font-size: 10px; font-weight: 800;
  min-width: 18px; height: 18px;
  border-radius: 9px; display: flex; align-items: center;
  justify-content: center; padding: 0 5px;
}

/* ── Sidebar footer ── */
.al-sidebar-footer {
  padding: 12px 10px;
  border-top: 1px solid rgba(255,255,255,.07);
}
.al-logout {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 10px; border-radius: 10px;
  background: transparent; border: 1px solid rgba(255,255,255,.1);
  color: rgba(255,255,255,.4); font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit;
  transition: background .18s, color .18s;
}
.al-logout:hover { background: rgba(248,113,113,.1); color: #f87171; border-color: rgba(248,113,113,.3); }
</style>

<style>
/* ══ MAIN AREA ══ */
.al-main {
  flex: 1; display: flex; flex-direction: column;
  min-width: 0; overflow: hidden;
}

/* ── Topbar ── */
.al-topbar {
  display: flex; align-items: center; gap: 12px;
  padding: 0 20px; height: 60px;
  background: #fff;
  border-bottom: 1px solid #e8edf3;
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 1px 3px rgba(0,0,0,.04);
}
.al-hamburger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 6px;
  border-radius: 8px;
}
.al-hamburger span {
  display: block; width: 20px; height: 2px;
  background: #4a5568; border-radius: 2px;
  transition: background .2s;
}
.al-hamburger:hover span { background: #1a2e45; }
.al-topbar-title { flex: 1; min-width: 0; }
.al-page-title {
  font-size: 17px; font-weight: 800; color: #1a2e45;
  margin: 0; letter-spacing: -.3px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.al-topbar-actions {
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}

/* ── Profile button ── */
.al-profile-wrap { position: relative; }
.al-profile-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #7ecec4, #2a9d8f);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; color: #fff;
}
.al-profile-btn:hover { opacity: .88; }
.al-profile-initial { pointer-events: none; }

/* ── Profile dropdown ── */
.al-profile-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: #fff; border-radius: 14px; width: 220px;
  box-shadow: 0 8px 32px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.06);
  border: 1px solid #e8edf3; overflow: hidden; z-index: 300;
}
.al-pd-header { display: flex; align-items: center; gap: 10px; padding: 14px 16px; }
.al-pd-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #7ecec4, #2a9d8f);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; color: #fff; flex-shrink: 0;
}
.al-pd-role { font-size: 10px; font-weight: 700; color: #7ecec4; text-transform: uppercase; letter-spacing: .5px; margin: 0 0 2px; }
.al-pd-name { font-size: 13px; font-weight: 700; color: #1a2e45; margin: 0 0 1px; }
.al-pd-email { font-size: 11px; color: #9ca3af; margin: 0; }
.al-pd-divider { height: 1px; background: #f0f4f8; }
.al-pd-logout {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 12px 16px;
  background: none; border: none; cursor: pointer;
  font-size: 13px; font-weight: 600; color: #ef4444;
  font-family: inherit; transition: background .15s;
}
.al-pd-logout:hover { background: #fef2f2; }

.al-dropdown-enter-active, .al-dropdown-leave-active {
  transition: opacity .15s, transform .15s;
}
.al-dropdown-enter-from, .al-dropdown-leave-to {
  opacity: 0; transform: translateY(-6px);
}

/* ── Content ── */
.al-content {
  flex: 1; padding: 24px;
  overflow-y: auto; min-height: 0;
}

/* ══ RESPONSIVE ══ */
@media (max-width: 768px) {
  .al-sidebar {
    position: fixed; top: 0; left: 0; bottom: 0;
    transform: translateX(-100%);
  }
  .al-sidebar-open .al-sidebar { transform: translateX(0); }
  .al-sidebar-close { display: flex; }
  .al-admin-tag { display: none; }
  .al-hamburger { display: flex; }
  .al-content { padding: 16px; }
  .al-topbar { padding: 0 14px; }
}
</style>
