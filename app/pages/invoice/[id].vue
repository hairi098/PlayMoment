<template>
  <div class="page-bg">
    <!-- Toast dikonfirmasi -->
    <Transition name="toast">
      <div v-if="showToastDikonfirmasi" class="toast-confirmed">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="18"
          height="18"
          style="flex-shrink: 0"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span
          >Invoice telah terbayar. Anda akan dialihkan ke halaman update profile
          dalam {{ toastCountdown }} detik.</span
        >
      </div>
    </Transition>
    <div class="co-phone">
      <!-- Header hijau "Transaksi" + tombol X -->
      <div class="trx-header">
        <span class="trx-header-title">Transaksi</span>
        <button class="trx-close" @click="handleClose">
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Receipt card putih -->
      <div class="trx-body">
        <div class="receipt-card">
          <!-- Brand -->
          <div class="receipt-brand">
            <span class="brand-play">Play</span
            ><span class="brand-moment">Moment</span>
          </div>

          <!-- Meta: tanggal + kode invoice -->
          <div class="receipt-meta">
            <span class="meta-date">{{ formattedDate }}</span>
            <span class="meta-kode">{{ order.kode }}</span>
          </div>

          <!-- Divider tipis -->
          <div class="receipt-line"></div>

          <!-- Status Badge dinamis -->
          <div class="status-wrap">
            <span class="status-badge" :class="statusBadge.badgeClass">
              <span class="status-dot"></span>
              {{ statusBadge.label }}
            </span>
          </div>

          <!-- Total -->
          <div class="receipt-total">Rp {{ formatRupiah(order.total) }}</div>

          <!-- Divider dashed -->
          <div class="receipt-dash"></div>

          <!-- Detail rows -->
          <div class="receipt-rows">
            <p class="receipt-section-title">DETAIL PESANAN</p>
            <div class="receipt-row" v-if="order.nama">
              <span class="row-label">Nama</span>
              <span class="row-val">{{ order.nama }}</span>
            </div>
            <div class="receipt-row">
              <span class="row-label">Email</span>
              <span class="row-val">{{ order.email }}</span>
            </div>
            <div class="receipt-row">
              <span class="row-label">Paket</span>
              <span class="row-val fw">{{ order.paket }}</span>
            </div>
            <div class="receipt-row">
              <span class="row-label">Akses Edit</span>
              <span class="row-val">{{ order.akses }} Hari</span>
            </div>
            <div class="receipt-row">
              <span class="row-label">Metode Bayar</span>
              <span class="row-val">{{ order.metode?.toUpperCase() }}</span>
            </div>
            <div class="receipt-row" v-if="order.bank">
              <span class="row-label">Bank</span>
              <span class="row-val">{{ order.bank }}</span>
            </div>

            <div class="receipt-divider"></div>
            <p class="receipt-section-title">RINCIAN HARGA</p>

            <div class="receipt-row">
              <span class="row-label">Harga Paket</span>
              <span class="row-val">Rp {{ formatRupiah(order.harga) }}</span>
            </div>
            <div class="receipt-row" v-if="order.diskon">
              <span class="row-label">Diskon ({{ order.promoKode }})</span>
              <span class="row-val diskon"
                >- Rp {{ formatRupiah(order.diskon) }}</span
              >
            </div>
            <div class="receipt-row">
              <span class="row-label">Kode Unik</span>
              <span class="row-val kode-unik">- {{ order.kodeUnik }}</span>
            </div>

            <div class="receipt-divider"></div>

            <div class="receipt-row total-row">
              <span class="row-label-total">Total Bayar</span>
              <span class="row-val-total"
                >Rp {{ formatRupiah(order.total) }}</span
              >
            </div>
          </div>

          <!-- Konfirmasi WA — hanya tampil kalau belum dikonfirmasi/cancel -->
          <div v-if="showKonfirmasiSection" class="konfirm-section">
            <div class="receipt-dash"></div>

            <!-- Petunjuk + Norek -->
            <div class="norek-section">
              <p class="norek-title">Petunjuk Pembayaran</p>
              <p class="norek-desc">
                Lakukan pembayaran melalui Bank Transfer sebesar
                <strong>Rp {{ formatRupiah(order.total) }}</strong> kepada
                rekening dibawah ini dalam waktu 1×24 jam
              </p>
              <div class="norek-list">
                <div class="norek-item">
                  <span class="norek-bank-label bca">BCA</span>
                  <span class="norek-number">0512023558</span>
                  <button class="btn-salin" @click="salinNorek('0512023558')">
                    {{ copied === "0512023558" ? "✓ Tersalin" : "Salin" }}
                  </button>
                </div>
                <div class="norek-item">
                  <span class="norek-bank-label ovo">OVO</span>
                  <span class="norek-number">081250335095</span>
                  <button
                    class="btn-salin"
                    @click="salinNorek('081250335095-ovo')"
                  >
                    {{ copied === "081250335095-ovo" ? "✓ Tersalin" : "Salin" }}
                  </button>
                </div>
                <div class="norek-item">
                  <span class="norek-bank-label dana">DANA</span>
                  <span class="norek-number">081250335095</span>
                  <button
                    class="btn-salin"
                    @click="salinNorek('081250335095-dana')"
                  >
                    {{
                      copied === "081250335095-dana" ? "✓ Tersalin" : "Salin"
                    }}
                  </button>
                </div>
              </div>
              <p class="norek-atas-nama">
                Semua rekening atas nama <strong>Abu Bakar Halid</strong>
              </p>
              <p class="norek-note">
                Untuk mempermudah verifikasi pastikan transfer sesuai dengan 3
                digit terakhir dan sertakan nomor invoice pada berita transfer.
              </p>
            </div>

            <p class="konfirm-info">
              Setelah transfer, klik tombol di bawah untuk konfirmasi pembayaran
              via WhatsApp ke admin.
            </p>

            <div v-if="!sudahKonfirmasi">
              <button class="btn-sudah-bayar" @click="handleSudahBayar">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="16"
                  height="16"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Saya Sudah Bayar
              </button>
            </div>

            <div v-else class="konfirm-done">
              <div class="konfirm-done-top">
                <div class="konfirm-done-icon">✅</div>
                <div>
                  <p class="konfirm-done-title">Konfirmasi Terkirim!</p>
                  <p class="konfirm-done-desc">
                    Tunggu konfirmasi dari admin ya.
                  </p>
                </div>
              </div>
              <a :href="waAdminUrl" target="_blank" class="btn-wa-ulang">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="14"
                  height="14"
                >
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"
                  />
                </svg>
                Kirim Ulang via WhatsApp
              </a>
            </div>
          </div>

          <!-- Langkah Selanjutnya -->
          <div v-if="showKonfirmasiSection" class="receipt-dash"></div>
          <div v-if="showKonfirmasiSection" class="next-steps-inner">
            <p class="next-steps-title">Langkah Selanjutnya</p>
            <div class="next-steps-list">
              <div class="next-step-item">
                <div class="step-num">1</div>
                <div class="step-content">
                  <p class="step-heading">Konfirmasi Pembayaran</p>
                  <p class="step-desc">
                    Lakukan transfer sesuai nominal dan konfirmasi via WhatsApp
                    ke admin kami agar pembayaran segera diproses.
                  </p>
                </div>
              </div>
              <div class="step-connector"></div>
              <div class="next-step-item">
                <div class="step-num">2</div>
                <div class="step-content">
                  <p class="step-heading">Pembuatan Akun</p>
                  <p class="step-desc">
                    Setelah konfirmasi pembayaran berhasil, admin akan membuat
                    akun dan mengirimkan informasi login untuk mengakses
                    undangan digital Anda.
                  </p>
                </div>
              </div>
              <div class="step-connector"></div>
              <div class="next-step-item">
                <div class="step-num">3</div>
                <div class="step-content">
                  <p class="step-heading">Login & Buat Undangan</p>
                  <p class="step-desc">
                    Login ke akun yang telah diberikan untuk mulai membuat
                    undangan digital.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="receipt-footer-note">PlayMoment · {{ order.kode }}</div>
        </div>
      </div>
    </div>
    <!-- end container -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAccountStore } from "~/stores/useAccountStore";
import { supabase } from "~/lib/supabase";
import { resolveCheckoutPaket } from "~/utils/paket-catalog";

const route = useRoute();
const router = useRouter();
const accountStore = useAccountStore();
const kodeInvoice = String(route.params.id || "");

const ADMIN_WA = "6281234567890";

const copied = ref(null);
const salinNorek = (key) => {
  const val = key.replace(/-ovo|-dana/, "");
  navigator.clipboard.writeText(val);
  copied.value = key;
  setTimeout(() => (copied.value = null), 2000);
};

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

// ===== STATUS BADGE =====
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
    dikonfirmasi: { label: "Dibayar", badgeClass: "badge-paid" },
    selesai: { label: "Selesai", badgeClass: "badge-paid" },
    cancel: { label: "Cancel", badgeClass: "badge-cancel" },
    dibatalkan: { label: "Dibatalkan", badgeClass: "badge-cancel" },
  };
  return map[statusKey.value] ?? map["pending"];
});

// Tombol konfirmasi WA hanya muncul kalau status masih pending/menunggu
const showKonfirmasiSection = computed(() => {
  const s = statusKey.value;
  return s === "pending" || s === "menunggu_konfirmasi";
});

// ===== HANDLE CLOSE — kembali ke halaman sebelumnya =====
const handleClose = () => {
  router.back();
};

// ===== TOAST DIKONFIRMASI =====
const showToastDikonfirmasi = ref(false);
const toastCountdown = ref(3);
let countdownTimer = null;

const tampilkanToastLaluRedirect = async () => {
  showToastDikonfirmasi.value = true;
  toastCountdown.value = 3;
  countdownTimer = setInterval(() => {
    toastCountdown.value--;
    if (toastCountdown.value <= 0) {
      clearInterval(countdownTimer);
      navigateTo(`/thankyou/${kodeInvoice}`);
    }
  }, 1000);
};

// ===== KONFIRMASI WA =====
const sudahKonfirmasi = ref(false);
const waAdminUrl = ref("");

const buildWaMessage = () => {
  const metode =
    order.value.metode === "qris" ? "QRIS" : `Transfer ${order.value.bank}`;
  const msg = [
    "Halo Admin, saya ingin konfirmasi pembayaran:",
    "",
    `Nama         : ${order.value.nama || order.value.email}`,
    `Email        : ${order.value.email}`,
    `Paket        : ${order.value.paket}`,
    `Metode       : ${metode}`,
    `Total        : Rp ${formatRupiah(order.value.total)}`,
    `Kode Invoice : ${order.value.kode}`,
    "",
    "Mohon dikonfirmasi, terima kasih 🙏",
  ].join("\n");
  return `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`;
};

const handleSudahBayar = async () => {
  const url = buildWaMessage();
  waAdminUrl.value = url;
  sudahKonfirmasi.value = true;
  window.open(url, "_blank");
  await accountStore.markOrderPaymentSubmitted(kodeInvoice);
};

// ===== POLLING STATUS =====
let pollingTimer = null;

const cekStatusKonfirmasi = async () => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("status")
      .ilike("invoice_code", kodeInvoice)
      .single();

    if (error || !data) return;

    if (data.status === "dikonfirmasi" || data.status === "selesai") {
      stopPolling();
      await accountStore.loadOrders();
      tampilkanToastLaluRedirect();
    }
  } catch {
    // abaikan error jaringan
  }
};

const startPolling = () => {
  cekStatusKonfirmasi();
  pollingTimer = setInterval(cekStatusKonfirmasi, 5000);
};

const stopPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
};

onMounted(() => startPolling());
onUnmounted(() => {
  stopPolling();
  if (countdownTimer) clearInterval(countdownTimer);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap");

* {
  box-sizing: border-box;
}

/* ===== LAYOUT ===== */
.page-bg {
  min-height: 100dvh;
  background: #f0f7f6;
  font-family: "Nunito", "Segoe UI", sans-serif;
}

.co-phone {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

/* ===== HEADER HIJAU ===== */
.trx-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 100px;
  background: #1eac99;
  flex-shrink: 0;
}

.trx-header-title {
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.2px;
}

.trx-close {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.18s;
  flex-shrink: 0;
}
.trx-close:hover {
  background: rgba(255, 255, 255, 0.38);
}

/* ===== BODY ===== */
.trx-body {
  padding: 0 16px 40px;
  margin-top: -60px;
  overflow-y: auto;
  flex: 1;
}

/* ===== RECEIPT CARD ===== */
.receipt-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 28px rgba(0, 0, 0, 0.1);
  padding: 24px 20px 20px;
}

/* ===== BRAND ===== */
.receipt-brand {
  font-size: 26px;
  font-weight: 900;
  text-align: center;
  margin-bottom: 14px;
  letter-spacing: -0.5px;
  font-family: "Nunito", "Segoe UI", sans-serif;
}
.brand-play {
  color: #1a2e45;
}
.brand-moment {
  color: #1eac99;
}

/* ===== META ===== */
.receipt-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.meta-date {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 600;
}
.meta-kode {
  font-size: 12px;
  font-weight: 900;
  color: #1a2e45;
  font-family: monospace;
  letter-spacing: 2px;
}

.receipt-line {
  height: 1px;
  background: #edf2f7;
  margin-bottom: 14px;
}

/* ===== STATUS BADGE ===== */
.status-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

/* Cancel */
.badge-cancel {
  background: #fee2e2;
  color: #dc2626;
}
.badge-cancel .status-dot {
  background: #dc2626;
}

/* Pending */
.badge-pending {
  background: #fef9c3;
  color: #92400e;
}
.badge-pending .status-dot {
  background: #f59e0b;
}

/* Menunggu Konfirmasi */
.badge-waiting {
  background: #dbeafe;
  color: #1d4ed8;
}
.badge-waiting .status-dot {
  background: #3b82f6;
}

/* Dibayar / Selesai */
.badge-paid {
  background: #d1fae5;
  color: #065f46;
}
.badge-paid .status-dot {
  background: #10b981;
}

/* ===== TOTAL ===== */
.receipt-total {
  font-size: 28px;
  font-weight: 900;
  color: #1a2e45;
  text-align: center;
  letter-spacing: -0.5px;
  margin-bottom: 16px;
}

/* ===== DASHED ===== */
.receipt-dash {
  border-top: 2px dashed #e2f4f2;
  margin: 4px 0 16px;
}

/* ===== ROWS ===== */
.receipt-section-title {
  font-size: 10.5px;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.8px;
  margin: 0 0 10px;
}

.receipt-rows {
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.receipt-row {
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
}
.row-val {
  font-size: 13px;
  color: #1a2e45;
  font-weight: 700;
  text-align: right;
  word-break: break-all;
}
.fw {
  font-weight: 900;
}
.diskon {
  color: #065f46;
}
.kode-unik {
  color: #7ecec4;
}

.receipt-divider {
  height: 1px;
  background: #edf2f7;
  margin: 2px 0;
}

.total-row {
  padding-top: 4px;
}
.row-label-total {
  font-size: 15px;
  font-weight: 800;
  color: #1a2e45;
}
.row-val-total {
  font-size: 18px;
  font-weight: 900;
  color: #1a2e45;
}

/* ===== KONFIRMASI WA ===== */
.konfirm-section {
  margin-top: 4px;
}

/* Norek */
.norek-section {
  margin-bottom: 16px;
}
.norek-title {
  font-size: 13px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 6px;
}
.norek-desc {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  line-height: 1.6;
  margin: 0 0 14px;
}
.norek-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}
.norek-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #e9f0f7;
  border-radius: 12px;
  padding: 10px 14px;
}
.norek-bank-label {
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}
.norek-bank-label.bca {
  background: #005baa;
  color: #fff;
}
.norek-bank-label.ovo {
  background: #4c3494;
  color: #fff;
}
.norek-bank-label.dana {
  background: #118eea;
  color: #fff;
}
.norek-number {
  font-size: 13px;
  font-weight: 700;
  color: #1a2e45;
  letter-spacing: 0.3px;
}
.btn-salin {
  font-size: 11px;
  font-weight: 700;
  color: #1eac99;
  background: #e8f7f5;
  border: none;
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;
  flex-shrink: 0;
  font-family: inherit;
  transition: background 0.15s;
}
.btn-salin:active {
  background: #d0f0ec;
}
.norek-atas-nama {
  font-size: 12px;
  color: #374151;
  font-weight: 500;
  margin: 0 0 6px;
}
.norek-note {
  font-size: 11.5px;
  color: #6b7280;
  font-weight: 500;
  line-height: 1.6;
  margin: 0;
}

.konfirm-info {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  line-height: 1.6;
  margin: 0 0 14px;
  text-align: center;
}

.btn-sudah-bayar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: #7ecec4;
  color: #1a2e45;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.2s,
    transform 0.1s;
}
.btn-sudah-bayar:hover {
  background: #6abfb4;
}
.btn-sudah-bayar:active {
  transform: scale(0.98);
}

.konfirm-done {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 14px;
  padding: 14px;
}
.konfirm-done-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.konfirm-done-icon {
  font-size: 22px;
  flex-shrink: 0;
}
.konfirm-done-title {
  font-size: 13px;
  font-weight: 800;
  color: #065f46;
  margin: 0 0 2px;
}
.konfirm-done-desc {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  margin: 0 0 10px;
  line-height: 1.5;
}
.btn-wa-ulang {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #2a9d8f;
  text-decoration: none;
  background: #e2f4f2;
  padding: 10px 12px;
  border-radius: 10px;
  transition: background 0.2s;
  width: 100%;
}
.btn-wa-ulang:hover {
  background: #c8ede9;
}

/* ===== TOAST DIKONFIRMASI ===== */
.toast-confirmed {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: #fff;
  color: #1a2e45;
  border: 2px solid #7ecec4;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
  padding: 14px 18px;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 340px;
  width: calc(100% - 40px);
}
.toast-confirmed svg {
  color: #1eac99;
  margin-top: 1px;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-12px);
}

.receipt-footer-note {
  margin-top: 20px;
  text-align: center;
  font-size: 11px;
  color: #cbd5e1;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* ===== LANGKAH SELANJUTNYA ===== */
.next-steps-inner {
  margin-top: 4px;
}
.next-steps-title {
  font-size: 15px;
  font-weight: 800;
  color: #1a2e45;
  margin-bottom: 20px;
  letter-spacing: -0.2px;
}
.next-steps-list {
  display: flex;
  flex-direction: column;
}
.next-step-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.step-num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1eac99, #14857a);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(30, 172, 153, 0.3);
}
.step-content {
  flex: 1;
  padding-top: 4px;
}
.step-heading {
  font-size: 13.5px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 3px;
}
.step-desc {
  font-size: 12.5px;
  color: #6b7280;
  font-weight: 500;
  line-height: 1.6;
  margin: 0;
}
.step-connector {
  width: 1.5px;
  height: 20px;
  background: #e2f4f2;
  margin: 6px 0 6px 15px;
}
</style>
