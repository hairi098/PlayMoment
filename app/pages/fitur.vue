<template>
  <div class="page">
    <!-- ===== HERO BANNER ===== -->
    <section class="hero-banner">
      <div class="hero-banner-inner">
        <p class="banner-eyebrow">Kenapa Pilih Kami</p>
        <h1 class="banner-title">
          Fitur Lengkap<br />untuk Undangan<br /><span class="banner-accent"
            >Digital Terbaik</span
          >
        </h1>
        <p class="banner-desc">
          Semua yang kamu butuhkan sudah tersedia — dari desain, musik, RSVP,
          hingga pengiriman instan. Buat undangan impianmu tanpa ribet, tanpa
          coding, cukup dari smartphone.
        </p>
      </div>
    </section>

    <!-- ===== FITUR UTAMA GRID ===== -->
    <section class="features-section" id="fitur-utama">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Fitur Unggulan</p>
          <h2 class="section-title">
            Semua yang Kamu <span class="accent">Butuhkan</span>
          </h2>
          <p class="section-sub">
            Dirancang sederhana, namun lengkap untuk acara pernikahanmu
          </p>
        </div>
        <div class="features-grid">
          <div v-for="(f, i) in mainFeatures" :key="i" class="feature-card">
            <div class="feature-icon-wrap" v-html="f.svg"></div>
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FITUR DETAIL (alternating layout) ===== -->
    <section class="detail-section" id="fitur-detail">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Lebih Detail</p>
          <h2 class="section-title">
            Cara Kerjanya <span class="accent">Simpel</span>
          </h2>
          <p class="section-sub">
            Tiga langkah mudah untuk membuat undangan digitalmu
          </p>
        </div>

        <div class="steps-list">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="step-item"
            :class="{ 'step-reverse': i % 2 !== 0 }"
          >
            <!-- Illustration -->
            <div class="step-illustration">
              <div class="step-mockup" :style="{ background: step.bg }">
                <div class="step-number-badge">{{ i + 1 }}</div>
                <div class="step-icon-large" v-html="step.svg"></div>
                <div class="step-mock-lines">
                  <div class="mock-line long"></div>
                  <div class="mock-line medium"></div>
                  <div class="mock-line short"></div>
                </div>
              </div>
            </div>
            <!-- Text -->
            <div class="step-text">
              <span class="step-tag">Langkah {{ i + 1 }}</span>
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-desc">{{ step.desc }}</p>
              <ul class="step-points">
                <li v-for="(pt, j) in step.points" :key="j">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7ecec4"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {{ pt }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FITUR TAMBAHAN (icon list) ===== -->
    <section class="bonus-section">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Ada Lebih Banyak</p>
          <h2 class="section-title">
            Fitur <span class="accent">Tambahan</span>
          </h2>
          <p class="section-sub">
            Nikmati berbagai fitur ekstra yang membuat undanganmu makin istimewa
          </p>
        </div>
        <div class="bonus-grid">
          <div v-for="(b, i) in bonusFeatures" :key="i" class="bonus-card">
            <div class="bonus-icon" v-html="b.svg"></div>
            <div class="bonus-info">
              <h4 class="bonus-title">{{ b.title }}</h4>
              <p class="bonus-desc">{{ b.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA BANNER ===== -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-card">
          <div class="cta-blob cta-blob-1"></div>
          <div class="cta-blob cta-blob-2"></div>
          <div class="cta-content">
            <h2 class="cta-title">Siap Buat Undangan<br />Digital Impianmu?</h2>
            <p class="cta-desc">
              Daftar gratis sekarang, tidak perlu kartu kredit. Mulai dalam 5
              menit!
            </p>
            <div class="cta-actions">
              <button class="btn-cta-white" @click="handleDaftar">
                Daftar Gratis Sekarang
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <a href="/tema" class="btn-cta-outline">Lihat Koleksi Tema</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
  </div>
</template>

<script setup>
import { ref } from "vue";

const handleDaftar = () => {
  alert("Selamat datang! Segera daftar gratis.");
};


const mainFeatures = [
  {
    title: "Pilih Tema Cantik",
    desc: "Ratusan tema eksklusif siap pakai, dari elegan klasik hingga modern minimalis. Cocok untuk semua konsep pernikahan.",
    svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  },
  {
    title: "Edit Tanpa Coding",
    desc: "Edit semua konten undangan langsung dari smartphone. Nama, tanggal, lokasi, foto — semuanya bisa diubah dalam hitungan menit.",
    svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  },
  {
    title: "Galeri Foto & Video",
    desc: "Upload foto prewedding dan video kenangan indahmu tanpa batas. Tampilkan momen terbaik untuk tamu undangan.",
    svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  },
  {
    title: "RSVP Online",
    desc: "Tamu bisa konfirmasi kehadiran, jumlah orang, dan pesan ucapan selamat langsung dari halaman undangan.",
    svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>`,
  },
  {
    title: "Musik Latar",
    desc: "Pilih lagu favorit sebagai backsound undangan. Buat suasana makin romantis saat tamu membuka undanganmu.",
    svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  },
  {
    title: "Kirim via WhatsApp",
    desc: "Bagikan link undangan langsung via WhatsApp, Instagram, atau media sosial lainnya. Mudah dan cepat.",
    svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  },
];

// ===== LANGKAH (HOW IT WORKS) =====
const steps = [
  {
    title: "Daftar & Pilih Tema",
    desc: "Buat akun gratis dalam 30 detik, lalu pilih tema undangan yang paling cocok dengan konsep pernikahanmu dari ratusan koleksi kami.",
    points: [
      "Tidak perlu kartu kredit",
      "Ratusan tema siap pakai",
      "Preview sebelum digunakan",
    ],
    bg: "linear-gradient(135deg, #e8f5f3 0%, #c8ede9 100%)",
    svg: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  },
  {
    title: "Isi Detail & Upload Foto",
    desc: "Masukkan nama pasangan, tanggal, lokasi akad dan resepsi, serta upload foto prewedding favoritmu. Semua bisa dilakukan dari HP.",
    points: [
      "Form isian yang mudah dipahami",
      "Upload foto tanpa batas (paket premium)",
      "Preview real-time langsung di layar",
    ],
    bg: "linear-gradient(135deg, #fef3f0 0%, #fcddd5 100%)",
    svg: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#f4a28c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  },
  {
    title: "Bagikan ke Tamu",
    desc: "Setelah undangan siap, cukup salin link dan kirimkan ke semua tamu via WhatsApp, Instagram, atau email. Tamu bisa langsung RSVP.",
    points: [
      "Link unik untuk setiap undangan",
      "Tamu bisa RSVP langsung",
      "Pantau konfirmasi kehadiran",
    ],
    bg: "linear-gradient(135deg, #f0f4ff 0%, #d6e0ff 100%)",
    svg: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#7b9cda" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  },
];

// ===== FITUR TAMBAHAN =====
const bonusFeatures = [
  {
    title: "Hitung Mundur Hari H",
    desc: "Countdown timer otomatis menuju hari pernikahan.",
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  },
  {
    title: "Peta Lokasi Otomatis",
    desc: "Integrasi Google Maps untuk petunjuk arah ke venue.",
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  },
  {
    title: "Gift Registry / Amplop Digital",
    desc: "Terima hadiah dan ucapan selamat secara digital.",
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  },
  {
    title: "Ucapan & Doa Tamu",
    desc: "Fitur buku tamu digital untuk ucapan dari orang-orang tercinta.",
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  },
  {
    title: "Protokol Kesehatan",
    desc: "Tampilkan informasi protokol kesehatan untuk tamu undangan.",
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  },
  {
    title: "Multi Acara",
    desc: "Tampilkan jadwal akad, resepsi, dan pengajian dalam satu halaman.",
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  },
  {
    title: "Animasi Pembuka",
    desc: "Opening animation yang memukau saat tamu pertama kali membuka link.",
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  },
  {
    title: "Statistik Kunjungan",
    desc: "Pantau berapa orang yang sudah membuka undanganmu secara real-time.",
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  },
];
</script>

<style scoped>
/* ===========================
   BASE
=========================== */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page {
  font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  background: #fff;
  color: #1a2e45;
  min-height: 100vh;
  padding-bottom: 72px;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.accent {
  color: #7ecec4;
}

.btn-cta:hover {
  background: #243d5c;
  transform: translateY(-1px);
}

/* Mobile dropdown */

/* ===========================
   HERO BANNER
=========================== */
.hero-banner {
  background: linear-gradient(135deg, #1a2e45 0%, #243d5c 60%, #2d5272 100%);
  padding: 40px 20px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.hero-banner::before {
  content: "";
  position: absolute;
  top: -60px;
  right: -60px;
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(126, 206, 196, 0.15) 0%,
    transparent 70%
  );
  border-radius: 50%;
}
.hero-banner::after {
  content: "";
  position: absolute;
  bottom: -80px;
  left: -40px;
  width: 260px;
  height: 260px;
  background: radial-gradient(
    circle,
    rgba(126, 206, 196, 0.1) 0%,
    transparent 70%
  );
  border-radius: 50%;
}

.hero-banner-inner {
  max-width: 680px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.banner-eyebrow {
  display: inline-block;
  background: rgba(126, 206, 196, 0.15);
  color: #7ecec4;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 50px;
  margin-bottom: 20px;
}

.banner-title {
  font-size: clamp(32px, 7vw, 52px);
  font-weight: 900;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 18px;
  letter-spacing: -1px;
}
.banner-accent {
  color: #7ecec4;
}

.banner-desc {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.7;
  margin-bottom: 32px;
}

.banner-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.btn-primary-hero {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #7ecec4;
  color: #1a2e45;
  border: none;
  border-radius: 50px;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
  white-space: nowrap;
}
.btn-primary-hero:hover {
  background: #6abfb4;
  transform: translateY(-2px);
}

.btn-outline-hero {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    border-color 0.2s,
    color 0.2s;
}
.btn-outline-hero:hover {
  border-color: #7ecec4;
  color: #7ecec4;
}

/* ===========================
   SECTION HEADER
=========================== */
.section-header {
  text-align: center;
  margin-bottom: 48px;
}
.section-eyebrow {
  display: inline-block;
  background: #f0faf9;
  color: #7ecec4;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 50px;
  margin-bottom: 14px;
}
.section-title {
  font-size: clamp(26px, 5vw, 38px);
  font-weight: 900;
  color: #1a2e45;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}
.section-sub {
  font-size: 15px;
  color: #718096;
  line-height: 1.6;
  max-width: 520px;
  margin: 0 auto;
}

/* ===========================
   FITUR UTAMA GRID
=========================== */
.features-section {
  padding: 64px 0;
  background: #fff;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.feature-card {
  background: #f8fbff;
  border: 1.5px solid #edf2f7;
  border-radius: 16px;
  padding: 24px 20px;
  transition:
    transform 0.25s,
    box-shadow 0.25s,
    border-color 0.25s;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(126, 206, 196, 0.15);
  border-color: #7ecec4;
}

.feature-icon-wrap {
  width: 56px;
  height: 56px;
  background: #f0faf9;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.feature-title {
  font-size: 15px;
  font-weight: 800;
  color: #1a2e45;
  margin-bottom: 8px;
}

.feature-desc {
  font-size: 13px;
  color: #718096;
  line-height: 1.6;
}

/* ===========================
   STEPS / DETAIL SECTION
=========================== */
.detail-section {
  padding: 64px 0;
  background: #f8fbff;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.step-item {
  display: flex;
  flex-direction: column;
  gap: 28px;
  align-items: center;
}

.step-illustration {
  width: 100%;
  max-width: 360px;
}

.step-mockup {
  border-radius: 20px;
  padding: 36px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
  min-height: 200px;
  justify-content: center;
}

.step-number-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 32px;
  height: 32px;
  background: #1a2e45;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
}

.step-icon-large {
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-mock-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 200px;
}
.mock-line {
  height: 8px;
  background: rgba(26, 46, 69, 0.12);
  border-radius: 4px;
}
.mock-line.long {
  width: 100%;
}
.mock-line.medium {
  width: 70%;
}
.mock-line.short {
  width: 45%;
}

.step-text {
  width: 100%;
}

.step-tag {
  display: inline-block;
  background: #f0faf9;
  color: #7ecec4;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 50px;
  margin-bottom: 12px;
}

.step-title {
  font-size: 22px;
  font-weight: 900;
  color: #1a2e45;
  margin-bottom: 10px;
}

.step-desc {
  font-size: 14px;
  color: #718096;
  line-height: 1.7;
  margin-bottom: 16px;
}

.step-points {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.step-points li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4a5568;
  font-weight: 500;
}

/* ===========================
   BONUS FEATURES
=========================== */
.bonus-section {
  padding: 64px 0;
  background: #fff;
}

.bonus-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.bonus-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: #f8fbff;
  border: 1.5px solid #edf2f7;
  border-radius: 14px;
  transition:
    border-color 0.2s,
    transform 0.2s;
  min-width: 0;
}
.bonus-card:hover {
  border-color: #7ecec4;
  transform: translateY(-2px);
}

.bonus-icon {
  width: 44px;
  height: 44px;
  min-width: 44px;
  background: #f0faf9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bonus-title {
  font-size: 13px;
  font-weight: 800;
  color: #1a2e45;
  margin-bottom: 4px;
  word-break: break-word;
}

.bonus-desc {
  font-size: 12px;
  color: #718096;
  line-height: 1.5;
  word-break: break-word;
}

/* ===========================
   CTA SECTION
=========================== */
.cta-section {
  padding: 64px 0;
  background: #f8fbff;
}

.cta-card {
  background: linear-gradient(135deg, #1a2e45 0%, #243d5c 100%);
  border-radius: 24px;
  padding: 52px 28px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-blob {
  position: absolute;
  border-radius: 50%;
  background: rgba(126, 206, 196, 0.12);
}
.cta-blob-1 {
  width: 280px;
  height: 280px;
  top: -80px;
  right: -60px;
}
.cta-blob-2 {
  width: 200px;
  height: 200px;
  bottom: -60px;
  left: -40px;
}

.cta-content {
  position: relative;
  z-index: 1;
}

.cta-title {
  font-size: clamp(24px, 5vw, 36px);
  font-weight: 900;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 14px;
}

.cta-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 32px;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.btn-cta-white {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #7ecec4;
  color: #1a2e45;
  border: none;
  border-radius: 50px;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
  white-space: nowrap;
}
.btn-cta-white:hover {
  background: #6abfb4;
  transform: translateY(-2px);
}

.btn-cta-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 50px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    border-color 0.2s,
    color 0.2s;
}
.btn-cta-outline:hover {
  border-color: #7ecec4;
  color: #7ecec4;
}

/* ===========================
   FOOTER
=========================== */

/* ===========================
   RESPONSIVE — SMALL MOBILE 360px+
=========================== */
@media (max-width: 399px) {
  .banner-title {
    font-size: 28px;
  }
  .container {
    padding: 0 16px;
  }
  .feature-card {
    padding: 18px 14px;
  }
  .bonus-card {
    padding: 14px 12px;
    gap: 10px;
  }
  .bonus-icon {
    width: 36px;
    height: 36px;
    min-width: 36px;
  }
  .step-mockup {
    padding: 24px 20px;
    min-height: 160px;
  }
  .cta-card {
    padding: 36px 20px;
  }
}

/* ===========================
   RESPONSIVE — MOBILE (default, up to 639px)
=========================== */
.features-grid {
  grid-template-columns: 1fr 1fr;
}

.bonus-grid {
  grid-template-columns: 1fr 1fr;
}

.banner-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
}
.btn-primary-hero,
.btn-outline-hero {
  width: 100%;
  justify-content: center;
}

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
}
.btn-cta-white,
.btn-cta-outline {
  width: 100%;
  justify-content: center;
}

/* ===========================
   RESPONSIVE — TABLET 480px+
=========================== */
@media (min-width: 480px) {
  .bonus-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .banner-actions {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .btn-primary-hero,
  .btn-outline-hero {
    width: auto;
    flex: 1 1 auto;
    max-width: 240px;
  }

  .cta-actions {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .btn-cta-white,
  .btn-cta-outline {
    width: auto;
    flex: 1 1 auto;
    max-width: 240px;
  }
}

/* ===========================
   RESPONSIVE — TABLET 640px+
=========================== */
@media (min-width: 640px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .bonus-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .banner-actions {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .btn-primary-hero,
  .btn-outline-hero {
    width: auto;
    flex: 0 0 auto;
  }

  .cta-actions {
    flex-direction: row;
    justify-content: center;
  }
  .btn-cta-white,
  .btn-cta-outline {
    width: auto;
    flex: 0 0 auto;
  }

  .step-illustration {
    max-width: 400px;
    margin: 0 auto;
  }
}

/* ===========================
   RESPONSIVE — DESKTOP 1024px+
=========================== */
@media (min-width: 1024px) {
  .page {
    padding-bottom: 0;
  }

  .features-section {
    padding: 96px 0;
  }
  .detail-section {
    padding: 96px 0;
  }
  .bonus-section {
    padding: 96px 0;
  }
  .cta-section {
    padding: 80px 0;
  }

  .features-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  /* Step: side by side */
  .step-item {
    flex-direction: row;
    gap: 64px;
    align-items: center;
  }
  .step-item.step-reverse {
    flex-direction: row-reverse;
  }

  .step-illustration {
    flex: 0 0 360px;
    max-width: 360px;
    margin: 0;
  }
  .step-text {
    flex: 1;
  }

  .step-title {
    font-size: 28px;
  }

  .bonus-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .cta-card {
    padding: 72px 64px;
  }

  .banner-actions {
    justify-content: center;
  }
  .btn-primary-hero,
  .btn-outline-hero {
    width: auto;
  }
}

/* ===========================
   RESPONSIVE — WIDE 1280px+
=========================== */
@media (min-width: 1280px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .bonus-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
