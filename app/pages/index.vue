<template>
  <div class="page">
    <!-- ===== HERO ===== -->
    <section class="hero" id="beranda">
      <div class="hero-inner container">
        <!-- Text -->
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="title-dark"
              >Bikin Undangan<br />Digital Online<br />Interaktif Untuk</span
            >
            <span class="title-accent">Pernikahan</span>
          </h1>
          <p class="hero-desc">
            PlayMoment menghadirkan undangan digital modern yang mudah dibuat
            dan siap dibagikan dalam hitungan menit.
          </p>
          <div class="hero-actions">
            <button class="btn-primary" @click="handleLoginClick">
              Login Sekarang
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
            <button class="btn-secondary" @click="goToTema">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Lihat Tema
            </button>
          </div>
        </div>

        <!-- Phone Mockup (desktop only) -->
        <div class="hero-illustration">
          <div class="blob blob-1"></div>
          <div class="blob blob-2"></div>
          <div class="blob blob-3"></div>
          <!-- Back phone (tilted) -->
          <div class="phone-mockup phone-back-card">
            <div class="phone-screen">
              <div
                class="mock-header"
                style="background: linear-gradient(135deg, #1a2e45, #243d5c)"
              >
                <span
                  class="mock-logo-text"
                  style="
                    color: #fff;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.3px;
                  "
                  >✨ Undangan Digital</span
                >
              </div>
              <div
                class="mock-content"
                style="
                  background: linear-gradient(
                    160deg,
                    #fce4ec 0%,
                    #f8b4c8 60%,
                    #e8d5b7 100%
                  );
                "
              >
                <div class="mock-ring" style="font-size: 28px">🌸</div>
                <div class="mock-names" style="font-size: 13px">
                  Ahmad &amp; Fatimah
                </div>
                <div class="mock-date" style="color: #c9747b">
                  20 Des 2025 · Surabaya
                </div>
                <div class="mock-divider"></div>
                <div class="mock-tags">
                  <span style="background: #f8b4c8; color: #8b3a4a"
                    >Walimah</span
                  >
                </div>
              </div>
              <div class="mock-footer" style="background: #c9747b">
                <span>Hadir Bersama Kami</span>
              </div>
            </div>
          </div>
          <!-- Front phone (main) -->
          <div class="phone-mockup phone-front-card">
            <div class="phone-screen">
              <div class="mock-header">
                <span class="mock-logo-text">
                  <span style="color: #1a2e45; font-weight: 800">Nama</span
                  ><span style="color: #7ecec4; font-weight: 800">Brand</span>
                </span>
              </div>
              <div class="mock-content">
                <div class="mock-ring">💍</div>
                <div class="mock-names">Rizky &amp; Siti</div>
                <div class="mock-date">15 Juni 2025 · Banjarmasin</div>
                <div class="mock-divider"></div>
                <div class="mock-tags">
                  <span>Akad Nikah</span>
                  <span>Resepsi</span>
                </div>
              </div>
              <div class="mock-footer">
                <span>Konfirmasi Kehadiran</span>
              </div>
            </div>
          </div>
          <!-- Floating badge -->
          <div class="hero-badge">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="#7ecec4"
              stroke="none"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
            <span>500+ Tema Tersedia</span>
          </div>
          <div class="hero-badge-2">
            <span>✅</span>
            <span>Selesai dalam 5 menit</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FITUR ===== -->
    <section class="features" id="fitur">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Kenapa Pilih Kami</p>
          <h2>Fitur <span class="accent">Unggulan</span></h2>
          <p class="section-sub">
            Semua yang kamu butuhkan untuk membuat undangan digital yang memukau
          </p>
        </div>
        <div class="features-grid">
          <div v-for="(f, i) in features" :key="i" class="feature-card">
            <div class="feature-icon-wrap" v-html="f.svg"></div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TEMA ===== -->
    <!-- ===== TEMA ===== -->
    <section class="themes" id="tema">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Koleksi Terlengkap</p>
          <h2>Pilihan <span class="accent">Tema</span></h2>
          <p class="section-sub">
            Puluhan tema unik siap pakai untuk hari spesialmu.
          </p>
        </div>

        <div class="themes-grid" ref="themesRef">
          <div
            v-for="(t, i) in themes"
            :key="i"
            class="theme-card"
            @mouseenter="t._hovered = true"
            @mouseleave="t._hovered = false"
          >
            <!-- Preview -->
            <div
              class="theme-preview"
              :style="{ background: t.bg || '#f9f9f9' }"
            >
              <div
                class="preview-deck"
                :class="{ 'preview-deck-open': themesVisible || t._hovered }"
              >
                <img
                  :src="t.thumbnails[0]"
                  class="pdeck-img pdeck-left"
                  :alt="t.name"
                />
                <img
                  :src="t.thumbnails[1]"
                  class="pdeck-img pdeck-center"
                  :alt="t.name"
                />
                <img
                  :src="t.thumbnails[2]"
                  class="pdeck-img pdeck-right"
                  :alt="t.name"
                />
              </div>
            </div>

            <!-- Info -->
            <div class="theme-info">
              <h3 class="theme-name">{{ t.name }}</h3>
              <div class="theme-price">
                <span class="price-now">Rp. {{ t.price }}</span>
                <span class="price-was" v-if="t.oldPrice"
                  >Rp. {{ t.oldPrice }}</span
                >
              </div>
              <div class="theme-actions">
                <button class="btn-preview">Preview</button>
                <button class="btn-pilih">Pilih</button>
              </div>
            </div>
          </div>
        </div>

        <div class="center-btn">
          <button class="btn-outline" @click="goToTema">
            Lihat Semua Tema
            <svg
              width="14"
              height="14"
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
        </div>
      </div>
    </section>

    <!-- ===== PAKET ===== -->
    <section class="pricing" id="paket">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Harga Terjangkau</p>
          <h2>Pilihan <span class="accent">Paket</span></h2>
          <p class="section-sub">
            Pilih paket Basic, Premium, atau Prioritas sesuai kebutuhanmu
          </p>
        </div>
        <div class="pricing-grid">
          <div
            v-for="(p, i) in packages"
            :key="i"
            class="pricing-card"
            :class="{ featured: p.featured }"
          >
            <div v-if="p.featured" class="badge">TERLARIS</div>

            <!-- Nama -->
            <h3>{{ p.name }}</h3>

            <!-- Harga -->
            <div class="price-wrap">
              <span class="price-rp">Rp</span>
              <span class="price-num">{{ p.priceNum }}</span>
            </div>

            <!-- Tagline -->
            <p v-if="p.tagline" class="pkg-tagline">{{ p.tagline }}</p>

            <!-- Fitur -->
            <ul class="feat-list">
              <li
                v-for="(feat, j) in p.marketingFeatures"
                :key="j"
                :class="{ 'feat-off': feat.disabled }"
              >
                <span class="feat-mark" :class="feat.disabled ? 'mark-no' : 'mark-yes'">
                  {{ feat.disabled ? '×' : '✓' }}
                </span>
                {{ feat.label }}
              </li>
            </ul>

            <!-- Tombol -->
            <button class="btn-pilih-pkg" @click="pilihPaket(p)">
              Selanjutnya &nbsp;&rarr;
            </button>
          </div>
        </div>

        <p class="pricing-note">Garansi uang kembali 7 hari jika tidak puas</p>
      </div>
    </section>

    <!-- ===== CARA BELI ===== -->
    <section class="how-to" id="cara-beli">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Mudah &amp; Cepat</p>
          <h2>Cara <span class="accent">Pesan</span></h2>
          <p class="section-sub">
            4 langkah mudah, undanganmu siap dalam hitungan menit
          </p>
        </div>
        <div class="how-grid">
          <div v-for="(step, i) in steps" :key="i" class="how-card">
            <div class="how-num">{{ i + 1 }}</div>
            <div class="how-icon" v-html="step.svg"></div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TESTIMONI ===== -->
    <section class="testimonials" id="testimoni">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Kata Mereka</p>
          <h2>Ribuan Pasangan <span class="accent">Puas</span></h2>
          <p class="section-sub">
            Bergabung bersama 10.000+ pengguna yang sudah mempercayai kami
          </p>
        </div>
        <div class="testi-grid">
          <div v-for="(t, i) in testimonials" :key="i" class="testi-card">
            <div class="testi-stars">
              <svg
                v-for="s in 5"
                :key="s"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="#f59e0b"
                stroke="none"
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
            <p class="testi-text">"{{ t.text }}"</p>
            <div class="testi-user">
              <div class="testi-avatar" :style="{ background: t.color }">
                {{ t.initials }}
              </div>
              <div>
                <div class="testi-name">{{ t.name }}</div>
                <div class="testi-event">{{ t.event }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="testi-stats">
          <div class="stat-item">
            <span class="stat-num">10.000+</span>
            <span class="stat-label">Pengguna Aktif</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">4.9/5</span>
            <span class="stat-label">Rating Rata-rata</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">500+</span>
            <span class="stat-label">Pilihan Tema</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">99%</span>
            <span class="stat-label">Pelanggan Puas</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FAQ ===== -->
    <section class="faq" id="faq">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Ada Pertanyaan?</p>
          <h2>FAQ <span class="accent">Pertanyaan Umum</span></h2>
          <p class="section-sub">
            Jawaban untuk pertanyaan yang sering ditanyakan
          </p>
        </div>
        <div class="faq-list">
          <div
            v-for="(item, i) in faqs"
            :key="i"
            class="faq-item"
            :class="{ open: openFaq === i }"
            @click="openFaq = openFaq === i ? null : i"
          >
            <div class="faq-q">
              <span>{{ item.q }}</span>
              <svg
                class="faq-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <div class="faq-a">{{ item.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA BOTTOM ===== -->
    <section class="cta-bottom">
      <div class="container">
        <div class="cta-card">
          <div class="cta-deco cta-deco-1"></div>
          <div class="cta-deco cta-deco-2"></div>
          <div class="cta-body">
            <p class="cta-eyebrow">Mulai Sekarang</p>
            <h2 class="cta-title">Siap Buat Undangan<br />Digital Impianmu?</h2>
            <p class="cta-desc">
              Daftar gratis sekarang, tidak perlu kartu kredit. Mulai dalam 5
              menit!
            </p>
            <div class="cta-actions">
              <button class="cta-btn-primary" @click="handleDaftar">
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
              <button class="cta-btn-outline" @click="goToTema">
                Lihat Koleksi Tema
              </button>
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
import { getMarketingPakets, formatRupiahNumber, buildCheckoutQuery } from "~/config/paket";
import { useAccountStore } from "~/stores/useAccountStore";

const accountStore = useAccountStore();
const router = useRouter();

function handleLoginClick() {
  const user = accountStore.currentUser;
  if (user?.role === "admin") {
    navigateTo("/admin/dashboard");
  } else if (user?.role === "customer") {
    navigateTo("/dashboard");
  } else {
    navigateTo("/login");
  }
}

const goToTema = () => {
  router.push("/tema");
};

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const handleDaftar = () => {
  alert("Selamat datang! Segera daftar gratis.");
};

const features = [
  {
    title: "Pilih Tema",
    desc: "Ratusan tema cantik tersedia, pilih sesuai selera dan konsep pernikahanmu.",
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  },
  {
    title: "Edit Mudah",
    desc: "Edit semua detail acara langsung dari smartphone tanpa keahlian coding.",
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  },
  {
    title: "Upload Foto",
    desc: "Unggah foto prewedding dan galeri kenangan indahmu dengan mudah.",
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  },
  {
    title: "Kirim Instan",
    desc: "Bagikan link undangan via WhatsApp, Instagram, atau media sosial lainnya.",
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  },
  {
    title: "Musik Latar",
    desc: "Tambahkan lagu favorit sebagai backsound undangan digitalmu.",
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  },
  {
    title: "RSVP Online",
    desc: "Tamu bisa konfirmasi kehadiran langsung di halaman undangan.",
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>`,
  },
];

const themesRef = ref(null);
const themesVisible = ref(false);
let themesObserver = null;

onMounted(() => {
  themesObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        themesVisible.value = entry.isIntersecting;
      });
    },
    { threshold: 0.2 },
  );
  if (themesRef.value) themesObserver.observe(themesRef.value);
});

onUnmounted(() => {
  if (themesObserver) themesObserver.disconnect();
});

const themes = reactive([
  {
    name: "Rainy Green",
    price: "199.000",
    oldPrice: "250.000",
    bg: "#e8ede8",
    _hovered: false,
    thumbnails: [
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
    ],
  },
  {
    name: "Royal Garden",
    price: "199.000",
    oldPrice: "250.000",
    bg: "#f5ede0",
    _hovered: false,
    thumbnails: [
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
    ],
  },
  {
    name: "Pastel Rose",
    price: "199.000",
    oldPrice: "250.000",
    bg: "#ede8f0",
    _hovered: false,
    thumbnails: [
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
    ],
  },
]);

const packages = getMarketingPakets().map((p) => ({
  id: p.id,
  name: p.adminName,
  tagline: p.tagline,
  priceNum: formatRupiahNumber(p.priceIdr),
  marketingFeatures: p.marketingFeatures ?? [],
  featured: p.featured,
}));

const pilihPaket = (p) =>
  navigateTo({ path: "/checkout", query: buildCheckoutQuery(p.id) });

const steps = [
  {
    title: "Pilih Tema dan Paket",
    desc: "Pilih tema dan paket undangan sesuai kebutuhan Anda.",
    // Icon: Search/Layout (Mencari tema)
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
  },
  {
    title: "Isi Data Pemesanan",
    desc: "Lengkapi data diri sebagai pemesan melalui form yang tersedia.",
    // Icon: Form/Edit (Mengisi data)
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  },
  {
    title: "Lakukan Pembayaran",
    desc: "Lakukan pembayaran sesuai instruksi yang diberikan.",
    // Icon: Wallet/Credit Card (Pembayaran)
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  },
  {
    title: "Konfirmasi via WhatsApp",
    desc: "Kirim bukti pembayaran ke admin melalui WhatsApp.",
    // Icon: Message Circle/Chat (Komunikasi)
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.8.9L21 3z"/></svg>`,
  },
  {
    title: "Terima Akun Login",
    desc: "Admin akan memberikan akun setelah pembayaran dikonfirmasi.",
    // Icon: User/Key (Menerima akses)
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  },
  {
    title: "Mulai Buat Undangan",
    desc: "Login dan mulai mengatur undangan Anda.",
    // Icon: Rocket/Magic (Eksekusi pembuatan)
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  },
];

const testimonials = [
  {
    text: "Prosesnya cepat banget, dalam 10 menit undangan sudah jadi. Tampilannya elegan dan tamu-tamu suka!",
    name: "Ayu & Budi",
    event: "Pernikahan · Januari 2025",
    initials: "AB",
    color: "linear-gradient(135deg,#f8b4c8,#e8d5b7)",
  },
  {
    text: "Fitur RSVPnya sangat membantu buat tracking tamu. Recommended banget buat yang mau nikah!",
    name: "Rizky & Siti",
    event: "Pernikahan · Maret 2025",
    initials: "RS",
    color: "linear-gradient(135deg,#7ecec4,#4a90d9)",
  },
  {
    text: "Harganya terjangkau tapi kualitas desainnya premium. Banyak tamu yang tanya pakai platform apa.",
    name: "Dinda & Fahri",
    event: "Pernikahan · Februari 2025",
    initials: "DF",
    color: "linear-gradient(135deg,#b8860b,#ffd700)",
  },
  {
    text: "Dari nol sampai undangan jadi cuma butuh waktu 15 menit. Sangat mudah dipakai meski gaptek!",
    name: "Mira & Hasan",
    event: "Pernikahan · April 2025",
    initials: "MH",
    color: "linear-gradient(135deg,#7aad8a,#c8e6c9)",
  },
  {
    text: "Pelayanan supportnya ramah dan responsif. Pas ada kendala langsung dibantu sampai beres.",
    name: "Lestari & Andi",
    event: "Pernikahan · Desember 2024",
    initials: "LA",
    color: "linear-gradient(135deg,#1e3a5f,#4a90d9)",
  },
  {
    text: "Tema koleksinya banyak dan cantik-cantik. Susah milihnya karena semuanya bagus!",
    name: "Nisa & Deni",
    event: "Pernikahan · Mei 2025",
    initials: "ND",
    color: "linear-gradient(135deg,#e91e63,#f48fb1)",
  },
];

const faqs = [
  {
    q: "Apakah bisa coba gratis dulu sebelum bayar?",
    a: "Ya! Kamu bisa daftar dan membuat undangan secara gratis. Paket gratis sudah termasuk 1 tema, link undangan aktif 30 hari, dan fitur RSVP dasar.",
  },
  {
    q: "Berapa lama proses pembuatan undangannya?",
    a: "Sangat cepat! Kamu bisa selesai dalam 5-15 menit. Cukup pilih tema, isi data, upload foto, dan undanganmu siap dibagikan.",
  },
  {
    q: "Apakah bisa diedit setelah diterbitkan?",
    a: "Tentu! Kamu bisa mengedit semua detail undangan kapan saja selama masa aktif paketmu. Perubahan akan langsung terlihat di link undangan.",
  },
  {
    q: "Apakah link undangan bisa custom dengan nama sendiri?",
    a: "Ya, untuk paket Premium dan VIP kamu bisa menggunakan subdomain custom seperti nama-kamu.id.",
  },
  {
    q: "Bagaimana cara tamu mengkonfirmasi kehadiran?",
    a: "Tamu cukup membuka link undangan dan mengisi form RSVP yang tersedia. Konfirmasi kehadiran akan langsung masuk ke dashboard kamu.",
  },
  {
    q: "Apakah tersedia fitur amplop digital / transfer hadiah?",
    a: "Ya! Kamu bisa menambahkan nomor rekening atau QRIS di halaman undangan sehingga tamu bisa mengirimkan hadiah secara digital.",
  },
];

const openFaq = ref(null);
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
  /* reserve space for mobile bottom nav */
  padding-bottom: 72px;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ===========================
   BUTTONS
=========================== */
.btn-primary {
  display: inline-flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  gap: 8px;
  background: #1a2e45;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 14px 26px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
  white-space: nowrap;
}
.btn-primary:hover {
  background: #263d58;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(26, 46, 69, 0.25);
}

.btn-nav {
  padding: 10px 20px;
  font-size: 14px;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #d4ede9;
  color: #1a2e45;
  border: none;
  border-radius: 50px;
  padding: 14px 26px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
}
.btn-secondary:hover {
  background: #b6dcd7;
  transform: translateY(-1px);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #1a2e45;
  border: 2px solid #1a2e45;
  border-radius: 50px;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s,
    transform 0.2s;
}
.btn-outline:hover {
  background: #1a2e45;
  color: #fff;
  transform: translateY(-1px);
}

.btn-block {
  width: 100%;
  justify-content: center;
}

/* ===========================
   HERO
=========================== */
.hero {
  overflow: hidden;
  position: relative;
}

.hero-inner {
  padding: 48px 20px 64px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: clamp(36px, 10vw, 62px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -1.5px;
  margin-bottom: 20px;
}

.title-dark {
  display: block;
  color: #1a2e45;
}
.title-accent {
  display: block;
  color: #7ecec4;
  font-style: italic;
}

.hero-desc {
  font-size: 15px;
  line-height: 1.75;
  color: #4a5568;
  margin-bottom: 32px;
  max-width: 520px;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Phone mockup — hidden on mobile */
.hero-illustration {
  display: none;
  position: relative;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: 460px;
}

.blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.blob-1 {
  width: 260px;
  height: 260px;
  background: radial-gradient(
    circle,
    rgba(126, 206, 196, 0.25) 0%,
    transparent 70%
  );
  top: -60px;
  right: -40px;
  z-index: 0;
}
.blob-2 {
  width: 180px;
  height: 180px;
  background: radial-gradient(
    circle,
    rgba(26, 46, 69, 0.1) 0%,
    transparent 70%
  );
  bottom: -20px;
  left: 0;
  z-index: 0;
}

.phone-mockup {
  width: 220px;
  height: 430px;
  background: #1a2e45;
  border-radius: 38px;
  padding: 12px;
  box-shadow:
    0 32px 80px rgba(26, 46, 69, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 2;
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mock-header {
  background: #f7fafa;
  padding: 12px 14px;
  border-bottom: 1px solid #eee;
}
.mock-logo-text {
  font-size: 13px;
  line-height: 1;
}

.mock-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  gap: 8px;
  background: linear-gradient(180deg, #fff 0%, #f0faf9 100%);
}

.mock-ring {
  font-size: 38px;
}
.mock-names {
  font-size: 15px;
  font-weight: 800;
  color: #1a2e45;
  letter-spacing: -0.3px;
}
.mock-date {
  font-size: 10px;
  color: #7ecec4;
  font-weight: 600;
}
.mock-divider {
  width: 40px;
  height: 1px;
  background: #e0e0e0;
  margin: 4px 0;
}
.mock-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}
.mock-tags span {
  background: #d4ede9;
  color: #1a2e45;
  font-size: 9px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}

.mock-footer {
  padding: 10px 14px;
  background: #1a2e45;
  border-radius: 0 0 28px 28px;
  text-align: center;
}
.mock-footer span {
  color: #fff;
  font-size: 10px;
  font-weight: 700;
}

/* ===========================
   SECTION SHARED
=========================== */
.section-header {
  text-align: center;
  margin-bottom: 40px;
}
.section-eyebrow {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #7ecec4;
  margin-bottom: 8px;
}
.section-header h2 {
  font-size: clamp(24px, 5vw, 36px);
  font-weight: 800;
  color: #1a2e45;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}
.section-sub {
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
  max-width: 480px;
  margin: 0 auto;
}
.accent {
  color: #7ecec4;
}

/* ===========================
   FEATURES
=========================== */
.features {
  padding: 64px 0;
  background: #f7fafa;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.feature-card {
  background: #fff;
  border-radius: 20px;
  padding: 24px 18px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
  transition:
    transform 0.25s,
    box-shadow 0.25s;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.feature-icon-wrap {
  width: 52px;
  height: 52px;
  background: #f0faf9;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.feature-card h3 {
  font-size: 15px;
  font-weight: 700;
  color: #1a2e45;
  margin-bottom: 6px;
}
.feature-card p {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
}

/* ===========================
   THEMES
=========================== */
/* ===========================
   THEMES
=========================== */
.themes {
  padding: 64px 0;
  background: #fff;
}

@media (min-width: 1024px) {
  .themes {
    padding: 96px 0;
  }
}

.themes-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 32px;
  padding: 0 15px;
}

@media (min-width: 640px) {
  .themes-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 0;
  }
}

@media (min-width: 1024px) {
  .themes-grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 40px;
    padding: 0;
  }
}

/* ===== CARD ===== */
.theme-card {
  background: #fff;
  border: 1.5px solid #7ecec4;
  border-radius: 20px;
  overflow: visible; /* biar kartu dalam ga terpotong */
  display: flex;
  flex-direction: column;
  transition:
    box-shadow 0.3s,
    transform 0.3s;
}
.theme-card:hover {
  box-shadow: 0 16px 40px rgba(26, 46, 69, 0.13);
  transform: translateY(-4px);
}

/* ===== PREVIEW AREA ===== */
.theme-preview {
  padding: 24px 20px 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 260px;
  overflow: hidden;
  border-radius: 18px 18px 0 0;
  position: relative;
}

/* ===== DECK WRAPPER ===== */
.preview-deck {
  position: relative;
  width: 100%;
  height: 240px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

/* ===== TIAP GAMBAR ===== */
.pdeck-img {
  position: absolute;
  width: 44%;
  height: 220px;
  object-fit: cover;
  object-position: top;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  bottom: 0;
}

/* STATE TERTUMPUK (default) */
.pdeck-left {
  left: 50%;
  transform: translateX(-50%) rotate(0deg);
  z-index: 1;
  filter: brightness(0.82);
}
.pdeck-center {
  left: 50%;
  transform: translateX(-50%) rotate(0deg);
  z-index: 3;
  filter: brightness(1);
}
.pdeck-right {
  left: 50%;
  transform: translateX(-50%) rotate(0deg);
  z-index: 2;
  filter: brightness(0.72);
}

/* STATE TERBUKA — scroll masuk viewport ATAU hover */
.preview-deck-open .pdeck-left {
  left: 0%;
  transform: translateX(0) rotate(-10deg) translateY(14px);
  z-index: 1;
  filter: brightness(0.88);
}
.preview-deck-open .pdeck-center {
  left: 50%;
  transform: translateX(-50%) rotate(0deg) translateY(0px);
  z-index: 3;
  filter: brightness(1);
}
.preview-deck-open .pdeck-right {
  left: auto;
  right: 0%;
  transform: translateX(0) rotate(10deg) translateY(14px);
  z-index: 2;
  filter: brightness(0.88);
}

/* ===== INFO ===== */
.theme-info {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  border-radius: 0 0 18px 18px;
}

.theme-name {
  font-size: 16px;
  font-weight: 700;
  color: #1a2e45;
  margin-bottom: 4px;
}

.theme-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.price-now {
  font-weight: 700;
  font-size: 15px;
  color: #1a2e45;
}

.price-was {
  color: #aaa;
  text-decoration: line-through;
  font-size: 13px;
}

.theme-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.btn-preview {
  background: #f0f0f0;
  border: none;
  padding: 11px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  color: #1a2e45;
  transition: background 0.2s;
}
.btn-preview:hover {
  background: #e0e0e0;
}

.btn-pilih {
  background: #1a2e45;
  color: white;
  border: none;
  padding: 11px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-pilih:hover {
  background: #263d58;
}

.center-btn {
  text-align: center;
  margin-top: 8px;
}
/* ===========================
   PRICING
=========================== */
.pricing {
  padding: 64px 0;
  background: #f7fafa;
}

.pricing-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pricing-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px 28px 28px;
  position: relative;
  border: 2px solid #e2e8f0;
  transition: transform 0.25s, box-shadow 0.25s;
}
.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
}
.pricing-card.featured {
  border-color: #7ecec4;
  box-shadow: 0 8px 32px rgba(126, 206, 196, 0.15);
}

.badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #7ecec4;
  color: #1a2e45;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  padding: 5px 18px;
  border-radius: 20px;
  white-space: nowrap;
}

.pricing-card h3 {
  font-size: 22px;
  font-weight: 900;
  color: #1a2e45;
  margin-bottom: 14px;
}

.price-wrap {
  display: flex;
  align-items: flex-start;
  gap: 2px;
  margin-bottom: 8px;
}
.price-rp {
  font-size: 18px;
  font-weight: 700;
  color: #1a2e45;
  margin-top: 6px;
}
.price-num {
  font-size: 42px;
  font-weight: 900;
  color: #1a2e45;
  line-height: 1;
}

.pkg-tagline {
  font-size: 14px;
  color: #7ecec4;
  font-style: italic;
  font-weight: 500;
  margin-bottom: 20px;
}

.feat-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin-bottom: 28px;
}
.feat-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: #2d3748;
  line-height: 1.5;
}
.feat-list li.feat-off {
  color: #a0aec0;
}
.feat-mark {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.5;
  flex-shrink: 0;
  width: 16px;
}
.mark-yes { color: #7ecec4; }
.mark-no  { color: #cbd5e0; }

.btn-pilih-pkg {
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
}
.btn-pilih-pkg:hover {
  background: #5bb8ac;
  transform: translateY(-1px);
}

.pricing-note {
  text-align: center;
  font-size: 13px;
  color: #718096;
  margin-top: 28px;
  font-weight: 500;
}

/* ===========================
   FOOTER
=========================== */
/* ===========================
   RESPONSIVE — TABLET 640px+
=========================== */
@media (min-width: 640px) {
  .hero-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .themes-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .pricing-grid {
    flex-direction: row;
    align-items: stretch;
  }
  .pricing-card {
    flex: 1;
  }
}

/* ===========================
   RESPONSIVE — DESKTOP 1024px+
=========================== */
@media (min-width: 1024px) {
  /* Remove bottom nav padding */
  .page {
    padding-bottom: 0;
  }

  /* WhatsApp: lower on desktop (no bottom nav) */
  /* Hero: side by side layout */
  .hero-inner {
    flex-direction: row;
    align-items: center;
    gap: 64px;
    padding: 96px 20px 120px;
  }

  .hero-text {
    flex: 1.1;
  }

  /* Show phone illustration */
  .hero-illustration {
    display: flex;
    flex: 0.9;
  }

  .hero-title {
    font-size: clamp(44px, 4.5vw, 66px);
  }
  .hero-desc {
    font-size: 16px;
  }

  /* Hero actions row on desktop */
  .hero-actions {
    flex-direction: row;
  }

  /* Larger section padding */
  .features {
    padding: 96px 0;
  }
  .themes {
    padding: 96px 0;
  }
  .pricing {
    padding: 96px 0;
  }

  /* Feature grid stays 3 col */
  .features-grid {
    gap: 24px;
  }
  .themes-grid {
    gap: 20px;
  }
}

/* ===========================
   RESPONSIVE — WIDE 1280px+
=========================== */
@media (min-width: 1280px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ===========================
   HERO ACTIONS — RESPONSIVE FIX
=========================== */
.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
}

@media (min-width: 480px) {
  .hero-actions {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
  .btn-primary,
  .btn-secondary {
    flex: 1 1 auto;
    justify-content: center;
    min-width: 160px;
  }
}

@media (min-width: 1024px) {
  .hero-actions {
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  }
  .btn-primary,
  .btn-secondary {
    flex: 0 0 auto;
  }
}

/* ===========================
   PHONE MOCKUP — UPGRADED
=========================== */
.phone-back-card {
  position: absolute;
  width: 190px !important;
  height: 370px !important;
  transform: rotate(-10deg) translateX(-80px) translateY(30px);
  opacity: 0.85;
  z-index: 1 !important;
}
.phone-front-card {
  position: relative;
  z-index: 2;
}
.blob-3 {
  width: 140px;
  height: 140px;
  background: radial-gradient(
    circle,
    rgba(244, 194, 194, 0.3) 0%,
    transparent 70%
  );
  bottom: 40px;
  right: -20px;
  z-index: 0;
}

.hero-badge {
  position: absolute;
  top: 24px;
  right: -10px;
  background: #fff;
  border-radius: 50px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #1a2e45;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  z-index: 5;
  white-space: nowrap;
}
.hero-badge-2 {
  position: absolute;
  bottom: 60px;
  left: -16px;
  background: #1a2e45;
  border-radius: 50px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 4px 20px rgba(26, 46, 69, 0.3);
  z-index: 5;
  white-space: nowrap;
}

/* ===========================
   HOW TO / CARA BELI
=========================== */
.how-to {
  padding: 80px 0;
  background: #fff;
}

.how-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  position: relative;
}

.how-card {
  background: #f7fafa;
  border-radius: 20px;
  padding: 28px 20px;
  position: relative;
  border: 1px solid #edf2f7;
  transition:
    transform 0.25s,
    box-shadow 0.25s;
}
.how-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}

.how-num {
  width: 32px;
  height: 32px;
  background: #1a2e45;
  color: #7ecec4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 900;
  margin-bottom: 14px;
}

.how-icon {
  width: 48px;
  height: 48px;
  background: #f0faf9;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.how-card h3 {
  font-size: 15px;
  font-weight: 700;
  color: #1a2e45;
  margin-bottom: 6px;
}
.how-card p {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
}

@media (min-width: 640px) {
  .how-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (min-width: 768px) {
  .how-grid {
    grid-template-columns: repeat(3, 1fr); /* desktop 3 kotak */
  }
}

/* ===========================
   TESTIMONIALS
=========================== */
.testimonials {
  padding: 80px 0;
  background: #f7fafa;
}

.testi-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 48px;
}

.testi-card {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #edf2f7;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition:
    transform 0.25s,
    box-shadow 0.25s;
}
.testi-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.09);
}

.testi-stars {
  display: flex;
  gap: 3px;
  margin-bottom: 12px;
}

.testi-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.7;
  margin-bottom: 16px;
  font-style: italic;
}

.testi-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.testi-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}

.testi-name {
  font-size: 14px;
  font-weight: 700;
  color: #1a2e45;
}
.testi-event {
  font-size: 12px;
  color: #9ca3af;
}

.testi-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0;
  background: #fff;
  border-radius: 20px;
  padding: 24px 16px;
  border: 1px solid #edf2f7;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px;
  flex: 1 1 120px;
}

.stat-num {
  font-size: 26px;
  font-weight: 900;
  color: #1a2e45;
  letter-spacing: -0.5px;
}
.stat-label {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
  text-align: center;
  margin-top: 2px;
}

.stat-divider {
  width: 1px;
  background: #edf2f7;
  align-self: stretch;
  display: none;
}

@media (min-width: 480px) {
  .testi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stat-divider {
    display: block;
  }
}

@media (min-width: 1024px) {
  .testi-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ===========================
   FAQ
=========================== */
.faq {
  padding: 80px 0;
  background: #fff;
}

.faq-list {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-item {
  background: #f7fafa;
  border-radius: 16px;
  border: 1.5px solid #edf2f7;
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.faq-item:hover {
  border-color: #7ecec4;
}
.faq-item.open {
  border-color: #7ecec4;
  box-shadow: 0 4px 16px rgba(126, 206, 196, 0.15);
}

.faq-q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  font-size: 15px;
  font-weight: 600;
  color: #1a2e45;
}

.faq-icon {
  flex-shrink: 0;
  color: #7ecec4;
  transition: transform 0.25s;
}
.faq-item.open .faq-icon {
  transform: rotate(180deg);
}

.faq-a {
  max-height: 0;
  overflow: hidden;
  font-size: 14px;
  color: #4a5568;
  line-height: 1.7;
  padding: 0 20px;
  transition:
    max-height 0.3s ease,
    padding 0.3s ease;
}
.faq-item.open .faq-a {
  max-height: 200px;
  padding: 0 20px 18px;
}

/* ===========================
   CTA BOTTOM
=========================== */
.cta-bottom {
  padding: 48px 0 80px;
  background: #f7fafa;
}

.cta-card {
  background: linear-gradient(135deg, #1a2e45 0%, #243d5c 60%, #2d5272 100%);
  border-radius: 28px;
  padding: 52px 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-deco {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.cta-deco-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(126, 206, 196, 0.15) 0%,
    transparent 70%
  );
  top: -100px;
  right: -60px;
}
.cta-deco-2 {
  width: 220px;
  height: 220px;
  background: radial-gradient(
    circle,
    rgba(126, 206, 196, 0.1) 0%,
    transparent 70%
  );
  bottom: -80px;
  left: -40px;
}

.cta-body {
  position: relative;
  z-index: 1;
}

.cta-eyebrow {
  display: inline-block;
  background: rgba(126, 206, 196, 0.2);
  color: #7ecec4;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 50px;
  margin-bottom: 20px;
}

.cta-title {
  font-size: clamp(26px, 6vw, 42px);
  font-weight: 900;
  color: #fff;
  line-height: 1.2;
  letter-spacing: -0.5px;
  margin-bottom: 14px;
}

.cta-desc {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  margin-bottom: 32px;
  max-width: 440px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.cta-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #7ecec4;
  color: #1a2e45;
  border: none;
  border-radius: 50px;
  padding: 16px 32px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
  white-space: nowrap;
}
.cta-btn-primary:hover {
  background: #6abfb4;
  transform: translateY(-2px);
}

.cta-btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s;
  white-space: nowrap;
}
.cta-btn-outline:hover {
  border-color: rgba(255, 255, 255, 0.7);
  color: #fff;
}

@media (min-width: 480px) {
  .cta-actions {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (min-width: 1024px) {
  .how-to {
    padding: 96px 0;
  }
  .testimonials {
    padding: 96px 0;
  }
  .faq {
    padding: 96px 0;
  }
  .cta-bottom {
    padding: 64px 0 96px;
  }
  .cta-card {
    padding: 72px 48px;
  }
}
</style>