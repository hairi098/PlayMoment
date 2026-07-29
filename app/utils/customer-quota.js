export { getDefaultMaxUndangan } from "~/config/paket";

export function formatKuotaUndangan(used, max) {
  if (max >= 99) return `${used} / ∞`;
  return `${used} / ${max}`;
}
