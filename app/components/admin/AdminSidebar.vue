<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <img src="/playmoment/logo-white.png" alt="PlayMoment Logo" class="logo-img" />
      <span class="logo-text">
        <span class="logo-dark">Play</span><span class="logo-accent">Moment</span>
      </span>
    </div>

    <div class="sidebar-user">
      <div class="user-avatar">
        <svg viewBox="0 0 24 24" fill="#7ecec4" width="28" height="28">
          <path
            d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
          />
        </svg>
      </div>
      <div class="user-info">
        <p class="user-greeting">{{ user?.name || "Admin" }} 👋</p>
      </div>
    </div>

    <nav class="sidebar-nav">
      <p class="nav-section-label">Menu Utama</p>

      <NuxtLink to="/admin/dashboard" class="nav-item">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="18"
          height="18"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        Dashboard
      </NuxtLink>

      <NuxtLink to="/admin/pesanan" class="nav-item">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="18"
          height="18"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        Kelola Pesanan
      </NuxtLink>

      <p class="nav-section-label">Manajemen Akun</p>

      <NuxtLink to="/admin/customers" class="nav-item">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="18"
          height="18"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        Data Customer
      </NuxtLink>

      <NuxtLink to="/admin/promo" class="nav-item">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="18"
          height="18"
        >
          <path
            d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
          />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
        Kelola Promo
      </NuxtLink>

      <NuxtLink to="/admin/buat-akun" class="nav-item">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="18"
          height="18"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
        Buat Akun Customer
      </NuxtLink>

      <p class="nav-section-label">Lainnya</p>

      <NuxtLink to="/admin/asset" class="nav-item">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="18"
          height="18"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 17h7M17.5 14v6" />
        </svg>
        Kelola Asset
      </NuxtLink>

      <NuxtLink to="/admin/undangan" class="nav-item">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="18"
          height="18"
        >
          <path
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        Semua Undangan
      </NuxtLink>

      <NuxtLink to="/admin/laporan" class="nav-item">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="18"
          height="18"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        Laporan
      </NuxtLink>

      <NuxtLink to="/admin/pengaturan" class="nav-item">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="18"
          height="18"
        >
          <circle cx="12" cy="12" r="3" />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
          />
        </svg>
        Pengaturan
      </NuxtLink>
    </nav>

    <div class="sidebar-footer">
      <button class="btn-logout" @click="navigateTo('/login')">
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
  </aside>
</template>

<script setup>
defineProps({ user: Object });
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.sidebar {
  width: 240px;
  min-width: 240px;
  min-height: 100dvh;
  background: #1a2e45;
  display: flex;
  flex-direction: column;
  padding: 0;
  position: sticky;
  top: 0;
  font-family: "Nunito", "Segoe UI", sans-serif;
}

.sidebar-brand {
  padding: 20px 20px 16px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-img {
  height: 28px;
  width: auto;
}
.logo-dark {
  color: #fff;
}
.logo-accent {
  color: #7ecec4;
}
.admin-badge {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  background: rgba(126, 206, 196, 0.2);
  color: #7ecec4;
  padding: 3px 7px;
  border-radius: 6px;
  border: 1px solid rgba(126, 206, 196, 0.3);
  margin-left: auto;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(126, 206, 196, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-greeting {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px;
}
.user-role {
  font-size: 10px;
  font-weight: 700;
  color: #f6ad55;
  background: rgba(246, 173, 85, 0.15);
  padding: 3px 8px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-nav {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.nav-section-label {
  font-size: 10px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 12px 14px 4px;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition:
    background 0.2s,
    color 0.2s;
}
.nav-item:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #fff;
}
.nav-item.router-link-active {
  background: rgba(126, 206, 196, 0.15);
  color: #7ecec4;
  font-weight: 700;
}

.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.btn-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  width: 100%;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.2s,
    color 0.2s;
}
.btn-logout:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #f87171;
}
</style>
