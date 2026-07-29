import { computed } from "vue";
import { useAccountStore } from "~/stores/useAccountStore";
import { isAdminLoggedIn, isCustomerLoggedIn } from "~/utils/auth-routes";

export const useAuth = () => {
  const accountStore = useAccountStore();

  const isCustomer = computed(() =>
    isCustomerLoggedIn(accountStore.currentUser),
  );
  const isAdmin = computed(() => isAdminLoggedIn(accountStore.currentUser));

  // Sudah login = customer ATAU admin
  const isLoggedIn = computed(() => isCustomer.value || isAdmin.value);

  /** Untuk aksi pilih/gunakan tema — preview tetap boleh tanpa login */
  const requireCustomerForSelect = (returnTo) => {
    // Kalau sudah login (customer atau admin), langsung boleh
    if (isLoggedIn.value) return true;

    // Belum login → redirect ke login dengan info mau kemana setelah login
    let redirect = "/tema";
    if (typeof returnTo === "string" && returnTo) {
      redirect = returnTo;
    } else if (returnTo && typeof returnTo === "object") {
      const path = returnTo.path || "/tema";
      const q = returnTo.query
        ? `?${new URLSearchParams(returnTo.query).toString()}`
        : "";
      redirect = `${path}${q}`;
    }

    navigateTo({
      path: "/login",
      query: {
        redirect,
        reason: "pilih-tema",
      },
    });
    return false;
  };

  return {
    accountStore,
    isCustomer,
    isAdmin,
    isLoggedIn,
    requireCustomerForSelect,
  };
};
