<template>
  <div class="dashboard-layout" @click="closeDropdown">
    <!-- ===== SIDEBAR (desktop only) ===== -->
    <DashboardSidebar class="sidebar-slot" :user="user" />

    <!-- ===== MAIN AREA ===== -->
    <div class="main-area">
      <!-- ===== TOPBAR ===== -->
      <header class="topbar">
        <button
          class="topbar-menu mobile-only"
          aria-label="Menu"
          @click.stop="drawerOpen = !drawerOpen"
        >
          <span></span><span></span><span></span>
        </button>
        <h1 class="topbar-title">Invoice</h1>
        <p class="topbar-welcome desktop-only">
          Kelola invoice dan riwayat transaksi
        </p>

        <!-- Avatar + Dropdown -->
        <div class="avatar-wrap" @click.stop="toggleDropdown">
          <button class="topbar-avatar" aria-label="Profil">
            <span class="topbar-avatar-initials">{{ getInitials(user?.name) }}</span>
          </button>

          <Transition name="dropdown">
            <div v-if="dropdownOpen" class="profile-dropdown">
              <div class="dropdown-header">
                <div class="dropdown-avatar">
                  <span style="font-size:13px;font-weight:800;color:#fff;user-select:none;">{{ getInitials(user?.name) }}</span>
                </div>
                <div class="dropdown-userinfo">
                  <p class="dropdown-paket">{{ user.paket }}</p>
                  <p class="dropdown-name">{{ user.name }}</p>
                  <p class="dropdown-email">{{ user.email }}</p>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" @click.stop="handleEditProfile">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="16"
                  height="16"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  />
                </svg>
                Edit Profile
              </button>
              <button class="dropdown-item" @click.stop="handleTutorial">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="16"
                  height="16"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Tutorial
              </button>
              <div class="dropdown-divider"></div>
              <button
                class="dropdown-item dropdown-logout"
                @click.stop="handleLogout"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="16"
                  height="16"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </Transition>
        </div>
      </header>

      <!-- ===== SCROLL BODY ===== -->
      <div class="scroll-body">
        <!-- ===== TOOLBAR ===== -->
        <div class="toolbar">
          <div class="toolbar-row">
            <div class="search-wrap">
              <svg
                class="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="15"
                height="15"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                class="search-input"
                v-model="searchQuery"
                placeholder="Cari nomor atau nama paket..."
              />
            </div>
            <div class="filter-wrap">
              <svg
                class="filter-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="14"
                height="14"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <select class="filter-select" v-model="filterStatus">
                <option value="semua">Semua</option>
                <option value="lunas">Lunas</option>
                <option value="pending">Pending</option>
                <option value="gagal">Gagal</option>
              </select>
            </div>
          </div>
          <p class="toolbar-count" v-if="filteredInvoices.length > 0">
            Menampilkan <strong>{{ filteredInvoices.length }}</strong> invoice
          </p>
        </div>

        <!-- ===== EMPTY STATE ===== -->
        <div v-if="filteredInvoices.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7ecec4"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              width="44"
              height="44"
            >
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <p class="empty-title">Belum ada invoice</p>
          <p class="empty-sub">Riwayat pembayaran Anda akan muncul di sini</p>
        </div>

        <!-- ===== DAFTAR INVOICE ===== -->
        <div v-else class="invoice-list">
          <div
            v-for="inv in filteredInvoices"
            :key="inv.id"
            class="invoice-card"
            @click="goToDetail(inv)"
          >
            <!-- Accent bar by status -->
            <div class="card-accent" :class="'accent-' + inv.status"></div>

            <!-- Header Card -->
            <div class="invoice-card-inner">
              <div class="invoice-card-header">
                <div class="invoice-id-wrap">
                  <div class="invoice-doc-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      width="14"
                      height="14"
                    >
                      <path
                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div>
                    <span class="invoice-id">{{ inv.id }}</span>
                    <p class="invoice-paket-name">{{ inv.paket }}</p>
                  </div>
                </div>
                <div class="invoice-right">
                  <span class="invoice-status" :class="'status-' + inv.status">
                    <span class="status-dot"></span>
                    {{ statusLabel(inv.status) }}
                  </span>
                  <div class="invoice-amount">
                    Rp {{ formatRupiah(inv.amount) }}
                  </div>
                </div>
              </div>

              <!-- Meta Row -->
              <div class="invoice-meta-row">
                <span class="invoice-meta-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="12"
                    height="12"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {{ inv.tanggal }}
                </span>
                <span class="meta-sep">·</span>
                <span class="invoice-meta-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="12"
                    height="12"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  {{ inv.metode }}
                </span>
              </div>

              <!-- Footer / Actions -->
              <div class="invoice-card-footer" @click.stop>
                <button
                  class="btn-action btn-lihat"
                  @click.stop="goToDetail(inv)"
                  title="Lihat Detail"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="13"
                    height="13"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>Detail</span>
                </button>
                <button
                  v-if="inv.status === 'lunas'"
                  class="btn-action btn-unduh"
                  @click.stop="handleUnduh(inv)"
                  :disabled="downloadingId === inv.id"
                  title="Unduh Invoice PDF"
                >
                  <svg
                    v-if="downloadingId !== inv.id"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="13"
                    height="13"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="13"
                    height="13"
                    class="spin"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span>{{
                    downloadingId === inv.id ? "Menyiapkan..." : "Unduh PDF"
                  }}</span>
                </button>
                <button
                  v-if="inv.status === 'pending'"
                  class="btn-action btn-bayar"
                  @click.stop="handleBayar(inv)"
                  title="Bayar Sekarang"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="13"
                    height="13"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  <span>Bayar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- end scroll-body -->

      <!-- ===== BOTTOM NAV (mobile only) ===== -->
      <DashboardBottomNav class="mobile-only" />
    </div>

    <!-- ===== MOBILE DRAWER ===== -->
    <Transition name="drawer">
      <div v-if="drawerOpen" class="drawer-overlay" @click="drawerOpen = false">
        <div class="drawer" @click.stop>
          <DashboardSidebar :user="user" />
        </div>
      </div>
    </Transition>

    <!-- ===== TOAST NOTIF ===== -->
    <Transition name="toast">
      <div v-if="toastMsg" class="toast" :class="'toast-' + toastType">
        <svg
          v-if="toastType === 'success'"
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
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="16"
          height="16"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import DashboardSidebar from "~/components/DashboardSidebar.vue";
import DashboardBottomNav from "~/components/DashboardBottomNav.vue";
import { useCustomerIdentity } from "~/composables/useCustomerIdentity";
import { useAccountStore } from "~/stores/useAccountStore";
import { mapOrderToCustomerInvoice } from "~/config/paket";

// ===== DRAWER =====
const drawerOpen = ref(false);

// ===== DROPDOWN =====
const dropdownOpen = ref(false);
const toggleDropdown = () => (dropdownOpen.value = !dropdownOpen.value);
const closeDropdown = () => (dropdownOpen.value = false);

const handleEditProfile = () => {
  closeDropdown();
  navigateTo("/pengaturan");
};
const handleTutorial = () => {
  closeDropdown();
  navigateTo("/tutorial");
};
const handleLogout = () => {
  closeDropdown();
  return logoutAndRedirect("/login");
};

// ===== USER DATA =====
const { user, logoutAndRedirect } = useCustomerIdentity();

function getInitials(name) {
  if (!name) return "?";
  return String(name).trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

// ===== SEARCH & FILTER =====
const searchQuery = ref("");
const filterStatus = ref("semua");

// ===== DOWNLOAD STATE =====
const downloadingId = ref(null);

// ===== TOAST =====
const toastMsg = ref("");
const toastType = ref("success");
let toastTimer = null;
const showToast = (msg, type = "success") => {
  toastMsg.value = msg;
  toastType.value = type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMsg.value = "";
  }, 3000);
};

// ===== NAVIGASI KE HALAMAN DETAIL INVOICE =====
const goToDetail = (inv) => {
  navigateTo(`/invoice/${inv.id}`);
};

// ===== UNDUH PDF INVOICE =====
// Membuka tab baru dengan tampilan identik halaman _id_.vue, lalu auto-print
const handleUnduh = async (inv) => {
  if (downloadingId.value) return;
  downloadingId.value = inv.id;
  try {
    const html = generateInvoiceHtml(inv);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => {
        setTimeout(() => {
          win.print();
          URL.revokeObjectURL(url);
        }, 600);
      };
    } else {
      // Fallback jika pop-up diblokir
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${inv.id}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
    showToast(`Invoice ${inv.id} siap diunduh`, "success");
  } catch {
    showToast("Gagal mengunduh invoice", "error");
  } finally {
    downloadingId.value = null;
  }
};

// ===== GENERATE HTML — identik tampilan halaman _id_.vue =====
const generateInvoiceHtml = (inv) => {
  // Resolve badge class & label (sama persis dengan _id_.vue statusBadge computed)
  const statusMap = {
    lunas: {
      label: "Lunas",
      dotColor: "#10b981",
      bg: "#d1fae5",
      color: "#065f46",
    },
    dikonfirmasi: {
      label: "Dibayar",
      dotColor: "#10b981",
      bg: "#d1fae5",
      color: "#065f46",
    },
    selesai: {
      label: "Selesai",
      dotColor: "#10b981",
      bg: "#d1fae5",
      color: "#065f46",
    },
    pending: {
      label: "Menunggu Pembayaran",
      dotColor: "#f59e0b",
      bg: "#fef9c3",
      color: "#92400e",
    },
    menunggu_konfirmasi: {
      label: "Menunggu Konfirmasi",
      dotColor: "#3b82f6",
      bg: "#dbeafe",
      color: "#1d4ed8",
    },
    gagal: {
      label: "Gagal",
      dotColor: "#dc2626",
      bg: "#fee2e2",
      color: "#dc2626",
    },
    cancel: {
      label: "Cancel",
      dotColor: "#dc2626",
      bg: "#fee2e2",
      color: "#dc2626",
    },
    dibatalkan: {
      label: "Dibatalkan",
      dotColor: "#dc2626",
      bg: "#fee2e2",
      color: "#dc2626",
    },
  };
  const s = statusMap[inv.status] ?? statusMap["pending"];

  // Format tanggal persis seperti formattedDate di _id_.vue
  let tglFormatted = inv.tanggal || "-";
  try {
    if (inv.tanggal) {
      const d = new Date(inv.tanggal);
      const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      const time = `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}.${String(d.getSeconds()).padStart(2, "0")}`;
      tglFormatted = `${date}, ${time}`;
    }
  } catch {
    /* pakai nilai asli */
  }

  const rp = (n) => {
    if (!n && n !== 0) return "0";
    return Math.abs(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Baris diskon & kode unik hanya tampil jika ada (sama logika _id_.vue v-if)
  const diskonRow = inv.diskon
    ? `<div class="receipt-row">
        <span class="row-label">Diskon${inv.promoKode ? " (" + inv.promoKode + ")" : ""}</span>
        <span class="row-val" style="color:#065f46">- Rp ${rp(inv.diskon)}</span>
      </div>`
    : "";

  const bankRow = inv.bank
    ? `<div class="receipt-row">
        <span class="row-label">Bank</span>
        <span class="row-val">${inv.bank}</span>
      </div>`
    : "";

  const namaRow = inv.nama
    ? `<div class="receipt-row">
        <span class="row-label">Nama</span>
        <span class="row-val">${inv.nama}</span>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Invoice ${inv.id}</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Nunito','Segoe UI',sans-serif;background:#f0f7f6;color:#1a2e45;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:32px 16px 48px}
    .co-phone{width:100%;max-width:460px}
    /* Header hijau — identik .trx-header */
    .trx-header{display:flex;align-items:center;justify-content:space-between;padding:20px 20px 100px;background:#1eac99;border-radius:18px 18px 0 0}
    .trx-header-title{font-size:17px;font-weight:800;color:#fff;letter-spacing:0.2px}
    .print-badge{font-size:11px;font-weight:700;color:rgba(255,255,255,0.75);background:rgba(255,255,255,0.18);padding:4px 10px;border-radius:20px}
    /* Body overlap */
    .trx-body{padding:0 16px 32px;margin-top:-60px}
    /* Receipt card — identik .receipt-card */
    .receipt-card{background:#fff;border-radius:18px;box-shadow:0 4px 28px rgba(0,0,0,0.1);padding:24px 20px 20px}
    /* Brand */
    .receipt-brand{font-size:26px;font-weight:900;text-align:center;margin-bottom:14px;letter-spacing:-0.5px}
    .brand-play{color:#1a2e45}
    .brand-moment{color:#1eac99}
    /* Meta */
    .receipt-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
    .meta-date{font-size:11px;color:#9ca3af;font-weight:600}
    .meta-kode{font-size:12px;font-weight:900;color:#1a2e45;font-family:monospace;letter-spacing:2px}
    .receipt-line{height:1px;background:#edf2f7;margin-bottom:14px}
    /* Status badge */
    .status-wrap{display:flex;justify-content:center;margin-bottom:10px}
    .status-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 16px;border-radius:999px;font-size:13px;font-weight:800;background:${s.bg};color:${s.color}}
    .status-dot{width:8px;height:8px;border-radius:50%;background:${s.dotColor};display:inline-block;flex-shrink:0}
    /* Total */
    .receipt-total{font-size:28px;font-weight:900;color:#1a2e45;text-align:center;letter-spacing:-0.5px;margin-bottom:16px}
    /* Dashed divider */
    .receipt-dash{border-top:2px dashed #e2f4f2;margin:4px 0 16px}
    /* Rows */
    .receipt-section-title{font-size:10.5px;font-weight:800;color:#94a3b8;letter-spacing:0.8px;margin:0 0 10px}
    .receipt-rows{display:flex;flex-direction:column;gap:11px}
    .receipt-row{display:flex;justify-content:space-between;align-items:center;gap:12px}
    .row-label{font-size:13px;color:#9ca3af;font-weight:600;flex-shrink:0}
    .row-val{font-size:13px;color:#1a2e45;font-weight:700;text-align:right;word-break:break-all}
    .fw{font-weight:900}
    .receipt-divider{height:1px;background:#edf2f7;margin:2px 0}
    .row-label-total{font-size:15px;font-weight:800;color:#1a2e45}
    .row-val-total{font-size:18px;font-weight:900;color:#1a2e45}
    /* Footer note */
    .receipt-footer-note{margin-top:20px;text-align:center;font-size:11px;color:#cbd5e1;font-weight:600;letter-spacing:0.5px}
    /* Print styles */
    @media print{
      body{background:#fff;padding:0}
      .trx-header{border-radius:0;padding-bottom:80px}
      .receipt-card{box-shadow:none}
      .print-badge{display:none}
    }
  </style>
</head>
<body>
  <div class="co-phone">
    <div class="trx-header">
      <span class="trx-header-title">Transaksi</span>
      <span class="print-badge">Invoice PDF</span>
    </div>
    <div class="trx-body">
      <div class="receipt-card">
        <div class="receipt-brand">
          <span class="brand-play">Play</span><span class="brand-moment">Moment</span>
        </div>
        <div class="receipt-meta">
          <span class="meta-date">${tglFormatted}</span>
          <span class="meta-kode">${inv.id}</span>
        </div>
        <div class="receipt-line"></div>
        <div class="status-wrap">
          <span class="status-badge">
            <span class="status-dot"></span>
            ${s.label}
          </span>
        </div>
        <div class="receipt-total">Rp ${rp(inv.amount)}</div>
        <div class="receipt-dash"></div>
        <div class="receipt-rows">
          <p class="receipt-section-title">DETAIL PESANAN</p>
          ${namaRow}
          <div class="receipt-row">
            <span class="row-label">Email</span>
            <span class="row-val">${inv.email || inv.deskripsi || "-"}</span>
          </div>
          <div class="receipt-row">
            <span class="row-label">Paket</span>
            <span class="row-val fw">${inv.paket}</span>
          </div>
          <div class="receipt-row">
            <span class="row-label">Metode Bayar</span>
            <span class="row-val">${(inv.metode || "").toUpperCase()}</span>
          </div>
          ${bankRow}

          <div class="receipt-divider"></div>
          <p class="receipt-section-title">RINCIAN HARGA</p>

          <div class="receipt-row">
            <span class="row-label">Harga Paket</span>
            <span class="row-val">Rp ${rp(inv.harga ?? inv.amount)}</span>
          </div>
          ${diskonRow}
          ${inv.kodeUnik ? `<div class="receipt-row"><span class="row-label">Kode Unik</span><span class="row-val" style="color:#7ecec4">- ${inv.kodeUnik}</span></div>` : ""}

          <div class="receipt-divider"></div>

          <div class="receipt-row" style="padding-top:4px">
            <span class="row-label-total">Total Bayar</span>
            <span class="row-val-total">Rp ${rp(inv.amount)}</span>
          </div>
        </div>
        <div class="receipt-footer-note">PlayMoment · ${inv.id}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
};

const handleBayar = (inv) => navigateTo(`/invoice/${inv.id}`);

// ===== FORMAT RUPIAH =====
const formatRupiah = (num) => {
  if (!num) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// ===== STATUS LABEL =====
const statusLabel = (s) => {
  if (s === "lunas") return "Lunas";
  if (s === "pending") return "Menunggu Pembayaran";
  if (s === "gagal") return "Gagal";
  return s;
};

// ===== DATA INVOICE =====
const accountStore = useAccountStore();
const invoices = computed(() => {
  const customer = accountStore.getCustomerByEmail(user.value?.email);
  const ref = customer ?? { email: user.value?.email };
  return accountStore
    .customerOrders(ref)
    .map((o) => ({
      // field dari mapOrderToCustomerInvoice (id, status, amount, tanggal, paket, metode, deskripsi)
      ...mapOrderToCustomerInvoice(o),
      // field tambahan untuk PDF — identik dengan order computed di _id_.vue
      email: o?.email || "",
      nama: o?.nama || "",
      bank: o?.bank || "",
      harga: o?.harga ?? 0,
      diskon: o?.diskon ?? 0,
      promoKode: o?.promoKode || "",
      kodeUnik: o?.kodeUnik ?? 0,
    }))
    .sort((a, b) => (b.tanggal || "").localeCompare(a.tanggal || ""));
});

// ===== FILTERED =====
const filteredInvoices = computed(() => {
  return invoices.value.filter((inv) => {
    const matchSearch =
      inv.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inv.paket.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inv.deskripsi.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus =
      filterStatus.value === "semua" || inv.status === filterStatus.value;
    return matchSearch && matchStatus;
  });
});
</script>

<style scoped>
/* ===========================
   LAYOUT
=========================== */
.dashboard-layout {
  display: flex;
  min-height: 100dvh;
  background: #f0f7f6;
  font-family: "Nunito", "Segoe UI", sans-serif;
}
.sidebar-slot {
  display: none;
}
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* ===========================
   TOPBAR
=========================== */
.topbar {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  background: #fff;
  border-bottom: 1px solid #edf2f7;
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 14px;
}
.topbar-menu {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
  flex-shrink: 0;
}
.topbar-menu span {
  display: block;
  width: 22px;
  height: 2.5px;
  background: #1a2e45;
  border-radius: 2px;
}
.topbar-title {
  font-size: 19px;
  font-weight: 800;
  color: #1a2e45;
  line-height: 1.2;
}
.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}
.topbar-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7ecec4, #2a9d8f);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.topbar-avatar:hover {
  background: linear-gradient(135deg, #6abfb4, #228b7e);
}
.topbar-avatar-initials {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.5px;
  user-select: none;
  line-height: 1;
}

/* Profile Dropdown */
.profile-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  min-width: 220px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(26, 46, 69, 0.15);
  overflow: hidden;
  z-index: 200;
}
.dropdown-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px 12px;
}
.dropdown-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7ecec4, #2a9d8f);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dropdown-paket {
  font-size: 10px;
  font-weight: 700;
  color: #7ecec4;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 2px;
}
.dropdown-name {
  font-size: 13px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 1px;
}
.dropdown-email {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
  word-break: break-all;
}
.dropdown-divider {
  height: 1px;
  background: #f0f4f8;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #1a2e45;
  font-family: inherit;
  transition: background 0.15s;
  text-align: left;
}
.dropdown-item:hover {
  background: #f7fafa;
}
.dropdown-logout {
  color: #e53e3e;
}
.dropdown-logout:hover {
  background: #fff5f5;
}

/* ===========================
   SCROLL BODY
=========================== */
.scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px 96px;
}

/* ===========================
   TOOLBAR
=========================== */
.toolbar {
  background: #fff;
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 16px;
  border: 1.5px solid #edf2f7;
}
.toolbar-row {
  display: flex;
  gap: 10px;
  align-items: center;
}
.search-wrap {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 10px;
  color: #9ca3af;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 9px 12px 9px 32px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 13px;
  color: #1a2e45;
  font-weight: 600;
  outline: none;
  font-family: inherit;
  background: #f8fafc;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.search-input:focus {
  border-color: #7ecec4;
  box-shadow: 0 0 0 3px rgba(126, 206, 196, 0.15);
}
.filter-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.filter-icon {
  position: absolute;
  left: 10px;
  color: #9ca3af;
  pointer-events: none;
}
.filter-select {
  background: #f8fafc;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 9px 12px 9px 30px;
  font-size: 13px;
  color: #1a2e45;
  font-weight: 600;
  outline: none;
  font-family: inherit;
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.2s;
  appearance: none;
}
.filter-select:focus {
  border-color: #7ecec4;
}
.toolbar-count {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
  margin: 10px 0 0;
}
.toolbar-count strong {
  color: #1a2e45;
}

/* ===========================
   EMPTY STATE
=========================== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 20px;
  border: 1.5px solid #edf2f7;
}
.empty-icon {
  width: 80px;
  height: 80px;
  background: #f0f7f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.empty-title {
  font-size: 16px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 6px;
}
.empty-sub {
  font-size: 13px;
  color: #9ca3af;
  font-weight: 600;
  margin: 0;
}

/* ===========================
   INVOICE LIST
=========================== */
.invoice-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.invoice-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1.5px solid #edf2f7;
  transition:
    box-shadow 0.2s,
    transform 0.2s,
    border-color 0.2s;
  display: flex;
  cursor: pointer;
}
.invoice-card:hover {
  box-shadow: 0 6px 24px rgba(26, 46, 69, 0.1);
  transform: translateY(-2px);
  border-color: #c7ede9;
}
.card-accent {
  width: 4px;
  flex-shrink: 0;
  border-radius: 0;
}
.accent-lunas {
  background: linear-gradient(180deg, #10b981, #059669);
}
.accent-pending {
  background: linear-gradient(180deg, #f59e0b, #d97706);
}
.accent-gagal {
  background: linear-gradient(180deg, #ef4444, #dc2626);
}

.invoice-card-inner {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* Card Header */
.invoice-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 18px 10px;
  gap: 12px;
}
.invoice-id-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.invoice-doc-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: #f0f7f6;
  color: #2a9d8f;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.invoice-id {
  font-size: 13px;
  font-weight: 800;
  color: #1a2e45;
  font-family: monospace;
  display: block;
  letter-spacing: 0.3px;
}
.invoice-paket-name {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
  margin: 2px 0 0;
}
.invoice-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}
.invoice-status {
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}
.status-lunas {
  background: #d1fae5;
  color: #065f46;
}
.status-pending {
  background: #fef3c7;
  color: #92400e;
}
.status-gagal {
  background: #fee2e2;
  color: #991b1b;
}
.invoice-amount {
  font-size: 16px;
  font-weight: 900;
  color: #1a2e45;
}

/* Meta Row */
.invoice-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 18px 12px;
  flex-wrap: wrap;
}
.invoice-meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
}
.meta-sep {
  color: #d1d5db;
  font-size: 12px;
}

/* Card Footer / Actions */
.invoice-card-footer {
  display: flex;
  border-top: 1px solid #f0f4f8;
}
.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
  padding: 11px 8px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
  background: transparent;
  color: #6b7280;
  transition:
    background 0.15s,
    color 0.15s;
  letter-spacing: 0.2px;
}
.btn-action + .btn-action {
  border-left: 1px solid #f0f4f8;
}
.btn-action:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.btn-lihat:hover {
  background: #f0f7f6;
  color: #2a9d8f;
}
.btn-unduh {
  color: #0d9488;
}
.btn-unduh:not(:disabled):hover {
  background: #f0fdf4;
  color: #065f46;
}
.btn-bayar {
  color: #d97706;
}
.btn-bayar:hover {
  background: #fffbeb;
  color: #92400e;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spin {
  animation: spin 0.9s linear infinite;
}

/* ===========================
   TOAST
=========================== */
.toast {
  position: fixed;
  bottom: 88px;
  left: 50%;
  transform: translateX(-50%);
  background: #1a2e45;
  color: #fff;
  padding: 11px 20px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 999;
  box-shadow: 0 8px 24px rgba(26, 46, 69, 0.25);
  white-space: nowrap;
}
.toast-success {
  background: #065f46;
}
.toast-error {
  background: #991b1b;
}
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s,
    transform 0.25s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

/* ===========================
   MOBILE DRAWER
=========================== */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 300;
}
.drawer {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: min(240px, 80vw);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #1a2e45;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
}
.drawer > :first-child {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  width: 100% !important;
  min-width: 0 !important;
}

/* ===========================
   TRANSITIONS
=========================== */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.18s,
    transform 0.18s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s;
}
.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform 0.25s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .drawer,
.drawer-leave-to .drawer {
  transform: translateX(-100%);
}

/* ===========================
   HELPERS
=========================== */
.mobile-only {
  display: flex;
}
.desktop-only {
  display: none;
}
.drawer :deep(.sidebar) {
  width: 100% !important;
  min-width: 0 !important;
  height: 100% !important;
  min-height: 100% !important;
  position: relative !important;
  top: auto !important;
  box-sizing: border-box;
}

/* ===========================
   RESPONSIVE — TABLET 640px+
=========================== */
@media (min-width: 640px) {
  .scroll-body {
    padding: 24px 24px 100px;
  }
  .invoice-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .toast {
    bottom: 30px;
  }
}

/* ===========================
   RESPONSIVE — DESKTOP 1024px+
=========================== */
@media (min-width: 1024px) {
  .mobile-only {
    display: none !important;
  }
  .desktop-only {
    display: block;
  }
  .sidebar-slot {
    display: flex;
  }
  .scroll-body {
    padding: 32px 32px 40px;
  }
  .invoice-list {
    grid-template-columns: repeat(2, 1fr);
  }
  .toast {
    bottom: 30px;
  }
}

/* ===========================
   RESPONSIVE — WIDE 1280px+
=========================== */
@media (min-width: 1280px) {
  .invoice-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
