<template>
  <div class="dashboard-layout" @click="closeDropdown">

    <!-- ===== NAV LOADING OVERLAY ===== -->
    <Transition name="nav-loading">
      <div v-if="navLoading" class="nav-loading-overlay">
        <div class="nav-loading-box">
          <div class="nav-loading-logo-wrap">
            <svg class="nav-spin-ring" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="5"/>
              <circle cx="50" cy="50" r="44" fill="none" stroke="#fff" stroke-width="5"
                stroke-linecap="round" stroke-dasharray="80 196" stroke-dashoffset="0"/>
            </svg>
            <img src="/playmoment/logo-white.png" alt="PlayMoment" class="nav-loading-logo" />
          </div>
          <p class="nav-loading-title">{{ navLoadingText }}</p>
          <p class="nav-loading-sub">Mohon tunggu sebentar...</p>
        </div>
      </div>
    </Transition>
    <!-- ===== SIDEBAR (desktop only) ===== -->
    <DashboardSidebar class="sidebar-slot" :user="user" />

    <!-- ===== MAIN AREA ===== -->
    <div class="main-area">
      <!-- ===== TOPBAR ===== -->
      <header class="topbar">
        <!-- Mobile: hamburger -->
        <button
          class="topbar-menu mobile-only"
          aria-label="Menu"
          @click.stop="drawerOpen = !drawerOpen"
        >
          <span></span><span></span><span></span>
        </button>
        <h1 class="topbar-title">Undangan Saya</h1>
        <!-- Desktop: welcome text -->
        <p class="topbar-welcome desktop-only">
          Kelola semua undangan Anda di sini
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
                  <span style="font-size:13px;font-weight:800;color:#7ecec4;user-select:none;">{{ getInitials(user?.name) }}</span>
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
                @click.stop="handleLogoutSynced"
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
            <!-- Search -->
            <div class="search-wrap">
              <svg
                class="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="16"
                height="16"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                class="search-input"
                v-model="searchQuery"
                placeholder="Cari undangan..."
              />
            </div>
            <!-- Filter Status -->
            <select class="filter-select" v-model="filterStatus">
              <option value="semua">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="draft">Draft</option>
              <option value="kadaluarsa">Kadaluarsa</option>
            </select>
          </div>

          <!-- Tombol Buat Undangan — full width -->
          <button class="btn-buat-undangan" @click="router.push('/tema')">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              width="16"
              height="16"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Buat Undangan Baru</span>
          </button>
        </div>

        <!-- ===== SUMMARY STRIP ===== -->
        <div class="summary-strip">
          <div v-for="(s, i) in summaryStats" :key="i" class="summary-item">
            <span class="summary-num">{{ s.value }}</span>
            <span class="summary-label">{{ s.label }}</span>
          </div>
        </div>

        <!-- ===== SKELETON LOADING ===== -->
        <div v-if="isLoading" class="invitation-list">
          <div v-for="i in 2" :key="i" class="skeleton-card">
            <div class="skeleton-thumb"></div>
            <div class="skeleton-body">
              <div class="skeleton-line w70"></div>
              <div class="skeleton-line w40"></div>
              <div class="skeleton-line w55"></div>
              <div class="skeleton-line w80 mt8"></div>
            </div>
            <div class="skeleton-actions"></div>
          </div>
        </div>

        <!-- ===== EMPTY STATE ===== -->
        <div v-else-if="filteredInvitations.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7ecec4"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              width="48"
              height="48"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <polyline points="3,5 12,13 21,5" />
            </svg>
          </div>
          <p class="empty-title">Belum ada undangan</p>
          <p class="empty-sub">
            Mulai buat undangan digital pertama Anda sekarang
          </p>
          <button class="btn-buat-undangan" @click="router.push('/tema')">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              width="16"
              height="16"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Buat Undangan Pertama</span>
          </button>
        </div>

        <!-- ===== DAFTAR UNDANGAN ===== -->
        <div v-else class="invitation-list">
          <div
            v-for="inv in filteredInvitations"
            :key="inv.id"
            class="invitation-card"
          >
            <!-- Thumbnail Foto -->
            <div class="card-thumb">
              <img
                v-if="inv.foto"
                :src="inv.foto"
                :alt="inv.judul"
                class="card-thumb-img"
              />
              <div
                v-else
                class="card-thumb-placeholder"
                :style="{ background: inv.themeColor }"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.7)"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="32"
                  height="32"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span class="card-thumb-noimg">Belum ada foto</span>
              </div>
              <!-- Overlay badge tema -->
              <div class="card-thumb-overlay">
                <span class="card-theme-label">{{ inv.tema }}</span>
              </div>
            </div>

            <!-- Info Utama -->
            <div class="card-body">
              <div class="card-header-row">
                <h3 class="card-title">{{ inv.judul }}</h3>
                <span class="card-status" :class="'status-' + inv.status">
                  {{ statusLabel(inv.status) }}
                </span>
              </div>

              <p class="card-mempelai">{{ inv.mempelai }}</p>

              <div class="card-meta-row">
                <span class="card-meta-item">
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
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {{ inv.tanggal }}
                </span>
                <span class="card-meta-item">
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
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  {{ inv.tamu }} Tamu
                </span>
                <span class="card-meta-item">
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
                      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    />
                  </svg>
                  {{ inv.ucapan }} Ucapan
                </span>
              </div>

              <!-- Link undangan -->
              <div class="card-link-row">
                <span class="card-link-text">{{ inv.link }}</span>
                <button
                  class="btn-copy"
                  @click="copyLink(inv.link)"
                  :class="{ copied: copiedId === inv.id }"
                  @click.stop="
                    copiedId = inv.id;
                    copyLink(inv.link);
                  "
                >
                  <svg
                    v-if="copiedId !== inv.id"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="13"
                    height="13"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path
                      d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                    />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="13"
                    height="13"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {{ copiedId === inv.id ? "Disalin!" : "Salin" }}
                </button>
              </div>
            </div>

            <!-- Aksi baris atas: Lihat, Kirim, Hapus -->
            <div class="card-actions">
              <button
                class="btn-action btn-lihat"
                @click="handleLihat(inv)"
                title="Lihat Undangan"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="15"
                  height="15"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Lihat</span>
              </button>
              <button
                class="btn-action btn-kirim"
                @click="handleKirim(inv)"
                title="Kirim Undangan"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="15"
                  height="15"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>Kirim</span>
              </button>
              <button
                class="btn-action btn-hapus"
                @click="handleHapus(inv)"
                title="Hapus Undangan"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="15"
                  height="15"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  />
                </svg>
                <span>Hapus</span>
              </button>
            </div>

            <!-- Aksi baris bawah: Edit -->
            <div class="card-actions-edit">
              <button
                class="btn-edit-full"
                @click="handleEdit(inv)"
                style="
                  border-top-left-radius: 0 !important;
                  border-top-right-radius: 0 !important;
                  border-bottom-left-radius: 18px !important;
                  border-bottom-right-radius: 18px !important;
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="15"
                  height="15"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  />
                </svg>
                Edit Undangan
              </button>
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

    <!-- ===== MODAL KONFIRMASI HAPUS ===== -->
    <Transition name="modal">
      <div v-if="hapusTarget" class="modal-overlay" @click="hapusTarget = null">
        <div class="modal-box" @click.stop>
          <div class="modal-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e53e3e"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              width="32"
              height="32"
            >
              <polyline points="3 6 5 6 21 6" />
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              />
            </svg>
          </div>
          <h3 class="modal-title">Hapus Undangan?</h3>
          <p class="modal-desc">
            Undangan <strong>{{ hapusTarget?.judul }}</strong> akan dihapus
            permanen dan tidak bisa dikembalikan.
          </p>
          <div class="modal-actions">
            <button class="btn-modal-cancel" @click="hapusTarget = null">
              Batal
            </button>
            <button class="btn-modal-confirm" @click="konfirmasiHapus">
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
const router = useRouter();
import DashboardSidebar from "~/components/DashboardSidebar.vue";
import DashboardBottomNav from "~/components/DashboardBottomNav.vue";
import { useAccountStore } from "~/stores/useAccountStore";
import { useCustomerIdentity } from "~/composables/useCustomerIdentity";

// ===== DRAWER =====
const drawerOpen = ref(false);
const accountStore = useAccountStore();
const isLoading = ref(true);

onMounted(async () => {
  await accountStore.loadAll();
  const invs = accountStore.customerInvitations;
  await Promise.all(
    invs
      .filter((inv) => !inv.editorData && inv.editorId)
      .map((inv) => accountStore.loadInvitationEditorData(inv.editorId))
  );
  isLoading.value = false;
});

// ===== DROPDOWN =====
const dropdownOpen = ref(false);
const toggleDropdown = () => (dropdownOpen.value = !dropdownOpen.value);
const closeDropdown = () => (dropdownOpen.value = false);

const handleEditProfile = () => {
  closeDropdown();
  router.push("/pengaturan");
};
const handleTutorial = () => {
  closeDropdown();
  router.push("/tutorial");
};
// handleLogoutSynced dipakai oleh tombol logout

// ===== USER DATA (sinkron dari store) =====
const { user, logoutAndRedirect } = useCustomerIdentity();
const handleLogoutSynced = async () => {
  closeDropdown();
  drawerOpen.value = false;
  await logoutAndRedirect("/login");
};

// ===== SEARCH & FILTER =====
const searchQuery = ref("");
const filterStatus = ref("semua");

// ===== COPY LINK =====
const copiedId = ref(null);
const copyLink = (link) => {
  navigator.clipboard.writeText(link).catch(() => {});
  setTimeout(() => {
    copiedId.value = null;
  }, 2000);
};

// ===== HAPUS =====
const hapusTarget = ref(null);
const handleHapus = (inv) => {
  hapusTarget.value = inv;
};
const konfirmasiHapus = () => {
  if (!hapusTarget.value) return;
  accountStore.deleteInvitation(hapusTarget.value.id);
  hapusTarget.value = null;
};

// ===== NAV LOADING =====
const navLoading = ref(false);
const navLoadingText = ref("Memuat halaman...");

function goTo(path, text = "Memuat halaman...") {
  navLoading.value = true;
  navLoadingText.value = text;
  router.push(path);
}

// ===== NAVIGASI =====
const handleLihat = (inv) => goTo(`/preview/${inv.slug}`, "Memuat undangan...");
const handleEdit = (inv) => goTo(`/edit-undangan/${inv.editorId || inv.slug}`, "Memuat editor...");
const handleKirim = (inv) => goTo(`/edit-undangan/${inv.editorId || inv.slug}/kirim`, "Memuat halaman kirim...");

function getInitials(name) {
  if (!name) return "?";
  return String(name).trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

// ===== STATUS LABEL =====
const statusLabel = (s) => {
  if (s === "aktif") return "Aktif";
  if (s === "draft") return "Draft";
  if (s === "nonaktif") return "Nonaktif";
  if (s === "kadaluarsa") return "Kadaluarsa";
  return s;
};

// ===== DATA UNDANGAN =====
const invitations = computed(() => accountStore.customerInvitations);

// ===== FILTER COMPUTED =====
const filteredInvitations = computed(() => {
  return invitations.value
    .filter((inv) => {
      const matchSearch =
        searchQuery.value.trim() === "" ||
        inv.judul.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        inv.customer.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchStatus =
        filterStatus.value === "semua" || inv.status === filterStatus.value;
      return matchSearch && matchStatus;
    })
    .map((inv) => ({
      ...inv,
      mempelai: inv.customer,
      tanggal: inv.tanggalAcara,
      judul: inv.editorData?.undangan?.judulPengaturan || inv.judul || "",
      // Foto: pakai thumbnailWa dari editorData, fallback ke fotoCouple, lalu kolom foto DB
      foto: inv.editorData?.undangan?.thumbnailWa
        || inv.editorData?.undangan?.fotoCouple
        || inv.foto
        || "",
      // Total semua tamu (hadir, tidak hadir, belum konfirmasi)
      tamu: Array.isArray(inv.editorData?.daftarTamu)
        ? inv.editorData.daftarTamu.length
        : (inv.tamu ?? 0),
      ucapan: Array.isArray(inv.editorData?.daftarTamu)
        ? inv.editorData.daftarTamu.filter(t => t.ucapan && String(t.ucapan).trim()).length
        : (inv.ucapan ?? 0),
    }));
});

// ===== SUMMARY STATS =====
const summaryStats = computed(() => [
  { label: "Total Undangan", value: invitations.value.length },
  {
    label: "Aktif",
    value: invitations.value.filter((i) => i.status === "aktif").length,
  },
  {
    label: "Draft",
    value: invitations.value.filter((i) => i.status === "draft").length,
  },
  {
    label: "Total Tamu",
    value: invitations.value.reduce((a, b) => a + b.tamu, 0),
  },
]);
</script>

<style scoped>
/* ===========================
   LAYOUT (sama persis dashboard)
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
  gap: 12px;
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
  flex: 1;
  font-size: 20px;
  font-weight: 800;
  color: #1a2e45;
}

.topbar-welcome {
  flex: 1;
  font-size: 15px;
  color: #6b7280;
}

.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.topbar-avatar {
  width: 42px;
  height: 42px;
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
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.5px;
  user-select: none;
  line-height: 1;
}

/* ===========================
   DROPDOWN
=========================== */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 230px;
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
  background: #1a2e45;
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

/* ===========================
   SCROLL BODY
=========================== */
.scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px 100px;
}

/* ===========================
   TOOLBAR
=========================== */
.toolbar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.toolbar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-wrap {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 10px 14px 10px 36px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 13px;
  color: #1a2e45;
  font-weight: 600;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus {
  border-color: #7ecec4;
}
.search-input::placeholder {
  color: #b0bec5;
  font-weight: 500;
}

.filter-select {
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px;
  color: #1a2e45;
  font-weight: 600;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
  cursor: pointer;
  flex-shrink: 0;
}
.filter-select:focus {
  border-color: #7ecec4;
}

.btn-buat-undangan {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: #1a2e45;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.2s,
    transform 0.18s;
}
.btn-buat-undangan:hover {
  background: #243d5c;
  transform: translateY(-1px);
}

/* ===========================
   SUMMARY STRIP
=========================== */
.summary-strip {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.summary-item {
  flex: 1;
  min-width: 100px;
  background: #fff;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1.5px solid #e2f4f2;
  border-left: 4px solid #7ecec4;
}
.summary-num {
  font-size: 26px;
  font-weight: 900;
  color: #1a2e45;
  line-height: 1;
}
.summary-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
  margin-top: 4px;
}

/* ===========================
   EMPTY STATE
=========================== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 24px;
  gap: 12px;
  background: #fff;
  border-radius: 20px;
  border: 2px dashed #d1ede9;
}
.empty-icon {
  width: 80px;
  height: 80px;
  background: #e8f7f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}
.empty-title {
  font-size: 18px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0;
}
.empty-sub {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px;
  text-align: center;
}

/* ===========================
   INVITATION LIST
=========================== */
.invitation-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.invitation-card {
  background: #fff;
  border-radius: 18px;
  border: 1.5px solid #e2f4f2;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    box-shadow 0.22s,
    transform 0.22s;
}
.invitation-card:hover {
  box-shadow: 0 6px 28px rgba(126, 206, 196, 0.16);
  transform: translateY(-2px);
}

/* Thumbnail Foto */
.card-thumb {
  position: relative;
  height: 160px;
  overflow: hidden;
  background: #e2f4f2;
  flex-shrink: 0;
}
.card-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}
.invitation-card:hover .card-thumb-img {
  transform: scale(1.04);
}
.card-thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.card-thumb-noimg {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.3px;
}
.card-thumb-overlay {
  position: absolute;
  bottom: 10px;
  left: 12px;
}
.card-theme-label {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: rgba(0, 0, 0, 0.38);
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.3px;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* Body */
.card-body {
  padding: 16px 18px 12px;
  flex: 1;
}

button.btn-edit-full {
  border-radius: 0 0 12px 12px !important;
}
.card-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 4px;
}
.card-title {
  font-size: 16px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0;
  flex: 1;
  line-height: 1.3;
}
.card-status {
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}
.status-aktif {
  background: #d1fae5;
  color: #065f46;
}
.status-draft {
  background: #fef3c7;
  color: #92400e;
}
.status-kadaluarsa {
  background: #fee2e2;
  color: #991b1b;
}
.status-nonaktif {
  background: #f3f4f6;
  color: #6b7280;
}

.card-mempelai {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
  margin: 0 0 12px;
}
.card-meta-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.card-meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
}
.card-meta-item svg {
  flex-shrink: 0;
}

/* Link row */
.card-link-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0f7f6;
  border-radius: 10px;
  padding: 8px 12px;
}
.card-link-text {
  flex: 1;
  font-size: 12px;
  color: #7ecec4;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btn-copy {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #7ecec4;
  color: #1a2e45;
  border: none;
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: background 0.2s;
  flex-shrink: 0;
}
.btn-copy.copied {
  background: #6abfb4;
}
.btn-copy:hover {
  background: #6abfb4;
}

/* Aksi baris atas */
.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-top: 1px solid #edf2f7;
}
.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 6px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
  background: #fff;
  color: #1a2e45;
  transition:
    background 0.15s,
    color 0.15s;
  letter-spacing: 0.2px;
}
.btn-action + .btn-action {
  border-left: 1px solid #edf2f7;
}
.btn-lihat:hover {
  background: #f0f7f6;
  color: #2a9d8f;
}
.btn-kirim:hover {
  background: #f0f7f6;
  color: #2a9d8f;
}
.btn-hapus {
  color: #9ca3af;
}
.btn-hapus:hover {
  background: #fff5f5;
  color: #e53e3e;
}

/* Aksi baris bawah — Edit full width */
.card-actions-edit {
  border-top: 1px solid #edf2f7;
  border-radius: 0 0 18px 18px;
  overflow: hidden;
}
.btn-edit-full {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 0px 0px 12px 12px !important;
  width: 100%;
  padding: 11px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  background: #7ecec4;
  color: #1a2e45;
  transition:
    background 0.15s,
    color 0.15s;
  letter-spacing: 0.2px;
}
.btn-edit-full:hover {
  background: #6abfb4;
  color: #1a2e45;
}

/* ===========================
   MODAL KONFIRMASI HAPUS
=========================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-box {
  background: #fff;
  border-radius: 20px;
  padding: 32px 28px;
  max-width: 360px;
  width: 100%;
  text-align: center;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.2);
}
.modal-icon {
  width: 64px;
  height: 64px;
  background: #fff5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.modal-title {
  font-size: 18px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 8px;
}
.modal-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px;
  line-height: 1.6;
}
.modal-actions {
  display: flex;
  gap: 10px;
}
.btn-modal-cancel {
  flex: 1;
  padding: 12px;
  background: #f0f4f8;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #1a2e45;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
}
.btn-modal-cancel:hover {
  background: #e2e8f0;
}
.btn-modal-confirm {
  flex: 1;
  padding: 12px;
  background: #e53e3e;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
}
.btn-modal-confirm:hover {
  background: #c53030;
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

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}
.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
  transition:
    transform 0.2s,
    opacity 0.2s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
  transform: scale(0.93);
  opacity: 0;
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

/* Override sidebar di drawer */
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
  .invitation-card {
    flex-direction: row;
    align-items: stretch;
  }
  .card-thumb {
    width: 140px;
    height: auto;
    min-height: 100px;
    flex-shrink: 0;
  }
  .card-thumb-overlay {
    bottom: 8px;
    left: 8px;
  }
  .card-actions {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 1fr);
    border-top: none;
    border-left: 1px solid #edf2f7;
    min-width: 68px;
  }
  .btn-action + .btn-action {
    border-left: none;
    border-top: 1px solid #edf2f7;
  }
  .btn-action span {
    display: none;
  }
  .btn-action {
    padding: 0;
  }
  .card-actions-edit {
    border-top: none;
    border-left: 1px solid #edf2f7;
    border-radius: 0 0 18px 0;
    min-width: 68px;
  }
  .btn-edit-full {
    height: 100%;
    font-size: 11px;
    padding: 8px 4px;
    flex-direction: column;
    gap: 4px;
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

  .toolbar {
    flex-direction: row;
    align-items: center;
  }
  .toolbar-row {
    flex: 1;
  }
  .btn-buat-undangan {
    width: auto;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .btn-action span {
    display: inline;
  }

  .invitation-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  .invitation-card {
    flex-direction: column;
  }
  .card-thumb {
    width: auto;
    height: 180px;
  }
  .card-thumb-overlay {
    bottom: 10px;
    left: 12px;
  }
  .card-actions {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    border-left: none;
    border-top: 1px solid #edf2f7;
    min-width: unset;
  }
  .btn-action {
    padding: 11px 6px;
  }
  .btn-action + .btn-action {
    border-top: none;
    border-left: 1px solid #edf2f7;
  }
  .card-actions-edit {
    border-left: none;
    border-top: 1px solid #edf2f7;
    border-radius: 0 0 18px 18px;
    min-width: unset;
  }
  .btn-edit-full {
    flex-direction: row;
    font-size: 13px;
    padding: 11px;
    height: auto;
    gap: 7px;
  }
}

/* ===========================
   RESPONSIVE — WIDE 1280px+
=========================== */
@media (min-width: 1280px) {
  .invitation-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ===========================
   SKELETON LOADING
=========================== */
@keyframes skeleton-shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skeleton-card {
  background: #fff;
  border-radius: 18px;
  border: 1.5px solid #e2f4f2;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.skeleton-thumb {
  height: 160px;
  background: linear-gradient(90deg, #e8f4f2 25%, #f0faf9 50%, #e8f4f2 75%);
  background-size: 800px 100%;
  animation: skeleton-shimmer 1.4s infinite;
}

.skeleton-body {
  padding: 16px 18px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e8f4f2 25%, #f0faf9 50%, #e8f4f2 75%);
  background-size: 800px 100%;
  animation: skeleton-shimmer 1.4s infinite;
}

.skeleton-line.w40 { width: 40%; }
.skeleton-line.w55 { width: 55%; }
.skeleton-line.w70 { width: 70%; }
.skeleton-line.w80 { width: 80%; }
.skeleton-line.mt8 { margin-top: 4px; }

.skeleton-actions {
  height: 44px;
  border-top: 1px solid #edf2f7;
  background: linear-gradient(90deg, #e8f4f2 25%, #f0faf9 50%, #e8f4f2 75%);
  background-size: 800px 100%;
  animation: skeleton-shimmer 1.4s infinite;
}

/* ===========================
   NAV LOADING OVERLAY
=========================== */
.nav-loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 60, 55, 0.55);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.nav-loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 40px 36px;
  text-align: center;
  background: #5bbfb5;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  min-width: 260px;
  max-width: 320px;
}

.nav-loading-logo-wrap {
  width: 96px;
  height: 96px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.nav-spin-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  animation: nav-ring-spin 1.1s linear infinite;
}

@keyframes nav-ring-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.nav-loading-logo {
  width: 58px;
  height: 58px;
  object-fit: contain;
  position: relative;
  z-index: 1;
}

.nav-loading-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: 0.2px;
  line-height: 1.4;
}

.nav-loading-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.5;
}

.nav-loading-enter-active,
.nav-loading-leave-active { transition: opacity 0.35s ease; }
.nav-loading-enter-from,
.nav-loading-leave-to     { opacity: 0; }</style>