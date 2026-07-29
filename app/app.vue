<template>
  <div>
    <NuxtLayout>
      <ClientOnly v-if="showNav">
        <NavbarDesktop
          v-if="isDesktop"
          @login="handleLogin"
          @daftar="handleDaftar"
        />
        <NavbarMobile v-else @login="handleLogin" @daftar="handleDaftar" />
        <template #fallback>
          <div
            style="
              height: 64px;
              background: #fff;
              border-bottom: 1px solid #edf2f7;
            "
          />
        </template>
      </ClientOnly>

      <!-- ===== KONTEN HALAMAN ===== -->
      <NuxtPage />

      <!-- ===== FOOTER — disembunyikan di halaman login & daftar ===== -->
      <AppFooter v-if="showFooter" />

      <!-- ===== FLOATING WHATSAPP ===== -->
      <FloatingWhatsapp v-if="showNav" />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import NavbarDesktop from "~/components/NavbarDesktop.vue";
import NavbarMobile from "~/components/NavbarMobile.vue";
import AppFooter from "~/components/AppFooter.vue";
import FloatingWhatsapp from "~/components/FloatingWhatsapp.vue";
import { useAccountStore } from "~/stores/useAccountStore";

const accountStore = useAccountStore();
const route = useRoute();

const SESSION_MAX_DAYS = 7;
const checkSessionExpiry = () => {
  const user = accountStore.currentUser;
  if (!user) return;
  const loginTime = user.loginAt ? new Date(user.loginAt) : null;
  if (!loginTime) { accountStore.logout(); return; }
  const diffMs = Date.now() - loginTime.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays >= SESSION_MAX_DAYS) {
    accountStore.logout();
    navigateTo("/login");
  }
};

onMounted(async () => {
  checkSessionExpiry();
  const isPreviewRoute = route.path.startsWith("/preview");
  if (!isPreviewRoute) {
    await accountStore.loadAll(true);
    // Validasi: kalau customer sudah tidak ada di DB, paksa logout
    const user = accountStore.currentUser;
    if (user?.role === 'customer') {
      const found = accountStore.getCustomerByEmail(user.email);
      if (!found) {
        accountStore.logout();
        navigateTo('/login');
      }
    }
  }
});

// ===== HALAMAN YANG MENYEMBUNYIKAN NAV & FOOTER =====
const hiddenRoutes = [
  "/login",
  "/dashboard",
  "/undangan",
  "/invoices",
  "/bantuan",
  "/profil",
  "/pengaturan",
  "/tutorial",
  "/tutorial-detail",
  "/checkout",
  "/invoice",
  "/thankyou",
  "/atur-undangan",
  "/edit-undangan",
  "/preview",
  "/preview-tema",
  "/admin",
];

const isHiddenRoute = computed(() => {
  return hiddenRoutes.some((path) => route.path.startsWith(path));
});

const showNav = computed(() => !isHiddenRoute.value);
const showFooter = computed(() => !isHiddenRoute.value);

// ===== RESPONSIVE NAVBAR =====
const isDesktop = ref(true);

const checkBreakpoint = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

onMounted(() => {
  checkBreakpoint();
  window.addEventListener("resize", checkBreakpoint);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkBreakpoint);
});


// ===== NAVIGASI =====
const handleLogin = () => navigateTo("/login");
</script>
