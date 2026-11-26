<template>
  <nav class="bottom-nav">
    <button
      v-for="item in navItems"
      :key="item.key"
      class="nav-item"
      :class="{ active: activeNav === item.key, 'nav-center': item.center }"
      @click="$emit('navigate', item.key)"
    >
      <!-- Tombol tengah (Menu) -->
      <template v-if="item.center">
        <span class="nav-center-circle">
          <span class="nav-icon" v-html="item.svg"></span>
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
defineProps({
  activeNav: { type: String, default: "menu" },
});
defineEmits(["navigate"]);

const navItems = [
  {
    key: "setting",
    label: "Setting",
    svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  },
  {
    key: "preview",
    label: "Preview",
    svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  },
  {
    key: "menu",
    label: "Menu",
    center: true,
    svg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="5" y1="8" x2="19" y2="8"/><line x1="5" y1="12" x2="19" y2="12"/><line x1="5" y1="16" x2="19" y2="16"/></svg>`,
  },
  {
    key: "kirim",
    label: "Kirim",
    svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  },
  {
    key: "music",
    label: "Music",
    svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  },
];
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
  z-index: 100;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.07);
  overflow: visible;
}

/* Sembunyikan di desktop, tampil hanya di mobile */
@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
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
.nav-item:hover {
  color: #1a2e45;
}
.nav-item.active {
  color: #7ecec4;
}
.nav-item.active .nav-icon svg {
  stroke: #7ecec4;
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

/* ===== Tombol Menu (tengah) ===== */
.nav-item.nav-center {
  position: relative;
  top: -38px;
  margin-bottom: -32px;
  color: #1a2e45;
}

.nav-center-circle {
  width: 56px;
  height: 56px;
  background: #1a2e45;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 -2px 16px rgba(26, 46, 69, 0.3);
  border: 3px solid #fff;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.nav-item.nav-center:hover .nav-center-circle {
  transform: scale(1.07);
  box-shadow: 0 -2px 24px rgba(26, 46, 69, 0.45);
}
.nav-item.nav-center.active .nav-center-circle {
  background: #7ecec4;
  box-shadow: 0 -2px 16px rgba(126, 206, 196, 0.5);
}
.nav-item.nav-center .nav-center-circle svg {
  stroke: #fff;
}

.nav-item.nav-center .nav-label {
  color: #1a2e45;
  font-weight: 700;
  margin-top: 6px;
}
.nav-item.nav-center.active .nav-label {
  color: #7ecec4;
}
</style>