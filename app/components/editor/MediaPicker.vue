<script setup>
// components/editor/MediaPicker.vue
// Semua foto di editor halaman WAJIB lewat Media: upload dulu ke Media (Gallery), lalu pilih. Tidak ada tempel-URL.
// Memakai mediaGallery & asset admin yang sama dengan editor lain.
import { ref, computed, watch } from "vue";
import { supabase } from "~/lib/supabase";
import { useUndanganStore } from "~/stores/useUndanganStore";
import { useAssetStore } from "@/stores/useAssetStore";

const open = defineModel("open", { type: Boolean, default: false });
const emit = defineEmits(["select"]);

const store = useUndanganStore();
const assetStore = useAssetStore();

const tab = ref("gallery");
const selected = ref("");
const search = ref("");
const uploading = ref(false);
const err = ref("");

const gallery = computed(() => store.undangan.mediaGallery || []);
const assets = computed(() =>
  (assetStore.fotoAsset || []).map((f) => ({ url: f.url, name: f.nama, kategori: f.kategori }))
);
const filteredAssets = computed(() => {
  const q = search.value.toLowerCase().trim();
  return q ? assets.value.filter((f) => (f.name || "").toLowerCase().includes(q) || (f.kategori || "").toLowerCase().includes(q)) : assets.value;
});

watch(open, async (v) => {
  if (!v) return;
  tab.value = "gallery";
  selected.value = "";
  err.value = "";
  if (!assets.value.length) { try { await assetStore.loadAssets(); } catch { /* abaikan */ } }
});

const ALLOWED = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
const MAX_MB = 5;
// Upload → masuk Media (mediaGallery) dulu → langsung terpilih
async function onUpload(e) {
  err.value = "";
  const files = Array.from(e.target.files || []);
  e.target.value = "";
  for (const f of files) {
    if (!ALLOWED[f.type]) { err.value = "Format tidak didukung — hanya PNG, JPG, WEBP."; return; }
    if (f.size > MAX_MB * 1024 * 1024) { err.value = `File terlalu besar — maks ${MAX_MB} MB.`; return; }
  }
  uploading.value = true;
  try {
    for (const f of files) {
      const path = `undangan/${Date.now()}_${Math.random().toString(36).slice(2)}.${ALLOWED[f.type]}`;
      const { error } = await supabase.storage.from("foto-assets").upload(path, f, { upsert: false });
      if (error) { err.value = "Upload gagal, coba lagi."; continue; }
      const url = supabase.storage.from("foto-assets").getPublicUrl(path).data.publicUrl;
      store.undangan.mediaGallery = [{ url, name: f.name }, ...(store.undangan.mediaGallery || [])];
      selected.value = url;
    }
  } catch {
    err.value = "Terjadi kesalahan saat upload.";
  } finally {
    uploading.value = false;
  }
}
function confirm() {
  if (!selected.value) return;
  emit("select", selected.value);
  open.value = false;
}
const modalUi = {
  content: "w-[calc(100vw-32px)] max-w-[450px] mx-auto my-auto max-h-[85vh] rounded-2xl !bg-white !text-slate-900 ring-1 ring-slate-200",
  title: "!text-[#1a2e45] dark:!text-[#1a2e45]"
};
</script>

<template>
  <UModal v-model:open="open" title="Pilih Media" :ui="modalUi">
    <template #body>
      <div class="mp-body">
        <div class="mp-tabs">
          <button type="button" :class="{ on: tab === 'gallery' }" @click="tab = 'gallery'">Gallery</button>
          <button type="button" :class="{ on: tab === 'assets' }" @click="tab = 'assets'">Assets</button>
        </div>

        <div v-if="tab === 'gallery'" class="mp-grid">
          <label class="mp-up">
            <UIcon :name="uploading ? 'i-lucide-loader' : 'i-lucide-plus-circle'" />
            <span>{{ uploading ? "Mengunggah…" : "Upload ke Media" }}</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" multiple hidden @change="onUpload" />
          </label>
          <button v-for="(m, i) in gallery" :key="m.url + i" type="button" class="mp-item" :class="{ sel: selected === m.url }" @click="selected = m.url">
            <img :src="m.url" :alt="m.name" loading="lazy" />
            <span v-if="selected === m.url" class="mp-check"><UIcon name="i-lucide-check" /></span>
          </button>
          <p v-if="!gallery.length && !uploading" class="mp-empty">Belum ada foto di Media. Upload dulu.</p>
        </div>

        <div v-else>
          <input v-model="search" class="mp-search" placeholder="Cari asset…" />
          <div class="mp-grid">
            <button v-for="(m, i) in filteredAssets" :key="m.url + i" type="button" class="mp-item" :class="{ sel: selected === m.url }" @click="selected = m.url">
              <img :src="m.url" :alt="m.name" loading="lazy" />
              <span v-if="selected === m.url" class="mp-check"><UIcon name="i-lucide-check" /></span>
            </button>
            <p v-if="!filteredAssets.length" class="mp-empty">Belum ada asset.</p>
          </div>
        </div>
        <p v-if="err" class="mp-err">{{ err }}</p>
      </div>
    </template>
    <template #footer>
      <div class="mp-foot">
        <button type="button" class="mp-cancel" @click="open = false">Batal</button>
        <button type="button" class="mp-ok" :disabled="!selected" @click="confirm">Pilih Foto</button>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.mp-body { display: flex; flex-direction: column; gap: 12px; color: #1a2e45; }
.mp-tabs { display: flex; gap: 8px; }
.mp-tabs button { flex: 1; height: 36px; border-radius: 10px; border: 1px solid #cbd5e1; background: #fff; font-size: 14px; color: #1a2e45; }
.mp-tabs button.on { background: #0d9488; border-color: #0d9488; color: #fff; font-weight: 600; }
.mp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-height: 46vh; overflow-y: auto; }
.mp-up { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border: 1.5px dashed #94a3b8; border-radius: 10px; color: #64748b; font-size: 11px; cursor: pointer; text-align: center; }
.mp-item { position: relative; aspect-ratio: 1; border-radius: 10px; overflow: hidden; border: 2px solid transparent; background: repeating-conic-gradient(#eef0f3 0% 25%, #fff 0% 50%) 50% / 14px 14px; }
.mp-item img { width: 100%; height: 100%; object-fit: contain; }
.mp-item.sel { border-color: #0d9488; }
.mp-check { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 999px; background: #0d9488; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; }
.mp-empty { grid-column: 1 / -1; text-align: center; color: #64748b; font-size: 13px; padding: 12px 0; }
.mp-search { width: 100%; height: 36px; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0 12px; font-size: 14px; margin-bottom: 8px; background: #fff; color: #1a2e45; }
.mp-err { color: #dc2626; font-size: 12px; }
.mp-foot { display: flex; justify-content: flex-end; gap: 10px; width: 100%; }
.mp-cancel { height: 40px; padding: 0 16px; border-radius: 10px; background: #cbd5e1; color: #1a2e45; font-weight: 600; font-size: 14px; }
.mp-ok { height: 40px; padding: 0 20px; border-radius: 10px; background: #0d9488; color: #fff; font-weight: 700; font-size: 14px; }
.mp-ok:disabled { opacity: .4; }
</style>
