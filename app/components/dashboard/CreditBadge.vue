<template>
  <NuxtLink v-if="show" to="/paket" class="credit-badge" title="Credit untuk membuat undangan">
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#fbbf24" />
      <circle cx="12" cy="12" r="8.5" fill="#f59e0b" />
      <path d="M13 6.5 8.5 13h3l-1 4.5L15.5 11h-3z" fill="#fff7d6" />
    </svg>
    <span class="credit-num">{{ credits }}</span>
    <span class="credit-lbl">Credits</span>
  </NuxtLink>
</template>

<script setup>
import { computed } from "vue";
import { useAccountStore } from "~/stores/useAccountStore";

const accountStore = useAccountStore();
const user = computed(() => accountStore.currentUser);
const show = computed(() => user.value?.role === "customer");
const credits = computed(() => {
  const live = accountStore.customers.find(
    (c) => String(c.id) === String(user.value?.id),
  );
  return live?.credits ?? user.value?.credits ?? 0;
});
</script>

<style scoped>
.credit-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 16px 5px 6px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #fff;
  color: #1a2e45;
  text-decoration: none;
  flex-shrink: 0;
  transition: border-color 0.2s;
}
.credit-badge:hover { border-color: #f59e0b; }
.credit-num { font-size: 15px; font-weight: 800; }
.credit-lbl { font-size: 14px; color: #4b5563; }
@media (max-width: 480px) {
  .credit-lbl { display: none; }
  .credit-badge { padding-right: 12px; }
}
</style>
