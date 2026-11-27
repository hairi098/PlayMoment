<script setup>
// components/editor/PageEditor.vue
// Editor "tipe halaman" (Tema 2) — tampilan daftar halaman ala Satu Momen:
//  baris halaman (drag, toggle tampil, tombol Edit) → klik Edit membuka toolbar + kanvas halaman.
//  Klik teks / foto di kanvas → modal edit.
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useElementSize, useWindowSize } from "@vueuse/core";
import { supabase } from "~/lib/supabase";
import { usePageEditor } from "~/composables/usePageEditor";
import { PAGE_STAGE, PAGE_FONTS, PAGE_FONT_URL, IMAGE_SHAPES, safeUrl } from "~/utils/page-defaults";

useHead({ link: [{ rel: "stylesheet", href: PAGE_FONT_URL }] });

const {
  pages, ensurePages, addPage, duplicatePage, removePage, renamePage, setPageBg,
  setPagePanel, setPageVisible, reorderPage,
  addElement, addImage, updateElement, removeElement, moveElement
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

// ── skala kanvas ──
const rootRef = ref(null);
const { width: rootW } = useElementSize(rootRef);
const { width: winW, height: winH } = useWindowSize();
// Kanvas penuh lebar (tanpa space kiri-kanan); tinggi ala layar mobile, tidak terlalu tinggi.
const scale = computed(() => (rootW.value ? rootW.value / PAGE_STAGE.width : 1));
// Proporsi = layar HP (tinggi/lebar viewport, dibatasi 1.6–2.1) supaya sama dengan yang dilihat tamu.
// Ubah angka 1.6 / 2.1 untuk atur batas tinggi.
const phoneRatio = computed(() => Math.min(2.1, Math.max(1.6, winH.value / (winW.value || 1))));
const stageH = computed(() => (rootW.value * phoneRatio.value) / scale.value);
const stageHpx = computed(() => stageH.value * scale.value);

// ── drag & drop urutan halaman ──
const dragFrom = ref(-1);
const dragOver = ref(-1);
function onDragStart(i, e) { dragFrom.value = i; e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", String(i)); }
function onDrop(i) {
  if (dragFrom.value >= 0) reorderPage(dragFrom.value, i);
  dragFrom.value = -1; dragOver.value = -1;
}

// ── upload foto ke Supabase Storage (bucket yang sama dengan editor lain) ──
const ALLOWED = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
const MAX_MB = 5;
const uploading = ref(false);
const errMsg = ref("");
async function uploadImage(file) {
  errMsg.value = "";
  if (!file) return "";
  const ext = ALLOWED[file.type];
  if (!ext) { errMsg.value = "Format tidak didukung — hanya PNG, JPG, WEBP."; return ""; }
  if (file.size > MAX_MB * 1024 * 1024) { errMsg.value = `File terlalu besar — maks ${MAX_MB} MB.`; return ""; }
  uploading.value = true;
  try {
    const name = `undangan/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("foto-assets").upload(name, file, { upsert: false });
    if (error) { errMsg.value = "Upload gagal, coba lagi."; return ""; }
    return supabase.storage.from("foto-assets").getPublicUrl(name).data.publicUrl;
  } catch {
    errMsg.value = "Terjadi kesalahan saat upload.";
    return "";
  } finally {
    uploading.value = false;
  }
}
async function onBgFile(e) {
  const f = e.target.files?.[0];
  e.target.value = "";
  const url = await uploadImage(f);
  if (url) setPageBg(current.value, { image: url });
}
async function onImgFile(e) {
  const f = e.target.files?.[0];
  e.target.value = "";
  const url = await uploadImage(f);
  if (url) draft.src = url;
}

// ── modal edit elemen (teks / foto) ──
const modalOpen = ref(false);
const editingId = ref(null);
const editingType = ref("text");
const draft = reactive({
  text: "", font: PAGE_FONTS[3].value, size: 16, color: "#000000", bold: false, italic: false, align: "center", mt: 0,
  src: "", shape: "oval", w: 190, h: 250, frame: "ornate", frameUrl: ""
});

function openEdit(id) {
  const el = page.value?.elements.find((e) => e.id === id);
  if (!el) return;
  errMsg.value = "";
  editingId.value = id;
  editingType.value = el.type === "image" ? "image" : "text";
  if (el.type === "image") {
    Object.assign(draft, { src: el.src || "", shape: el.shape || "oval", w: el.w || 190, h: el.h || 250, frame: el.frame || "ornate", frameUrl: el.frameUrl || "", mt: el.mt || 0 });
  } else {
    Object.assign(draft, {
      text: el.text, font: el.font, size: el.size, color: el.color,
      bold: !!el.bold, italic: !!el.italic, align: el.align || "center", mt: el.mt || 0
    });
  }
  modalOpen.value = true;
}
function onAddText() { const id = addElement(current.value); if (id) openEdit(id); }
function onAddImage() { const id = addImage(current.value); if (id) openEdit(id); }
const clamp = (v, a, b, d) => Math.min(b, Math.max(a, Number(v) || d));
function save() {
  const mt = clamp(draft.mt, 0, 200, 0);
  if (editingType.value === "image") {
    updateElement(current.value, editingId.value, {
      src: safeUrl(draft.src), shape: draft.shape, w: clamp(draft.w, 60, 300, 190), h: clamp(draft.h, 60, 400, 250),
      frame: draft.frame, frameUrl: safeUrl(draft.frameUrl), mt
    });
  } else {
    updateElement(current.value, editingId.value, {
      text: draft.text, font: draft.font, size: clamp(draft.size, 8, 120, 16), color: draft.color,
      bold: draft.bold, italic: draft.italic, align: draft.align, mt
    });
  }
  modalOpen.value = false;
}
function del() { removeElement(current.value, editingId.value); modalOpen.value = false; }
function moveEl(dir) { moveElement(current.value, editingId.value, dir); }

const aligns = [
  { v: "left", icon: "i-lucide-align-left" },
  { v: "center", icon: "i-lucide-align-center" },
  { v: "right", icon: "i-lucide-align-right" }
];
const modalUi = {
  content: "w-[calc(100vw-32px)] max-w-[450px] mx-auto my-auto max-h-[85vh] rounded-2xl !bg-white !text-slate-900 ring-1 ring-slate-200",
  title: "!text-[#1a2e45] dark:!text-[#1a2e45]"
};

// ── aksi halaman ──
function onAdd() { openId.value = pages.value[addPage(current.value >= 0 ? current.value : null)]?.id ?? openId.value; }
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
    <div
      v-for="(p, i) in pages"
      :key="p.id"
      class="pe-item"
      :class="{ over: dragOver === i && dragFrom !== i }"
      @dragover.prevent="dragOver = i"
      @drop.prevent="onDrop(i)"
    >
      <!-- BARIS HALAMAN -->
      <div class="pe-row" draggable="true" @dragstart="onDragStart(i, $event)" @dragend="dragFrom = -1; dragOver = -1">
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
        <div class="pe-toolbar">
          <button
            type="button"
            class="pe-ico"
            :class="{ on: p.panel?.shape === 'arch' }"
            title="Panel lengkung"
            @click="togglePanel"
          ><UIcon name="i-lucide-panel-top" /></button>
          <input class="pe-name" :value="p.name" maxlength="30" placeholder="Nama halaman" @input="renamePage(i, $event.target.value)" />
          <label class="pe-ico" :class="{ on: !!p.bg?.image }" title="Gambar latar">
            <UIcon :name="uploading ? 'i-lucide-loader' : 'i-lucide-image'" />
            <input type="file" accept="image/png,image/jpeg,image/webp" hidden @change="onBgFile" />
          </label>
          <button type="button" class="pe-ico" title="Duplikat halaman" @click="onDup"><UIcon name="i-lucide-copy" /></button>
          <button type="button" class="pe-ico danger" title="Hapus halaman" :disabled="pages.length <= 1" @click="onDel"><UIcon name="i-lucide-trash-2" /></button>
        </div>

        <div class="pe-stage-area">
          <div class="pe-stage-wrap" :style="{ width: rootW + 'px', height: stageHpx + 'px' }">
            <PageStage :page="p" :scale="scale" :height="stageH" editable @edit="openEdit" />
          </div>
        </div>

        <div class="pe-bar">
          <button type="button" class="pe-btn" @click="onAddText"><UIcon name="i-lucide-type" /> Teks</button>
          <button type="button" class="pe-btn" @click="onAddImage"><UIcon name="i-lucide-image-plus" /> Foto</button>
          <label class="pe-clr" title="Warna latar">
            <UIcon name="i-lucide-paint-bucket" />
            <input type="color" :value="p.bg?.color || '#ffffff'" @input="setPageBg(i, { color: $event.target.value })" />
          </label>
          <label v-if="p.panel?.shape === 'arch'" class="pe-clr" title="Warna panel">
            <UIcon name="i-lucide-panel-top" />
            <input type="color" :value="p.panel?.color || '#ffffff'" @input="setPagePanel(i, { color: $event.target.value })" />
          </label>
          <button v-if="p.bg?.image" type="button" class="pe-btn ghost" @click="setPageBg(i, { image: '' })"><UIcon name="i-lucide-x" /> Latar</button>
        </div>
        <p v-if="errMsg && !modalOpen" class="pe-err">{{ errMsg }}</p>
      </div>
    </div>

    <button type="button" class="pe-addpage" @click="onAdd"><UIcon name="i-lucide-plus" /> Tambah Halaman</button>

    <!-- MODAL -->
    <UModal v-model:open="modalOpen" :title="editingType === 'image' ? 'Edit Foto' : 'Edit Text'" :ui="modalUi">
      <template #body>
        <div v-if="editingType === 'text'" class="em-body">
          <textarea v-model="draft.text" class="em-text" rows="5" placeholder="Ketik teks…" />
          <div class="em-row">
            <button type="button" class="em-tog" :class="{ on: draft.italic }" style="font-style: italic" @click="draft.italic = !draft.italic">I</button>
            <button type="button" class="em-tog" :class="{ on: draft.bold }" style="font-weight: 700" @click="draft.bold = !draft.bold">B</button>
            <button v-for="a in aligns" :key="a.v" type="button" class="em-tog" :class="{ on: draft.align === a.v }" @click="draft.align = a.v">
              <UIcon :name="a.icon" />
            </button>
            <select v-model="draft.font" class="em-select">
              <option v-for="f in PAGE_FONTS" :key="f.value" :value="f.value">{{ f.label }}</option>
            </select>
          </div>
          <div class="em-row">
            <label class="em-lbl">Warna Text <input v-model="draft.color" type="color" class="em-color" /></label>
            <label class="em-lbl em-right">Ukuran <input v-model.number="draft.size" type="number" min="8" max="120" class="em-num" /> px</label>
          </div>
          <div class="em-row">
            <label class="em-lbl">Jarak atas <input v-model.number="draft.mt" type="number" min="0" max="200" class="em-num" /> px</label>
            <span class="em-right em-move">
              <button type="button" class="em-tog" title="Naikkan" @click="moveEl(-1)"><UIcon name="i-lucide-arrow-up" /></button>
              <button type="button" class="em-tog" title="Turunkan" @click="moveEl(1)"><UIcon name="i-lucide-arrow-down" /></button>
            </span>
          </div>
        </div>

        <div v-else class="em-body">
          <div class="em-row">
            <label class="em-upload">
              <UIcon :name="uploading ? 'i-lucide-loader' : 'i-lucide-upload'" /> {{ uploading ? "Mengunggah…" : "Upload Foto" }}
              <input type="file" accept="image/png,image/jpeg,image/webp" hidden @change="onImgFile" />
            </label>
            <input v-model="draft.src" type="url" class="em-input" placeholder="atau tempel URL foto (https://…)" />
          </div>
          <p v-if="errMsg" class="pe-err">{{ errMsg }}</p>
          <div class="em-row">
            <label class="em-lbl">Bentuk
              <select v-model="draft.shape" class="em-select">
                <option v-for="s in IMAGE_SHAPES" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </label>
            <label class="em-lbl em-right">Bingkai
              <select v-model="draft.frame" class="em-select">
                <option value="ornate">Emas</option>
                <option value="none">Tanpa</option>
              </select>
            </label>
          </div>
          <div class="em-row">
            <label class="em-lbl">Lebar <input v-model.number="draft.w" type="number" min="60" max="300" class="em-num" /></label>
            <label class="em-lbl em-right">Tinggi <input v-model.number="draft.h" type="number" min="60" max="400" class="em-num" :disabled="draft.shape === 'circle'" /></label>
          </div>
          <input v-model="draft.frameUrl" type="url" class="em-input" placeholder="URL PNG bingkai ornamen (opsional, transparan)" />
          <div class="em-row">
            <label class="em-lbl">Jarak atas <input v-model.number="draft.mt" type="number" min="0" max="200" class="em-num" /> px</label>
            <span class="em-right em-move">
              <button type="button" class="em-tog" title="Naikkan" @click="moveEl(-1)"><UIcon name="i-lucide-arrow-up" /></button>
              <button type="button" class="em-tog" title="Turunkan" @click="moveEl(1)"><UIcon name="i-lucide-arrow-down" /></button>
            </span>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="em-foot">
          <button type="button" class="em-del" @click="del">Delete Element</button>
          <button type="button" class="em-save" @click="save">Simpan</button>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.pe-root { display: flex; flex-direction: column; gap: 10px; margin: 4px 0 0; width: 100%; }
.pe-item { border-radius: 12px; transition: box-shadow .15s; }
.pe-item.over { box-shadow: 0 -3px 0 #0d9488; }
.pe-row { margin: 0 12px; display: flex; align-items: center; gap: 12px; background: #fff; border-radius: 12px; padding: 10px 12px; box-shadow: 0 1px 6px rgba(26, 46, 69, .1); cursor: grab; }
.pe-handle { color: #f97316; font-size: 20px; display: inline-flex; flex-shrink: 0; }
.pe-handle.off { color: #64748b; }
.pe-rname { flex: 1; min-width: 0; font-size: 14px; color: #1a2e45; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pe-tog { position: relative; width: 44px; height: 26px; border-radius: 999px; background: #94a3b8; flex-shrink: 0; transition: background .15s; }
.pe-tog span { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 999px; background: #fff; transition: transform .15s; }
.pe-tog.on { background: #0d9488; }
.pe-tog.on span { transform: translateX(18px); }
.pe-edit { height: 34px; min-width: 58px; padding: 0 12px; border-radius: 8px; background: #cbd1d9; color: #1a2e45; font-size: 14px; flex-shrink: 0; }
.pe-edit.on { box-shadow: 0 0 0 2px #aab3be; }

.pe-open { background: #f4f4f5; padding: 12px 0 14px; margin-top: -4px; }
.pe-toolbar { display: flex; align-items: center; gap: 8px; margin: 0 12px 12px; }
.pe-ico { width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #cbd5e1; border-radius: 10px; color: #1a2e45; background: #fff; flex-shrink: 0; cursor: pointer; font-size: 18px; }
.pe-ico.on { background: #e6f4f1; border-color: #0d9488; color: #0d9488; }
.pe-ico.danger { color: #1a2e45; }
.pe-ico:disabled { opacity: .35; }
.pe-name { flex: 1; min-width: 0; height: 38px; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0 12px; font-size: 14px; color: #1a2e45; background: #fff; }
.pe-stage-area { display: flex; justify-content: center; }
.pe-stage-wrap { position: relative; overflow: hidden; border-radius: 22px; }
.pe-bar { display: flex; align-items: center; gap: 8px; padding: 12px 12px 0; overflow-x: auto; }
.pe-btn { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 12px; border-radius: 8px; background: #0d9488; color: #fff; font-size: 13px; font-weight: 600; flex-shrink: 0; }
.pe-btn.ghost { background: #fff; color: #1a2e45; border: 1px solid #cbd5e1; }
.pe-clr { display: inline-flex; align-items: center; gap: 4px; color: #1a2e45; flex-shrink: 0; }
.pe-clr input { width: 32px; height: 32px; padding: 0; border: 1px solid #cbd5e1; border-radius: 8px; background: none; cursor: pointer; }
.pe-open .pe-err { margin: 6px 12px 0; }
.pe-err { color: #dc2626; font-size: 12px; margin-top: 6px; }
.pe-addpage { margin: 0 12px; display: flex; align-items: center; justify-content: center; gap: 6px; height: 42px; border: 1px dashed #94a3b8; border-radius: 12px; color: #1a2e45; font-size: 14px; background: #fff; }

/* modal */
.em-body { display: flex; flex-direction: column; gap: 14px; padding: 4px 2px; color: #1a2e45; }
.em-text { width: 100%; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; font-size: 14px; line-height: 1.5; resize: vertical; color: #1a2e45; background: #fff; }
.em-row { display: flex; align-items: center; gap: 8px; }
.em-tog { width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #cbd5e1; border-radius: 8px; color: #1a2e45; background: #fff; flex-shrink: 0; }
.em-tog.on { background: #0d9488; border-color: #0d9488; color: #fff; }
.em-select { flex: 1; min-width: 0; height: 36px; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0 10px; font-size: 14px; background: #fff; color: #1a2e45; }
.em-input { flex: 1; min-width: 0; width: 100%; height: 36px; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0 10px; font-size: 13px; background: #fff; color: #1a2e45; }
.em-upload { display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 12px; border-radius: 10px; background: #0d9488; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; flex-shrink: 0; }
.em-lbl { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.em-right { margin-left: auto; }
.em-color { width: 28px; height: 28px; padding: 0; border: 1px solid #cbd5e1; border-radius: 999px; background: none; cursor: pointer; }
.em-num { width: 72px; height: 34px; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0 8px; font-size: 14px; color: #1a2e45; background: #fff; }
.em-move { display: inline-flex; gap: 6px; }
.em-foot { display: flex; align-items: center; justify-content: flex-end; gap: 10px; width: 100%; }
.em-del { height: 40px; padding: 0 16px; border-radius: 10px; background: #cbd5e1; color: #1a2e45; font-weight: 600; font-size: 14px; }
.em-save { height: 40px; padding: 0 20px; border-radius: 10px; background: #0d9488; color: #fff; font-weight: 700; font-size: 14px; }
</style>
