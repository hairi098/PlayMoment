<script setup>
// components/themes/TemaPage.vue
// Tampilan tamu untuk tema tipe "page": halaman satu per satu (geser / tombol).
import { ref, computed, watch } from "vue";
import { useSwipe, useElementSize } from "@vueuse/core";
import { useUndanganStore } from "~/stores/useUndanganStore";
import { PAGE_STAGE, PAGE_FONT_URL } from "~/utils/page-defaults";

useHead({ link: [{ rel: "stylesheet", href: PAGE_FONT_URL }] });

const store = useUndanganStore();
const pages = computed(() => (store.sectionContents.pages?.items ?? []).filter((p) => Array.isArray(p.elements) && p.visible !== false));
const idx = ref(0);
const dir = ref("next");
const guest = computed(() => store.undangan.namaTamu || "");
const current = computed(() => pages.value[idx.value]);

function go(i) {
  if (i < 0 || i > pages.value.length - 1 || i === idx.value) return;
  dir.value = i > idx.value ? "next" : "prev";
  idx.value = i;
}
const next = () => go(idx.value + 1);
const prev = () => go(idx.value - 1);
watch(() => pages.value.length, (n) => { if (idx.value > n - 1) idx.value = Math.max(0, n - 1); });

const rootRef = ref(null);
useSwipe(rootRef, {
  threshold: 50,
  onSwipeEnd(_e, d) {
    if (d === "up" || d === "left") next();
    else if (d === "down" || d === "right") prev();
  }
});
const { width: w, height: h } = useElementSize(rootRef);
// Penuh lebar (tanpa space kiri-kanan) & penuh tinggi layar, seperti halaman mobile biasa.
// Di layar lebar dibatasi 480px dan ditengah.
const wrapW = computed(() => Math.min(w.value || PAGE_STAGE.width, 480));
const scale = computed(() => wrapW.value / PAGE_STAGE.width);
const stageH = computed(() => (h.value || PAGE_STAGE.height) / scale.value);
</script>

<template>
  <div ref="rootRef" class="tp-root" :style="{ background: current?.bg?.color || '#fff' }">
    <div
      v-if="current"
      class="tp-wrap"
      :style="{ width: wrapW + 'px', height: h + 'px' }"
    >
      <Transition :name="`tp-${dir}`" mode="out-in">
        <PageStage :key="current.id" :page="current" :scale="scale" :height="stageH" :guest="guest" />
      </Transition>
    </div>

    <div class="tp-nav">
      <button type="button" :disabled="idx === 0" aria-label="Sebelumnya" @click="prev">
        <UIcon name="i-lucide-chevron-up" />
      </button>
      <span class="tp-dots">
        <i v-for="(p, i) in pages" :key="p.id" :class="{ on: i === idx }" @click="go(i)" />
      </span>
      <button type="button" :disabled="idx === pages.length - 1" aria-label="Berikutnya" @click="next">
        <UIcon name="i-lucide-chevron-down" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.tp-root { position: relative; width: 100%; height: 100dvh; display: flex; align-items: center; justify-content: center; overflow: hidden; touch-action: pan-y; }
.tp-wrap { position: relative; overflow: hidden; }
@media (min-width: 520px) { .tp-wrap { border-radius: 24px; } }
.tp-nav { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: center; gap: 10px; z-index: 5; }
.tp-nav button { width: 32px; height: 32px; border-radius: 999px; background: rgba(255, 255, 255, .8); color: #1a2e45; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0, 0, 0, .15); }
.tp-nav button:disabled { opacity: .3; }
.tp-dots { display: flex; flex-direction: column; gap: 6px; }
.tp-dots i { width: 6px; height: 6px; border-radius: 999px; background: rgba(26, 46, 69, .25); cursor: pointer; }
.tp-dots i.on { background: #1a2e45; height: 14px; }
.tp-next-enter-active, .tp-next-leave-active, .tp-prev-enter-active, .tp-prev-leave-active { transition: opacity .25s ease; }
.tp-next-enter-from, .tp-next-leave-to, .tp-prev-enter-from, .tp-prev-leave-to { opacity: 0; }
</style>
