/**
 * Sumber tunggal data paket — marketing, checkout, admin, dan store.
 * adminName disimpan di customer/order/invitation.
 */

export const PAKET_CATALOG = [
  {
    id: "basic",
    adminName: "Basic",
    marketingName: "Basic",
    showOnMarketing: true,
    priceIdr: 59_000,
    priceYearlyIdr: 566_400, // ~20% hemat tahunan
    durationDays: 7,
    maxUndangan: 1,
    creditPoints: 50,
    featured: false,
    tagline: "Hemat & self-edit",
    description: "Paket Basic — edit mandiri, masa aktif 7 hari",
    features: [
      "Semua fitur undangan digital",
      "Edit & setting mandiri",
      "Akses editor + tutorial",
      "Masa aktif 7 hari",
      "Tanpa bantuan admin",
    ],
    marketingFeatures: [
      { label: "Semua fitur undangan digital", disabled: false },
      { label: "Edit & setting mandiri", disabled: false },
      { label: "Akses editor + tutorial", disabled: false },
      { label: "Masa aktif 7 hari", disabled: false },
      { label: "Tanpa bantuan admin", disabled: true },
    ],
    adminCard: {
      hari: 7,
      masaLabel: "7 Hari",
      desc: "1 undangan digital (kuota bisa diubah)",
      iconBg: "rgba(126,206,196,.15)",
      iconColor: "#0a7060",
    },
  },
   {
    id: "premium",
    adminName: "Premium",
    marketingName: "Premium",
    showOnMarketing: true,
    priceIdr: 99_000,
    priceYearlyIdr: 1_238_400,
    durationDays: 30,
    maxUndangan: 1,
    featured: true,
    tagline: "Hemat tapi Aman",
    description: "Paket Premium — dibuatkan admin, masa aktif 30 hari",
    features: [
      "Semua fitur undangan digital",
      "Masa aktif 30 hari",
      "Dibuatkan oleh admin",
      "2x revisi minor",
      "Support WhatsApp (jam kerja)",
    ],
    marketingFeatures: [
      { label: "Semua fitur undangan digital", disabled: false },
      { label: "Masa aktif 30 hari", disabled: false },
      { label: "Dibuatkan oleh admin", disabled: false },
      { label: "2x revisi minor", disabled: false },
      { label: "Support WhatsApp (jam kerja)", disabled: false },
    ],
    adminCard: {
      hari: 30,
      masaLabel: "1 Bulan (30 Hari)",
      desc: "1 undangan digital (kuota bisa diubah)",
      iconBg: "rgba(183,148,244,.15)",
      iconColor: "#6b21a8",
    },
  },
  {
    id: "prioritas",
    adminName: "Prioritas",
    marketingName: "Prioritas",
    showOnMarketing: true,
    priceIdr: 149_000,
    priceYearlyIdr: 1_910_400,
    durationDays: 90,
    maxUndangan: 1,
    creditPoints: 200,
    featured: false,
    tagline: "Terima beres & tenang",
    description: "Paket Prioritas — full admin, masa aktif 90 hari",
    features: [
      "Semua fitur undangan digital",
      "Masa aktif 90 hari",
      "Full dibuatkan admin (terima beres)",
      "Revisi wajar tanpa batas",
      "Prioritas respon",
    ],
    marketingFeatures: [
      { label: "Semua fitur undangan digital", disabled: false },
      { label: "Masa aktif 90 hari", disabled: false },
      { label: "Full dibuatkan admin (terima beres)", disabled: false },
      { label: "Revisi wajar tanpa batas", disabled: false },
      { label: "Prioritas respon", disabled: false },
    ],
    adminCard: {
      hari: 90,
      masaLabel: "3 Bulan (90 Hari)",
      desc: "1 undangan digital (kuota bisa diubah)",
      iconBg: "rgba(246,173,85,.15)",
      iconColor: "#b45309",
    },
  },
];

/** Alias lama (checkout URL / data migrasi). */
const LEGACY_ALIASES = {
  "Reseller Lite": "premium",
  "Reseller Pro": "prioritas",
  Gratis: "basic",
  VIP: "prioritas",
};

export function formatRupiahNumber(num) {
  const n = Math.max(0, Math.round(Number(num) || 0));
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatRupiahLabel(amountIdr) {
  return `Rp ${formatRupiahNumber(amountIdr)}`;
}

export function getPaketById(id) {
  return PAKET_CATALOG.find((p) => p.id === id) ?? null;
}

export function getPaketByAdminName(name) {
  const key = String(name || "")
    .replace(/^Paket\s+/i, "")
    .trim();
  return PAKET_CATALOG.find((p) => p.adminName === key) ?? null;
}

export function resolvePaketEntry(nameOrId) {
  const raw = String(nameOrId || "").trim();
  if (!raw) return getPaketById("basic");

  const byId = getPaketById(raw.toLowerCase());
  if (byId) return byId;

  const legacyId = LEGACY_ALIASES[raw];
  if (legacyId) return getPaketById(legacyId);

  const byAdmin = getPaketByAdminName(raw);
  if (byAdmin) return byAdmin;

  const byMarketing = PAKET_CATALOG.find((p) => p.marketingName === raw);
  if (byMarketing) return byMarketing;

  return getPaketById("basic");
}

export function getDefaultMaxUndangan(paket) {
  return resolvePaketEntry(paket)?.maxUndangan ?? 1;
}

export function getPackageDays(paket) {
  return resolvePaketEntry(paket)?.durationDays ?? 30;
}

export function getAdminPaketNames() {
  return PAKET_CATALOG.map((p) => p.adminName);
}

/** Opsi filter admin: '' + semua adminName */
export function getAdminPaketFilterOptions() {
  return ["", ...getAdminPaketNames()];
}

export function getMarketingPakets() {
  return PAKET_CATALOG.filter((p) => p.showOnMarketing);
}

export function getAdminPaketCards() {
  return PAKET_CATALOG.filter((p) => p.adminCard).map((p) => ({
    nama: p.adminName,
    hari: p.adminCard.hari,
    masaLabel: p.adminCard.masaLabel,
    desc: p.adminCard.desc,
    defaultUndangan: p.maxUndangan,
    harga: formatRupiahLabel(p.priceIdr),
    iconBg: p.adminCard.iconBg,
    iconColor: p.adminCard.iconColor,
  }));
}

export function getAdminPriceFormRows() {
  return PAKET_CATALOG.map((p) => ({
    key: p.adminName,
    features: p.adminCard?.desc ?? `${p.maxUndangan} undangan`,
    priceFormatted: formatRupiahNumber(p.priceIdr),
  }));
}

export function getInitialBusinessPrices() {
  return Object.fromEntries(
    PAKET_CATALOG.map((p) => [p.adminName, formatRupiahNumber(p.priceIdr)]),
  );
}

/** Kartu pricing halaman utama (index). */
export function getIndexPricingCards() {
  return getMarketingPakets().map((p) => ({
    id: p.id,
    name: p.adminName,
    price: formatRupiahLabel(p.priceIdr),
    tagline: p.tagline,
    features: p.features.filter((f) => f !== "Tanpa bantuan admin"),
    featured: p.featured,
  }));
}

/** Kartu pricing halaman /paket. */
export function getPaketPageCards() {
  return getMarketingPakets().map((p) => ({
    id: p.id,
    name: p.adminName,
    tagline: p.tagline,
    priceMonthly: formatRupiahNumber(p.priceIdr),
    priceYearly: formatRupiahNumber(p.priceYearlyIdr),
    savingAmount: formatRupiahNumber(
      Math.max(0, p.priceIdr * 12 - p.priceYearlyIdr),
    ),
    featured: p.featured,
    features: p.marketingFeatures ?? [],
    adminName: p.adminName,
  }));
}

export function buildCheckoutQuery(paketId, { yearly = false } = {}) {
  const entry = getPaketById(paketId) ?? getPaketById("basic");
  const harga = yearly ? entry.priceYearlyIdr : entry.priceIdr;
  return {
    id: entry.id,
    paket: entry.adminName,
    desk: entry.description,
    akses: String(entry.durationDays),
    kredit: String(entry.creditPoints),
    harga: String(harga),
    yearly: yearly ? "1" : "0",
  };
}

export function resolveCheckoutPaket(namaPaket) {
  const entry = resolvePaketEntry(namaPaket);
  return {
    paket: entry.adminName,
    maxUndangan: entry.maxUndangan,
    hari: entry.durationDays,
    catalogId: entry.id,
  };
}

/** Map status order store → tampilan invoice customer. */
export function mapOrderStatusToInvoice(status) {
  if (status === "dikonfirmasi") return "lunas";
  if (status === "batal") return "gagal";
  return "pending";
}

export function mapOrderToCustomerInvoice(order) {
  const code = order.invoiceCode || order.id;
  const amount =
    order.totalNumber ??
    Number(String(order.total || "0").replace(/\./g, "")) ??
    order.harga ??
    0;
  return {
    id: code,
    orderId: order.id,
    status: mapOrderStatusToInvoice(order.status),
    amount,
    tanggal: order.tanggal,
    paket: `Paket ${order.paketCheckout || order.paket}`,
    metode: order.metode === "manual" ? "Transfer Bank" : order.metode || "—",
    deskripsi:
      order.catatan ||
      `Pembelian paket ${order.paketCheckout || order.paket}`,
    pembayaranDikonfirmasi: Boolean(order.pembayaranDikonfirmasi),
    promoKode: order.promoKode || null,
  };
}

/** Map order store → baris laporan admin. */
export function mapOrderToLaporanRow(order, color = "#7ecec4") {
  const statusMap = {
    menunggu_konfirmasi: "pending",
    dikonfirmasi: "selesai",
    batal: "batal",
    pending: "pending",
    proses: "proses",
    selesai: "selesai",
  };
  return {
    id: order.invoiceCode || order.id,
    nama: order.nama,
    email: order.email,
    paket: order.paket,
    total: order.total,
    tanggal: order.tanggal,
    status: statusMap[order.status] ?? order.status,
    color,
  };
}