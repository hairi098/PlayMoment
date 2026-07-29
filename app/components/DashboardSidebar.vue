<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <img src="/playmoment/logo-white.png" alt="PlayMoment Logo" class="logo-img" />
      <span class="logo-text">
        <span class="logo-dark">Play</span><span class="logo-accent">Moment</span>
      </span>
    </div>

    <div class="sidebar-user">
      <div class="user-avatar user-avatar-initials">
        {{ getInitials(user?.name) }}
      </div>
      <div class="user-info">
        <p class="user-greeting">Halo, {{ user?.name || "Nama User" }}</p>
        <span class="user-paket">{{ user?.paket || "Nama Paket" }}</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <NuxtLink to="/dashboard" class="nav-item">
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
      <NuxtLink to="/undangan" class="nav-item">
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
        Undangan
      </NuxtLink>
      <NuxtLink to="/invoices" class="nav-item">
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
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        Invoice
      </NuxtLink>
      <NuxtLink to="/bantuan" class="nav-item">
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
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
          />
        </svg>
        Bantuan
      </NuxtLink>
      <NuxtLink to="/tutorial" class="nav-item">
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
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Tutorial
      </NuxtLink>
      <NuxtLink to="/pengaturan" class="nav-item">
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
      <button class="btn-buat" @click="navigateTo('/tema')">
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
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Buat Undangan
      </button>
      <button
        class="btn-logout"
        @click="
          accountStore.logout();
          navigateTo('/login');
        "
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
  </aside>
</template>

<script setup>
import { useAccountStore } from "~/stores/useAccountStore";

defineProps({ user: Object });

const accountStore = useAccountStore();

function getInitials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
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
  gap: 8px;
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
.user-avatar-initials {
  background: linear-gradient(135deg, #7ecec4, #2a9d8f);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: default;
  user-select: none;
}
.user-greeting {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px;
}
.user-paket {
  font-size: 10px;
  font-weight: 700;
  color: #7ecec4;
  background: rgba(126, 206, 196, 0.15);
  padding: 3px 8px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
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
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-buat {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #7ecec4;
  color: #1a2e45;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
}
.btn-buat:hover {
  background: #6abfb4;
}

.btn-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
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
  color: #fff;
}
</style>
