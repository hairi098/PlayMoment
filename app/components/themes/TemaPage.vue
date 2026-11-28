<script setup>
// components/themes/TemaPage.vue
// Tampilan tamu untuk tema tipe "page":
//  - Halaman pertama (Opening) = COVER yang menutupi undangan. Klik "Open Invitation" → cover naik pelan ke atas
//    dan isi undangan terlihat di bawahnya (cover tidak ikut jadi bagian scroll).
//  - Halaman lainnya ditumpuk ke bawah dan di-scroll (bukan per halaman).
//  - HP: tiap halaman minimal setinggi layar. Desktop / bingkai preview: ukuran disesuaikan tinggi layar supaya
//    COVER pas satu layar penuh (tanpa scroll); halaman isi tidak dipaksa full-layar, tingginya mengikuti isi.
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useElementSize } from "@vueuse/core";
import { useUndanganStore } from "~/stores/useUndanganStore";
import { PAGE_STAGE, PAGE_FONT_URL, ANIMATE_CSS_URL, safeUrl } from "~/utils/page-defaults";
import { useAssetStore } from "~/stores/useAssetStore";
import PageStage from "~/components/themes/PageStage.vue";
import { usePageEditor } from "~/composables/usePageEditor";

// dideklarasikan supaya tidak jatuh jadi atribut HTML di elemen root (dikirim oleh halaman preview)
const props = defineProps({ previewMode: { type: Boolean, default: false }, demoMode: { type: Boolean, default: false } });

useHead({ link: [{ rel: "stylesheet", href: PAGE_FONT_URL }, ...(ANIMATE_CSS_URL ? [{ rel: "stylesheet", href: ANIMATE_CSS_URL }] : [])] });

const store = useUndanganStore();
usePageEditor().ensurePages(false); // tema baru dipilih → langsung terisi default (tanpa mengubah data yang sudah ada)
// RSVP dimatikan (store.rsvpAktif = false) → halaman yang berisi form RSVP tidak ditampilkan ke tamu
const pages = computed(() =>
  (store.sectionContents.pages?.items ?? []).filter(
    (p) => Array.isArray(p.elements) && p.visible !== false && (store.rsvpAktif !== false || !p.elements.some((e) => e.type === "rsvp"))
  )
);
const guest = computed(() => store.undangan.namaTamu || "");

// ── cover (halaman pertama) & isi (sisanya) ──
// Cover hanya dipakai kalau ada >1 halaman dan halaman pertama punya tombol "buka halaman berikutnya"
// (kalau tidak, tamu tidak punya cara membukanya → langsung tampil semua).
const hasCover = computed(
  () => pages.value.length > 1 && pages.value[0].elements.some((e) => e.type === "button" && e.action === "next")
);
const cover = computed(() => (hasCover.value ? pages.value[0] : null));
const rest = computed(() => (hasCover.value ? pages.value.slice(1) : pages.value));
const opened = ref(false); // klik tombol → true
const coverGone = ref(false); // setelah animasi selesai → cover dilepas dari layar
const isOpen = computed(() => opened.value || !hasCover.value);

function openInvitation() {
  if (opened.value) return;
  opened.value = true;
  playMusic(); // klik tombol = interaksi user → browser mengizinkan musik berbunyi
  scrollEl.value && (scrollEl.value.scrollTop = 0);
  setTimeout(() => { coverGone.value = true; }, 1100);
}

// ── musik latar (sistem musik yang sama dengan editor: store.undangan.musikUrl + store.musikAktif) ──
// Tombol musik tampil selama fitur Music aktif. Lagu dipilih di editor (Music → Pilih); tanpa lagu terpilih
// tombol tetap tampil: di preview tema memakai lagu pertama dari koleksi asset sebagai contoh.
const assetStore = useAssetStore();
const musicIsOn = ref(true); // keinginan tamu (tombol)
const isPlaying = ref(false); // benar-benar sedang berbunyi
const trackUrl = computed(() => store.undangan.musikUrl || (props.demoMode || props.previewMode ? assetStore.musikAsset?.[0]?.url || "" : ""));
const showMusicBtn = computed(() => store.musikAktif !== false);
const hasMusic = computed(() => showMusicBtn.value && !!trackUrl.value);
let bgAudio = null;
function loadMusic(url) {
  bgAudio?.pause();
  bgAudio = null;
  isPlaying.value = false;
  if (!url || typeof Audio === "undefined") return;
  bgAudio = new Audio(url);
  bgAudio.loop = true;
  bgAudio.volume = 0.5;
  bgAudio.addEventListener("play", () => { isPlaying.value = true; });
  bgAudio.addEventListener("pause", () => { isPlaying.value = false; });
}
function playMusic() {
  if (bgAudio && hasMusic.value && musicIsOn.value) bgAudio.play().catch(() => {});
}
function toggleMusic() {
  musicIsOn.value = !musicIsOn.value; // watcher di bawah yang memutar / menjeda
}
watch(trackUrl, (url) => { loadMusic(url); playMusic(); });
watch([musicIsOn, () => store.musikAktif], () => {
  if (!bgAudio) return;
  if (hasMusic.value && musicIsOn.value) bgAudio.play().catch(() => {});
  else bgAudio.pause();
});
// Kalau tidak ada cover (tidak ada tombol buka), musik mulai di sentuhan/klik pertama tamu
function firstTouch() { playMusic(); }

// ── ukuran ──
// HP: penuh lebar (maks 480px). Desktop (≥768px) & bingkai HP preview: skala dibatasi juga oleh tinggi layar,
// jadi satu halaman 360×640 selalu muat di layar → cover tidak perlu di-scroll ke bawah.
const rootEl = ref(null);
const scrollEl = ref(null);
const { width: w, height: h } = useElementSize(rootEl);
const fitHeight = computed(() => props.demoMode || w.value >= 768);
const widthScale = computed(() => Math.min(w.value || PAGE_STAGE.width, 480) / PAGE_STAGE.width);
const heightScale = computed(() => (h.value || PAGE_STAGE.height) / PAGE_STAGE.height);
const scale = computed(() => (fitHeight.value ? Math.min(widthScale.value, heightScale.value) : widthScale.value));
const colW = computed(() => PAGE_STAGE.width * scale.value);
// tombol musik sejajar dengan tepi kanan kolom undangan (di layar lebar kolom ada di tengah)
const musicRight = computed(() => Math.max(0, ((w.value || colW.value) - colW.value) / 2) + 12);
// Cover (dan semua halaman di HP): tinggi logis minimum = layar penuh.
// Halaman isi di desktop: tinggi minimum = proporsi desain (640) → tidak dipaksa full-layar, memanjang sesuai isi.
const minH = computed(() => Math.max(PAGE_STAGE.height, (h.value || PAGE_STAGE.height) / scale.value));
const restMinH = computed(() => (fitHeight.value ? PAGE_STAGE.height : minH.value));
const measured = reactive({}); // id halaman → tinggi isi (logis)
const secH = (p, min) => Math.max(min, measured[p.id] || 0) * scale.value;
// latar di sisi kiri/kanan kolom (desktop) memakai gambar latar halaman yang sama → tidak ada pinggiran polos
const bgOf = (pg) => {
  const img = safeUrl(pg?.bg?.image);
  return { backgroundColor: pg?.bg?.color || "#fff", ...(img ? { backgroundImage: `url("${img}")`, backgroundSize: "cover", backgroundPosition: "center" } : {}) };
};

// ── halaman yang sudah terlihat (memulai animasi) & halaman aktif (titik navigasi) ──
const seen = reactive({});
const secEls = {};
let io = null;
// animasi halaman isi baru jalan setelah undangan dibuka
const isActive = (p) => (cover.value && p.id === cover.value.id ? true : isOpen.value && !!seen[p.id]);

function bindSection(el, id) {
  if (!el) { if (io && secEls[id]) io.unobserve(secEls[id]); delete secEls[id]; return; }
  if (secEls[id] === el) return;
  secEls[id] = el;
  el.dataset.pid = id;
  io?.observe(el);
}

onMounted(() => {
  loadMusic(trackUrl.value);
  if (!store.undangan.musikUrl && (props.demoMode || props.previewMode) && !assetStore.musikAsset?.length) assetStore.loadAssets?.().catch(() => {});
  window.addEventListener("pointerdown", firstTouch, { once: true });
  if (typeof IntersectionObserver !== "undefined") {
    io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) seen[e.target.dataset.pid] = true; }),
      { root: scrollEl.value, threshold: 0.15 }
    );
    Object.values(secEls).forEach((el) => io.observe(el));
  } else {
    pages.value.forEach((p) => { seen[p.id] = true; });
  }
  if (rest.value[0]) seen[rest.value[0].id] = true;
});
onBeforeUnmount(() => {
  io?.disconnect();
  window.removeEventListener("pointerdown", firstTouch);
  bgAudio?.pause();
  bgAudio = null;
});

function go(i) {
  const p = rest.value[i];
  const el = p && secEls[p.id];
  if (el) scrollEl.value?.scrollTo({ top: el.offsetTop, behavior: "smooth" });
}
// Aksi tombol: buka undangan (di cover) / scroll ke halaman berikutnya / buka link / WhatsApp (href sudah disaring → hanya http(s))
function onAction({ action, href }, i, isCover = false) {
  if (action === "next") return isCover ? openInvitation() : go(i + 1);
  if (href) window.open(href, "_blank", "noopener,noreferrer");
}
</script>

<template>
  <div ref="rootEl" class="tp-root" :class="{ demo: demoMode }" :style="{ background: pages[0]?.bg?.color || '#fff' }">
    <!-- ISI UNDANGAN (di bawah cover) -->
    <div ref="scrollEl" class="tp-scroll" :class="{ locked: !isOpen, snap: !fitHeight }" :style="bgOf(rest[0])">
      <div class="tp-col" :style="{ width: colW + 'px' }">
        <section
          v-for="(p, i) in rest"
          :key="p.id"
          :ref="(el) => bindSection(el, p.id)"
          class="tp-sec"
          :style="{ height: secH(p, restMinH) + 'px', background: p.bg?.color || '#fff' }"
        >
          <PageStage
            :page="p"
            :scale="scale"
            :height="restMinH"
            :guest="guest"
            :data="store.undangan"
            grow
            :active="isActive(p)"
            @measure="measured[p.id] = $event"
            @action="onAction($event, i)"
          />
        </section>
      </div>
    </div>

    <!-- COVER: menutupi undangan, naik pelan saat dibuka -->
    <div v-if="cover && !coverGone" class="tp-cover" :class="{ open: opened }" :style="bgOf(cover)">
      <div class="tp-cover-scroll">
        <div class="tp-col" :style="{ width: colW + 'px' }">
          <section class="tp-sec" :style="{ height: secH(cover, minH) + 'px', background: cover.bg?.color || '#fff' }">
            <PageStage
              :page="cover"
              :scale="scale"
              :height="minH"
              :guest="guest"
              :data="store.undangan"
              grow
              @measure="measured[cover.id] = $event"
              @action="onAction($event, 0, true)"
            />
          </section>
        </div>
      </div>
    </div>

    <!-- TOMBOL MUSIK (di atas cover & isi) -->
    <button
      v-if="showMusicBtn"
      type="button"
      class="tp-music"
      :class="{ off: !musicIsOn, playing: isPlaying && musicIsOn }"
      :style="{ right: musicRight + 'px' }"
      :aria-label="musicIsOn ? 'Matikan musik' : 'Nyalakan musik'"
      :title="musicIsOn ? 'Matikan musik' : 'Nyalakan musik'"
      @click.stop="toggleMusic"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
        <line v-if="!musicIsOn" x1="3" y1="3" x2="21" y2="21" stroke-width="2.5" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.tp-root { position: relative; width: 100%; height: 100dvh; overflow: hidden; }
.tp-root.demo { height: 100%; } /* di dalam bingkai HP (preview-tema) */
.tp-scroll { width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.tp-scroll.snap { scroll-snap-type: y proximity; }
.tp-scroll.locked { overflow: hidden; } /* sebelum dibuka, isi tidak bisa di-scroll */
.tp-scroll::-webkit-scrollbar, .tp-cover-scroll::-webkit-scrollbar { display: none; }
.tp-col { position: relative; margin: 0 auto; }
.tp-sec { position: relative; overflow: hidden; scroll-snap-align: start; }

.tp-cover { position: absolute; inset: 0; z-index: 10; transform: translateY(0); transition: transform 1s cubic-bezier(.7, 0, .2, 1); will-change: transform; box-shadow: 0 8px 30px rgba(0, 0, 0, .25); }
.tp-cover.open { transform: translateY(-100%); pointer-events: none; }
.tp-cover-scroll { width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; scrollbar-width: none; }

.tp-music { position: absolute; top: 14px; z-index: 20; width: 40px; height: 40px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, .85); color: #b76b78; box-shadow: 0 2px 10px rgba(0, 0, 0, .2); backdrop-filter: blur(4px); transition: transform .15s; }
.tp-music:active { transform: scale(.92); }
.tp-music.playing svg { animation: tp-spin 4s linear infinite; }
.tp-music.off { color: #94a3b8; }
@keyframes tp-spin { to { transform: rotate(360deg); } }
</style>
