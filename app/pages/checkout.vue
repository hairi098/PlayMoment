<template>
  <div class="page-bg">
    <div class="co-phone">
      <!-- Header hijau -->
      <div class="co-header">
        <span class="co-header-title">Checkout</span>
        <button class="co-close" @click="handleClose">
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

      <div class="co-shell">
        <div class="co-container">
          <p class="co-sub">Periksa pesanan sebelum melanjutkan pembayaran</p>

          <!-- Data Pemesan -->
          <div class="co-card" ref="formRef">
            <div class="co-card-title">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7ecec4"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="16"
                height="16"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Data Pemesan
            </div>
            <div class="pemesan-fields">
              <div class="pemesan-field">
                <label>Nama Lengkap <span class="req">*</span></label>
                <input
                  v-model="pemesan.nama"
                  type="text"
                  placeholder="Nama sesuai bukti transfer"
                />
              </div>
              <div class="pemesan-field">
                <label>Email <span class="req">*</span></label>
                <input
                  v-model="pemesan.email"
                  type="email"
                  placeholder="untuk akun login setelah dikonfirmasi"
                />
              </div>
              <div class="pemesan-field">
                <label>No. WhatsApp <span class="req">*</span></label>
                <input
                  v-model="pemesan.hp"
                  type="text"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>
            <p v-if="pemesanError" class="pemesan-error">{{ pemesanError }}</p>
          </div>

          <!-- Ringkasan Paket -->
          <div class="co-card">
            <div class="co-card-title">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7ecec4"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="16"
                height="16"
              >
                <path d="M20 12V22H4V12" />
                <path d="M22 7H2v5h20V7z" />
                <path d="M12 22V7" />
              </svg>
              Paket Dipilih
            </div>
            <div class="paket-box">
              <div class="paket-info">
                <p class="paket-name">{{ selectedPaket.nama }}</p>
                <p class="paket-desc">{{ selectedPaket.deskripsi }}</p>
                <div class="paket-tags">
                  <span class="paket-tag"
                    >{{ selectedPaket.akses }} Hari Akses</span
                  >
                </div>
              </div>
              <div class="paket-price">
                Rp {{ formatRupiah(selectedPaket.harga) }}
              </div>
            </div>
          </div>

          <!-- Metode Pembayaran -->
          <div class="co-card">
            <div class="co-card-title">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7ecec4"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="16"
                height="16"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Pilih Metode Pembayaran
            </div>

            <div
              class="metode-option"
              :class="{ active: metodePembayaran === 'transfer' }"
              @click="metodePembayaran = 'transfer'"
            >
              <div class="metode-radio">
                <div
                  class="radio-dot"
                  v-if="metodePembayaran === 'transfer'"
                ></div>
              </div>
              <div class="metode-info">
                <p class="metode-name">Transfer Bank / E-Wallet</p>
                <p class="metode-desc">
                  Transfer manual ke rekening pilihan. Konfirmasi oleh admin
                  (±30 menit).
                </p>
              </div>
            </div>

            <div v-if="metodePembayaran === 'transfer'" class="bank-list">
              <div
                v-for="b in banks"
                :key="b.id"
                class="bank-item"
                :class="{ 'bank-active': bank === b.id }"
                @click="bank = b.id"
              >
                <div class="bank-radio">
                  <div class="radio-dot-sm" v-if="bank === b.id"></div>
                </div>
                <div class="bank-logo" :class="b.id.toLowerCase()">
                  {{ b.id }}
                </div>
                <span class="bank-norek">{{ b.norek }}</span>
              </div>
            </div>

            <div
              class="metode-option"
              :class="{ active: metodePembayaran === 'qris' }"
              @click="metodePembayaran = 'qris'"
            >
              <div class="metode-radio">
                <div class="radio-dot" v-if="metodePembayaran === 'qris'"></div>
              </div>
              <div class="metode-info">
                <p class="metode-name">QRIS</p>
                <p class="metode-desc">
                  Scan QR di bawah atau unduh gambar QRIS. Konfirmasi tetap
                  manual oleh admin.
                </p>
              </div>
            </div>

            <div v-if="metodePembayaran === 'qris'" class="qris-panel">
              <p class="qris-hint">
                Nominal: <strong>Rp {{ formatRupiah(totalBayar) }}</strong>
                (kode invoice akan muncul setelah lanjut ke pembayaran)
              </p>
              <div class="qris-img-wrap">
                <img
                  :src="qrisImageUrl"
                  alt="QRIS SatuMomen"
                  class="qris-img"
                  width="220"
                  height="220"
                />
              </div>
              <p class="qris-merchant">{{ qrisMerchantName }}</p>
              <button
                type="button"
                class="btn-qris-dl"
                :disabled="qrisDownloading"
                @click="handleDownloadQris"
              >
                {{ qrisDownloading ? "Mengunduh..." : "Unduh QRIS" }}
              </button>
            </div>
          </div>

          <!-- Detail Pembayaran -->
          <div class="co-card">
            <div class="co-card-title">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7ecec4"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="16"
                height="16"
              >
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Detail Pembayaran
            </div>
            <div class="detail-list">
              <div class="detail-row">
                <span class="detail-label">Nama Paket</span>
                <span class="detail-val">{{ selectedPaket.nama }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Akses Edit</span>
                <span class="detail-val">{{ selectedPaket.akses }} Hari</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Harga</span>
                <span class="detail-val"
                  >Rp {{ formatRupiah(selectedPaket.harga) }}</span
                >
              </div>
              <div class="detail-row" v-if="promoApplied && diskonPromo > 0">
                <span class="detail-label"
                  >Diskon Promo ({{ appliedPromoCode }})</span
                >
                <span class="detail-val kode-unik"
                  >- Rp {{ formatRupiah(diskonPromo) }}</span
                >
              </div>
              <div class="detail-row">
                <span class="detail-label">Kode Unik</span>
                <span class="detail-val kode-unik">- Rp {{ kodeUnik }}</span>
              </div>
              <div class="detail-divider"></div>
              <div class="detail-row total-row">
                <span class="detail-label-total">Total</span>
                <span class="detail-val-total"
                  >Rp {{ formatRupiah(totalBayar) }}</span
                >
              </div>
            </div>

            <div class="promo-wrap">
              <input
                type="text"
                class="promo-input"
                v-model="kodePromo"
                placeholder="Kosongkan jika tidak memiliki kode promo"
              />
              <button class="btn-promo" @click="terapkanPromo">Terapkan</button>
            </div>
            <p v-if="promoError" class="promo-error">{{ promoError }}</p>
            <div v-if="promoApplied" class="promo-success">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#065f46"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="13"
                height="13"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {{ promoSuccessMsg }}
              <button type="button" class="btn-promo-clear" @click="hapusPromo">
                Hapus
              </button>
            </div>
          </div>

          <!-- Spacer footer -->
          <div style="height: 16px"></div>
        </div>

        <!-- Button Checkout — tidak sticky -->
        <div class="co-footer-wrap">
          <button
            class="btn-checkout"
            :disabled="loading"
            @click="prosesCheckout"
          >
            <span v-if="!loading">Lanjut ke Pembayaran →</span>
            <span v-else class="loading-dots"
              >Memproses<span>.</span><span>.</span><span>.</span></span
            >
          </button>
        </div>
      </div>
      <!-- end co-shell -->
    </div>
    <!-- end co-phone -->
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAccountStore } from "~/stores/useAccountStore";
import {
  resolveCheckoutPaket,
  formatRupiahNumber,
  resolvePaketEntry,
} from "~/utils/paket-catalog";

const router = useRouter();

onMounted(async () => {
  // Pastikan promo sudah di-load agar kode promo bisa divalidasi
  if (accountStore.promos.length === 0) {
    await accountStore.loadPromos();
  }
});
const handleClose = () => router.back();

// ===== KONFIGURASI BANK & QRIS (inline, tanpa import eksternal) =====
const TRANSFER_BANKS = [
  { id: "BCA", norek: "1234567890 a.n. SatuMomen" },
  { id: "OVO", norek: "0812-3456-7890 a.n. SatuMomen" },
  { id: "DANA", norek: "0812-3456-7890 a.n. SatuMomen" },
];
// Ganti path di bawah dengan path gambar QRIS kamu yang sesungguhnya
const QRIS_IMAGE_PATH = "/images/qris-satumomen.png";
const QRIS_MERCHANT_NAME = "SatuMomen";

const route = useRoute();
const accountStore = useAccountStore();

const catalogEntry = computed(() =>
  resolvePaketEntry(route.query.id || route.query.paket || "basic"),
);

const paketFromQuery = computed(() => {
  const entry = catalogEntry.value;
  const yearly = route.query.yearly === "1";
  return {
    nama: route.query.paket || entry.marketingName || entry.adminName,
    deskripsi: route.query.desk || entry.description,
    akses: Number(route.query.akses) || entry.durationDays,
    harga:
      Number(route.query.harga) ||
      (yearly ? entry.priceYearlyIdr : entry.priceIdr),
  };
});

const selectedPaket = ref({ ...paketFromQuery.value });

watch(
  paketFromQuery,
  (p) => {
    selectedPaket.value = { ...p };
  },
  { immediate: true },
);
const paketResolved = computed(() =>
  resolveCheckoutPaket(selectedPaket.value.nama),
);

const pemesan = ref({ nama: "", email: "", hp: "" });

// Auto-fill dari akun yang sedang login
if (accountStore.currentUser) {
  const u = accountStore.currentUser;
  pemesan.value.nama = u.name || "";
  pemesan.value.email = u.email || "";
  // hp dari customerSource jika ada
  const customer = accountStore.getCustomerByEmail(u.email);
  pemesan.value.hp = customer?.hp || "";
}
const pemesanError = ref("");

// ===== STATE =====
const metodePembayaran = ref("transfer");
const bank = ref("BCA");
const qrisDownloading = ref(false);
const qrisMerchantName = QRIS_MERCHANT_NAME;
const kodePromo = ref("");
const promoApplied = ref(false);
const diskonPromo = ref(0);
const appliedPromoCode = ref("");
const promoSuccessMsg = ref("");
const promoError = ref("");
const loading = ref(false);
const kodeUnik = ref(Math.floor(Math.random() * 900) + 100);

const banks = TRANSFER_BANKS;

// ===== FORMAT =====
const formatRupiah = (num) => {
  if (!num && num !== 0) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Generate kode invoice 6 karakter acak (huruf kapital + angka, hindari karakter ambigu)
const generateKode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ===== COMPUTED =====
const subtotalPaket = computed(() => selectedPaket.value.harga);

const totalBayar = computed(() => {
  let total = subtotalPaket.value;
  total -= diskonPromo.value;
  total -= kodeUnik.value;
  return Math.max(total, 0);
});

// ===== QRIS: gambar statis, download langsung =====
const qrisImageUrl = QRIS_IMAGE_PATH;

const handleDownloadQris = async () => {
  qrisDownloading.value = true;
  try {
    const a = document.createElement("a");
    a.href = QRIS_IMAGE_PATH;
    a.download = "qris-satumomen.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch {
    alert("Gagal mengunduh QRIS. Coba lagi.");
  } finally {
    qrisDownloading.value = false;
  }
};

// ===== ACTIONS =====
const terapkanPromo = () => {
  promoError.value = "";
  const result = accountStore.validatePromo(
    kodePromo.value,
    subtotalPaket.value,
  );
  if (!result.ok) {
    promoError.value = result.message;
    promoApplied.value = false;
    diskonPromo.value = 0;
    appliedPromoCode.value = "";
    return;
  }
  diskonPromo.value = result.diskon;
  appliedPromoCode.value = result.promoKode;
  promoSuccessMsg.value = `${result.promoLabel} — diskon Rp ${formatRupiah(result.diskon)}`;
  promoApplied.value = true;
};

const hapusPromo = () => {
  kodePromo.value = "";
  promoApplied.value = false;
  diskonPromo.value = 0;
  appliedPromoCode.value = "";
  promoSuccessMsg.value = "";
  promoError.value = "";
};

// Ref untuk form element (untuk scroll ke form saat validasi gagal)
const formRef = ref(null);

const prosesCheckout = async () => {
  pemesanError.value = "";

  // Validasi: kalau ada field kosong, scroll ke form dan tampilkan error
  if (
    !pemesan.value.nama.trim() ||
    !pemesan.value.email.trim() ||
    !pemesan.value.hp.trim()
  ) {
    pemesanError.value = "Lengkapi nama, email, dan nomor WhatsApp.";
    if (formRef.value) {
      formRef.value.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pemesan.value.email.trim())) {
    pemesanError.value = "Format email tidak valid.";
    if (formRef.value) {
      formRef.value.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }
  if (metodePembayaran.value === "transfer" && !bank.value) {
    alert("Pilih bank tujuan transfer");
    return;
  }

  loading.value = true;

  const kodeInvoice = generateKode();
  const total = totalBayar.value;

  // ✅ FIX: await addOrder supaya order benar-benar tersimpan ke Supabase
  // sebelum navigate ke halaman invoice.
  // Sebelumnya tidak di-await sehingga halaman invoice load lebih cepat
  // dari proses insert → data kosong / 0, dan pesanan tidak muncul di admin.
  const savedOrder = await accountStore.addOrder({
    invoiceCode: kodeInvoice,
    nama: pemesan.value.nama.trim(),
    email: pemesan.value.email.trim(),
    hp: pemesan.value.hp.trim(),
    paket: paketResolved.value.paket,
    paketCheckout: selectedPaket.value.nama,
    maxUndangan: paketResolved.value.maxUndangan,
    total: formatRupiahNumber(total),
    totalNumber: total,
    harga: selectedPaket.value.harga,
    diskon: diskonPromo.value,
    promoKode: appliedPromoCode.value || null,
    kodeUnik: kodeUnik.value,
    metode: "manual",
    bank: metodePembayaran.value === "qris" ? "QRIS" : bank.value,
    metodePembayaran: metodePembayaran.value,
    catatan: `Checkout: ${selectedPaket.value.nama}`,
  });

  loading.value = false;

  if (!savedOrder) {
    pemesanError.value = "Gagal menyimpan pesanan. Coba lagi.";
    return;
  }

  navigateTo(`/invoice/${kodeInvoice}`);
};
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
.co-header {
  background: #1eac99;
  padding: 20px 20px 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.co-header-title {
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.2px;
}
.co-close {
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
.co-close:hover {
  background: rgba(255, 255, 255, 0.38);
}

/* ===== SCROLLABLE CONTENT ===== */
.co-shell {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: -100px;
  overflow-y: auto;
  padding-bottom: 24px;
}

/* CONTAINER */
.co-container {
  flex: 1;
  width: 100%;
  padding: 0 16px;
  
}
.co-sub {
  font-size: 12px;
  color: white;
  font-weight: 600;
  margin: 16px 0 14px;
}

.pemesan-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.pemesan-field label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 6px;
}
.pemesan-field .req {
  color: #e53e3e;
}
.pemesan-field input {
  width: 100%;
  padding: 11px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}
.pemesan-field input:focus {
  border-color: #7ecec4;
  box-shadow: 0 0 0 3px rgba(126, 206, 196, 0.15);
}
.pemesan-error {
  margin: 10px 0 0;
  font-size: 12px;
  color: #e53e3e;
  font-weight: 600;
}

/* CARD */
.co-card {
  background: #fff;
  border-radius: 18px;
  border: none;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 18px;
  
  margin-bottom: 14px;
}
.co-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 800;
  color: #1a2e45;
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* PAKET */
.paket-box {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  background: #f8fffe;
  border-radius: 12px;
  padding: 14px;
  border: 1.5px solid #e2f4f2;
}
.paket-name {
  font-size: 15px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 4px;
}
.paket-desc {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
  margin: 0 0 10px;
}
.paket-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.paket-tag {
  background: #e2f4f2;
  color: #2a9d8f;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}
.paket-price {
  font-size: 17px;
  font-weight: 900;
  color: #1a2e45;
  white-space: nowrap;
  flex-shrink: 0;
}

/* TAMBAHAN */
.tambahan-hint {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  margin: 0 0 12px;
  line-height: 1.6;
}
.tambahan-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.tambahan-name {
  font-size: 14px;
  font-weight: 700;
  color: #1a2e45;
  margin: 0 0 2px;
}
.tambahan-price {
  font-size: 13px;
  color: #7ecec4;
  font-weight: 800;
  margin: 0;
}
.btn-tambah {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  background: #1a2e45;
  color: #7ecec4;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: background 0.2s;
}
.btn-tambah:hover {
  background: #243d5c;
}
.btn-tambah-outline {
  background: #f0f7f6;
  color: #1a2e45;
  border: 1.5px solid #e2f4f2;
}
.btn-tambah-outline:hover {
  background: #e2f4f2;
}
.extra-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  background: #d1fae5;
  color: #065f46;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 10px;
}
.btn-remove-extra {
  margin-left: auto;
  background: none;
  border: none;
  color: #991b1b;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  padding: 0;
}
.divider-soft {
  height: 1px;
  background: #f0f4f8;
  margin: 14px 0;
}

/* METODE */
.metode-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  border: 1.5px solid #edf2f7;
  margin-bottom: 10px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;
}
.metode-option:last-child {
  margin-bottom: 0;
}
.metode-option.active {
  border-color: #7ecec4;
  background: #f8fffe;
}
.metode-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #7ecec4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7ecec4;
}
.metode-info {
  flex: 1;
}
.metode-name {
  font-size: 13px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 2px;
}
.metode-desc {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 600;
  margin: 0;
  line-height: 1.5;
}

/* BANK */
.bank-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: -2px 0 10px 30px;
}
.bank-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 10px;
  border: 1.5px solid #edf2f7;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;
}
.bank-item.bank-active {
  border-color: #7ecec4;
  background: #f8fffe;
}
.bank-radio {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #7ecec4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.radio-dot-sm {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #7ecec4;
}
.bank-logo {
  font-size: 11px;
  font-weight: 900;
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: 0.5px;
}
.bca {
  background: #003087;
  color: #fff;
}
.ovo {
  background: #4c2a86;
  color: #fff;
}
.dana {
  background: #108ee9;
  color: #fff;
}
.bank-norek {
  font-size: 13px;
  font-weight: 700;
  color: #1a2e45;
  font-family: monospace;
}

.qris-panel {
  margin-top: 4px;
  padding: 16px;
  border-radius: 14px;
  border: 1.5px solid #e2f4f2;
  background: #f8fffe;
  text-align: center;
}
.qris-hint {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  margin: 0 0 12px;
  line-height: 1.5;
}
.qris-img-wrap {
  display: inline-flex;
  padding: 10px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  margin-bottom: 10px;
}
.qris-img {
  display: block;
  border-radius: 8px;
}
.qris-merchant {
  font-size: 12px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 12px;
}
.btn-qris-dl {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: #1a2e45;
  color: #7ecec4;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
}
.btn-qris-dl:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.btn-qris-dl:hover:not(:disabled) {
  background: #243d5c;
}

/* DETAIL */
.detail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.detail-label {
  font-size: 13px;
  color: #9ca3af;
  font-weight: 600;
}
.detail-val {
  font-size: 13px;
  color: #1a2e45;
  font-weight: 700;
  text-align: right;
}
.kode-unik {
  color: #7ecec4;
}
.detail-divider {
  height: 1px;
  background: #edf2f7;
  margin: 4px 0;
}
.detail-label-total {
  font-size: 15px;
  font-weight: 800;
  color: #1a2e45;
}
.detail-val-total {
  font-size: 17px;
  font-weight: 900;
  color: #1a2e45;
}

/* PROMO */
.promo-wrap {
  display: flex;
  gap: 8px;
}
.promo-input {
  flex: 1;
  padding: 11px 14px;
  border-radius: 10px;
  border: 1.5px solid #edf2f7;
  font-size: 13px;
  font-family: inherit;
  color: #1a2e45;
  font-weight: 600;
  outline: none;
  background: #f8fffe;
  transition: border-color 0.2s;
}
.promo-input:focus {
  border-color: #7ecec4;
}
.btn-promo {
  padding: 11px 18px;
  background: #1a2e45;
  color: #7ecec4;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: background 0.2s;
}
.btn-promo:hover {
  background: #243d5c;
}
.promo-success {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #065f46;
  background: #d1fae5;
  padding: 8px 12px;
  border-radius: 8px;
}

/* FOOTER */
.co-footer-wrap {
  width: 100%;
  padding: 8px 16px 24px;
}
.promo-error {
  margin: 8px 0 0;
  font-size: 12px;
  font-weight: 600;
  color: #dc2626;
}
.btn-promo-clear {
  margin-left: auto;
  background: none;
  border: none;
  color: #065f46;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  text-decoration: underline;
}
.footer-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.footer-total-label {
  font-size: 13px;
  color: #9ca3af;
  font-weight: 600;
}
.footer-total-val {
  font-size: 17px;
  font-weight: 900;
  color: #1a2e45;
}
.btn-checkout {
  width: 100%;
  padding: 15px;
  background: #7ecec4;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  color: #1a2e45;
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.2s,
    transform 0.1s;
}
.btn-checkout:hover {
  background: #6abfb4;
}
.btn-checkout:active {
  transform: scale(0.98);
}
.btn-checkout:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.loading-dots span {
  animation: blink 1.2s infinite;
}
.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}
.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
</style>
