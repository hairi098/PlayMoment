<template>
  <div class="dashboard-layout" @click="closeDropdown">
    <DashboardSidebar class="sidebar-slot" :user="user" />

    <div class="main-area">
      <!-- TOPBAR -->
      <header class="topbar">
        <button class="topbar-menu mobile-only" aria-label="Menu" @click.stop="drawerOpen = !drawerOpen">
          <span></span><span></span><span></span>
        </button>
        <div class="topbar-center">
          <button class="btn-back" @click="navigateTo('/tutorial')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <p class="topbar-label">Tutorial</p>
            <h1 class="topbar-title">{{ topic.title }}</h1>
          </div>
        </div>

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
              <button class="dropdown-item" @click.stop="navigateTo('/pengaturan')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </button>
              <button class="dropdown-item" @click.stop="navigateTo('/tutorial')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Tutorial
              </button>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item dropdown-logout" @click.stop="logoutAndRedirect('/login')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
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

      <!-- SCROLL BODY -->
      <div class="scroll-body">

        <!-- TOPIC INFO CARD -->
        <div class="topic-info-card">
          <div class="topic-icon-wrap" :style="{ background: topic.bgColor }">
            <span v-html="topic.svg"></span>
          </div>
          <div class="topic-meta">
            <h2 class="topic-name">{{ topic.title }}</h2>
            <p class="topic-desc">{{ topic.desc }}</p>
            <div class="topic-tags">
              <span class="tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                {{ topic.tutorials.length }} tutorial
              </span>
              <span class="tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ topic.duration }}
              </span>
            </div>
          </div>
        </div>

        <!-- PROGRESS BAR -->
        <div class="progress-card">
          <div class="progress-top">
            <span class="progress-label">Progress</span>
            <span class="progress-count">{{ completedCount }} / {{ topic.tutorials.length }} selesai</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>

        <!-- TUTORIAL LIST -->
        <div class="tutorial-list">
          <div
            v-for="(tut, idx) in topic.tutorials"
            :key="tut.id"
            class="tutorial-card"
            :class="{ expanded: expandedId === tut.id, done: tut.done }"
          >
            <!-- Card Header -->
            <div class="card-header" @click="toggleExpand(tut.id)">
              <div class="step-num" :class="{ done: tut.done }">
                <svg v-if="tut.done" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <div class="card-info">
                <p class="card-title">{{ tut.title }}</p>
                <p class="card-sub">{{ tut.subtitle }}</p>
              </div>
              <span class="tag-level" :class="'level-' + tut.level">{{ tut.levelLabel }}</span>
              <div class="card-chevron" :class="{ rotated: expandedId === tut.id }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            <!-- Card Body -->
            <Transition name="expand">
              <div v-if="expandedId === tut.id" class="card-body">

                <!-- Steps -->
                <div class="steps-wrap">
                  <div
                    v-for="(step, si) in tut.steps"
                    :key="si"
                    class="step-row"
                    :class="{ active: si === tut.currentStep, done: si < tut.currentStep }"
                  >
                    <!-- Step connector line -->
                    <div class="step-left">
                      <div class="step-dot" :class="{ done: si < tut.currentStep, active: si === tut.currentStep }">
                        <svg v-if="si < tut.currentStep" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="10" height="10">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span v-else>{{ si + 1 }}</span>
                      </div>
                      <div v-if="si < tut.steps.length - 1" class="step-line" :class="{ done: si < tut.currentStep }"></div>
                    </div>

                    <!-- Step Content -->
                    <div class="step-content" :class="{ active: si === tut.currentStep }">
                      <p class="step-title">{{ step.title }}</p>
                      <p class="step-body">{{ step.body }}</p>

                      <!-- Screenshot placeholder — tampil di step aktif -->
                      <div v-if="si === tut.currentStep && step.hasImage" class="screenshot-wrap">
                        <div class="screenshot-placeholder">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="32" height="32">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                          <p class="screenshot-label">Screenshot: {{ step.imageCaption }}</p>
                          <!-- Ganti div ini dengan <img :src="step.imageUrl" ... /> -->
                        </div>
                      </div>

                      <!-- Tip box -->
                      <div v-if="si === tut.currentStep && step.tip" class="tip-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <p>{{ step.tip }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="card-actions">
                  <button
                    v-if="tut.currentStep > 0 && !tut.done"
                    class="btn-prev"
                    @click.stop="prevStep(tut)"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Sebelumnya
                  </button>
                  <div class="actions-right">
                    <span v-if="tut.done" class="badge-done">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="13" height="13">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Selesai
                    </span>
                    <button v-if="tut.done" class="btn-reset" @click.stop="resetTutorial(tut)">Ulangi</button>
                    <button v-if="!tut.done" class="btn-next" @click.stop="nextStep(tut)">
                      {{ tut.currentStep < tut.steps.length - 1 ? 'Langkah Berikutnya' : 'Tandai Selesai' }}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            </Transition>
          </div>
        </div>

        <!-- NAVIGASI TOPIK LAIN -->
        <div class="nav-topics">
          <p class="nav-topics-label">Topik lainnya</p>
          <div class="nav-topics-grid">
            <div
              v-for="other in otherTopics"
              :key="other.id"
              class="nav-topic-card"
              @click="navigateTo('/tutorial/' + other.slug)"
            >
              <div class="nav-topic-icon" :style="{ background: other.bgColor }">
                <span v-html="other.svg"></span>
              </div>
              <div class="nav-topic-info">
                <p class="nav-topic-title">{{ other.title }}</p>
                <p class="nav-topic-count">{{ other.count }} tutorial</p>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      <DashboardBottomNav class="mobile-only" />
    </div>

    <!-- MOBILE DRAWER -->
    <Transition name="drawer">
      <div v-if="drawerOpen" class="drawer-overlay" @click="drawerOpen = false">
        <div class="drawer" @click.stop>
          <DashboardSidebar :user="user" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import DashboardSidebar from "~/components/DashboardSidebar.vue";
import DashboardBottomNav from "~/components/DashboardBottomNav.vue";
import { useCustomerIdentity } from "~/composables/useCustomerIdentity";

// Route param — ganti dengan useRoute().params.slug di Nuxt
// const slug = useRoute().params.slug

const drawerOpen = ref(false);
const dropdownOpen = ref(false);
const toggleDropdown = () => { dropdownOpen.value = !dropdownOpen.value; };
const closeDropdown = () => { dropdownOpen.value = false; };

const { user, logoutAndRedirect } = useCustomerIdentity();

function getInitials(name) {
  if (!name) return "?";
  return String(name).trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

// ===== DATA TOPIK =====
// Di implementasi nyata, fetch berdasarkan slug dari route param
const topic = ref({
  id: 2,
  slug: "membuat-undangan",
  title: "Membuat Undangan",
  desc: "Cara membuat undangan digital dari nol hingga siap dibagikan ke tamu.",
  duration: "15 menit",
  bgColor: "#eef2ff",
  svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  tutorials: [
    {
      id: 1,
      title: "Buka & Navigasi ke Menu Undangan",
      subtitle: "Temukan menu undangan dari dashboard utama.",
      level: "easy",
      levelLabel: "Mudah",
      done: false,
      currentStep: 0,
      steps: [
        {
          title: "Login ke dashboard",
          body: "Masuk ke akun Anda. Setelah berhasil login, Anda akan langsung diarahkan ke halaman Dashboard utama.",
          hasImage: true,
          imageCaption: "Tampilan halaman Dashboard",
          tip: null,
        },
        {
          title: "Klik menu Undangan di sidebar",
          body: "Pada sidebar kiri (desktop) atau menu bawah (mobile), cari dan klik ikon/menu 'Undangan'.",
          hasImage: true,
          imageCaption: "Sidebar dengan menu Undangan",
          tip: "Di mobile, menu Undangan ada di navigation bar bagian bawah layar.",
        },
        {
          title: "Halaman daftar undangan terbuka",
          body: "Anda akan melihat halaman daftar semua undangan yang pernah dibuat. Jika masih kosong, area utama akan menampilkan tombol 'Buat Undangan Pertama'.",
          hasImage: true,
          imageCaption: "Halaman daftar undangan (kosong)",
          tip: null,
        },
      ],
    },
    {
      id: 2,
      title: "Memilih Template Undangan",
      subtitle: "Pilih desain template yang sesuai tema acara.",
      level: "easy",
      levelLabel: "Mudah",
      done: false,
      currentStep: 0,
      steps: [
        {
          title: "Klik tombol Buat Undangan",
          body: "Di halaman daftar undangan, klik tombol '+ Buat Undangan' di bagian kanan atas untuk memulai proses pembuatan undangan baru.",
          hasImage: true,
          imageCaption: "Tombol '+ Buat Undangan'",
          tip: null,
        },
        {
          title: "Pilih kategori template",
          body: "Galeri template akan terbuka. Gunakan filter kategori di bagian atas untuk menyaring template berdasarkan tema: Pernikahan, Ulang Tahun, Khitanan, dan lainnya.",
          hasImage: true,
          imageCaption: "Galeri template dengan filter kategori",
          tip: null,
        },
        {
          title: "Preview dan pilih template",
          body: "Arahkan kursor ke template yang diinginkan untuk melihat preview, lalu klik 'Gunakan Template Ini' untuk melanjutkan.",
          hasImage: true,
          imageCaption: "Preview template undangan",
          tip: "Template bisa diubah kapan saja setelah undangan dibuat, tanpa menghapus konten yang sudah diisi.",
        },
      ],
    },
    {
      id: 3,
      title: "Mengisi Detail Acara",
      subtitle: "Isi nama, tanggal, waktu, dan lokasi acara.",
      level: "easy",
      levelLabel: "Mudah",
      done: false,
      currentStep: 0,
      steps: [
        {
          title: "Isi nama acara / pasangan",
          body: "Pada halaman editor, isi form 'Nama Acara' atau 'Nama Pasangan' sesuai jenis undangan yang dibuat.",
          hasImage: true,
          imageCaption: "Form isian nama acara",
          tip: null,
        },
        {
          title: "Atur tanggal dan waktu",
          body: "Klik field tanggal untuk membuka date picker. Pilih tanggal akad/resepsi dan atur jam mulai–selesai acara.",
          hasImage: true,
          imageCaption: "Date picker tanggal acara",
          tip: "Jika acara berlangsung lebih dari satu hari, aktifkan opsi 'Multi-hari' di pengaturan acara.",
        },
        {
          title: "Masukkan lokasi",
          body: "Ketik nama venue atau alamat lengkap di field Lokasi. Sistem akan otomatis mencari dan menyarankan lokasi dari Google Maps.",
          hasImage: true,
          imageCaption: "Field lokasi dengan saran Google Maps",
          tip: null,
        },
        {
          title: "Simpan detail acara",
          body: "Setelah semua field terisi, klik tombol 'Simpan & Lanjutkan' untuk masuk ke tahap kustomisasi desain.",
          hasImage: false,
          imageCaption: null,
          tip: "Progres Anda tersimpan otomatis setiap 30 detik. Anda bisa keluar dan melanjutkan kapan saja.",
        },
      ],
    },
    {
      id: 4,
      title: "Publikasi & Bagikan Link",
      subtitle: "Aktifkan undangan dan dapatkan link unik.",
      level: "easy",
      levelLabel: "Mudah",
      done: false,
      currentStep: 0,
      steps: [
        {
          title: "Buka tab Publikasi",
          body: "Di editor undangan, klik tab 'Publikasi' yang ada di bagian atas halaman editor.",
          hasImage: true,
          imageCaption: "Tab Publikasi di editor",
          tip: null,
        },
        {
          title: "Klik tombol Publikasikan",
          body: "Tekan tombol besar 'Publikasikan Undangan'. Status undangan akan berubah dari Draft menjadi Aktif.",
          hasImage: true,
          imageCaption: "Tombol Publikasikan Undangan",
          tip: "Pastikan semua detail sudah benar sebelum mempublikasikan, karena link undangan langsung bisa diakses tamu.",
        },
        {
          title: "Salin link undangan",
          body: "Setelah dipublikasikan, link unik undangan Anda akan muncul. Klik 'Salin Link' untuk menyimpannya ke clipboard.",
          hasImage: true,
          imageCaption: "Link undangan yang sudah aktif",
          tip: null,
        },
        {
          title: "Bagikan ke tamu",
          body: "Tempel link tersebut saat mengirim pesan WhatsApp, atau gunakan fitur 'Kirim Undangan' untuk pengiriman massal ke daftar tamu.",
          hasImage: false,
          imageCaption: null,
          tip: null,
        },
      ],
    },
    {
      id: 5,
      title: "Menggunakan Fitur RSVP",
      subtitle: "Aktifkan konfirmasi kehadiran dari tamu.",
      level: "medium",
      levelLabel: "Menengah",
      done: false,
      currentStep: 0,
      steps: [
        {
          title: "Aktifkan fitur RSVP",
          body: "Di pengaturan undangan, buka tab 'Fitur' lalu aktifkan toggle 'RSVP / Konfirmasi Kehadiran'.",
          hasImage: true,
          imageCaption: "Toggle RSVP di pengaturan fitur",
          tip: null,
        },
        {
          title: "Atur batas konfirmasi",
          body: "Tentukan batas waktu konfirmasi kehadiran (misal: H-7 sebelum acara) agar tamu yang terlambat tidak bisa mengisi RSVP.",
          hasImage: true,
          imageCaption: "Setting batas waktu RSVP",
          tip: "Kamu bisa mengubah batas waktu ini kapan saja selama undangan masih aktif.",
        },
        {
          title: "Pantau konfirmasi tamu",
          body: "Buka menu 'Tamu' → tab 'RSVP' untuk melihat siapa saja yang sudah mengkonfirmasi kehadiran, jumlah tamu yang hadir, dan catatan dari tamu.",
          hasImage: true,
          imageCaption: "Halaman rekap RSVP tamu",
          tip: null,
        },
      ],
    },
  ],
});

// Data topik lain untuk navigasi
const otherTopics = ref([
  { id: 1, slug: "memulai", title: "Memulai / Onboarding", count: 4, bgColor: "#e8f7f5", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polygon points="5 3 19 12 5 21 5 3"/></svg>` },
  { id: 3, slug: "kelola-tamu", title: "Kelola Tamu", count: 5, bgColor: "#fef3c7", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
  { id: 4, slug: "kirim-undangan", title: "Kirim Undangan", count: 4, bgColor: "#f0fdf4", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>` },
  { id: 5, slug: "desain-kustomisasi", title: "Desain & Kustomisasi", count: 7, bgColor: "#fdf4ff", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>` },
]);

// ===== COMPUTED =====
const completedCount = computed(() => topic.value.tutorials.filter((t) => t.done).length);
const progressPercent = computed(() =>
  topic.value.tutorials.length > 0
    ? Math.round((completedCount.value / topic.value.tutorials.length) * 100)
    : 0
);

// ===== EXPAND =====
const expandedId = ref(null);
const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

// ===== STEP NAVIGATION =====
const nextStep = (tut) => {
  if (tut.currentStep < tut.steps.length - 1) {
    tut.currentStep++;
  } else {
    tut.done = true;
  }
};
const prevStep = (tut) => {
  if (tut.currentStep > 0) tut.currentStep--;
};
const resetTutorial = (tut) => {
  tut.done = false;
  tut.currentStep = 0;
};
</script>

<style scoped>
* { box-sizing: border-box; }
.dashboard-layout { display: flex; min-height: 100vh; background: #f4f8fb; font-family: "Nunito", "Segoe UI", sans-serif; }
.sidebar-slot { display: none; }
.main-area { flex: 1; display: flex; flex-direction: column; min-width: 0; min-height: 100vh; }

/* TOPBAR */
.topbar { display: flex; align-items: center; gap: 12px; padding: 0 16px; height: 64px; background: #fff; border-bottom: 1.5px solid #e8f0f7; position: sticky; top: 0; z-index: 100; flex-shrink: 0; }
.topbar-menu { background: none; border: none; cursor: pointer; padding: 6px; display: flex; flex-direction: column; gap: 5px; flex-shrink: 0; }
.topbar-menu span { display: block; width: 22px; height: 2.5px; background: #1a2e45; border-radius: 2px; }
.topbar-center { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.btn-back { width: 34px; height: 34px; border-radius: 10px; background: #f4f8fb; border: 1.5px solid #e8f0f7; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #1a2e45; flex-shrink: 0; transition: background 0.2s; }
.btn-back:hover { background: #e8f7f5; border-color: #7ecec4; }
.topbar-label { font-size: 10px; font-weight: 700; color: #7ecec4; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 1px; }
.topbar-title { font-size: 15px; font-weight: 900; color: #1a2e45; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.avatar-wrap { position: relative; flex-shrink: 0; }
.topbar-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #7ecec4, #2a9d8f); color: #fff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
.topbar-avatar:hover { background: linear-gradient(135deg, #6abfb4, #228b7e); }
.topbar-avatar-initials { font-size: 15px; font-weight: 800; letter-spacing: 0.5px; user-select: none; line-height: 1; }
.profile-dropdown { position: absolute; right: 0; top: calc(100% + 10px); background: #fff; border-radius: 16px; box-shadow: 0 8px 32px rgba(26,46,69,0.15); min-width: 220px; border: 1.5px solid #e8f0f7; padding: 8px 0; z-index: 200; }
.dropdown-header { display: flex; align-items: center; gap: 12px; padding: 12px 16px; }
.dropdown-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #7ecec4, #2a9d8f); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dropdown-paket { font-size: 10px; font-weight: 800; color: #7ecec4; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 1px; }
.dropdown-name { font-size: 13px; font-weight: 800; color: #1a2e45; margin: 0 0 1px; }
.dropdown-email { font-size: 11px; color: #6b7280; margin: 0; }
.dropdown-divider { height: 1px; background: #f0f4f8; margin: 4px 0; }
.dropdown-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 16px; background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 700; color: #1a2e45; font-family: inherit; transition: background 0.15s; text-align: left; }
.dropdown-item:hover { background: #f4f8fb; }
.dropdown-logout { color: #e53e3e; }
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s, transform 0.15s; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }

/* SCROLL BODY */
.scroll-body { flex: 1; overflow-y: auto; padding: 16px 16px 100px; display: flex; flex-direction: column; gap: 14px; }

/* TOPIC INFO CARD */
.topic-info-card { background: #fff; border-radius: 16px; border: 1.5px solid #e8f0f7; padding: 16px; display: flex; align-items: flex-start; gap: 14px; }
.topic-icon-wrap { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.topic-meta { flex: 1; min-width: 0; }
.topic-name { font-size: 15px; font-weight: 900; color: #1a2e45; margin: 0 0 4px; }
.topic-desc { font-size: 12px; color: #6b7280; font-weight: 500; margin: 0 0 10px; line-height: 1.5; }
.topic-tags { display: flex; align-items: center; gap: 12px; }
.tag { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: #9ca3af; }

/* PROGRESS */
.progress-card { background: #fff; border-radius: 14px; border: 1.5px solid #e8f0f7; padding: 14px 16px; }
.progress-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.progress-label { font-size: 12px; font-weight: 800; color: #1a2e45; }
.progress-count { font-size: 12px; font-weight: 700; color: #6b7280; }
.progress-bar { height: 8px; background: #f0f4f8; border-radius: 20px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #7ecec4, #a8ddd8); border-radius: 20px; transition: width 0.5s ease; }

/* TUTORIAL LIST */
.tutorial-list { display: flex; flex-direction: column; gap: 10px; }

.tutorial-card { background: #fff; border-radius: 16px; border: 1.5px solid #e8f0f7; border-left: 4px solid #7ecec4; overflow: hidden; transition: box-shadow 0.2s; }
.tutorial-card:hover { box-shadow: 0 4px 16px rgba(126,206,196,0.12); }
.tutorial-card.done { border-left-color: #059669; background: #f8fffc; }

/* Card Header */
.card-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; user-select: none; }
.step-num { width: 30px; height: 30px; border-radius: 50%; background: #e8f7f5; border: 2px solid #7ecec4; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; color: #1a2e45; flex-shrink: 0; transition: all 0.2s; }
.step-num.done { background: #059669; border-color: #059669; color: #fff; }
.card-info { flex: 1; min-width: 0; }
.card-title { font-size: 13px; font-weight: 800; color: #1a2e45; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-sub { font-size: 11px; color: #6b7280; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tag-level { font-size: 10px; font-weight: 800; border-radius: 20px; padding: 2px 10px; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0; }
.level-easy { background: #d1fae5; color: #059669; }
.level-medium { background: #fef3c7; color: #d97706; }
.level-hard { background: #fee2e2; color: #e53e3e; }
.card-chevron { color: #9ca3af; flex-shrink: 0; transition: transform 0.25s ease; }
.card-chevron.rotated { transform: rotate(180deg); }

/* Card Body */
.card-body { padding: 0 16px 16px; }

/* Steps */
.steps-wrap { display: flex; flex-direction: column; margin-bottom: 16px; }
.step-row { display: flex; gap: 12px; }
.step-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 26px; }
.step-dot { width: 26px; height: 26px; border-radius: 50%; background: #f0f4f8; border: 2px solid #d1d5db; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: #9ca3af; flex-shrink: 0; transition: all 0.2s; z-index: 1; }
.step-dot.done { background: #059669; border-color: #059669; color: #fff; }
.step-dot.active { background: #1a2e45; border-color: #1a2e45; color: #7ecec4; }
.step-line { width: 2px; flex: 1; min-height: 16px; background: #e8f0f7; margin: 4px 0; border-radius: 2px; transition: background 0.3s; }
.step-line.done { background: #7ecec4; }

.step-content { flex: 1; padding: 2px 0 16px; }
.step-title { font-size: 13px; font-weight: 800; color: #1a2e45; margin: 0 0 4px; }
.step-body { font-size: 12px; color: #6b7280; font-weight: 500; margin: 0; line-height: 1.6; }

/* Screenshot placeholder */
.screenshot-wrap { margin-top: 12px; }
.screenshot-placeholder {
  background: #f8fffe; border: 1.5px dashed #b2e0da;
  border-radius: 12px; padding: 24px 16px;
  display: flex; flex-direction: column; align-items: center;
  gap: 8px; text-align: center;
}
.screenshot-label { font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0; }

/* Tip box */
.tip-box {
  display: flex; align-items: flex-start; gap: 8px;
  background: #fffbeb; border: 1.5px solid #fde68a;
  border-radius: 10px; padding: 10px 12px; margin-top: 10px;
}
.tip-box p { font-size: 11px; font-weight: 600; color: #92400e; margin: 0; line-height: 1.5; }

/* Actions */
.card-actions { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.actions-right { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.btn-prev { display: flex; align-items: center; gap: 6px; padding: 9px 16px; background: #fff; border: 1.5px solid #d1d5db; border-radius: 10px; font-size: 12px; font-weight: 700; color: #6b7280; cursor: pointer; font-family: inherit; transition: border-color 0.2s; }
.btn-prev:hover { border-color: #7ecec4; color: #1a2e45; }
.btn-next { display: flex; align-items: center; gap: 7px; padding: 10px 20px; background: #1a2e45; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; color: #7ecec4; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-next:hover { background: #243d5c; }
.badge-done { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800; color: #059669; background: #d1fae5; border-radius: 20px; padding: 6px 14px; }
.btn-reset { padding: 8px 16px; background: #fff; border: 1.5px solid #d1d5db; border-radius: 10px; font-size: 12px; font-weight: 700; color: #6b7280; cursor: pointer; font-family: inherit; transition: border-color 0.2s; }
.btn-reset:hover { border-color: #7ecec4; }

/* Expand transition */
.expand-enter-active, .expand-leave-active { transition: opacity 0.2s, transform 0.2s; }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: translateY(-4px); }

/* NAV TOPIK LAIN */
.nav-topics-label { font-size: 11px; font-weight: 800; color: #7ecec4; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px; }
.nav-topics-grid { display: flex; flex-direction: column; gap: 8px; }
.nav-topic-card { background: #fff; border: 1.5px solid #e8f0f7; border-radius: 14px; padding: 12px 14px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; }
.nav-topic-card:hover { border-color: #7ecec4; box-shadow: 0 2px 12px rgba(126,206,196,0.1); }
.nav-topic-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.nav-topic-info { flex: 1; }
.nav-topic-title { font-size: 13px; font-weight: 800; color: #1a2e45; margin: 0 0 1px; }
.nav-topic-count { font-size: 11px; color: #9ca3af; font-weight: 600; margin: 0; }

/* DRAWER */
.drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 300; }
.drawer { position: absolute; left: 0; top: 0; bottom: 0; width: min(240px, 80vw); display: flex; flex-direction: column; overflow: hidden; background: #1a2e45; box-shadow: 4px 0 24px rgba(0,0,0,0.25); }
.drawer > :first-child { flex: 1; overflow-y: auto; overflow-x: hidden; min-height: 0; width: 100% !important; min-width: 0 !important; }
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.25s; }
.drawer-enter-active .drawer, .drawer-leave-active .drawer { transition: transform 0.25s ease; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .drawer, .drawer-leave-to .drawer { transform: translateX(-100%); }
.drawer :deep(.sidebar) { width: 100% !important; min-width: 0 !important; height: 100% !important; min-height: 100% !important; position: relative !important; top: auto !important; box-sizing: border-box; }

.mobile-only { display: flex; }
.desktop-only { display: none; }

@media (min-width: 640px) {
  .scroll-body { padding: 24px 24px 100px; }
  .nav-topics-grid { display: grid; grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  .mobile-only { display: none !important; }
  .desktop-only { display: block; }
  .sidebar-slot { display: flex; }
  .scroll-body { padding: 32px 32px 40px; }
  .nav-topics-grid { grid-template-columns: 1fr 1fr; }
}
</style>