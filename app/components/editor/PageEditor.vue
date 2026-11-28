<script setup>
// components/editor/PageEditor.vue
// Editor "tipe halaman" (Tema 2): daftar halaman (drag, toggle, Edit) → toolbar + kanvas.
// Klik elemen di kanvas → modal edit. Semua foto WAJIB dipilih dari Media (MediaPicker).
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useElementSize } from "@vueuse/core";
import { usePageEditor } from "~/composables/usePageEditor";
import { useUndanganStore } from "~/stores/useUndanganStore";
import PageStage from "~/components/themes/PageStage.vue";
import MediaPicker from "~/components/editor/MediaPicker.vue";
import {
  PAGE_STAGE, PAGE_FONTS, PAGE_FONT_URL, ANIMATE_CSS_URL, IMAGE_SHAPES, ENTRANCES, LOOPS, BTN_ACTIONS, safeUrl, tokenKey, hasToken
} from "~/utils/page-defaults";

useHead({ link: [{ rel: "stylesheet", href: PAGE_FONT_URL }, ...(ANIMATE_CSS_URL ? [{ rel: "stylesheet", href: ANIMATE_CSS_URL }] : [])] });

// Mode user (default): tema bawaan, user hanya mengganti DATA (teks yang terikat data, foto, link tombol).
// Mode desainer (designer=true): kontrol lengkap untuk membuat/mengubah tema (tambah elemen, dekorasi, panel, animasi).
const props = defineProps({ designer: { type: Boolean, default: false } });
const emit = defineEmits(["musik"]); // minta induk (halaman editor) membuka pilihan Music
const store = useUndanganStore();

const {
  pages, ensurePages, addPage, duplicatePage, removePage, renamePage, setPageBg,
  setPagePanel, setPageVisible, reorderPage,
  addElement, addImage, addButton, addRsvp, addLayer, updateElement, removeElement, moveElement
} = usePageEditor();

onMounted(() => {
  ensurePages();
  if (!openId.value && pages.value[0]) openId.value = pages.value[0].id;
});

// ── halaman terbuka (accordion) — dilacak lewat id supaya aman saat urutan berubah ──
const openId = ref(null);
const current = computed(() => pages.value.findIndex((p) => p.id === openId.value));
const page = computed(() => pages.value[current.value]);
watch(() => pages.value.length, () => {
  if (openId.value && current.value < 0) openId.value = pages.value[0]?.id ?? null;
});
const toggleOpen = (id) => { openId.value = openId.value === id ? null : id; };

// ── kanvas: sejajar baris halaman, tinggi mengikuti isi (minimal ukuran mobile default) ──
const rootRef = ref(null);
const { width: rootW } = useElementSize(rootRef);
const SIDE = 12;
const MAX_STAGE_W = 480; // sama dengan tampilan tamu: di layar lebar kanvas tidak melebar tanpa batas
// responsif: lebar kanvas mengikuti lebar layar (dikurangi sisi), maks 480px, selalu di tengah
const stageW = computed(() => Math.min(MAX_STAGE_W, Math.max(0, rootW.value - SIDE * 2)));
const scale = computed(() => (stageW.value ? stageW.value / PAGE_STAGE.width : 1));
// tinggi minimal logis sama persis dengan tampilan tamu (PAGE_STAGE.height) → posisi dekorasi konsisten
const stageH = computed(() => PAGE_STAGE.height);
const measuredH = ref(0);
const stageHpx = computed(() => Math.max(stageH.value, measuredH.value) * scale.value);
watch(openId, () => { measuredH.value = 0; });

// ── drag & drop urutan halaman ──
const dragFrom = ref(-1);
const dragOver = ref(-1);
function onDragStart(i, e) { dragFrom.value = i; e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", String(i)); }
function onDrop(i) {
  if (dragFrom.value >= 0) reorderPage(dragFrom.value, i);
  dragFrom.value = -1; dragOver.value = -1;
}

// ── Media picker (satu-satunya jalan memilih foto) ──
const pickerOpen = ref(false);
const pickerTarget = ref(""); // bg | src | frame
function pickMedia(target) { pickerTarget.value = target; pickerOpen.value = true; }
function onPicked(url) {
  if (pickerTarget.value === "bg") setPageBg(current.value, { image: url });
  else if (pickerTarget.value === "src") draft.src = url;
  else if (pickerTarget.value === "frame") draft.frameUrl = url;
}

// ── modal edit elemen ──
const modalOpen = ref(false);
const editBound = ref(""); // nama field data yang diedit langsung (teks/label tunggal berisi 1 token)
const editLocked = ref(false); // teks gabungan beberapa data → tidak diedit di sini
const editBindImg = ref("");
const editBindUrl = ref("");
const editingId = ref(null);
const editingType = ref("text"); // text | image | button | layer | rsvp
const draft = reactive({
  text: "", font: PAGE_FONTS[3].value, size: 16, color: "#000000", bold: false, italic: false, align: "center", mt: 0,
  src: "", shape: "oval", w: 190, h: 250, frame: "ornate", frameUrl: "",
  label: "", action: "next", url: "", bg: "#96483e",
  lh: "left", lv: "top", x: 0, y: 0, lw: 50, rot: 0, flip: false, front: true, loop: "",
  doneText: "", showWishes: true,
  anim: "", delay: 0, dur: 1
});

function openEdit(id) {
  const el = page.value?.elements.find((e) => e.id === id);
  if (!el) return;
  editingId.value = id;
  editingType.value = el.type || "text";
  editBound.value = ""; editLocked.value = false; editBindImg.value = ""; editBindUrl.value = "";
  draft.mt = el.mt || 0;
  draft.anim = el.anim || "";
  draft.delay = el.delay || 0;
  draft.dur = el.dur || 1;
  const boundKey = (txt) => { const k = tokenKey(txt); return !props.designer && k && k !== "nama_tamu" ? k : ""; };
  if (el.type === "image") {
    editBindImg.value = el.bind || "";
    Object.assign(draft, { src: el.bind ? String(store.undangan[el.bind] ?? "") : el.src || "", shape: el.shape || "oval", w: el.w || 190, h: el.h || 250, frame: el.frame || "ornate", frameUrl: el.frameUrl || "" });
  } else if (el.type === "button") {
    editBound.value = boundKey(el.label);
    editBindUrl.value = el.bindUrl || "";
    Object.assign(draft, {
      label: editBound.value ? String(store.undangan[editBound.value] ?? "") : el.label,
      action: el.action || "next", font: el.font, size: el.size, color: el.color, bg: el.bg,
      url: el.bindUrl ? String(store.undangan[el.bindUrl] ?? "") : el.url || ""
    });
  } else if (el.type === "rsvp") {
    Object.assign(draft, { label: el.label || "Kirim RSVP", doneText: el.doneText || "", showWishes: el.showWishes !== false, font: el.font, color: el.color, bg: el.bg });
  } else if (el.type === "layer") {
    Object.assign(draft, { src: el.src || "", lh: el.h || "left", lv: el.v || "top", x: el.x || 0, y: el.y || 0, lw: el.w || 50, rot: el.rot || 0, flip: !!el.flip, front: el.front !== false, loop: el.loop || "" });
  } else {
    editBound.value = boundKey(el.text);
    editLocked.value = !props.designer && !editBound.value && hasToken(el.text);
    Object.assign(draft, {
      text: editBound.value ? String(store.undangan[editBound.value] ?? "") : el.text,
      font: el.font, size: el.size, color: el.color, bold: !!el.bold, italic: !!el.italic, align: el.align || "center"
    });
  }
  modalOpen.value = true;
}
const onAdd = (fn) => { const id = fn(current.value); if (id) openEdit(id); };

const clamp = (v, a, b, d) => Math.min(b, Math.max(a, Number(v) || d));
function save() {
  const t = editingType.value;
  const D = store.undangan;
  const goodUrl = (u) => (safeUrl(u) ? String(u).trim() : "");

  const animPatch = { anim: draft.anim, delay: clamp(draft.delay, 0, 10, 0), dur: clamp(draft.dur, 0.2, 5, 1) };

  // ── RSVP (user & desainer): teks tombol, pesan sukses, daftar ucapan ──
  if (t === "rsvp") {
    const patch = { label: draft.label || "Kirim RSVP", doneText: draft.doneText, showWishes: !!draft.showWishes, ...animPatch };
    if (props.designer) Object.assign(patch, { font: draft.font, color: draft.color, bg: draft.bg, mt: clamp(draft.mt, 0, 300, 0) });
    updateElement(current.value, editingId.value, patch);
    modalOpen.value = false;
    return;
  }

  // ── MODE USER: hanya data (+ animasi) ──
  if (!props.designer) {
    if (t === "text") {
      if (editBound.value) { D[editBound.value] = draft.text; updateElement(current.value, editingId.value, animPatch); }
      else updateElement(current.value, editingId.value, { text: draft.text, ...animPatch });
    } else if (t === "image") {
      if (editBindImg.value) { D[editBindImg.value] = goodUrl(draft.src); updateElement(current.value, editingId.value, animPatch); }
      else updateElement(current.value, editingId.value, { src: goodUrl(draft.src), ...animPatch });
    } else if (t === "button") {
      const patch = { ...animPatch };
      if (editBound.value) D[editBound.value] = draft.label; else patch.label = draft.label || "Tombol";
      if (draft.action !== "next") { if (editBindUrl.value) D[editBindUrl.value] = draft.url; else patch.url = draft.url; }
      updateElement(current.value, editingId.value, patch);
    }
    modalOpen.value = false;
    return;
  }

  // ── MODE DESAINER ──
  const common = { mt: clamp(draft.mt, 0, 300, 0), ...animPatch };
  let patch;
  if (t === "image") {
    if (editBindImg.value) D[editBindImg.value] = goodUrl(draft.src);
    patch = { ...(editBindImg.value ? {} : { src: goodUrl(draft.src) }), shape: draft.shape, w: clamp(draft.w, 60, 300, 190), h: clamp(draft.h, 60, 400, 250), frame: draft.frame, frameUrl: goodUrl(draft.frameUrl), ...common };
  } else if (t === "button") {
    if (editBindUrl.value) D[editBindUrl.value] = draft.url;
    patch = { label: draft.label || "Tombol", action: draft.action, ...(editBindUrl.value ? {} : { url: draft.url }), font: draft.font, size: clamp(draft.size, 10, 30, 14), color: draft.color, bg: draft.bg, ...common };
  } else if (t === "layer") {
    patch = {
      src: goodUrl(draft.src), h: draft.lh, v: draft.lv, x: Number(draft.x) || 0, y: Number(draft.y) || 0, w: clamp(draft.lw, 5, 200, 50),
      rot: clamp(draft.rot, -180, 180, 0) * 1, flip: draft.flip, loop: draft.loop, ...animPatch
    };
  } else {
    patch = { text: draft.text, font: draft.font, size: clamp(draft.size, 8, 120, 16), color: draft.color, bold: draft.bold, italic: draft.italic, align: draft.align, ...common };
  }
  updateElement(current.value, editingId.value, patch);
  modalOpen.value = false;
}
function del() { removeElement(current.value, editingId.value); modalOpen.value = false; }
function moveEl(dir) { moveElement(current.value, editingId.value, dir); }
function onLayerMove({ id, x, y }) { updateElement(current.value, id, { x, y }); }

// contoh animasi di modal (animate.css) — tombol "Putar" memutar ulang
const demoKey = ref(0);
const demoCls = computed(() => (draft.anim && /^[A-Za-z]{2,32}$/.test(draft.anim) ? ["animate__animated", `animate__${draft.anim}`] : []));

const aligns = [
  { v: "left", icon: "i-lucide-align-left" },
  { v: "center", icon: "i-lucide-align-center" },
  { v: "right", icon: "i-lucide-align-right" }
];
const modalTitle = computed(() => ({ text: "Edit Teks", image: "Ganti Foto", button: "Edit Tombol", layer: "Edit Dekorasi", rsvp: "Pengaturan RSVP" }[editingType.value]));
const modalUi = {
  content: "w-[calc(100vw-32px)] max-w-[450px] mx-auto my-auto max-h-[85vh] rounded-2xl !bg-white !text-slate-900 ring-1 ring-slate-200",
  title: "!text-[#1a2e45] dark:!text-[#1a2e45]"
};

// ── aksi halaman ──
function onAddPage() { openId.value = pages.value[addPage(current.value >= 0 ? current.value : null)]?.id ?? openId.value; }
function onDup() { openId.value = pages.value[duplicatePage(current.value)]?.id ?? openId.value; }
function onDel() {
  if (pages.value.length <= 1) return;
  if (!confirm(`Hapus halaman "${page.value?.name}"?`)) return;
  const i = removePage(current.value);
  openId.value = pages.value[i]?.id ?? null;
}
function togglePanel() {
  setPagePanel(current.value, { shape: page.value?.panel?.shape === "arch" ? "none" : "arch" });
}
</script>

<template>
  <div ref="rootRef" class="pe-root">
    <!-- MUSIK: pilih lagu di editor → tombol musik muncul di preview & undangan -->
    <div class="pe-music">
      <UIcon name="i-lucide-music" class="pe-music-ico" />
      <span class="pe-music-name">{{ store.musikAktif === false ? "Musik nonaktif" : store.undangan.musik || "Belum ada lagu dipilih" }}</span>
      <button type="button" class="pe-edit" @click="emit('musik')">Pilih Musik</button>
    </div>

    <div
      v-for="(p, i) in pages"
      :key="p.id"
      class="pe-item"
      :class="{ over: dragOver === i && dragFrom !== i }"
      @dragover.prevent="dragOver = i"
      @drop.prevent="onDrop(i)"
    >
      <!-- BARIS HALAMAN -->
      <div class="pe-row" :draggable="designer" @dragstart="onDragStart(i, $event)" @dragend="dragFrom = -1; dragOver = -1">
        <span class="pe-handle" :class="{ off: p.visible === false }"><UIcon name="i-lucide-arrow-up-down" /></span>
        <span class="pe-rname">{{ p.name }}</span>
        <button
          type="button"
          class="pe-tog"
          :class="{ on: p.visible !== false }"
          :aria-label="p.visible !== false ? 'Sembunyikan halaman' : 'Tampilkan halaman'"
          @click.stop="setPageVisible(i, p.visible === false)"
        ><span /></button>
        <button type="button" class="pe-edit" :class="{ on: openId === p.id }" @click.stop="toggleOpen(p.id)">Edit</button>
      </div>

      <!-- PANEL EDIT -->
      <div v-if="openId === p.id" class="pe-open">
        <div v-if="designer" class="pe-toolbar">
          <button type="button" class="pe-ico" :class="{ on: p.panel?.shape === 'arch' }" title="Panel lengkung" @click="togglePanel">
            <UIcon name="i-lucide-panel-top" />
          </button>
          <input class="pe-name" :value="p.name" maxlength="30" placeholder="Nama halaman" @input="renamePage(i, $event.target.value)" />
          <button type="button" class="pe-ico" :class="{ on: !!p.bg?.image }" title="Gambar latar (dari Media)" @click="pickMedia('bg')">
            <UIcon name="i-lucide-image" />
          </button>
          <button type="button" class="pe-ico" title="Duplikat halaman" @click="onDup"><UIcon name="i-lucide-copy" /></button>
          <button type="button" class="pe-ico" title="Hapus halaman" :disabled="pages.length <= 1" @click="onDel"><UIcon name="i-lucide-trash-2" /></button>
        </div>

        <div class="pe-stage-area">
          <div class="pe-stage-wrap" :style="{ width: stageW + 'px', height: stageHpx + 'px' }">
            <PageStage
              
              :page="p" :scale="scale" :height="stageH" :data="store.undangan" :designer="designer" editable
              @edit="openEdit" @measure="measuredH = $event" @layer-move="onLayerMove"
            />
          </div>
        </div>

        <div v-if="designer" class="pe-bar">
          <button type="button" class="pe-btn" @click="onAdd(addElement)"><UIcon name="i-lucide-type" /> Teks</button>
          <button type="button" class="pe-btn" @click="onAdd(addImage)"><UIcon name="i-lucide-image-plus" /> Foto</button>
          <button type="button" class="pe-btn" @click="onAdd(addButton)"><UIcon name="i-lucide-mouse-pointer-click" /> Tombol</button>
          <button type="button" class="pe-btn" @click="onAdd(addLayer)"><UIcon name="i-lucide-flower-2" /> Dekorasi</button>
          <button type="button" class="pe-btn" @click="onAdd(addRsvp)"><UIcon name="i-lucide-mail-check" /> RSVP</button>
        </div>
        <div v-if="designer" class="pe-bar pe-bar2">
          <label class="pe-clr" title="Warna latar">
            <UIcon name="i-lucide-paint-bucket" />
            <input type="color" :value="p.bg?.color || '#ffffff'" @input="setPageBg(i, { color: $event.target.value })" />
          </label>
          <template v-if="p.panel?.shape === 'arch'">
            <label class="pe-clr" title="Warna panel">
              <UIcon name="i-lucide-panel-top" />
              <input type="color" :value="p.panel?.color || '#ffffff'" @input="setPagePanel(i, { color: $event.target.value })" />
            </label>
            <label class="pe-clr" title="Transparansi panel">
              <UIcon name="i-lucide-droplet" />
              <input type="range" min="0" max="1" step="0.05" :value="p.panel?.alpha ?? 1" class="pe-range" @input="setPagePanel(i, { alpha: Number($event.target.value) })" />
            </label>
            <label class="pe-clr" title="Garis tepi panel">
              <UIcon name="i-lucide-square-dashed" />
              <input type="color" :value="p.panel?.border || '#96483e'" @input="setPagePanel(i, { border: $event.target.value })" />
            </label>
            <button v-if="p.panel?.border" type="button" class="pe-btn ghost" @click="setPagePanel(i, { border: '' })">Tanpa garis</button>
          </template>
          <button v-if="p.bg?.image" type="button" class="pe-btn ghost" @click="setPageBg(i, { image: '' })"><UIcon name="i-lucide-x" /> Latar</button>
        </div>
      </div>
    </div>

    <button v-if="designer" type="button" class="pe-addpage" @click="onAddPage"><UIcon name="i-lucide-plus" /> Tambah Halaman</button>

    <MediaPicker v-model:open="pickerOpen" @select="onPicked" />

    <!-- MODAL EDIT ELEMEN -->
    <UModal v-model:open="modalOpen" :title="modalTitle" :ui="modalUi">
      <template #body>
        <div class="em-body">
          <!-- RSVP (user & desainer) -->
          <template v-if="editingType === 'rsvp'">
            <input v-model="draft.label" class="em-input" placeholder="Teks tombol kirim" maxlength="30" />
            <input v-model="draft.doneText" class="em-input" placeholder="Pesan setelah terkirim" maxlength="120" />
            <label class="em-lbl"><input v-model="draft.showWishes" type="checkbox" /> Tampilkan daftar ucapan tamu</label>
            <label class="em-lbl">
              <input type="checkbox" :checked="store.rsvpAktif !== false" @change="store.setRsvpAktif($event.target.checked)" />
              RSVP aktif (nonaktif = halaman RSVP disembunyikan dari tamu)
            </label>
            <p class="em-hint">Kolom isian (nama, kehadiran, jumlah, ucapan) mengikuti pengaturan RSVP undangan. Jawaban tamu masuk ke daftar tamu.</p>
            <template v-if="designer">
              <div class="em-row">
                <label class="em-lbl">Warna tombol <input v-model="draft.bg" type="color" class="em-color" /></label>
                <label class="em-lbl em-right">Warna teks <input v-model="draft.color" type="color" class="em-color" /></label>
              </div>
              <div class="em-row">
                <label class="em-lbl">Jarak atas <input v-model.number="draft.mt" type="number" min="0" max="300" class="em-num" /> px</label>
                <span class="em-right em-move">
                  <button type="button" class="em-tog" title="Naikkan" @click="moveEl(-1)"><UIcon name="i-lucide-arrow-up" /></button>
                  <button type="button" class="em-tog" title="Turunkan" @click="moveEl(1)"><UIcon name="i-lucide-arrow-down" /></button>
                </span>
              </div>
            </template>
          </template>

          <!-- MODE USER: hanya mengganti data -->
          <template v-else-if="!designer">
            <template v-if="editingType === 'text'">
              <p v-if="editLocked" class="em-hint">Teks ini gabungan beberapa data (mis. nama &amp; tanggal). Ubah lewat form Data undangan.</p>
              <textarea v-else v-model="draft.text" class="em-text" rows="5" placeholder="Ketik teks…" />
              <p v-if="editBound" class="em-hint">Perubahan ini ikut memperbarui data undangan.</p>
            </template>
            <template v-else-if="editingType === 'image'">
              <div class="em-row">
                <button type="button" class="em-media" @click="pickMedia('src')"><UIcon name="i-lucide-images" /> {{ draft.src ? "Ganti Foto" : "Pilih dari Media" }}</button>
                <img v-if="draft.src" :src="safeUrl(draft.src)" class="em-thumb" alt="" />
                <button v-if="draft.src" type="button" class="em-tog" title="Hapus foto" @click="draft.src = ''"><UIcon name="i-lucide-x" /></button>
              </div>
            </template>
            <template v-else-if="editingType === 'button'">
              <input v-model="draft.label" class="em-input" placeholder="Teks tombol" maxlength="40" />
              <input v-if="draft.action === 'link'" v-model="draft.url" type="url" class="em-input" placeholder="Link, mis. https://maps.app.goo.gl/…" />
              <input v-if="draft.action === 'wa'" v-model="draft.url" type="tel" class="em-input" placeholder="Nomor WhatsApp, mis. 0812xxxx" />
            </template>
          </template>

          <!-- MODE DESAINER -->
          <template v-else>
          <!-- TEKS -->
          <template v-if="editingType === 'text'">
            <textarea v-model="draft.text" class="em-text" rows="5" placeholder="Ketik teks…" />
            <div class="em-row">
              <button type="button" class="em-tog" :class="{ on: draft.italic }" style="font-style: italic" @click="draft.italic = !draft.italic">I</button>
              <button type="button" class="em-tog" :class="{ on: draft.bold }" style="font-weight: 700" @click="draft.bold = !draft.bold">B</button>
              <button v-for="a in aligns" :key="a.v" type="button" class="em-tog" :class="{ on: draft.align === a.v }" @click="draft.align = a.v"><UIcon :name="a.icon" /></button>
              <select v-model="draft.font" class="em-select"><option v-for="f in PAGE_FONTS" :key="f.value" :value="f.value">{{ f.label }}</option></select>
            </div>
            <div class="em-row">
              <label class="em-lbl">Warna Text <input v-model="draft.color" type="color" class="em-color" /></label>
              <label class="em-lbl em-right">Ukuran <input v-model.number="draft.size" type="number" min="8" max="120" class="em-num" /> px</label>
            </div>
          </template>

          <!-- FOTO -->
          <template v-else-if="editingType === 'image'">
            <div class="em-row">
              <button type="button" class="em-media" @click="pickMedia('src')"><UIcon name="i-lucide-images" /> {{ draft.src ? "Ganti Foto" : "Pilih dari Media" }}</button>
              <img v-if="draft.src" :src="safeUrl(draft.src)" class="em-thumb" alt="" />
            </div>
            <div class="em-row">
              <label class="em-lbl">Bentuk
                <select v-model="draft.shape" class="em-select"><option v-for="s in IMAGE_SHAPES" :key="s.value" :value="s.value">{{ s.label }}</option></select>
              </label>
              <label class="em-lbl em-right">Bingkai
                <select v-model="draft.frame" class="em-select"><option value="ornate">Emas</option><option value="none">Tanpa</option></select>
              </label>
            </div>
            <div class="em-row">
              <label class="em-lbl">Lebar <input v-model.number="draft.w" type="number" min="60" max="300" class="em-num" /></label>
              <label class="em-lbl em-right">Tinggi <input v-model.number="draft.h" type="number" min="60" max="400" class="em-num" :disabled="draft.shape === 'circle'" /></label>
            </div>
            <div class="em-row">
              <button type="button" class="em-media" @click="pickMedia('frame')"><UIcon name="i-lucide-frame" /> {{ draft.frameUrl ? "Ganti Bingkai Ornamen" : "Bingkai Ornamen (Media)" }}</button>
              <button v-if="draft.frameUrl" type="button" class="em-tog" title="Hapus bingkai ornamen" @click="draft.frameUrl = ''"><UIcon name="i-lucide-x" /></button>
            </div>
          </template>

          <!-- TOMBOL -->
          <template v-else-if="editingType === 'button'">
            <input v-model="draft.label" class="em-input" placeholder="Teks tombol" maxlength="40" />
            <select v-model="draft.action" class="em-select"><option v-for="a in BTN_ACTIONS" :key="a.value" :value="a.value">{{ a.label }}</option></select>
            <input v-if="draft.action === 'link'" v-model="draft.url" type="url" class="em-input" placeholder="https://maps.app.goo.gl/…" />
            <input v-if="draft.action === 'wa'" v-model="draft.url" type="tel" class="em-input" placeholder="Nomor WhatsApp, mis. 0812xxxx" />
            <div class="em-row">
              <label class="em-lbl">Warna tombol <input v-model="draft.bg" type="color" class="em-color" /></label>
              <label class="em-lbl em-right">Warna teks <input v-model="draft.color" type="color" class="em-color" /></label>
            </div>
            <div class="em-row">
              <select v-model="draft.font" class="em-select"><option v-for="f in PAGE_FONTS" :key="f.value" :value="f.value">{{ f.label }}</option></select>
              <label class="em-lbl em-right">Ukuran <input v-model.number="draft.size" type="number" min="10" max="30" class="em-num" /></label>
            </div>
          </template>

          <!-- DEKORASI -->
          <template v-else>
            <div class="em-row">
              <button type="button" class="em-media" @click="pickMedia('src')"><UIcon name="i-lucide-images" /> {{ draft.src ? "Ganti Gambar" : "Pilih dari Media" }}</button>
              <img v-if="draft.src" :src="safeUrl(draft.src)" class="em-thumb" alt="" />
            </div>
            <p class="em-hint">Dekorasi selalu berada di belakang teks, foto, dan tombol. Di desktop, dekorasi bisa digeser langsung di kanvas.</p>
            <div class="em-row">
              <label class="em-lbl">Dari
                <select v-model="draft.lh" class="em-select"><option value="left">Kiri</option><option value="center">Tengah</option><option value="right">Kanan</option></select>
              </label>
              <label class="em-lbl em-right">
                <select v-model="draft.lv" class="em-select"><option value="top">Atas</option><option value="bottom">Bawah</option></select>
              </label>
            </div>
            <div class="em-row">
              <label class="em-lbl">X % <input v-model.number="draft.x" type="number" step="1" class="em-num" /></label>
              <label class="em-lbl em-right">Y % <input v-model.number="draft.y" type="number" step="1" class="em-num" /></label>
            </div>
            <div class="em-row">
              <label class="em-lbl">Lebar % <input v-model.number="draft.lw" type="number" min="5" max="200" class="em-num" /></label>
              <label class="em-lbl em-right">Putar ° <input v-model.number="draft.rot" type="number" min="-180" max="180" class="em-num" /></label>
            </div>
            <div class="em-row">
              <button type="button" class="em-tog wide" :class="{ on: draft.flip }" @click="draft.flip = !draft.flip">Balik</button>
            </div>
            <label class="em-lbl">Gerak
              <select v-model="draft.loop" class="em-select"><option v-for="l in LOOPS" :key="l.value" :value="l.value">{{ l.label }}</option></select>
            </label>
          </template>

          <!-- ANIMASI MASUK + URUTAN (semua elemen) -->
          <div class="em-sep" />
          <div class="em-row">
            <label class="em-lbl">Animasi
              <select v-model="draft.anim" class="em-select"><option v-for="a in ENTRANCES" :key="a.value" :value="a.value">{{ a.label }}</option></select>
            </label>
            <label class="em-lbl em-right">Delay <input v-model.number="draft.delay" type="number" min="0" max="10" step="0.1" class="em-num" /> dtk</label>
          </div>
          <div class="em-row">
            <label class="em-lbl">Durasi <input v-model.number="draft.dur" type="number" min="0.2" max="5" step="0.1" class="em-num" /> dtk</label>
            <span class="em-right em-demo"><span :key="demoKey" class="em-demo-box" :class="demoCls" :style="{ '--animate-duration': (draft.dur || 1) + 's' }">Contoh</span><button type="button" class="em-tog" title="Putar animasi" @click="demoKey++"><UIcon name="i-lucide-play" /></button></span>
          </div>
          <div v-if="editingType !== 'layer'" class="em-row">
            <label class="em-lbl">Jarak atas <input v-model.number="draft.mt" type="number" min="0" max="300" class="em-num" /> px</label>
            <span class="em-right em-move">
              <button type="button" class="em-tog" title="Naikkan" @click="moveEl(-1)"><UIcon name="i-lucide-arrow-up" /></button>
              <button type="button" class="em-tog" title="Turunkan" @click="moveEl(1)"><UIcon name="i-lucide-arrow-down" /></button>
            </span>
          </div>
          </template>

          <!-- ANIMASI (animate.css) untuk mode user & RSVP -->
          <template v-if="editingType === 'rsvp' || !designer">
            <div class="em-sep" />
            <div class="em-row">
              <label class="em-lbl">Animasi
                <select v-model="draft.anim" class="em-select"><option v-for="a in ENTRANCES" :key="a.value" :value="a.value">{{ a.label }}</option></select>
              </label>
              <label class="em-lbl em-right">Delay <input v-model.number="draft.delay" type="number" min="0" max="10" step="0.1" class="em-num" /> dtk</label>
            </div>
            <div class="em-row">
              <label class="em-lbl">Durasi <input v-model.number="draft.dur" type="number" min="0.2" max="5" step="0.1" class="em-num" /> dtk</label>
              <span class="em-right em-demo"><span :key="demoKey" class="em-demo-box" :class="demoCls" :style="{ '--animate-duration': (draft.dur || 1) + 's' }">Contoh</span><button type="button" class="em-tog" title="Putar animasi" @click="demoKey++"><UIcon name="i-lucide-play" /></button></span>
            </div>
          </template>
        </div>
      </template>
      <template #footer>
        <div class="em-foot">
          <button v-if="designer" type="button" class="em-del" @click="del">Delete Element</button>
          <button v-else type="button" class="em-del" @click="modalOpen = false">{{ editLocked ? "Tutup" : "Batal" }}</button>
          <button v-if="designer || !editLocked" type="button" class="em-save" @click="save">Simpan</button>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.pe-root { display: flex; flex-direction: column; gap: 10px; margin: 4px 0 0; width: 100%; }
.pe-item { border-radius: 12px; transition: box-shadow .15s; }
.pe-item.over { box-shadow: 0 -3px 0 #0d9488; }
.pe-row { margin: 0 12px; display: flex; align-items: center; gap: 12px; background: #fff; border-radius: 12px; padding: 10px 12px; box-shadow: 0 1px 6px rgba(26, 46, 69, .1); }
.pe-row[draggable="true"] { cursor: grab; }
.pe-handle { color: #f97316; font-size: 20px; display: inline-flex; flex-shrink: 0; }
.pe-handle.off { color: #64748b; }
.pe-rname { flex: 1; min-width: 0; font-size: 14px; color: #1a2e45; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pe-tog { position: relative; width: 44px; height: 26px; border-radius: 999px; background: #94a3b8; flex-shrink: 0; transition: background .15s; }
.pe-tog span { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 999px; background: #fff; transition: transform .15s; }
.pe-tog.on { background: #0d9488; }
.pe-tog.on span { transform: translateX(18px); }
.pe-music { margin: 0 12px; display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 12px; padding: 8px 12px; box-shadow: 0 1px 6px rgba(26, 46, 69, .1); }
.pe-music-ico { color: #b76b78; flex-shrink: 0; }
.pe-music-name { flex: 1; min-width: 0; font-size: 13px; color: #1a2e45; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pe-edit { height: 34px; min-width: 58px; padding: 0 12px; border-radius: 8px; background: #cbd1d9; color: #1a2e45; font-size: 14px; flex-shrink: 0; }
.pe-edit.on { box-shadow: 0 0 0 2px #aab3be; }

.pe-open { background: #f4f4f5; padding: 12px 0 14px; margin-top: -4px; }
.pe-toolbar { display: flex; align-items: center; gap: 8px; margin: 0 12px 12px; }
.pe-ico { width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #cbd5e1; border-radius: 10px; color: #1a2e45; background: #fff; flex-shrink: 0; cursor: pointer; font-size: 18px; }
.pe-ico.on { background: #e6f4f1; border-color: #0d9488; color: #0d9488; }
.pe-ico:disabled { opacity: .35; }
.pe-name { flex: 1; min-width: 0; height: 38px; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0 12px; font-size: 14px; color: #1a2e45; background: #fff; }
.pe-stage-area { display: flex; justify-content: center; padding: 0 12px; width: 100%; box-sizing: border-box; }
.pe-stage-wrap { position: relative; overflow: hidden; border-radius: 22px; }
.pe-bar { display: flex; align-items: center; gap: 8px; padding: 12px 12px 0; overflow-x: auto; }
.pe-bar2 { padding-top: 8px; }
.pe-btn { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 12px; border-radius: 8px; background: #0d9488; color: #fff; font-size: 13px; font-weight: 600; flex-shrink: 0; white-space: nowrap; }
.pe-btn.ghost { background: #fff; color: #1a2e45; border: 1px solid #cbd5e1; }
.pe-clr { display: inline-flex; align-items: center; gap: 4px; color: #1a2e45; flex-shrink: 0; }
.pe-clr input[type="color"] { width: 32px; height: 32px; padding: 0; border: 1px solid #cbd5e1; border-radius: 8px; background: none; cursor: pointer; }
.pe-range { width: 84px; accent-color: #0d9488; }
.pe-addpage { margin: 0 12px; display: flex; align-items: center; justify-content: center; gap: 6px; height: 42px; border: 1px dashed #94a3b8; border-radius: 12px; color: #1a2e45; font-size: 14px; background: #fff; }

/* modal */
.em-body { display: flex; flex-direction: column; gap: 14px; padding: 4px 2px; color: #1a2e45; }
.em-text { width: 100%; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; font-size: 14px; line-height: 1.5; resize: vertical; color: #1a2e45; background: #fff; }
.em-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.em-tog { min-width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #cbd5e1; border-radius: 8px; color: #1a2e45; background: #fff; flex-shrink: 0; font-size: 13px; }
.em-tog.wide { flex: 1; padding: 0 10px; }
.em-tog.on { background: #0d9488; border-color: #0d9488; color: #fff; }
.em-select { flex: 1; min-width: 0; height: 36px; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0 10px; font-size: 14px; background: #fff; color: #1a2e45; }
.em-input { width: 100%; height: 38px; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0 12px; font-size: 14px; background: #fff; color: #1a2e45; }
.em-media { display: inline-flex; align-items: center; gap: 6px; height: 38px; padding: 0 14px; border-radius: 10px; background: #0d9488; color: #fff; font-size: 13px; font-weight: 600; flex-shrink: 0; }
.em-thumb { width: 44px; height: 44px; object-fit: contain; border-radius: 8px; border: 1px solid #cbd5e1; background: repeating-conic-gradient(#eef0f3 0% 25%, #fff 0% 50%) 50% / 10px 10px; }
.em-hint { font-size: 12px; color: #64748b; margin: -6px 0 0; }
.em-demo { display: inline-flex; align-items: center; gap: 8px; }
.em-demo-box { display: inline-block; font-size: 12px; font-weight: 600; color: #fff; background: #b76b78; border-radius: 999px; padding: 6px 12px; }
.em-sep { height: 1px; background: #e2e8f0; }
.em-lbl { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.em-right { margin-left: auto; }
.em-color { width: 28px; height: 28px; padding: 0; border: 1px solid #cbd5e1; border-radius: 999px; background: none; cursor: pointer; }
.em-num { width: 72px; height: 34px; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0 8px; font-size: 14px; color: #1a2e45; background: #fff; }
.em-move { display: inline-flex; gap: 6px; }
.em-foot { display: flex; align-items: center; justify-content: flex-end; gap: 10px; width: 100%; }
.em-del { height: 40px; padding: 0 16px; border-radius: 10px; background: #cbd5e1; color: #1a2e45; font-weight: 600; font-size: 14px; }
.em-save { height: 40px; padding: 0 20px; border-radius: 10px; background: #0d9488; color: #fff; font-weight: 700; font-size: 14px; }
</style>
