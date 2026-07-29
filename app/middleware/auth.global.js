import { useAccountStore } from "~/stores/useAccountStore";
import {
  isAdminRoute,
  isCustomerProtectedRoute,
  isAdminLoggedIn,
  isCustomerLoggedIn
} from "~/utils/auth-routes";

export default defineNuxtRouteMiddleware((to) => {
  // Session disimpan di localStorage (pinia persist) — cek hanya di client
  if (import.meta.server) return;

  const accountStore = useAccountStore();
  const path = to.path;

  if (isAdminRoute(path)) {
    if (isAdminLoggedIn(accountStore.currentUser)) return;

    throw createError({
      statusCode: 403,
      statusMessage: "Akses Admin Ditolak",
      message:
        "Halaman admin hanya dapat diakses setelah Anda login sebagai administrator.",
      data: {
        authType: "admin",
        loginUrl: "/login",
        redirect: to.fullPath
      }
    });
  }

  if (isCustomerProtectedRoute(path)) {
    if (
      isCustomerLoggedIn(accountStore.currentUser) ||
      isAdminLoggedIn(accountStore.currentUser)
    ) {
      return;
    }

    throw createError({
      statusCode: 401,
      statusMessage: "Login Diperlukan",
      message: "Silakan login terlebih dahulu untuk mengakses halaman customer.",
      data: {
        authType: "customer",
        loginUrl: "/login",
        redirect: to.fullPath
      }
    });
  }
});
