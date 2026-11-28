<script setup>
// components/themes/PageStage.vue
// Render satu halaman: latar + dekorasi (layer) + panel (lengkung) + elemen (teks, foto berbingkai, tombol).
// Dipakai bersama oleh editor & tampilan tamu supaya hasilnya identik. Teks dirender sebagai teks biasa (aman, tanpa v-html).
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { PAGE_STAGE, applyTokens, safeUrl, hexA, buttonHref } from "~/utils/page-defaults";

const props = defineProps({
  page: { type: Object, required: true },
  scale: { type: Number, default: 1 },
  height: { type: Number, default: PAGE_STAGE.height }, // tinggi logis (px sebelum di-scale)
  guest: { type: String, default: "" },
  data: { type: Object, default: () => ({}) }, // data undangan (store.undangan) → untuk token & foto/link terikat
  editable: { type: Boolean, default: false },
  designer: { type: Boolean, default: false }, // true = dekorasi bisa diklik/digeser (mode desainer tema)
  grow: { type: Boolean, default: false }, // true = tinggi mengikuti isi (dipakai tampilan tamu mode scroll)
  active: { type: Boolean, default: true } // false = animasi masuk ditahan (mulai saat halaman terlihat di layar)
});
const emit = defineEmits(["edit", "measure", "action", "layer-move"]);

// Mode editor & mode scroll tamu (grow): tinggi halaman mengikuti isi (otomatis memanjang), minimal = `height`.
// Dengan begitu isi tidak pernah terpotong dan tidak ada scroll di dalam scroll.
const auto = computed(() => props.editable || props.grow);
const rootEl = ref(null);
let ro = null;
onMounted(() => {
  if (!auto.value || typeof ResizeObserver === "undefined") return;
  ro = new ResizeObserver(() => rootEl.value && emit("measure", rootEl.value.offsetHeight));
  ro.observe(rootEl.value);
  emit("measure", rootEl.value.offsetHeight);
});
onBeforeUnmount(() => ro?.disconnect());

const PANEL_TOP = 44;
const hasPanel = computed(() => props.page.panel?.shape === "arch");
const animate = computed(() => !props.editable); // animasi hanya di tampilan tamu

const flowEls = computed(() => props.page.elements.filter((e) => e.type !== "layer"));
// Urutan tumpukan TETAP (tidak bisa tertukar): dekorasi paling belakang → panel → isi yang bisa diedit paling depan.
// Properti `front` pada data lama diabaikan.
const layers = computed(() => props.page.elements.filter((e) => e.type === "layer"));

const stageStyle = computed(() => {
  const img = safeUrl(props.page.bg?.image);
  return {
    ...(auto.value ? { minHeight: `${props.height}px` } : { height: `${props.height}px` }),
    transform: `scale(${props.scale})`,
    backgroundColor: props.page.bg?.color || "#fff",
    backgroundImage: img ? `url("${img}")` : "none"
  };
});

const panelStyle = computed(() => {
  const p = props.page.panel || {};
  const w = PAGE_STAGE.width;
  return {
    left: "0",
    right: "0",
    top: `${PANEL_TOP}px`,
    bottom: "0",
    background: hexA(p.color || "#ffffff", p.alpha ?? 1),
    borderRadius: `${w / 2}px ${w / 2}px 0 0`,
    border: p.border ? `${Number(p.borderW) || 2}px solid ${p.border}` : "none",
    boxSizing: "border-box"
  };
});
const flowStyle = computed(() =>
  hasPanel.value ? { padding: `${PANEL_TOP + 48}px 34px 32px` } : { padding: "32px 30px" }
);

// ── animasi masuk ──
function animStyle(el) {
  return el.anim && animate.value
    ? { animationName: `ps-${el.anim}`, animationDelay: `${Number(el.delay) || 0}s`, animationDuration: "1s", animationFillMode: "both", animationPlayState: props.active ? "running" : "paused" }
    : {};
}

// ── teks ──
function textStyle(el) {
  return {
    fontFamily: el.font,
    fontSize: `${el.size}px`,
    color: el.color,
    fontWeight: el.bold ? 700 : 400,
    fontStyle: el.italic ? "italic" : "normal",
    textAlign: el.align || "center",
    marginTop: `${el.mt || 0}px`,
    ...animStyle(el)
  };
}

// ── foto berbingkai ──
function radius(el, extra = 0) {
  const w = (Number(el.w) || 190) + extra;
  if (el.shape === "arch") return `${w / 2}px ${w / 2}px 0 0`;
  if (el.shape === "rect") return "10px";
  return "50%";
}
function imgBox(el) {
  const w = Number(el.w) || 190;
  return { w, h: el.shape === "circle" ? w : Number(el.h) || 250 };
}
const imageWrapStyle = (el) => ({ marginTop: `${el.mt || 0}px`, display: "flex", justifyContent: "center", ...animStyle(el) });
function frameStyle(el) {
  const { w, h } = imgBox(el);
  const ornate = el.frame === "ornate" && !safeUrl(el.frameUrl);
  const pad = ornate ? 9 : 0;
  return {
    position: "relative",
    width: `${w + pad * 2}px`,
    height: `${h + pad * 2}px`,
    padding: `${pad}px`,
    boxSizing: "border-box",
    borderRadius: radius(el, pad * 2),
    background: ornate ? "linear-gradient(135deg,#e9dcc0 0%,#b99a5b 28%,#f3ead3 52%,#a98547 78%,#e4d3a8 100%)" : "transparent",
    boxShadow: ornate ? "0 2px 8px rgba(80,60,20,.25), inset 0 0 0 2px rgba(255,255,255,.55)" : "none"
  };
}
const photoStyle = (el) => ({ width: "100%", height: "100%", borderRadius: radius(el), overflow: "hidden", background: "rgba(0,0,0,.06)" });

// ── tombol ──
const btnWrapStyle = (el) => ({ marginTop: `${el.mt || 0}px`, display: "flex", justifyContent: "center", ...animStyle(el) });
const btnStyle = (el) => ({
  fontFamily: el.font,
  fontSize: `${el.size}px`,
  color: el.color,
  background: el.bg,
  padding: "10px 26px",
  borderRadius: "999px",
  fontWeight: 600,
  cursor: "pointer",
  border: "none"
});
function onBtn(el) {
  if (props.editable) return emit("edit", el.id);
  emit("action", { action: el.action, href: buttonHref(el, props.data) });
}

// ── dekorasi (layer) ──
function layerStyle(el) {
  const st = { position: "absolute", width: `${Number(el.w) || 50}%` };
  const x = `${Number(el.x) || 0}%`;
  const y = `${Number(el.y) || 0}%`;
  const tf = [];
  if (el.h === "right") st.right = x;
  else if (el.h === "center") { st.left = `calc(50% + ${x})`; tf.push("translateX(-50%)"); }
  else st.left = x;
  if (el.v === "bottom") st.bottom = y;
  else st.top = y;
  if (el.rot) tf.push(`rotate(${Number(el.rot)}deg)`);
  if (el.flip) tf.push("scaleX(-1)");
  if (tf.length) st.transform = tf.join(" ");
  st.transformOrigin = `${el.h === "right" ? "right" : el.h === "center" ? "center" : "left"} ${el.v === "bottom" ? "bottom" : "top"}`;
  return st;
}
const loopStyle = (el) =>
  el.loop === "fly" && animate.value
    ? { animationName: "ps-fly", animationDuration: "15s", animationTimingFunction: "linear", animationIterationCount: "infinite" }
    : el.loop && animate.value
    ? { animationName: `ps-${el.loop}`, animationDuration: el.loop === "float" ? "3.5s" : "3s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", animationDirection: "alternate", transformOrigin: `${el.h === "right" ? "right" : "left"} ${el.v === "bottom" ? "bottom" : "top"}` }
    : {};

// Seret dekorasi dengan mouse di editor (sentuhan tetap untuk scroll; atur lewat modal)
let drag = null;
function onLayerDown(el, e) {
  if (!props.designer || e.pointerType !== "mouse" || e.button !== 0) return;
  drag = { id: el.id, sx: e.clientX, sy: e.clientY, x: Number(el.x) || 0, y: Number(el.y) || 0, el, moved: false };
  e.currentTarget.setPointerCapture?.(e.pointerId);
}
function onLayerMove(e) {
  if (!drag) return;
  const dx = e.clientX - drag.sx;
  const dy = e.clientY - drag.sy;
  if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
  drag.moved = true;
  const H = rootEl.value?.offsetHeight || props.height;
  const pctX = (dx / props.scale / PAGE_STAGE.width) * 100;
  const pctY = (dy / props.scale / H) * 100;
  const x = drag.el.h === "right" ? drag.x - pctX : drag.x + pctX;
  const y = drag.el.v === "bottom" ? drag.y - pctY : drag.y + pctY;
  emit("layer-move", { id: drag.id, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
}
function onLayerUp(el) {
  const moved = drag?.moved;
  drag = null;
  if (!moved && props.designer) emit("edit", el.id);
}

const vars = computed(() => ({ ...props.data, nama_tamu: props.guest }));
const shown = (el) => applyTokens(el.text, vars.value);
const labelOf = (el) => applyTokens(el.label, vars.value);
// foto terikat ke field data (bind) atau src langsung (dekorasi tema)
const srcOf = (el) => safeUrl(el.bind ? props.data?.[el.bind] : el.src);
const hasSrc = (el) => !!srcOf(el);
// tombol link/WA tanpa tujuan tidak ditampilkan ke tamu
const showBtn = (el) => props.editable || el.action === "next" || !!buttonHref(el, props.data);
</script>

<template>
  <div ref="rootEl" class="ps-stage" :class="{ auto }" :style="stageStyle">
    <!-- LAYER 1 (paling belakang): semua dekorasi -->
    <template v-for="el in layers" :key="el.id">
      <div v-if="hasSrc(el)" class="ps-layer" :class="{ editable: designer }" :style="layerStyle(el)"
        @pointerdown="onLayerDown(el, $event)" @pointermove="onLayerMove" @pointerup="onLayerUp(el)">
        <div :style="animStyle(el)"><img :src="srcOf(el)" alt="" draggable="false" :style="loopStyle(el)" @error="$event.target.style.visibility = 'hidden'" /></div>
      </div>
    </template>

    <!-- LAYER 2: panel lengkung -->
    <div v-if="hasPanel" class="ps-panel" :style="panelStyle" />

    <!-- LAYER 3 (paling depan): teks, foto, tombol -->
    <div class="ps-flow" :style="flowStyle">
      <div class="ps-inner">
        <template v-for="el in flowEls" :key="el.id">
          <div v-if="el.type === 'image'" class="ps-img" :class="{ editable }" :style="imageWrapStyle(el)"
            @click="editable && emit('edit', el.id)">
            <div v-if="hasSrc(el) || editable" :style="frameStyle(el)">
              <div :style="photoStyle(el)">
                <img v-if="hasSrc(el)" :src="srcOf(el)" alt="" class="ps-photo" draggable="false" />
                <div v-else class="ps-empty">+ Foto</div>
              </div>
              <img v-if="safeUrl(el.frameUrl)" :src="safeUrl(el.frameUrl)" alt="" class="ps-frame-img" draggable="false" />
            </div>
          </div>
          <div v-else-if="el.type === 'button' && showBtn(el)" class="ps-btnwrap" :class="{ editable }" :style="btnWrapStyle(el)">
            <button type="button" :style="btnStyle(el)" @click="onBtn(el)">{{ labelOf(el) }}</button>
          </div>
          <div v-else-if="el.type !== 'button'" class="ps-el" :class="{ editable }" :style="textStyle(el)" @click="editable && emit('edit', el.id)">
            {{ shown(el) || "\u00A0" }}
          </div>
        </template>
      </div>
    </div>

  </div>
</template>

<style scoped>
.ps-stage { position: absolute; top: 0; left: 0; width: 360px; transform-origin: top left; background-size: cover; background-position: center; overflow: hidden; display: flex; flex-direction: column; }
.ps-layer { z-index: 1; }
.ps-panel { position: absolute; z-index: 2; pointer-events: none; }
.ps-flow { position: relative; z-index: 3; width: 100%; flex: 1 1 auto; min-height: 0; box-sizing: border-box; overflow-y: auto; display: flex; scrollbar-width: none; overscroll-behavior: contain; }
.ps-flow::-webkit-scrollbar { display: none; }
.ps-inner { margin: auto; width: 100%; }
/* flow tidak menangkap klik di area kosong → dekorasi di belakangnya tetap bisa diklik/digeser (mode desainer) */
.ps-flow, .ps-inner { pointer-events: none; }
.ps-inner > * { pointer-events: auto; }
.ps-stage.auto .ps-flow { overflow: visible; min-height: auto; }
.ps-el { line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
.ps-el.editable, .ps-img.editable, .ps-btnwrap.editable { cursor: pointer; border-radius: 4px; outline: 1px dashed transparent; outline-offset: 4px; transition: outline-color .15s; }
.ps-el.editable:hover, .ps-img.editable:hover, .ps-btnwrap.editable:hover { outline-color: rgba(47, 198, 218, .9); }
.ps-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
.ps-empty { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font: 600 13px sans-serif; color: rgba(0, 0, 0, .4); }
.ps-frame-img { position: absolute; inset: -12%; width: 124%; height: 124%; max-width: none; object-fit: contain; pointer-events: none; }
.ps-layer { pointer-events: none; }
.ps-layer img { width: 100%; height: auto; display: block; }
.ps-layer.editable { pointer-events: auto; cursor: grab; touch-action: pan-y; outline: 1px dashed transparent; outline-offset: 2px; }
.ps-layer.editable:hover { outline-color: rgba(47, 198, 218, .9); }
</style>

<!-- Keyframes HARUS global (tanpa scoped): nama animasi dipasang lewat inline style, scoped akan mengganti nama keyframes-nya -->
<style>
@keyframes ps-fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@keyframes ps-fadeInDown { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: none; } }
@keyframes ps-fadeInLeft { from { opacity: 0; transform: translateX(-36px); } to { opacity: 1; transform: none; } }
@keyframes ps-fadeInRight { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: none; } }
@keyframes ps-zoomIn { from { opacity: 0; transform: scale(.6); } to { opacity: 1; transform: none; } }
@keyframes ps-wave-left { from { transform: rotate(-2deg); } to { transform: rotate(5deg); } }
@keyframes ps-wave-right { from { transform: rotate(2deg); } to { transform: rotate(-5deg); } }
@keyframes ps-fly { from { transform: translate(-120%, -60px); } to { transform: translate(420px, 60px); } }
@keyframes ps-float { from { transform: translateY(0); } to { transform: translateY(-8px); } }
@media (prefers-reduced-motion: reduce) { .ps-stage * { animation: none !important; } }
</style>
