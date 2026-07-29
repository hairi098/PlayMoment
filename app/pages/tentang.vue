<template>
  <div class="page">
    <!-- ===== HERO TENTANG ===== -->
    <section class="hero">
      <div class="hero-bg-deco">
        <div class="deco-circle deco-c1"></div>
        <div class="deco-circle deco-c2"></div>
        <div class="deco-dots"></div>
      </div>
      <div class="container">
        <div class="hero-inner">
          <span class="hero-badge">✦ Tentang Kami</span>
          <h1 class="hero-title">
            Kami Hadir untuk Membuat<br />
            <span class="accent">Momen Spesialmu</span><br />
            Tak Terlupakan
          </h1>
          <p class="hero-desc">
            PlayMoment lahir dari kecintaan terhadap detail dan kepercayaan
            bahwa setiap undangan adalah cerminan cerita cinta yang unik. Kami
            bukan sekadar platform — kami adalah teman perjalanan menuju hari
            istimewamu.
          </p>
          <div class="hero-scroll-hint">
            <span>Kenali lebih jauh</span>
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
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TENTANG BRAND ===== -->
    <section class="brand-section">
      <div class="container">
        <div class="brand-grid">
          <div class="brand-visual">
            <div class="brand-card-stack">
              <div class="brand-card bc-back">
                <div class="bc-header"></div>
                <div
                  class="bc-img"
                  style="background: linear-gradient(135deg, #c9747b, #7e57c2)"
                ></div>
                <div class="bc-lines">
                  <div class="bc-line w70"></div>
                  <div class="bc-line w50"></div>
                </div>
              </div>
              <div class="brand-card bc-mid">
                <div class="bc-header"></div>
                <div
                  class="bc-img"
                  style="background: linear-gradient(135deg, #f0c040, #e64a19)"
                ></div>
                <div class="bc-lines">
                  <div class="bc-line w80"></div>
                  <div class="bc-line w55"></div>
                </div>
              </div>
              <div class="brand-card bc-front">
                <div class="bc-header"></div>
                <div
                  class="bc-img"
                  style="background: linear-gradient(135deg, #7ecec4, #1a2e45)"
                ></div>
                <div class="bc-lines">
                  <div class="bc-line w75"></div>
                  <div class="bc-line w60"></div>
                  <div class="bc-line w45"></div>
                </div>
                <div class="bc-btn"></div>
              </div>
            </div>
            <div class="brand-float-badge">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a2e45"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Dipercaya 12.000+ Pasangan</span>
            </div>
          </div>

          <div class="brand-content">
            <p class="sec-eyebrow">Cerita Kami</p>
            <h2 class="sec-title">
              Dimulai dari Sebuah<br /><span class="accent"
                >Mimpi Sederhana</span
              >
            </h2>
            <p class="brand-text">
              Berawal dari frustrasi melihat undangan pernikahan yang kaku,
              mahal, dan susah dibagikan — PlayMoment hadir pada 2022 dengan
              satu misi: membuat undangan digital yang indah, personal, dan bisa
              dinikmati semua kalangan.
            </p>
            <p class="brand-text">
              Dalam waktu dua tahun, kami telah membantu ribuan pasangan,
              keluarga, dan penyelenggara acara menghadirkan undangan digital
              yang tak hanya cantik, tapi juga fungsional — dengan fitur RSVP,
              amplop digital, musik latar, dan masih banyak lagi.
            </p>
            <div class="brand-values">
              <div class="bv-item" v-for="(v, i) in brandValues" :key="i">
                <div class="bv-icon" v-html="v.svg"></div>
                <div>
                  <p class="bv-title">{{ v.title }}</p>
                  <p class="bv-desc">{{ v.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== STATISTIK ===== -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item" v-for="(s, i) in stats" :key="i">
            <p class="stat-value">{{ s.value }}</p>
            <p class="stat-label">{{ s.label }}</p>
            <p class="stat-desc">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== PORTOFOLIO ===== -->
    <section class="portfolio-section">
      <div class="container">
        <div class="sec-header">
          <p class="sec-eyebrow">Hasil Karya</p>
          <h2 class="sec-title">
            Portofolio <span class="accent">Undangan Digital</span>
          </h2>
          <p class="sec-desc">
            Undangan nyata yang telah kami buat untuk klien di seluruh Indonesia
          </p>
        </div>

        <!-- Filter Kategori -->
        <div class="porto-filter-wrap">
          <div class="porto-filter-scroll">
            <button
              v-for="cat in portoCategories"
              :key="cat"
              class="porto-filter-btn"
              :class="{ active: activePortoCategory === cat }"
              @click="activePortoCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="portoLoading" class="porto-grid">
          <div class="porto-card skeleton-card" v-for="n in 8" :key="n">
            <div class="skeleton-img"></div>
            <div class="skeleton-info">
              <div class="skeleton-line short"></div>
              <div class="skeleton-line long"></div>
            </div>
          </div>
        </div>

        <!-- Grid Foto -->
        <div v-else-if="filteredPortfolio.length > 0" class="porto-grid">
          <div
            class="porto-card"
            v-for="(p, i) in filteredPortfolio"
            :key="p.id || i"
            @click="openLightbox(p)"
          >
            <div class="porto-img-wrap">
              <img
                :src="p.foto_url"
                :alt="p.nama_klien"
                class="porto-img"
                loading="lazy"
                @error="(e) => (e.target.src = '/images/porto-placeholder.jpg')"
              />
              <div class="porto-overlay">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <span class="porto-cat-badge">{{ p.kategori }}</span>
            </div>
            <div class="porto-info">
              <p class="porto-category">{{ p.kategori }}</p>
              <h3 class="porto-name">{{ p.nama_klien }}</h3>
              <p class="porto-date">{{ p.tanggal }}</p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="porto-empty">
          <svg
            width="52"
            height="52"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#cbd5e0"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p>Belum ada portofolio untuk kategori ini</p>
        </div>

        <!-- Load More -->
        <div
          class="porto-more"
          v-if="!portoLoading && filteredPortfolio.length > 0 && hasMore"
        >
          <button
            class="btn-lihat-semua"
            @click="loadMore"
            :disabled="loadingMore"
          >
            <span v-if="loadingMore">Memuat...</span>
            <template v-else>
              Lihat Lebih Banyak
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
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </template>
          </button>
        </div>
      </div>

      <!-- Lightbox -->
      <Transition name="lb-fade">
        <div
          v-if="lightboxItem"
          class="lb-overlay"
          @click.self="lightboxItem = null"
        >
          <div class="lb-panel">
            <button class="lb-close" @click="lightboxItem = null">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <img
              :src="lightboxItem.foto_url"
              :alt="lightboxItem.nama_klien"
              class="lb-img"
            />
            <div class="lb-info">
              <span class="lb-cat">{{ lightboxItem.kategori }}</span>
              <h3 class="lb-name">{{ lightboxItem.nama_klien }}</h3>
              <p class="lb-date">{{ lightboxItem.tanggal }}</p>
              <a
                v-if="lightboxItem.link_undangan"
                :href="lightboxItem.link_undangan"
                target="_blank"
                class="lb-btn"
              >
                Lihat Undangan
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
                  <path
                    d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                  />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </section>

    <!-- ===== TESTIMONI ===== -->
    <section class="testi-section">
      <div class="container">
        <div class="sec-header">
          <p class="sec-eyebrow">Kata Mereka</p>
          <h2 class="sec-title">
            Ribuan Pasangan<br /><span class="accent"
              >Sudah Mempercayai Kami</span
            >
          </h2>
        </div>

        <div class="testi-grid">
          <div
            class="testi-card"
            v-for="(t, i) in testimonials"
            :key="i"
            :class="{ 'testi-featured': t.featured }"
          >
            <div class="testi-stars">★★★★★</div>
            <p class="testi-text">"{{ t.text }}"</p>
            <div class="testi-footer">
              <div class="testi-ava" :style="{ background: t.avaColor }">
                {{ t.initial }}
              </div>
              <div>
                <p class="testi-name">{{ t.name }}</p>
                <p class="testi-sub">{{ t.sub }}</p>
              </div>
              <div class="testi-category-badge">{{ t.category }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TIM ===== -->
    <section class="team-section">
      <div class="container">
        <div class="sec-header">
          <p class="sec-eyebrow">Di Balik Layar</p>
          <h2 class="sec-title">
            Tim yang <span class="accent">Berdedikasi</span>
          </h2>
          <p class="sec-desc">
            Orang-orang yang bekerja keras setiap hari untuk membuat undanganmu
            sempurna
          </p>
        </div>
        <div class="team-grid">
          <div class="team-card" v-for="(m, i) in teamMembers" :key="i">
            <div class="team-avatar" :style="{ background: m.avatarBg }">
              <span class="team-initial">{{ m.initial }}</span>
            </div>
            <h3 class="team-name">{{ m.name }}</h3>
            <p class="team-role">{{ m.role }}</p>
            <p class="team-desc">{{ m.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA ===== -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-card">
          <div class="cta-blob cta-blob-1"></div>
          <div class="cta-blob cta-blob-2"></div>
          <div class="cta-content">
            <p class="cta-eyebrow">🎉 Bergabung Sekarang</p>
            <h2 class="cta-title">
              Siap Membuat Undangan<br />yang Tak Terlupakan?
            </h2>
            <p class="cta-desc">
              Bergabung dengan 12.000+ pasangan yang telah mempercayakan hari
              spesial mereka kepada PlayMoment. Gratis, mudah, dan langsung
              jadi.
            </p>
            <div class="cta-actions">
              <button class="btn-cta-primary" @click="handleDaftar">
                Coba Gratis Sekarang
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
              <a href="/tema" class="btn-cta-sec">Lihat Koleksi Tema</a>
            </div>
            <p class="cta-note">
              ✦ Gratis selamanya &nbsp;·&nbsp; Tanpa kartu kredit &nbsp;·&nbsp;
              Daftar 30 detik
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

const handleDaftar = () => alert("Menuju halaman daftar...");

// ===== PORTOFOLIO REALTIME =====
const portoCategories = [
  "Semua Kategori",
  "Wedding",
  "Kids & Birthday",
  "Aqiqah & Tasmiyah",
  "Tasyakuran Khitan",
  "Umum & Seminar",
  "Christmas & New Year",
  "Syukuran & Islami",
  "Party & Dinner",
  "School & Graduation",
];

const activePortoCategory = ref("Semua Kategori");
const portoLoading = ref(true);
const loadingMore = ref(false);
const hasMore = ref(false);
const portoList = ref([]);
const portoPage = ref(1);
const PORTO_LIMIT = 8;

const filteredPortfolio = computed(() => {
  if (activePortoCategory.value === "Semua Kategori") return portoList.value;
  return portoList.value.filter(
    (p) => p.kategori === activePortoCategory.value,
  );
});

// Fetch dari API / Supabase
// Ganti URL ini dengan endpoint database kamu
const fetchPortofolio = async (page = 1) => {
  try {
    // === CONTOH FETCH API ===
    // const res = await fetch(`/api/portofolio?page=${page}&limit=${PORTO_LIMIT}`);
    // const data = await res.json();
    // portoList.value = page === 1 ? data.items : [...portoList.value, ...data.items];
    // hasMore.value = data.hasMore;

    // === CONTOH SUPABASE ===
    // const { data, error } = await supabase
    //   .from("portofolio")
    //   .select("*")
    //   .order("created_at", { ascending: false })
    //   .range((page - 1) * PORTO_LIMIT, page * PORTO_LIMIT - 1);
    // if (!error) {
    //   portoList.value = page === 1 ? data : [...portoList.value, ...data];
    //   hasMore.value = data.length === PORTO_LIMIT;
    // }

    // PLACEHOLDER - hapus ini setelah connect database
    await new Promise((r) => setTimeout(r, 800));
    portoList.value = [];
    hasMore.value = false;
  } catch (err) {
    console.error("Gagal memuat portofolio:", err);
  } finally {
    portoLoading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = async () => {
  loadingMore.value = true;
  portoPage.value++;
  await fetchPortofolio(portoPage.value);
};

const lightboxItem = ref(null);
const openLightbox = (item) => {
  lightboxItem.value = item;
};

onMounted(() => {
  fetchPortofolio(1);
});

watch(activePortoCategory, () => {
  // filter di client side — data sudah di-fetch semua
  // kalau mau filter di server, uncomment baris berikut:
  // portoLoading.value = true; portoPage.value = 1; fetchPortofolio(1);
});

const brandValues = [
  {
    title: "Desain Berkualitas Tinggi",
    desc: "Setiap tema dirancang oleh desainer profesional dengan perhatian penuh pada detail.",
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  },
  {
    title: "Teknologi Terkini",
    desc: "Platform kami selalu diperbarui dengan fitur-fitur canggih yang mudah digunakan.",
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  },
  {
    title: "Dukungan Penuh",
    desc: "Tim support kami siap membantu 24/7 agar undanganmu selalu tampil sempurna.",
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  },
];

const stats = [
  {
    value: "12.000+",
    label: "Pengguna Aktif",
    desc: "Pasangan yang telah memakai layanan kami",
  },
  {
    value: "50+",
    label: "Pilihan Tema",
    desc: "Desain eksklusif dari desainer profesional",
  },
  {
    value: "98%",
    label: "Kepuasan Pelanggan",
    desc: "Rating rata-rata dari pengguna setia kami",
  },
  {
    value: "2 Tahun",
    label: "Pengalaman",
    desc: "Melayani dengan sepenuh hati sejak 2022",
  },
];

const testimonials = [
  {
    text: "PlayMoment bikin undangan nikahan kami jadi jauh lebih berkesan. Semua tamu kagum dengan tampilannya, dan fitur RSVP-nya benar-benar membantu kami menghitung tamu!",
    name: "Aulia & Farhan",
    sub: "Menikah Juni 2025",
    initial: "AF",
    category: "Wedding",
    avaColor: "linear-gradient(135deg, #7e57c2, #c9747b)",
    featured: true,
  },
  {
    text: "Prosesnya gampang banget, tinggal pilih tema, isi data, langsung jadi. Tampilannya elegan dan profesional. Rekomen banget!",
    name: "Dewi Kartika",
    sub: "Menikah Maret 2025",
    initial: "DK",
    category: "Wedding",
    avaColor: "linear-gradient(135deg, #7ecec4, #1a2e45)",
    featured: false,
  },
  {
    text: "RSVP online-nya sangat membantu buat ngitung jumlah tamu. Fitur amplop digitalnya juga kece! Tamu-tamu kami sangat terkesan.",
    name: "Bagas & Ninda",
    sub: "Menikah Agustus 2025",
    initial: "BN",
    category: "Wedding",
    avaColor: "linear-gradient(135deg, #e05c7a, #7e57c2)",
    featured: false,
  },
  {
    text: "Pakai PlayMoment untuk undangan khitanan anak kami. Hasilnya luar biasa, desainnya Islami dan elegan. Support team-nya juga responsif!",
    name: "Bapak Hendra",
    sub: "Khitanan Mei 2025",
    initial: "BH",
    category: "Khitanan",
    avaColor: "linear-gradient(135deg, #f0c040, #e64a19)",
    featured: false,
  },
  {
    text: "Kami gunakan untuk undangan seminar perusahaan. Fiturnya lengkap, link-nya mudah dibagikan, dan tampilannya sangat profesional.",
    name: "Ibu Ratna",
    sub: "Event Manager, April 2025",
    initial: "IR",
    category: "Seminar",
    avaColor: "linear-gradient(135deg, #4a90d9, #1a2e45)",
    featured: false,
  },
  {
    text: "Desainnya cantik banget! Banyak tamu nanya bikin di mana. Harganya juga terjangkau untuk kualitas sepremium ini.",
    name: "Sinta & Doni",
    sub: "Menikah Februari 2025",
    initial: "SD",
    category: "Wedding",
    avaColor: "linear-gradient(135deg, #48bb78, #276749)",
    featured: false,
  },
];

const teamMembers = [
  {
    name: "Arif Budiman",
    role: "Founder & CEO",
    desc: "Visioner di balik PlayMoment, dengan passion dalam teknologi dan desain.",
    initial: "AB",
    avatarBg: "linear-gradient(135deg, #1a2e45, #7ecec4)",
  },
  {
    name: "Sari Dewi",
    role: "Lead Designer",
    desc: "Menciptakan tema-tema indah yang membuat setiap undangan menjadi karya seni.",
    initial: "SD",
    avatarBg: "linear-gradient(135deg, #e05c7a, #c9747b)",
  },
  {
    name: "Budi Santoso",
    role: "Head of Engineering",
    desc: "Memastikan platform selalu cepat, stabil, dan penuh fitur inovatif.",
    initial: "BS",
    avatarBg: "linear-gradient(135deg, #7e57c2, #4a90d9)",
  },
  {
    name: "Maya Putri",
    role: "Customer Success",
    desc: "Memastikan setiap pengguna mendapatkan pengalaman terbaik di PlayMoment.",
    initial: "MP",
    avatarBg: "linear-gradient(135deg, #f0c040, #e64a19)",
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.accent {
  color: #7ecec4;
}

.sec-eyebrow {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #7ecec4;
  margin-bottom: 8px;
}

.sec-title {
  font-size: clamp(22px, 5vw, 32px);
  font-weight: 900;
  color: #1a2e45;
  line-height: 1.25;
  margin-bottom: 12px;
}

.sec-desc {
  font-size: 15px;
  color: #718096;
  line-height: 1.7;
  max-width: 520px;
  margin: 0 auto;
}

.sec-header {
  text-align: center;
  margin-bottom: 40px;
}

/* ===== HERO ===== */
.hero {
  background: linear-gradient(160deg, #1a2e45 0%, #243d5c 60%, #2d5272 100%);
  padding: 72px 20px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-bg-deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
}

.deco-c1 {
  width: 320px;
  height: 320px;
  top: -100px;
  right: -80px;
  background: radial-gradient(
    circle,
    rgba(126, 206, 196, 0.15) 0%,
    transparent 70%
  );
}

.deco-c2 {
  width: 240px;
  height: 240px;
  bottom: -80px;
  left: -60px;
  background: radial-gradient(
    circle,
    rgba(126, 206, 196, 0.1) 0%,
    transparent 70%
  );
}

.hero-inner {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  background: rgba(126, 206, 196, 0.15);
  color: #7ecec4;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 50px;
  margin-bottom: 24px;
  border: 1px solid rgba(126, 206, 196, 0.3);
}

.hero-title {
  font-size: clamp(40px, 6vw, 40px);
  font-weight: 900;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}

.hero-desc {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.8;
  margin-bottom: 36px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.hero-scroll-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  font-weight: 500;
}

/* ===== BRAND SECTION ===== */
.brand-section {
  padding: 72px 0;
  background: #fff;
}

.brand-grid {
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: center;
}

.brand-visual {
  position: relative;
  width: 100%;
  max-width: 320px;
  flex-shrink: 0;
}

.brand-card-stack {
  position: relative;
  height: 260px;
  width: 100%;
}

.brand-card {
  position: absolute;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 16px 14px 14px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bc-back {
  width: 62%;
  height: 200px;
  left: 0;
  top: 30px;
  transform: rotate(-5deg);
  opacity: 0.7;
  z-index: 1;
}

.bc-mid {
  width: 62%;
  height: 210px;
  right: 0;
  top: 20px;
  transform: rotate(4deg);
  opacity: 0.75;
  z-index: 2;
}

.bc-front {
  width: 66%;
  height: 230px;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  z-index: 3;
}

.bc-header {
  height: 8px;
  background: rgba(0, 0, 0, 0.07);
  border-radius: 4px;
}

.bc-img {
  height: 100px;
  border-radius: 12px;
  flex-shrink: 0;
}

.bc-lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bc-line {
  height: 6px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 3px;
}

.bc-line.w80 {
  width: 80%;
}
.bc-line.w70 {
  width: 70%;
}
.bc-line.w60 {
  width: 60%;
}
.bc-line.w55 {
  width: 55%;
}
.bc-line.w50 {
  width: 50%;
}
.bc-line.w45 {
  width: 45%;
}

.bc-btn {
  height: 14px;
  background: #7ecec4;
  border-radius: 7px;
  margin-top: auto;
}

.brand-float-badge {
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 2px solid #7ecec4;
  border-radius: 50px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #1a2e45;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(126, 206, 196, 0.3);
}

.brand-content {
  width: 100%;
}

.brand-text {
  font-size: 15px;
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 16px;
}

.brand-values {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 28px;
}

.bv-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.bv-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #e8f7f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bv-title {
  font-size: 14px;
  font-weight: 800;
  color: #1a2e45;
  margin-bottom: 3px;
}

.bv-desc {
  font-size: 13px;
  color: #718096;
  line-height: 1.6;
}

/* ===== STATS ===== */
.stats-section {
  padding: 48px 0;
  background: #1a2e45;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px 16px;
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 900;
  color: #7ecec4;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.stat-desc {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
}

/* ===== PORTFOLIO ===== */
.portfolio-section {
  padding: 72px 0;
  background: #f8fafc;
}

/* Filter */
.porto-filter-wrap {
  margin-bottom: 28px;
  position: relative;
}

.porto-filter-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: none;
}
.porto-filter-scroll::-webkit-scrollbar {
  display: none;
}

.porto-filter-btn {
  flex-shrink: 0;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  color: #4a5568;
  border-radius: 50px;
  padding: 7px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.porto-filter-btn:hover {
  border-color: #7ecec4;
  color: #1a2e45;
}
.porto-filter-btn.active {
  background: #1a2e45;
  border-color: #1a2e45;
  color: #fff;
}

/* Grid */
.porto-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* Card */
.porto-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition:
    transform 0.25s,
    box-shadow 0.25s;
}
.porto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

/* Image */
.porto-img-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  background: #edf2f7;
}
.porto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.porto-card:hover .porto-img {
  transform: scale(1.06);
}

/* Hover overlay */
.porto-overlay {
  position: absolute;
  inset: 0;
  background: rgba(26, 46, 69, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s;
}
.porto-card:hover .porto-overlay {
  opacity: 1;
}

/* Category badge on image */
.porto-cat-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.92);
  color: #1a2e45;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 50px;
  backdrop-filter: blur(4px);
}

/* Info */
.porto-info {
  padding: 12px 14px 14px;
}
.porto-category {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #7ecec4;
  margin-bottom: 3px;
}
.porto-name {
  font-size: 14px;
  font-weight: 800;
  color: #1a2e45;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.porto-date {
  font-size: 11px;
  color: #9ca3af;
}

/* Skeleton */
.skeleton-card {
  cursor: default;
  pointer-events: none;
}
.skeleton-img {
  aspect-ratio: 3 / 4;
  background: linear-gradient(90deg, #edf2f7 25%, #e2e8f0 50%, #edf2f7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.skeleton-info {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.skeleton-line {
  height: 10px;
  border-radius: 5px;
  background: linear-gradient(90deg, #edf2f7 25%, #e2e8f0 50%, #edf2f7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.skeleton-line.short {
  width: 40%;
}
.skeleton-line.long {
  width: 70%;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Empty state */
.porto-empty {
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #9ca3af;
  font-size: 15px;
}

/* Load More */
.porto-more {
  text-align: center;
  margin-top: 36px;
}
.btn-lihat-semua {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 2px solid #1a2e45;
  color: #1a2e45;
  border-radius: 50px;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.btn-lihat-semua:hover {
  background: #1a2e45;
  color: #fff;
}
.btn-lihat-semua:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Lightbox */
.lb-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.lb-panel {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  width: 100%;
  max-width: 420px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
}
.lb-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}
.lb-close:hover {
  background: #fff;
}
.lb-img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
  max-height: 55vh;
}
.lb-info {
  padding: 20px;
  flex-shrink: 0;
}
.lb-cat {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #7ecec4;
  display: block;
  margin-bottom: 4px;
}
.lb-name {
  font-size: 18px;
  font-weight: 900;
  color: #1a2e45;
  margin-bottom: 4px;
}
.lb-date {
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 16px;
}
.lb-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1a2e45;
  color: #fff;
  text-decoration: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  transition: background 0.2s;
}
.lb-btn:hover {
  background: #243d5c;
}

/* Lightbox transition */
.lb-fade-enter-active,
.lb-fade-leave-active {
  transition: opacity 0.2s ease;
}
.lb-fade-enter-from,
.lb-fade-leave-to {
  opacity: 0;
}

/* ===== TESTIMONI ===== */
.testi-section {
  padding: 72px 0;
  background: #fff;
}

.testi-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.testi-card {
  background: #f8fafc;
  border-radius: 18px;
  padding: 22px;
  border: 1px solid #edf2f7;
  transition: box-shadow 0.2s;
}

.testi-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07);
}

.testi-featured {
  background: linear-gradient(135deg, #1a2e45, #243d5c);
  border-color: transparent;
}

.testi-featured .testi-text {
  color: rgba(255, 255, 255, 0.85);
}

.testi-featured .testi-name {
  color: #fff;
}

.testi-featured .testi-sub {
  color: rgba(255, 255, 255, 0.5);
}

.testi-featured .testi-stars {
  color: #f6ad55;
}

.testi-stars {
  color: #f6ad55;
  font-size: 13px;
  margin-bottom: 10px;
}

.testi-text {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.75;
  margin-bottom: 16px;
  font-style: italic;
}

.testi-footer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.testi-ava {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  flex-shrink: 0;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.testi-name {
  font-size: 13px;
  font-weight: 700;
  color: #1a2e45;
}

.testi-sub {
  font-size: 11px;
  color: #9ca3af;
}

.testi-category-badge {
  margin-left: auto;
  font-size: 10px;
  font-weight: 700;
  color: #7ecec4;
  background: rgba(126, 206, 196, 0.12);
  border: 1px solid rgba(126, 206, 196, 0.3);
  border-radius: 50px;
  padding: 3px 10px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ===== TEAM ===== */
.team-section {
  padding: 72px 0;
  background: #f8fafc;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.team-card {
  background: #fff;
  border-radius: 20px;
  padding: 24px 18px;
  text-align: center;
  border: 1px solid #edf2f7;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.team-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
}

.team-avatar {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  margin: 0 auto 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-initial {
  color: #fff;
  font-size: 20px;
  font-weight: 900;
}

.team-name {
  font-size: 15px;
  font-weight: 800;
  color: #1a2e45;
  margin-bottom: 4px;
}

.team-role {
  font-size: 12px;
  font-weight: 600;
  color: #7ecec4;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.team-desc {
  font-size: 12px;
  color: #718096;
  line-height: 1.6;
}

/* ===== CTA ===== */
.cta-section {
  padding: 60px 0;
  background: #fff;
}

.cta-card {
  background: linear-gradient(135deg, #1a2e45 0%, #243d5c 100%);
  border-radius: 24px;
  padding: 52px 24px;
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
  width: 300px;
  height: 300px;
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

.cta-eyebrow {
  font-size: 14px;
  font-weight: 600;
  color: #7ecec4;
  margin-bottom: 14px;
}

.cta-title {
  font-size: clamp(22px, 5vw, 34px);
  font-weight: 900;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 14px;
}

.cta-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.68);
  margin-bottom: 32px;
  line-height: 1.7;
  max-width: 440px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;
}

.btn-cta-primary {
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

.btn-cta-primary:hover {
  background: #6abfb4;
  transform: translateY(-2px);
}

.btn-cta-sec {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
  transition: color 0.2s;
  text-decoration: none;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 50px;
  padding: 12px 24px;
  white-space: nowrap;
}

.btn-cta-sec:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.6);
}

.cta-note {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}
/* ===== RESPONSIVE ===== */
@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .porto-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .testi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .team-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .cta-actions {
    flex-direction: row;
    justify-content: center;
  }
}

@media (min-width: 768px) {
  .brand-grid {
    flex-direction: row;
    gap: 64px;
    align-items: center;
  }
  .brand-visual {
    max-width: 360px;
  }
  .testi-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .page {
    padding-bottom: 0;
  }
  .cta-card {
    padding: 72px 64px;
  }
  .porto-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
