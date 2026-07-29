<template>
  <div class="page">
    <!-- ===== HERO BANNER ===== -->
    <section class="hero-banner">
      <div class="hero-banner-inner">
        <p class="banner-eyebrow">Harga Transparan</p>
        <h1 class="banner-title">
          Pilih Paket yang<br />Sesuai
          <span class="banner-accent">Kebutuhanmu</span>
        </h1>
        <p class="banner-desc">
          Pilih paket sesuai kebutuhanmu. Semua paket sudah termasuk akses ke
          fitur utama undangan digital kami.
        </p>
      </div>
    </section>

    <!-- ===== PRICING CARDS ===== -->
    <section class="pricing-section" id="paket">
      <div class="container">
        <div class="pricing-grid">
          <div
            v-for="(pkg, i) in packages"
            :key="i"
            class="pricing-card"
            :class="{ 'pricing-featured': pkg.featured }"
          >
            <div v-if="pkg.featured" class="featured-badge">TERLARIS</div>

            <!-- Name -->
            <h3 class="pkg-name">{{ pkg.name }}</h3>

            <!-- Price -->
            <div class="card-price">
              <span class="price-currency">Rp</span>
              <span class="price-amount">{{ pkg.priceDisplay }}</span>
            </div>

            <!-- Tagline -->
            <p class="pkg-tagline">{{ pkg.tagline }}</p>

            <!-- Features List -->
            <ul class="feature-list">
              <li
                v-for="(feat, j) in pkg.features"
                :key="j"
                :class="{ 'feat-disabled': feat.disabled }"
              >
                <span class="feat-mark" :class="feat.disabled ? 'feat-mark-no' : 'feat-mark-yes'">
                  {{ feat.disabled ? '×' : '✓' }}
                </span>
                <span>{{ feat.label }}</span>
              </li>
            </ul>

            <!-- CTA Button -->
            <button class="btn-pilih" @click="handlePilih(pkg)">
              Selanjutnya &nbsp;&rarr;
            </button>
          </div>
        </div>

        <!-- Money back note -->
        <p class="guarantee-note">
          Garansi uang kembali 7 hari jika tidak puas
        </p>
      </div>
    </section>

    <!-- ===== PERBANDINGAN FITUR (tabel) ===== -->
    <section class="compare-section">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Perbandingan Lengkap</p>
          <h2 class="section-title">
            Apa yang Kamu <span class="accent">Dapatkan</span>
          </h2>
          <p class="section-sub">
            Bandingkan semua paket sebelum memilih yang paling cocok
          </p>
        </div>

        <div class="compare-table-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th class="th-feature">Fitur</th>
                <th
                  v-for="pkg in packages"
                  :key="pkg.name"
                  :class="{ 'th-featured': pkg.featured }"
                >
                  {{ pkg.name }}
                  <span v-if="pkg.featured" class="th-badge">Populer</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in compareRows" :key="i">
                <td class="td-feature">{{ row.label }}</td>
                <td
                  v-for="(val, j) in row.values"
                  :key="j"
                  :class="{ 'td-featured': j === 1 }"
                >
                  <span v-if="val === true" class="td-check">Ya</span>
                  <span v-else-if="val === false" class="td-no">—</span>
                  <span v-else class="td-text">{{ val }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ===== FAQ ===== -->
    <section class="faq-section">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Ada Pertanyaan?</p>
          <h2 class="section-title">
            Yang Sering <span class="accent">Ditanyakan</span>
          </h2>
        </div>
        <div class="faq-list">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="faq-item"
            :class="{ 'faq-open': openFaq === i }"
            @click="openFaq = openFaq === i ? null : i"
          >
            <div class="faq-question">
              <span>{{ faq.q }}</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a2e45"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="faq-chevron"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <Transition name="faq-slide">
              <div v-if="openFaq === i" class="faq-answer">{{ faq.a }}</div>
            </Transition>
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
            <h2 class="cta-title">Mulai Gratis,<br />Upgrade Kapan Saja</h2>
            <p class="cta-desc">
              Tidak perlu kartu kredit. Coba semua fitur dasar secara gratis
              selamanya.
            </p>
            <div class="cta-actions">
              <button class="btn-cta-white" @click="handleDaftar">
                Daftar Gratis Sekarang &nbsp;&rarr;
              </button>
              <a
                href="https://wa.me/628123456789"
                class="btn-cta-outline"
                target="_blank"
                >Tanya via WhatsApp</a
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getPaketPageCards, buildCheckoutQuery } from "~/config/paket";

const openFaq = ref(null);

const goCheckout = (id) =>
  navigateTo({
    path: "/checkout",
    query: buildCheckoutQuery(id, {}),
  });
const handleDaftar = () => goCheckout("basic");
const handlePilih = (pkg) => goCheckout(pkg.id);

const packages = getPaketPageCards().map((p) => ({
  ...p,
  priceDisplay: p.priceMonthly,
}));

// ===== TABEL PERBANDINGAN =====
const compareRows = [
  { label: "Masa aktif", values: ["7 hari", "30 hari", "90 hari"] },
  { label: "Edit mandiri", values: [true, false, false] },
  { label: "Dibuatkan admin", values: [false, true, true] },
  { label: "Revisi", values: ["—", "2x minor", "Tanpa batas (wajar)"] },
  { label: "Support WhatsApp", values: [false, true, true] },
  { label: "Prioritas respon", values: [false, false, true] },
];

// ===== FAQ =====
const faqs = [
  {
    q: "Berapa lama masa aktif setiap paket?",
    a: "Basic aktif 7 hari, Premium 30 hari, dan Prioritas 90 hari sejak akun dikonfirmasi admin.",
  },
  {
    q: "Bagaimana cara upgrade dari Basic ke Premium?",
    a: "Kamu bisa upgrade kapan saja dari dashboard akun. Pilih paket yang diinginkan, lakukan pembayaran, dan fitur paket baru langsung aktif setelah dikonfirmasi.",
  },
  {
    q: "Metode pembayaran apa yang tersedia?",
    a: "Kami menerima transfer bank, GoPay, OVO, Dana, QRIS, dan kartu kredit/debit Visa/Mastercard.",
  },
  {
    q: "Apakah saya bisa mendapatkan refund?",
    a: "Ya, kami memberikan garansi uang kembali 7 hari sejak tanggal pembelian jika kamu tidak puas dengan layanan kami.",
  },
  {
    q: "Apakah link undangan bisa dibagikan ke banyak tamu?",
    a: "Tentu! Link undangan bisa dibagikan ke siapa saja tanpa batas jumlah tamu, baik via WhatsApp, Instagram, email, maupun media lainnya.",
  },
  {
    q: "Apakah ada biaya tambahan untuk domain custom?",
    a: "Domain custom dapat ditambahkan sebagai layanan tambahan saat checkout. Hubungi admin untuk domain .com khusus.",
  },
];
</script>

<style scoped>
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
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.accent {
  color: #7ecec4;
}

/* ===========================
   HERO BANNER
=========================== */
.hero-banner {
  background: linear-gradient(135deg, #1a2e45 0%, #243d5c 60%, #2d5272 100%);
  padding: 64px 20px 72px;
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
  background: radial-gradient(circle, rgba(126, 206, 196, 0.15) 0%, transparent 70%);
  border-radius: 50%;
}
.hero-banner::after {
  content: "";
  position: absolute;
  bottom: -80px;
  left: -40px;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(126, 206, 196, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}
.hero-banner-inner {
  max-width: 600px;
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
  font-size: clamp(30px, 7vw, 50px);
  font-weight: 900;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 16px;
  letter-spacing: -1px;
}
.banner-accent {
  color: #7ecec4;
}
.banner-desc {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
}

/* ===========================
   PRICING SECTION
=========================== */
.pricing-section {
  padding: 64px 0 32px;
  background: #f8fbff;
}

.pricing-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pricing-card {
  position: relative;
  background: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px 28px 28px;
  transition: transform 0.25s, box-shadow 0.25s;
}
.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
}
.pricing-featured {
  border-color: #7ecec4;
  background: #fff;
  box-shadow: 0 8px 32px rgba(126, 206, 196, 0.15);
}

.featured-badge {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  background: #7ecec4;
  color: #1a2e45;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  padding: 5px 20px;
  border-radius: 20px;
  white-space: nowrap;
}

/* Name */
.pkg-name {
  font-size: 22px;
  font-weight: 900;
  color: #1a2e45;
  margin-bottom: 16px;
}

/* Price */
.card-price {
  display: flex;
  align-items: flex-start;
  gap: 2px;
  margin-bottom: 8px;
}
.price-currency {
  font-size: 18px;
  font-weight: 700;
  color: #1a2e45;
  margin-top: 6px;
}
.price-amount {
  font-size: 42px;
  font-weight: 900;
  color: #1a2e45;
  line-height: 1;
}

/* Tagline */
.pkg-tagline {
  font-size: 14px;
  color: #7ecec4;
  font-style: italic;
  font-weight: 500;
  margin-bottom: 20px;
}

/* Features */
.feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin-bottom: 28px;
}
.feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: #2d3748;
  line-height: 1.5;
}
.feature-list li.feat-disabled {
  color: #a0aec0;
}
.feat-mark {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.5;
  flex-shrink: 0;
  width: 16px;
}
.feat-mark-yes {
  color: #7ecec4;
}
.feat-mark-no {
  color: #cbd5e0;
}

/* CTA Button */
.btn-pilih {
  width: 100%;
  display: block;
  background: #7ecec4;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 0;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  letter-spacing: 0.2px;
}
.btn-pilih:hover {
  background: #5bb8ac;
  transform: translateY(-1px);
}

.guarantee-note {
  text-align: center;
  font-size: 13px;
  color: #718096;
  margin-top: 28px;
  font-weight: 500;
}

/* ===========================
   SECTION HEADER
=========================== */
.section-header {
  text-align: center;
  margin-bottom: 40px;
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
  font-size: clamp(24px, 5vw, 36px);
  font-weight: 900;
  color: #1a2e45;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}
.section-sub {
  font-size: 14px;
  color: #718096;
  line-height: 1.6;
  max-width: 480px;
  margin: 0 auto;
}

/* ===========================
   COMPARE TABLE
=========================== */
.compare-section {
  padding: 64px 0;
  background: #fff;
}

.compare-table-wrap {
  overflow-x: auto;
  border-radius: 16px;
  border: 1.5px solid #edf2f7;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 480px;
}

.compare-table thead tr {
  background: #f8fbff;
  border-bottom: 2px solid #edf2f7;
}

.compare-table th {
  padding: 16px 18px;
  text-align: center;
  font-size: 14px;
  font-weight: 800;
  color: #1a2e45;
}
.th-feature {
  text-align: left;
  width: 40%;
  color: #718096;
  font-weight: 600;
}
.th-featured {
  background: #f0faf9;
  color: #7ecec4;
  position: relative;
}
.th-badge {
  display: inline-block;
  background: #7ecec4;
  color: #1a2e45;
  font-size: 9px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 50px;
  margin-left: 6px;
  vertical-align: middle;
}

.compare-table tbody tr {
  border-bottom: 1px solid #f0f4f8;
  transition: background 0.15s;
}
.compare-table tbody tr:last-child {
  border-bottom: none;
}
.compare-table tbody tr:hover {
  background: #fafcff;
}

.compare-table td {
  padding: 13px 18px;
  text-align: center;
  font-size: 13px;
}
.td-feature {
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  font-size: 13px;
}
.td-featured {
  background: #f0faf9;
}
.td-check {
  color: #7ecec4;
  font-weight: 700;
}
.td-no {
  color: #cbd5e0;
}
.td-text {
  color: #1a2e45;
  font-weight: 600;
  font-size: 12px;
}

/* ===========================
   FAQ
=========================== */
.faq-section {
  padding: 64px 0;
  background: #f8fbff;
}

.faq-list {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  background: #fff;
  border: 1.5px solid #edf2f7;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s;
}
.faq-item:hover,
.faq-item.faq-open {
  border-color: #7ecec4;
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  font-size: 14px;
  font-weight: 700;
  color: #1a2e45;
  gap: 12px;
}

.faq-chevron {
  flex-shrink: 0;
  transition: transform 0.25s;
}
.faq-open .faq-chevron {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 20px 18px;
  font-size: 13px;
  color: #718096;
  line-height: 1.7;
}

.faq-slide-enter-active,
.faq-slide-leave-active {
  transition: all 0.25s ease;
}
.faq-slide-enter-from,
.faq-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ===========================
   CTA
=========================== */
.cta-section {
  padding: 64px 0;
  background: #fff;
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
  margin-bottom: 12px;
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
  transition: background 0.2s, transform 0.2s;
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
  transition: border-color 0.2s, color 0.2s;
}
.btn-cta-outline:hover {
  border-color: #7ecec4;
  color: #7ecec4;
}

/* ===========================
   RESPONSIVE — TABLET 640px+
=========================== */
@media (min-width: 640px) {
  .pricing-grid {
    flex-direction: row;
    align-items: stretch;
    flex-wrap: wrap;
  }
  .pricing-card {
    flex: 1;
    min-width: 240px;
  }
  .cta-actions {
    flex-direction: row;
    justify-content: center;
  }
}

/* ===========================
   RESPONSIVE — DESKTOP 1024px+
=========================== */
@media (min-width: 1024px) {
  .page {
    padding-bottom: 0;
  }
  .pricing-section {
    padding: 80px 0 40px;
  }
  .compare-section {
    padding: 80px 0;
  }
  .faq-section {
    padding: 80px 0;
  }
  .cta-section {
    padding: 80px 0;
  }
  .pricing-grid {
    flex-wrap: nowrap;
    gap: 24px;
  }
  .pricing-card {
    flex: 1;
  }
  .pricing-featured {
    transform: scale(1.03);
  }
  .pricing-featured:hover {
    transform: scale(1.03) translateY(-4px);
  }
  .cta-card {
    padding: 72px 64px;
  }
}
</style>