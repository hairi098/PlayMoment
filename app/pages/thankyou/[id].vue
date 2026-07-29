<template>
  <div class="ty-page">
    <div class="ty-container">
      <!-- ===== HERO SECTION ===== -->
      <div class="ty-hero">
        <!-- Decorative circles -->
        <div class="hero-circle hero-circle-1"></div>
        <div class="hero-circle hero-circle-2"></div>

        <!-- Check icon -->
        <div class="hero-check-wrap">
          <div class="hero-check-ring"></div>
          <div class="hero-check-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              width="32"
              height="32"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <!-- Heading -->
        <h1 class="ty-heading">Thank You for Your Purchase!</h1>
        <p class="ty-subheading">
          Pesanan Anda berhasil kami terima. Berikut ringkasan transaksi dan
          langkah selanjutnya.
        </p>
      </div>
      <!-- end hero -->

      <!-- ===== INVOICE CARD ===== -->
      <div class="ty-card">
        <!-- Card Header -->
        <div class="card-header">
          <div class="card-brand">
            <span class="brand-play">Play</span
            ><span class="brand-moment">Moment</span>
          </div>
          <div class="card-meta">
            <span class="meta-date">{{ formattedDate }}</span>
            <span class="meta-kode">{{ order.kode }}</span>
          </div>
        </div>

        <div class="card-divider"></div>

        <!-- Status + Total -->
        <div class="card-status-total">
          <span class="status-badge" :class="statusBadge.badgeClass">
            <span class="status-dot"></span>
            {{ statusBadge.label }}
          </span>
          <div class="card-total-amount">
            Rp {{ formatRupiah(order.total) }}
          </div>
          <p class="card-total-label">Total Pembayaran</p>
        </div>

        <div class="card-dash"></div>

        <!-- Detail Pesanan -->
        <div class="card-section-title">Detail Pesanan</div>
        <div class="card-rows">
          <div class="card-row" v-if="order.nama">
            <span class="row-label">Nama</span>
            <span class="row-val">{{ order.nama }}</span>
          </div>
          <div class="card-row">
            <span class="row-label">Email</span>
            <span class="row-val">{{ order.email }}</span>
          </div>
          <div class="card-row">
            <span class="row-label">Paket</span>
            <span class="row-val bold">{{ order.paket }}</span>
          </div>
          <div class="card-row">
            <span class="row-label">Akses Edit</span>
            <span class="row-val">{{ order.akses }} Hari</span>
          </div>
          <div class="card-row">
            <span class="row-label">Metode Bayar</span>
            <span class="row-val">{{ order.metode?.toUpperCase() }}</span>
          </div>
          <div class="card-row" v-if="order.bank">
            <span class="row-label">Bank</span>
            <span class="row-val">{{ order.bank }}</span>
          </div>
        </div>

        <div class="card-divider thin"></div>

        <!-- Rincian Harga -->
        <div class="card-section-title">Rincian Harga</div>
        <div class="card-rows">
          <div class="card-row">
            <span class="row-label">Harga Paket</span>
            <span class="row-val">Rp {{ formatRupiah(order.harga) }}</span>
          </div>
          <div class="card-row" v-if="order.diskon">
            <span class="row-label"
              >Diskon <span class="promo-tag">{{ order.promoKode }}</span></span
            >
            <span class="row-val diskon"
              >− Rp {{ formatRupiah(order.diskon) }}</span
            >
          </div>
          <div class="card-row">
            <span class="row-label">Kode Unik</span>
            <span class="row-val kode-unik">− {{ order.kodeUnik }}</span>
          </div>
        </div>

        <div class="card-total-row">
          <span class="total-label">Total Bayar</span>
          <span class="total-val">Rp {{ formatRupiah(order.total) }}</span>
        </div>

        <div class="card-footer">PlayMoment · {{ order.kode }}</div>
      </div>
      <!-- end invoice card -->

      <!-- ===== CTA LOGIN ===== -->
      <div class="ty-cta">
        <p class="cta-desc">
          Akun Anda sudah siap. Masuk sekarang untuk mulai membuat undangan
          digital Anda.
        </p>
        <NuxtLink to="/login" class="btn-login">
          Masuk ke Akun
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            width="18"
            height="18"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </NuxtLink>
        <p class="cta-note">
          Ada pertanyaan? Hubungi kami via
          <a :href="`https://wa.me/${ADMIN_WA}`" target="_blank" class="wa-link"
            >WhatsApp</a
          >.
        </p>
      </div>
    </div>
    <!-- end container -->
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAccountStore } from "~/stores/useAccountStore";
import { resolveCheckoutPaket } from "~/utils/paket-catalog";

const route = useRoute();
const router = useRouter();
const accountStore = useAccountStore();
const kodeInvoice = String(route.params.id || "");

const ADMIN_WA = "6281234567890";

const storeOrder = computed(() =>
  accountStore.getOrderByInvoiceCode(kodeInvoice),
);

const order = computed(() => {
  const o = storeOrder.value;
  const paketEntry = resolveCheckoutPaket(o?.paketCheckout || o?.paket || "");
  return {
    kode: kodeInvoice,
    email: o?.email || "",
    paket: o?.paketCheckout || o?.paket || "Paket",
    akses: o?.aksesHari ?? paketEntry.hari,
    metode: o?.metodePembayaran || o?.metode || "manual",
    harga: o?.harga ?? 0,
    diskon: o?.diskon ?? 0,
    promoKode: o?.promoKode || "",
    kodeUnik: o?.kodeUnik ?? 0,
    total:
      o?.totalNumber ??
      (o?.total ? Number(String(o.total).replace(/\./g, "")) : 0),
    tanggal: o?.tanggal || "",
    bank: o?.bank || "",
    nama: o?.nama || "",
    hp: o?.hp || "",
    status: o?.status || "pending",
  };
});

const formatRupiah = (num) => {
  if (!num && num !== 0) return "0";
  return Math.abs(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const formattedDate = computed(() => {
  if (!order.value.tanggal) return "-";
  try {
    const d = new Date(order.value.tanggal);
    const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    const time = `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}.${String(d.getSeconds()).padStart(2, "0")}`;
    return `${date}, ${time}`;
  } catch {
    return order.value.tanggal;
  }
});

const statusKey = computed(() =>
  (order.value.status || "pending").toLowerCase(),
);

const statusBadge = computed(() => {
  const map = {
    pending: { label: "Menunggu Pembayaran", badgeClass: "badge-pending" },
    menunggu_konfirmasi: {
      label: "Menunggu Konfirmasi",
      badgeClass: "badge-waiting",
    },
    dikonfirmasi: {
      label: "Pembayaran Dikonfirmasi",
      badgeClass: "badge-paid",
    },
    selesai: { label: "Selesai", badgeClass: "badge-paid" },
    cancel: { label: "Dibatalkan", badgeClass: "badge-cancel" },
    dibatalkan: { label: "Dibatalkan", badgeClass: "badge-cancel" },
  };
  return map[statusKey.value] ?? map["pending"];
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Nunito:wght@400;600;700;800;900&display=swap");

* {
  box-sizing: border-box;
}

/* ===== PAGE ===== */
.ty-page {
  min-height: 100dvh;
  background: #f0f7f6;
  font-family: "Plus Jakarta Sans", "Nunito", "Segoe UI", sans-serif;
}

.ty-container {
  max-width: 480px;
  margin: 0 auto;
  padding: 0 16px 56px;
}

/* ===== HERO ===== */
.ty-hero {
  position: relative;
  background: linear-gradient(135deg, #1eac99 0%, #14857a 100%);
  border-radius: 0 0 28px 28px;
  padding: 48px 24px 60px;
  text-align: center;
  overflow: hidden;
  margin: 0 -16px 0;
}

.hero-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.12;
  background: #fff;
}
.hero-circle-1 {
  width: 180px;
  height: 180px;
  top: -60px;
  right: -40px;
}
.hero-circle-2 {
  width: 120px;
  height: 120px;
  bottom: -30px;
  left: -20px;
}

.hero-check-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.hero-check-ring {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  animation: pulseRing 2.5s ease-in-out infinite;
}
.hero-check-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
}
.hero-check-icon svg {
  color: #1eac99;
}

@keyframes pulseRing {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.18;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.08;
  }
}

.ty-heading {
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 10px;
  line-height: 1.3;
  letter-spacing: -0.3px;
}
.ty-subheading {
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.82);
  font-weight: 500;
  line-height: 1.6;
  margin: 0;
  max-width: 320px;
  display: inline-block;
}

/* ===== INVOICE CARD ===== */
.ty-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.09);
  padding: 24px 20px 20px;
  margin-top: -28px;
  position: relative;
  z-index: 2;
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}
.card-brand {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.5px;
}
.brand-play {
  color: #1a2e45;
}
.brand-moment {
  color: #1eac99;
}
.card-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}
.meta-date {
  font-size: 10.5px;
  color: #9ca3af;
  font-weight: 600;
}
.meta-kode {
  font-size: 11px;
  font-weight: 900;
  color: #1a2e45;
  font-family: monospace;
  letter-spacing: 1.5px;
  background: #f0f7f6;
  padding: 3px 8px;
  border-radius: 6px;
}

.card-divider {
  height: 1px;
  background: #edf2f7;
  margin-bottom: 18px;
}
.card-divider.thin {
  margin: 6px 0 16px;
}

/* Status + Total */
.card-status-total {
  text-align: center;
  margin-bottom: 18px;
}
.card-total-amount {
  font-size: 30px;
  font-weight: 900;
  color: #1a2e45;
  letter-spacing: -0.5px;
  margin: 10px 0 2px;
}
.card-total-label {
  font-size: 11.5px;
  color: #9ca3af;
  font-weight: 600;
  margin: 0;
}

.card-dash {
  border-top: 2px dashed #e2f4f2;
  margin: 4px 0 18px;
}

/* Section title */
.card-section-title {
  font-size: 10.5px;
  font-weight: 800;
  color: #9ca3af;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

/* Rows */
.card-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}
.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.row-label {
  font-size: 13px;
  color: #9ca3af;
  font-weight: 600;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}
.row-val {
  font-size: 13px;
  color: #1a2e45;
  font-weight: 700;
  text-align: right;
  word-break: break-all;
}
.row-val.bold {
  font-weight: 900;
}
.diskon {
  color: #059669;
}
.kode-unik {
  color: #1eac99;
}
.promo-tag {
  background: #ecfdf5;
  color: #059669;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
}

/* Total row */
.card-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f7f6;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 4px;
}
.total-label {
  font-size: 14px;
  font-weight: 800;
  color: #1a2e45;
}
.total-val {
  font-size: 18px;
  font-weight: 900;
  color: #1eac99;
}

/* Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 800;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.badge-cancel {
  background: #fee2e2;
  color: #dc2626;
}
.badge-cancel .status-dot {
  background: #dc2626;
}
.badge-pending {
  background: #fef9c3;
  color: #92400e;
}
.badge-pending .status-dot {
  background: #f59e0b;
}
.badge-waiting {
  background: #dbeafe;
  color: #1d4ed8;
}
.badge-waiting .status-dot {
  background: #3b82f6;
}
.badge-paid {
  background: #d1fae5;
  color: #065f46;
}
.badge-paid .status-dot {
  background: #10b981;
}

.card-footer {
  text-align: center;
  margin-top: 20px;
  text-align: center;
  font-size: 11px;
  color: #cbd5e1;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.card-footer-note {
  margin-top: 20px;
  text-align: center;
  font-size: 11px;
  color: #cbd5e1;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* ===== LANGKAH SELANJUTNYA ===== */
/* ===== CTA LOGIN ===== */
.ty-cta {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  padding: 24px 20px;
  margin-top: 16px;
  text-align: center;
}
.cta-desc {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  line-height: 1.6;
  margin: 0 0 18px;
}
.btn-login {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #1eac99 0%, #14857a 100%);
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  transition:
    opacity 0.2s,
    transform 0.1s;
  box-shadow: 0 6px 20px rgba(30, 172, 153, 0.35);
  letter-spacing: -0.2px;
}
.btn-login:hover {
  opacity: 0.9;
}
.btn-login:active {
  transform: scale(0.98);
}

.cta-note {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
  margin: 14px 0 0;
}
.wa-link {
  color: #1eac99;
  font-weight: 700;
  text-decoration: none;
}
.wa-link:hover {
  text-decoration: underline;
}
</style>
