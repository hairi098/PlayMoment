import { computed } from "vue";
import { useAccountStore } from "~/stores/useAccountStore";
import { useUndanganStore } from "~/stores/useUndanganStore";

const formatExpiry = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};

export const useCustomerIdentity = () => {
  const accountStore = useAccountStore();

  const customerSource = computed(() => {
    const current = accountStore.currentUser;

    if (current?.role === "customer" && current?.id) {
      return accountStore.customers.find((c) => c.id === current.id) || null;
    }
    if (current?.role === "customer" && current?.email) {
      return accountStore.customers.find((c) => c.email === current.email) || null;
    }

    // fallback: untuk dev / saat belum login
    return accountStore.defaultCustomer;
  });

  const user = computed(() => {
    const current = accountStore.currentUser;
    const source = customerSource.value;

    const name =
      source?.nama || current?.name || current?.nama || "Nama User";
    const email =
      source?.email || current?.email || "contoh@email.com";
    const paketRaw =
      source?.paket || current?.paket || "Nama Paket";

    // beberapa halaman pakai "Paket Premium" dari login mock
    const paket = paketRaw.startsWith("Paket ") ? paketRaw : paketRaw;

    const expiryIso = source?.expiryDate || current?.expiryDate || null;

    return {
      name,
      email,
      paket,
      expiryDate: expiryIso,
      paketExpiry: formatExpiry(expiryIso)
    };
  });

  const logoutAndRedirect = async (to = "/login") => {
    accountStore.logout();

    // ✅ Reset undangan store agar data customer lain tidak bocor ke sesi berikutnya
    try {
      const undanganStore = useUndanganStore();
      undanganStore.$reset();
    } catch {}

    if (process.client) {
      try {
        // ✅ Bersihkan cache undangan legacy dari localStorage jika ada
        localStorage.removeItem("undangan-store");
      } catch {
        // ignore
      }
    }
    await navigateTo(to);
  };

  return { accountStore, customerSource, user, logoutAndRedirect };
};