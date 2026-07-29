<template>
  <!-- Top Bar with Hamburger -->
  <nav class="topbar">
    <div class="topbar-container">
      <NuxtLink to="/" class="logo">
        <img src="/playmoment/logo-teal.png" alt="PlayMoment Logo" class="logo-img" />
        <span class="logo-text">
          <span class="logo-dark">Play</span><span class="logo-accent">Moment</span>
        </span>
      </NuxtLink>
      <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Menu">
        <svg
          v-if="!menuOpen"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1a2e45"
          stroke-width="2"
          stroke-linecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <svg
          v-else
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1a2e45"
          stroke-width="2"
          stroke-linecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Dropdown Menu -->
    <Transition name="menu-slide">
      <div v-if="menuOpen" class="mobile-menu">
        <ul>
          <li><NuxtLink to="/" @click="menuOpen = false">Beranda</NuxtLink></li>
          <li>
            <NuxtLink to="/fitur" @click="menuOpen = false">Fitur</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/tema" @click="menuOpen = false">Tema</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/paket" @click="menuOpen = false">Paket</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/tentang" @click="menuOpen = false">Tentang</NuxtLink>
          </li>
        </ul>

        <!-- CTA Buttons -->
        <div class="menu-cta-group">
          <button
            class="btn-login-full"
            @click="
              menuOpen = false;
              emit('login');
            "
          >
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
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Login
          </button>
        </div>
      </div>
    </Transition>
  </nav>

  <!-- Mobile Bottom Nav -->
  <nav class="bottom-nav">
    <NuxtLink
      to="/"
      class="nav-item"
      active-class="active"
      exact-active-class="active"
    >
      <div class="nav-icon-wrap">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </div>
      <span class="nav-label">Beranda</span>
    </NuxtLink>

    <NuxtLink to="/fitur" class="nav-item" active-class="active">
      <div class="nav-icon-wrap">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
          />
        </svg>
      </div>
      <span class="nav-label">Fitur</span>
    </NuxtLink>

    <!-- Tema — center raised -->
    <NuxtLink to="/tema" class="nav-item nav-center" active-class="active">
      <div class="nav-icon-wrap center-circle">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h8v8H3zm0 10h8v8H3zm10-10h8v8h-8zm0 10h8v8h-8z" />
        </svg>
      </div>
      <span class="nav-label">Tema</span>
    </NuxtLink>

    <NuxtLink to="/paket" class="nav-item" active-class="active">
      <div class="nav-icon-wrap">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
          />
        </svg>
      </div>
      <span class="nav-label">Paket</span>
    </NuxtLink>

    <NuxtLink to="/tentang" class="nav-item" active-class="active">
      <div class="nav-icon-wrap">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
          />
        </svg>
      </div>
      <span class="nav-label">Tentang</span>
    </NuxtLink>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["login", "daftar"]);
const menuOpen = ref(false);
</script>

<style scoped>
/* ===== TOP BAR ===== */
.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #edf2f7;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  top: 0;
}

.topbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  text-decoration: none;
  user-select: none;
}
.logo-img {
  height: 24px;
  width: auto;
}
.logo-dark {
  color: #1a2e45;
}
.logo-accent {
  color: #7ecec4;
}

/* ===== HAMBURGER ===== */
.hamburger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.hamburger:hover {
  background: #f0f4f8;
}

/* ===== DROPDOWN MENU ===== */
.mobile-menu {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #edf2f7;
  padding: 8px 0 20px;
  z-index: 200;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.mobile-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mobile-menu li :deep(a) {
  display: block;
  padding: 13px 20px;
  font-size: 15px;
  font-weight: 500;
  color: #1a2e45;
  text-decoration: none;
  transition: background 0.15s;
  border-left: 3px solid transparent;
}
.mobile-menu li :deep(a:hover) {
  background: #f7fafc;
}
.mobile-menu li :deep(a.router-link-active) {
  color: #1a2e45;
  font-weight: 700;
  border-left-color: #7ecec4;
  background: #f0faf9;
}

/* ===== CTA BUTTONS ===== */
.menu-cta-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px 0;
}

.btn-login-full {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #1a2e45;
  background: transparent;
  border: 1.5px solid #d1dce8;
  border-radius: 10px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;
}
.btn-login-full:hover {
  border-color: #1a2e45;
  background: #f7fafc;
}

.btn-daftar-full {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background: #1a2e45;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-daftar-full:hover {
  background: #243d5c;
}

/* ===== TRANSITION ===== */
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: all 0.22s ease;
}
.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ===== BOTTOM NAV ===== */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #edf2f7;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding: 6px 0 10px;
  z-index: 180;
  overflow: visible;
  clip-path: none;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  text-decoration: none;
  color: #9ca3af;
  flex: 1;
  transition: color 0.2s;
}
.nav-item.active {
  color: #1a2e45;
}
.nav-item.active .nav-icon-wrap {
  background: #f0faf9;
}

.nav-icon-wrap {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: background 0.2s;
}

.nav-center {
  position: relative;
  top: -38px;
  margin-bottom: -32px;
  color: #1a2e45;
}

.center-circle {
  width: 56px;
  height: 56px;
  background: #d4ede9;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 -2px 16px rgba(126, 206, 196, 0.35);
  color: #1a2e45;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-label {
  font-size: 10px;
  font-weight: 500;
}
</style>
