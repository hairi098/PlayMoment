<template>
  <nav class="navbar-desktop">
    <div class="nav-inner">
      <NuxtLink to="/" class="nav-logo">
        <img src="/playmoment/logo-teal.png" alt="PlayMoment Logo" class="logo-img" />
        <span class="logo-text">
          <span class="logo-dark">Play</span><span class="logo-accent">Moment</span>
        </span>
      </NuxtLink>

      <div class="nav-links">
        <NuxtLink to="/" class="nav-link">Beranda</NuxtLink>
        <NuxtLink to="/fitur" class="nav-link">Fitur</NuxtLink>
        <NuxtLink to="/tema" class="nav-link">Tema</NuxtLink>
        <NuxtLink to="/paket" class="nav-link">Paket</NuxtLink>
        <NuxtLink to="/tentang" class="nav-link">Tentang</NuxtLink>
      </div>

      <div class="nav-actions">
        <button class="btn-login" @click="$emit('login')">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            width="15"
            height="15"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Login
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineEmits(["login", "daftar"]);
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.navbar-desktop {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #fff;
  border-bottom: 1px solid #edf2f7;
  font-family: Arial, sans-serif;
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 800 !important;
  letter-spacing: -0.5px;
  text-decoration: none;
  user-select: none;
}

.logo-img {
  height: 28px;
  width: auto;
}

.logo-dark,
.logo-accent {
  font-weight: 800 !important;
}

.logo-dark {
  color: #1a2e45;
  font-weight: 800;
}

.logo-accent {
  color: #7ecec4;
  font-weight: 800;
}

.nav-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
}

.nav-link {
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  text-decoration: none;
  transition:
    color 0.2s,
    background 0.2s;
}
.nav-link:hover {
  color: #1a2e45;
  background: #f0f7f6;
}
.nav-link.router-link-active {
  color: #1a2e45;
  font-weight: 700;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.btn-login {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  border-radius: 10px;
  border: none;
  background: #1a2e45;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
}
.btn-login:hover {
  background: #243d5c;
}
</style>
