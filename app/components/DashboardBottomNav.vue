<template>
  <nav class="bottom-nav">
    <button
      v-for="(item, i) in navItems"
      :key="i"
      class="nav-item"
      :class="{ active: isActive(item.route), 'nav-center': item.center }"
      @click="handleNav(item)"
    >
      <!-- Tombol tengah (Buat) -->
      <template v-if="item.center">
        <span class="nav-center-circle">
          <span v-html="item.svg"></span>
        </span>
        <span class="nav-label">{{ item.label }}</span>
      </template>

      <!-- Item biasa -->
      <template v-else>
        <span class="nav-icon" v-html="item.svg"></span>
        <span class="nav-label">{{ item.label }}</span>
      </template>
    </button>
  </nav>
</template>

<script setup>
import { computed } from "vue";

const route = useRoute();

const navItems = [
  {
    label: "Dashboard",
    route: "/dashboard",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>`,
  },
  {
    label: "Undangan",
    route: "/undangan",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
      <path d="M22 6l-10 7L2 6"/>
      <path d="M2 6l6 6M22 6l-6 6"/>
    </svg>`,
  },
  {
    label: "Buat",
    center: true,
    route: "/tema",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="28" height="28">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>`,
  },
  {
    label: "Invoice",
    route: "/invoices",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="15" y2="17"/>
      <line x1="9" y1="9" x2="11" y2="9"/>
    </svg>`,
  },
  {
    label: "Bantuan",
    route: "/bantuan",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>`,
  },
];

const isActive = (itemRoute) => route.path.startsWith(itemRoute);

const handleNav = (item) => {
  navigateTo(item.route);
};
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #edf2f7;
  display: flex;
  align-items: flex-end;
  padding: 6px 0 14px;
  z-index: 200;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.07);
  overflow: visible;
}

/* ===== Item biasa ===== */
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 4px 0;
  transition: color 0.2s;
  font-family: inherit;
}
.nav-item.active {
  color: #1a2e45;
}
.nav-item.active .nav-icon svg {
  stroke: #1a2e45;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-label {
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
}

/* ===== Tombol Buat (tengah) ===== */
.nav-item.nav-center {
  position: relative;
  top: -38px;
  margin-bottom: -32px;
}

.nav-center-circle {
  width: 56px;
  height: 56px;
  background: #7ecec4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a2e45;
  box-shadow: 0 -2px 16px rgba(126, 206, 196, 0.45);
  border: 3px solid #fff;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.nav-item.nav-center:hover .nav-center-circle {
  transform: scale(1.07);
  box-shadow: 0 -2px 24px rgba(126, 206, 196, 0.65);
}

.nav-item.nav-center .nav-label {
  color: #1a2e45;
  font-weight: 700;
  margin-top: 6px;
}
</style>
