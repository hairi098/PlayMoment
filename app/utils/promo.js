/** Hitung diskon dari konfigurasi promo. */
export function calculatePromoDiscount(promo, subtotal) {
  const base = Math.max(0, Number(subtotal) || 0)
  if (!promo?.active) return 0

  let diskon = 0
  if (promo.type === 'percent') {
    diskon = Math.floor((base * Number(promo.value || 0)) / 100)
    if (promo.maxDiskon) {
      diskon = Math.min(diskon, Number(promo.maxDiskon))
    }
  } else {
    diskon = Number(promo.value || 0)
  }

  return Math.min(Math.max(0, diskon), base)
}
