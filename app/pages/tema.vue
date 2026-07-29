<template>
  <div class="page">
    <!-- ===== HERO BANNER ===== -->
    <section class="hero-banner">
      <div class="hero-banner-inner">
        <p class="banner-eyebrow">Koleksi Tema</p>
        <h1 class="banner-title">
          Tema Undangan Digital<br />yang Bisa di
          <span class="banner-accent">Custom</span>
        </h1>
        <p class="banner-desc">
          Pilih dari koleksi template menakjubkan yang dapat diedit sesuka hati.
          Dengan desain undangan digital ini, tamu undangan tidak akan ragu
          untuk menghadiri acara Kamu!
        </p>
      </div>
    </section>

    <!-- ===== STICKY SEARCH BAR ===== -->
    <!-- Ikut flow normal, fixed ke bawah navbar setelah hero di-scroll -->
    <div class="sticky-search-bar">
      <div class="search-bar-inner">
        <button class="filter-btn" @click="openFilter">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          <span class="filter-btn-label">Filter</span>
          <span v-if="activeFiltersCount > 0" class="filter-badge">{{
            activeFiltersCount
          }}</span>
        </button>
        <div class="search-divider"></div>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Cari tema..."
          class="search-input"
        />
        <button class="search-btn">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ===== THEME LIST ===== -->
    <section class="theme-list-section">
      <div class="container">
        <!-- Active Filters Pills -->
        <div class="active-filters" v-if="activeFiltersCount > 0">
          <span class="active-filter-pill" v-if="activeStyle !== 'Semua Style'">
            {{ activeStyle }}
            <button @click="activeStyle = 'Semua Style'">×</button>
          </span>
          <span class="active-filter-pill" v-if="activeColor !== 'Semua Warna'">
            {{ activeColor }}
            <button @click="activeColor = 'Semua Warna'">×</button>
          </span>
          <button class="clear-all-filters" @click="resetFilters">
            Hapus Semua
          </button>
        </div>

        <!-- List Header -->
        <div class="list-header">
          <h2 class="list-title">Semua Tema</h2>
          <span class="list-count">{{ filteredThemes.length }}+ Tema</span>
        </div>

        <!-- Grid -->
        <div class="theme-grid" v-if="filteredThemes.length > 0">
          <div
            v-for="(t, i) in filteredThemes"
            :key="i"
            class="theme-card"
            :ref="(el) => setCardRef(el, i)"
          >
            <!-- Wishlist button -->
            <button
              class="wishlist-btn"
              @click="toggleWishlist(i)"
              :class="{ wishlisted: t.wishlisted }"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                :fill="t.wishlisted ? '#e05c7a' : 'none'"
                stroke="#e05c7a"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
            </button>

            <!-- Preview — deck 3 foto seperti di home -->
            <div
              class="theme-preview"
              :style="{ background: t.cardBg || '#f9f9f9' }"
            >
              <div
                class="preview-deck"
                :class="{ 'preview-deck-open': visibleCards.has(i) }"
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

            <!-- Theme Info -->
            <div class="theme-info">
              <h3 class="theme-name">{{ t.name }}</h3>
              <div class="theme-price">
                <span class="price-now">Rp. {{ t.price }}</span>
                <span class="price-was" v-if="t.oldPrice"
                  >Rp. {{ t.oldPrice }}</span
                >
              </div>
              <div class="theme-actions">
                <button class="btn-preview-card" @click="handlePreview(t)">
                  Preview
                </button>
                <button class="btn-pilih" @click="handleGunakan(t)">
                  Pilih
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p>Tema tidak ditemukan</p>
          <span>Coba ubah kata kunci atau filter yang digunakan</span>
          <button class="btn-reset" @click="resetAll">Reset Pencarian</button>
        </div>

        <!-- Load More -->
        <div class="load-more" v-if="filteredThemes.length > 0">
          <button class="btn-load-more">
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
          </button>
        </div>
      </div>
    </section>

    <!-- ===== FILTER MODAL POPUP ===== -->
    <Transition name="modal-fade">
      <div v-if="showFilter" class="modal-overlay" @click.self="closeFilter">
        <div class="modal-panel">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="modal-title-wrap">
              <h3 class="modal-title">Filter Tema</h3>
              <span class="beta-badge">BETA</span>
            </div>
            <button class="modal-close" @click="closeFilter">
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
          </div>

          <!-- Modal Body (scrollable) -->
          <div class="modal-body">
            <!-- Style -->
            <div class="filter-section">
              <div class="filter-section-label">
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
                  <circle cx="12" cy="12" r="3" />
                  <path
                    d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
                  />
                </svg>
                Style
              </div>
              <div class="filter-tags">
                <button
                  v-for="style in styles"
                  :key="style"
                  class="tag"
                  :class="{ 'tag-active': tempStyle === style }"
                  @click="tempStyle = style"
                >
                  {{ style }}
                </button>
              </div>
            </div>

            <!-- Warna -->
            <div class="filter-section">
              <div class="filter-section-label">
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
                  <circle cx="13.5" cy="6.5" r="0.5" />
                  <circle cx="17.5" cy="10.5" r="0.5" />
                  <circle cx="8.5" cy="7.5" r="0.5" />
                  <circle cx="6.5" cy="12.5" r="0.5" />
                  <path
                    d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
                  />
                </svg>
                Warna
              </div>
              <div class="filter-tags">
                <button
                  v-for="color in colors"
                  :key="color"
                  class="tag"
                  :class="{ 'tag-active': tempColor === color }"
                  @click="tempColor = color"
                >
                  {{ color }}
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button class="btn-reset-filter" @click="resetTempFilters">
              Reset Filter
            </button>
            <button class="btn-apply-filter" @click="applyFilter">
              Terapkan Filter
              <span v-if="tempFiltersCount > 0" class="apply-count"
                >({{ tempFiltersCount }})</span
              >
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===== CUSTOM TEMA CTA ===== -->
    <section class="custom-cta-section">
      <div class="container">
        <div class="custom-cta-card">
          <div class="custom-cta-deco deco-1"></div>
          <div class="custom-cta-deco deco-2"></div>
          <div class="custom-cta-content">
            <p class="custom-cta-eyebrow">🎨 Desain Eksklusif</p>
            <h2 class="custom-cta-title">
              Tidak Menemukan Tema<br />yang Cocok?
            </h2>
            <p class="custom-cta-desc">
              Tim desainer kami siap membuatkan tema undangan eksklusif sesuai
              keinginan kamu — warna, gaya, hingga detail terkecil sesuai
              permintaan.
            </p>
            <div class="custom-cta-features">
              <div class="cta-feat">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7ecec4"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Desain 100% unik & eksklusif</span>
              </div>
              <div class="cta-feat">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7ecec4"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Revisi hingga puas</span>
              </div>
              <div class="cta-feat">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7ecec4"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Proses cepat 1–3 hari kerja</span>
              </div>
              <div class="cta-feat">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7ecec4"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Harga terjangkau & transparan</span>
              </div>
            </div>
            <div class="custom-cta-actions">
              <a
                href="https://wa.me/628123456789?text=Halo,%20saya%20ingin%20custom%20tema%20undangan"
                target="_blank"
                class="btn-hubungi"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  />
                </svg>
                Hubungi Sekarang
              </a>
              <a href="/paket" class="btn-lihat-paket">Lihat Paket Custom</a>
            </div>
          </div>
          <div class="custom-cta-illustration">
            <div class="illus-phones">
              <div class="illus-phone illus-phone-1">
                <div class="illus-screen">
                  <div class="illus-bar"></div>
                  <div
                    class="illus-img"
                    style="
                      background: linear-gradient(135deg, #7ecec4, #3d9e91);
                    "
                  ></div>
                  <div class="illus-lines">
                    <div class="illus-line w80"></div>
                    <div class="illus-line w55"></div>
                    <div class="illus-line w65"></div>
                  </div>
                  <div class="illus-btn-mock" style="background: #7ecec4"></div>
                </div>
              </div>
              <div class="illus-phone illus-phone-2">
                <div class="illus-screen">
                  <div class="illus-bar"></div>
                  <div
                    class="illus-img"
                    style="
                      background: linear-gradient(135deg, #f0c040, #e64a19);
                    "
                  ></div>
                  <div class="illus-lines">
                    <div class="illus-line w70"></div>
                    <div class="illus-line w45"></div>
                  </div>
                  <div class="illus-btn-mock" style="background: #e64a19"></div>
                </div>
              </div>
              <div class="illus-phone illus-phone-3">
                <div class="illus-screen">
                  <div class="illus-bar"></div>
                  <div
                    class="illus-img"
                    style="
                      background: linear-gradient(135deg, #c9747b, #7e57c2);
                    "
                  ></div>
                  <div class="illus-lines">
                    <div class="illus-line w75"></div>
                    <div class="illus-line w50"></div>
                    <div class="illus-line w60"></div>
                  </div>
                  <div class="illus-btn-mock" style="background: #7e57c2"></div>
                </div>
              </div>
            </div>
            <div class="illus-label">✨ Tema Custom Eksklusif</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
} from "vue";
import { getAllThemes } from "~/config/themes";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";

// ===== STATE =====
const showFilter = ref(false);
const searchQuery = ref("");
const navbarHeight = ref(64);

// ===== PER-CARD SCROLL VISIBILITY =====
const visibleCards = reactive(new Set());
const cardRefs = ref([]);
let cardObserver = null;

const setCardRef = (el, i) => {
  if (el) cardRefs.value[i] = el;
};

// ===== STICKY SEARCH =====

onMounted(() => {
  // Deteksi tinggi navbar
  const navbar = document.querySelector(".navbar-desktop");
  navbarHeight.value = navbar ? navbar.offsetHeight : 64;
  document.documentElement.style.setProperty("--navbar-h-mobile", "59.5px");
  document.documentElement.style.setProperty("--navbar-h-desktop", "64px");

  // Per-card observer — animasi deck muncul saat card scroll masuk viewport
  cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const idx = Number(entry.target.dataset.cardIndex);
        if (entry.isIntersecting) {
          visibleCards.add(idx);
        } else {
          visibleCards.delete(idx);
        }
      });
    },
    { threshold: 0.2 },
  );

  // Observe semua card yang sudah ada di DOM
  setTimeout(() => {
    cardRefs.value.forEach((el, i) => {
      if (el) {
        el.dataset.cardIndex = i;
        cardObserver.observe(el);
      }
    });
  }, 100);
});

onUnmounted(() => {
  cardObserver?.disconnect();
});

// ===== REFRESH CARD OBSERVER saat filter/search berubah =====
const refreshCardObserver = () => {
  if (!cardObserver) return;
  // Disconnect semua, bersihkan visibleCards dan refs
  cardObserver.disconnect();
  visibleCards.clear();
  cardRefs.value = [];

  nextTick(() => {
    setTimeout(() => {
      cardRefs.value.forEach((el, i) => {
        if (el) {
          el.dataset.cardIndex = i;
          cardObserver.observe(el);
        }
      });
    }, 50);
  });
};

// ===== FILTER =====
const activeStyle = ref("Semua Style");
const activeColor = ref("Semua Warna");

const tempStyle = ref("Semua Style");
const tempColor = ref("Semua Warna");

// ===== THEMES — langsung dari themeConfig =====
const themes = reactive(
  getAllThemes().map((t) => ({
    slug: t.slug,
    name: t.name,
    price: t.price,
    oldPrice: t.oldPrice,
    cardBg: t.cardBg,
    thumbnails: t.thumbnails,
    wishlisted: false,
  })),
);

// ===== FILTERED THEMES =====
const filteredThemes = computed(() => {
  return themes.filter((t) => {
    const name = (t.name || "").toLowerCase();
    const matchSearch = name.includes(searchQuery.value.toLowerCase());
    const matchStyle =
      activeStyle.value === "Semua Style" ||
      (t.style || "") === activeStyle.value;
    const matchColor =
      activeColor.value === "Semua Warna" ||
      (t.color || "") === activeColor.value;
    return matchSearch && matchStyle && matchColor;
  });
});

// Watch filteredThemes — refresh observer setiap filter/search berubah
watch(filteredThemes, () => {
  refreshCardObserver();
});

// ===== ACTIONS =====
const toggleWishlist = (i) => {
  const item = filteredThemes.value[i];
  const real = themes.findIndex((t) => t === item);
  if (real !== -1) themes[real].wishlisted = !themes[real].wishlisted;
};

const router = useRouter();
const { requireCustomerForSelect, isLoggedIn } = useAuth();

// Preview → buka di tab baru (tanpa login)
const handlePreview = (t) => {
  window.open(`/preview-tema/${t.slug}`, "_blank");
};

// Gunakan tema → cek login dulu, kalau sudah login langsung lanjut
const handleGunakan = (t) => {
  // Sudah login → langsung ke atur-undangan tanpa perlu login lagi
  if (isLoggedIn.value) {
    router.push({
      path: "/atur-undangan",
      query: { tema: t.slug }
    });
    return;
  }

  // Belum login → arahkan ke login, setelah login balik ke atur-undangan
  requireCustomerForSelect({
    path: "/atur-undangan",
    query: { tema: t.slug }
  });
};

// ===== FILTER MODAL =====
const openFilter = () => {
  // Sync temp dengan active sebelum buka modal
  tempStyle.value = activeStyle.value;
  tempColor.value = activeColor.value;
  showFilter.value = true;
  document.body.style.overflow = "hidden";
};

const closeFilter = () => {
  showFilter.value = false;
  document.body.style.overflow = "";
};

const applyFilter = () => {
  activeStyle.value = tempStyle.value;
  activeColor.value = tempColor.value;
  closeFilter();
};

const resetTempFilters = () => {
  tempStyle.value = "Semua Style";
  tempColor.value = "Semua Warna";
};

const resetFilters = () => {
  activeStyle.value = "Semua Style";
  activeColor.value = "Semua Warna";
};

const resetAll = () => {
  searchQuery.value = "";
  resetFilters();
};

// ===== FILTER OPTIONS =====
const styles = [
  "Semua Style",
  "Modern",
  "Rustic",
  "Minimalis",
  "Elegan",
  "Boho",
  "Floral",
];
const colors = [
  "Semua Warna",
  "Hijau",
  "Merah Muda",
  "Biru",
  "Krem",
  "Putih",
  "Ungu",
  "Emas",
];

// ===== COMPUTED FILTER COUNTS =====
const activeFiltersCount = computed(() => {
  let count = 0;
  if (activeStyle.value !== "Semua Style") count++;
  if (activeColor.value !== "Semua Warna") count++;
  return count;
});

const tempFiltersCount = computed(() => {
  let count = 0;
  if (tempStyle.value !== "Semua Style") count++;
  if (tempColor.value !== "Semua Warna") count++;
  return count;
});

const handleDaftar = () => alert("Daftar & Coba Gratis!");
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
  background: #f5f7f9;
  color: #1a2e45;
  min-height: 100vh;
  padding-bottom: 72px;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* ===========================
   HERO BANNER — same dark style as fitur/paket
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
  max-width: 720px;
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
  font-size: clamp(30px, 7vw, 52px);
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
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
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
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s;
}
.btn-outline-hero:hover {
  border-color: rgba(255, 255, 255, 0.6);
  color: #fff;
}

@media (min-width: 480px) {
  .banner-actions {
    flex-direction: row;
    justify-content: center;
  }
}

/* ===========================
   STICKY SEARCH BAR
=========================== */

/*
  .search-section-wrap  — wrapper di normal flow, tinggi tetap = tinggi bar.
                          Mencegah konten di bawah loncat saat bar jadi fixed.
  .sticky-search-bar    — elemen visual. Saat is-stuck → position: fixed.
*/
/* ===========================
   STICKY SEARCH BAR
   Selalu sticky di bawah navbar — seperti satumomen.com
=========================== */
.sticky-search-bar {
  position: sticky;
  top: var(--navbar-h-mobile, 59.5px);
  z-index: 99;
  background: #fff;
  border-bottom: 1px solid #edf0f4;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

@media (min-width: 768px) {
  .sticky-search-bar {
    top: var(--navbar-h-desktop, 64px);
  }
}

/* Inner search bar — kotak dengan rounded sudut sedikit */
.search-bar-inner {
  display: flex;
  align-items: center;
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
  background: #fff;
  border: 1.5px solid #d1d8e0;
  border-radius: 10px;
  overflow: hidden;
  height: 44px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.search-bar-inner:focus-within {
  border-color: #7ecec4;
  box-shadow: 0 0 0 3px rgba(126, 206, 196, 0.15);
}

/* Filter button */
.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0 14px;
  font-size: 13.5px;
  font-weight: 600;
  color: #4a5568;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  height: 100%;
  transition: color 0.15s;
}
.filter-btn:hover {
  color: #1a2e45;
}

.filter-btn-label {
  display: none;
}
@media (min-width: 380px) {
  .filter-btn-label {
    display: inline;
  }
}

.filter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #7ecec4;
  color: #fff;
  border-radius: 9px;
  font-size: 10px;
  font-weight: 800;
  line-height: 1;
}

/* Divider */
.search-divider {
  width: 1px;
  height: 22px;
  background: #d1d8e0;
  flex-shrink: 0;
}

/* Input */
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0 12px;
  font-size: 14px;
  color: #1a2e45;
  min-width: 0;
  height: 100%;
}
.search-input::placeholder {
  color: #a0aec0;
}
.search-input::-webkit-search-decoration,
.search-input::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

/* Search button — teal, ujung kanan */
.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #7ecec4;
  border: none;
  width: 50px;
  height: 100%;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 0 8px 8px 0;
  transition: background 0.15s;
}
.search-btn:hover {
  background: #6abfb4;
}

/* ===========================
   ACTIVE FILTERS PILLS
=========================== */
.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
}

.active-filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(126, 206, 196, 0.12);
  color: #1a2e45;
  border: 1.5px solid #7ecec4;
  border-radius: 50px;
  padding: 5px 12px;
  font-size: 13px;
  font-weight: 600;
}
.active-filter-pill button {
  background: none;
  border: none;
  cursor: pointer;
  color: #7ecec4;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  font-weight: 700;
  transition: color 0.2s;
}
.active-filter-pill button:hover {
  color: #e05c7a;
}

.clear-all-filters {
  background: none;
  border: none;
  color: #e05c7a;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

/* ===========================
   THEME LIST
=========================== */
.theme-list-section {
  padding: 20px 0 48px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.list-title {
  font-size: 20px;
  font-weight: 800;
  color: #1a2e45;
}

.list-count {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 600;
  background: #f0f4f8;
  padding: 4px 12px;
  border-radius: 50px;
}

/* Grid — sama persis dengan index */
.theme-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 32px;
  padding: 0 15px;
}

@media (min-width: 640px) {
  .theme-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 0;
  }
}

@media (min-width: 1024px) {
  .theme-grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 40px;
    gap: 24px;
    padding: 0;
  }
}

/* Card */
.theme-card {
  background: #fff;
  border: 1.5px solid #7ecec4;
  border-radius: 20px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  position: relative;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}
.theme-card:hover {
  box-shadow: 0 16px 40px rgba(26, 46, 69, 0.13);
  transform: translateY(-4px);
}

/* Wishlist */
.wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition:
    transform 0.2s,
    background 0.2s;
}
.wishlist-btn:hover {
  transform: scale(1.15);
}
.wishlist-btn.wishlisted {
  background: #fff0f3;
}

/* ===== PREVIEW AREA — persis index ===== */
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

/* ===== THEME INFO — persis index ===== */
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

.btn-preview-card {
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
.btn-preview-card:hover {
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

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.empty-state p {
  font-size: 18px;
  font-weight: 700;
  color: #4a5568;
}
.empty-state span {
  font-size: 14px;
}
.btn-reset {
  background: #1a2e45;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 10px 28px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}
.btn-reset:hover {
  background: #263d58;
}

/* Load More */
.load-more {
  text-align: center;
  margin-top: 36px;
}
.btn-load-more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 2px solid #1a2e45;
  color: #1a2e45;
  border-radius: 50px;
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.btn-load-more:hover {
  background: #1a2e45;
  color: #fff;
}

/* ===========================
   FILTER MODAL
=========================== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-active .modal-panel,
.modal-fade-leave-active .modal-panel {
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-panel,
.modal-fade-leave-to .modal-panel {
  transform: scale(0.94);
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  /* Di bawah topbar (100), hamburger menu (200), bottom-nav (180), navbar desktop (1000) */
  z-index: 99;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
}

@media (min-width: 768px) {
  .modal-overlay {
    padding: 24px 32px;
    z-index: 99;
  }
}

.modal-panel {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.2);
}

@media (min-width: 768px) {
  .modal-panel {
    margin-top: 50px;
    border-radius: 24px;
    max-height: calc(100vh - var(--navbar-h-desktop, 64px) - 48px);
  }
}

@media (min-width: 1024px) {
  .modal-panel {
    max-width: 640px;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f0f4f8;
  flex-shrink: 0;
}

.modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-title {
  font-size: 18px;
  font-weight: 800;
  color: #1a2e45;
}

.beta-badge {
  background: #7ecec4;
  color: #1a2e45;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 3px 8px;
  border-radius: 6px;
}

.modal-close {
  background: #f0f4f8;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4a5568;
  transition:
    background 0.2s,
    color 0.2s;
}
.modal-close:hover {
  background: #e2e8f0;
  color: #1a2e45;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
  -webkit-overflow-scrolling: touch;
}
.modal-body::-webkit-scrollbar {
  width: 4px;
}
.modal-body::-webkit-scrollbar-track {
  background: transparent;
}
.modal-body::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}

.filter-section {
  padding: 18px 0;
  border-bottom: 1px solid #f0f4f8;
}
.filter-section:last-child {
  border-bottom: none;
}

.filter-section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.filter-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #f1f5f9;
  border: 1.5px solid #e2e8f0;
  color: #4a5568;
  border-radius: 50px;
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
}
.tag:hover {
  border-color: #7ecec4;
  color: #1a2e45;
}
.tag-active {
  background: #1a2e45;
  border-color: #1a2e45;
  color: #fff;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px 20px;
  border-top: 1px solid #f0f4f8;
  flex-shrink: 0;
}

.btn-reset-filter {
  flex: 1;
  background: #f1f5f9;
  border: none;
  color: #4a5568;
  border-radius: 12px;
  padding: 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-reset-filter:hover {
  background: #e2e8f0;
}

.btn-apply-filter {
  flex: 2;
  background: #7ecec4;
  border: none;
  color: #1a2e45;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition:
    background 0.2s,
    transform 0.2s;
}
.btn-apply-filter:hover {
  background: #6abfb4;
  transform: translateY(-1px);
}

.apply-count {
  font-size: 13px;
  font-weight: 600;
}
/* ===========================
   RESPONSIVE — 480px+
=========================== */
@media (min-width: 480px) {
  .theme-name {
    font-size: 15px;
  }
  .btn-preview,
  .btn-gunakan {
    font-size: 13px;
  }
}

/* ===========================
   RESPONSIVE — DESKTOP 1024px+
=========================== */
@media (min-width: 1024px) {
  .page {
    padding-bottom: 0;
  }

  .hero-banner {
    padding: 50px 20px 20px;
  }

  .theme-list-section {
    padding: 28px 0 64px;
  }

  .sticky-search-wrap {
    top: 68px;
    padding: 14px 24px;
  }

  .list-title {
    font-size: 22px;
  }
}

/* ===========================
   CUSTOM TEMA CTA SECTION
=========================== */
.custom-cta-section {
  padding: 40px 0 48px;
  background: #f5f7f9;
}

.custom-cta-card {
  background: linear-gradient(135deg, #1a2e45 0%, #243d5c 60%, #2d5272 100%);
  border-radius: 28px;
  padding: 40px 28px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.custom-cta-deco {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.deco-1 {
  width: 280px;
  height: 280px;
  top: -80px;
  right: -60px;
  background: radial-gradient(
    circle,
    rgba(126, 206, 196, 0.12) 0%,
    transparent 70%
  );
}
.deco-2 {
  width: 200px;
  height: 200px;
  bottom: -60px;
  left: -40px;
  background: radial-gradient(
    circle,
    rgba(126, 206, 196, 0.08) 0%,
    transparent 70%
  );
}

.custom-cta-content {
  position: relative;
  z-index: 1;
}

.custom-cta-eyebrow {
  font-size: 13px;
  font-weight: 700;
  color: #7ecec4;
  margin-bottom: 14px;
  letter-spacing: 0.5px;
}

.custom-cta-title {
  font-size: clamp(24px, 5vw, 36px);
  font-weight: 900;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 14px;
  letter-spacing: -0.5px;
}

.custom-cta-desc {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.7;
  margin-bottom: 24px;
  max-width: 480px;
}

.custom-cta-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 20px;
  margin-bottom: 28px;
}

.cta-feat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.custom-cta-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-hubungi {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #25d366;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
  white-space: nowrap;
  justify-content: center;
}
.btn-hubungi:hover {
  background: #1ebe5a;
  transform: translateY(-2px);
}

.btn-lihat-paket {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s;
}
.btn-lihat-paket:hover {
  border-color: rgba(255, 255, 255, 0.7);
  color: #fff;
}

/* Illustration */
.custom-cta-illustration {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.illus-phones {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: -10px;
  height: 180px;
  position: relative;
  width: 100%;
}

.illus-phone {
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: absolute;
  bottom: 0;
}
.illus-phone-1 {
  width: 90px;
  height: 140px;
  left: 50%;
  transform: translateX(-120px) rotate(-6deg);
  z-index: 1;
  opacity: 0.8;
  background: #fff;
}
.illus-phone-2 {
  width: 100px;
  height: 160px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  background: #fff;
}
.illus-phone-3 {
  width: 90px;
  height: 140px;
  left: 50%;
  transform: translateX(22px) rotate(6deg);
  z-index: 1;
  opacity: 0.8;
  background: #fff;
}

.illus-screen {
  padding: 10px 8px 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.illus-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  flex-shrink: 0;
}
.illus-img {
  flex: 1;
  border-radius: 8px;
  flex-shrink: 0;
  max-height: 55%;
}
.illus-lines {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.illus-line {
  height: 5px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
.illus-line.w80 {
  width: 80%;
}
.illus-line.w75 {
  width: 75%;
}
.illus-line.w70 {
  width: 70%;
}
.illus-line.w65 {
  width: 65%;
}
.illus-line.w60 {
  width: 60%;
}
.illus-line.w55 {
  width: 55%;
}
.illus-line.w50 {
  width: 50%;
}
.illus-line.w45 {
  width: 45%;
}
.illus-btn-mock {
  height: 12px;
  border-radius: 6px;
  opacity: 0.85;
  flex-shrink: 0;
}

.illus-label {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 14px;
  border-radius: 50px;
  backdrop-filter: blur(4px);
}

@media (min-width: 768px) {
  .custom-cta-card {
    flex-direction: row;
    align-items: center;
    padding: 52px 48px;
    gap: 48px;
  }
  .custom-cta-content {
    flex: 1;
  }
  .custom-cta-illustration {
    width: 260px;
    flex-shrink: 0;
  }
  .illus-phones {
    height: 200px;
  }
  .illus-phone-2 {
    width: 110px;
    height: 180px;
  }
  .illus-phone-1,
  .illus-phone-3 {
    width: 96px;
    height: 155px;
  }
  .custom-cta-actions {
    flex-direction: row;
  }
  .btn-hubungi,
  .btn-lihat-paket {
    justify-content: flex-start;
  }
}

/* ===========================
   FOOTER
=========================== */

@media (min-width: 1024px) {
  .custom-cta-section {
    padding: 48px 0 56px;
  }
}
</style>