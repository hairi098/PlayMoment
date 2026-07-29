import { computed } from "vue";
import { useAccountStore } from "~/stores/useAccountStore";

export function useCustomerQuota() {
  const accountStore = useAccountStore();

  const currentCustomer = computed(() => {
    const user = accountStore.currentUser;
    if (!user || user.role !== "customer") return null;

    // Coba ambil data lengkap dari store dulu
    const fromStore = user.id
      ? accountStore.getCustomerById(user.id)
      : accountStore.getCustomerByEmail(user.email);

    // Fallback ke currentUser langsung kalau customers array belum di-load
    // currentUser sudah punya status & maxUndangan sejak login
    return fromStore ?? user;
  });

  const quota = computed(() => {
    if (!currentCustomer.value) {
      return { used: 0, max: 0, remaining: 0, canCreate: false };
    }
    return accountStore.customerInvitationQuota(currentCustomer.value);
  });

  return {
    currentCustomer,
    quota,
    canCreateInvitation: computed(() => quota.value.canCreate),
    remainingInvitations: computed(() => quota.value.remaining),
  };
}