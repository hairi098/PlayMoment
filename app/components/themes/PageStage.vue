<script setup>
// components/themes/PageStage.vue
// Render satu halaman: latar + panel (lengkung/arch) + elemen (teks & foto berbingkai).
// Dipakai bersama oleh editor & tampilan tamu supaya hasilnya identik.
// Teks dirender sebagai teks biasa (aman, tanpa v-html).
import { computed } from "vue";
import { PAGE_STAGE, applyTokens, safeUrl } from "~/utils/page-defaults";

const props = defineProps({
  page: { type: Object, required: true },
  scale: { type: Number, default: 1 },
  height: { type: Number, default: PAGE_STAGE.height }, // tinggi logis (px sebelum di-scale)
  guest: { type: String, default: "" },
  editable: { type: Boolean, default: false }
});
const emit = defineEmits(["edit"]);

const PANEL = { side: 0, top: 44 };
const hasPanel = computed(() => props.page.panel?.shape === "arch");

const stageStyle = computed(() => {
  const img = safeUrl(props.page.bg?.image);
  return {
    width: `${PAGE_STAGE.width}px`,
    height: `${props.height}px`,
    transform: `scale(${props.scale})`,
    backgroundColor: props.page.bg?.color || "#fff",
    backgroundImage: img ? `url("${img}")` : "none"
  };
});

const panelStyle = computed(() => {
  const w = PAGE_STAGE.width - PANEL.side * 2;
  return {
    left: `${PANEL.side}px`,
    right: `${PANEL.side}px`,
    top: `${PANEL.top}px`,
    bottom: "0",
    background: props.page.panel?.color || "#fff",
    borderRadius: `${w / 2}px ${w / 2}px 0 0`
  };
});

const flowStyle = computed(() =>
  hasPanel.value
    ? { padding: `${PANEL.top + 48}px 34px 32px` }
    : { padding: "32px 30px" }
);

function textStyle(el) {
  return {
    fontFamily: el.font,
    fontSize: `${el.size}px`,
    color: el.color,
    fontWeight: el.bold ? 700 : 400,
    fontStyle: el.italic ? "italic" : "normal",
    textAlign: el.align || "center",
    marginTop: `${el.mt || 0}px`
  };
}

// Radius per bentuk foto
function radius(el, extra = 0) {
  const w = (Number(el.w) || 190) + extra;
  if (el.shape === "arch") return `${w / 2}px ${w / 2}px 0 0`;
  if (el.shape === "rect") return "10px";
  return "50%"; // oval & circle
}
function imgBox(el) {
  const w = Number(el.w) || 190;
  const h = el.shape === "circle" ? w : Number(el.h) || 250;
  return { w, h };
}
function imageWrapStyle(el) {
  return { marginTop: `${el.mt || 0}px`, display: "flex", justifyContent: "center" };
}
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
    background: ornate
      ? "linear-gradient(135deg,#e9dcc0 0%,#b99a5b 28%,#f3ead3 52%,#a98547 78%,#e4d3a8 100%)"
      : "transparent",
    boxShadow: ornate ? "0 2px 8px rgba(80,60,20,.25), inset 0 0 0 2px rgba(255,255,255,.55)" : "none"
  };
}
function photoStyle(el) {
  return { width: "100%", height: "100%", borderRadius: radius(el), overflow: "hidden", background: "rgba(0,0,0,.06)" };
}
const shown = (el) => applyTokens(el.text, { nama_tamu: props.guest });
const hasSrc = (el) => !!safeUrl(el.src);
</script>

<template>
  <div class="ps-stage" :style="stageStyle">
    <div v-if="hasPanel" class="ps-panel" :style="panelStyle" />
    <div class="ps-flow" :class="{ editable }" :style="flowStyle">
      <div class="ps-inner">
      <template v-for="el in page.elements" :key="el.id">
        <div
          v-if="el.type === 'image'"
          class="ps-img"
          :class="{ editable }"
          :style="imageWrapStyle(el)"
          @click="editable && emit('edit', el.id)"
        >
          <div v-if="hasSrc(el) || editable" :style="frameStyle(el)">
            <div :style="photoStyle(el)">
              <img v-if="hasSrc(el)" :src="safeUrl(el.src)" alt="" class="ps-photo" draggable="false" />
              <div v-else class="ps-empty">+ Foto</div>
            </div>
            <img
              v-if="safeUrl(el.frameUrl)"
              :src="safeUrl(el.frameUrl)"
              alt=""
              class="ps-frame-img"
              draggable="false"
            />
          </div>
        </div>
        <div
          v-else
          class="ps-el"
          :class="{ editable }"
          :style="textStyle(el)"
          @click="editable && emit('edit', el.id)"
        >
          {{ shown(el) || "\u00A0" }}
        </div>
      </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ps-stage { position: absolute; top: 0; left: 0; transform-origin: top left; background-size: cover; background-position: center; overflow: hidden; }
.ps-panel { position: absolute; }
.ps-flow { position: relative; width: 100%; height: 100%; box-sizing: border-box; overflow-y: auto; display: flex; scrollbar-width: none; overscroll-behavior: contain; }
.ps-flow::-webkit-scrollbar { display: none; }
.ps-inner { margin: auto; width: 100%; }
.ps-el { line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
.ps-el.editable, .ps-img.editable { cursor: pointer; border-radius: 4px; outline: 1px dashed transparent; outline-offset: 4px; transition: outline-color .15s; }
.ps-el.editable:hover, .ps-img.editable:hover { outline-color: rgba(47, 198, 218, .9); }
.ps-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
.ps-empty { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font: 600 13px sans-serif; color: rgba(0, 0, 0, .4); }
.ps-frame-img { position: absolute; inset: -12%; width: 124%; height: 124%; max-width: none; object-fit: contain; pointer-events: none; }
</style>
