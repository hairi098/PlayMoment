<script setup>
// components/themes/PageRsvp.vue
// Form RSVP untuk tema tipe "page". Terhubung ke sistem RSVP yang sama dengan Tema 1:
//  - kolom, label, wajib/tidak, opsi kehadiran  → store.rsvpFields
//  - kirim                                      → accountStore.submitPublicRsvp (masuk ke daftar tamu undangan)
//  - ucapan tamu yang tampil                    → store.daftarTamu
//  - hidup/mati                                 → store.rsvpAktif
// Di editor (editable) hanya contoh tampilan (tidak mengirim). Di preview tema (belum ada undangan) hanya simulasi.
import { computed, reactive, ref, watch } from "vue";
import { useUndanganStore } from "~/stores/useUndanganStore";
import { useAccountStore } from "~/stores/useAccountStore";

const props = defineProps({
  el: { type: Object, required: true },
  editable: { type: Boolean, default: false },
  guest: { type: String, default: "" }
});

const store = useUndanganStore();
const accountStore = useAccountStore();

const KEYS = ["nama", "grup", "whatsapp", "kehadiran", "jumlah", "ucapan"];
const FALLBACK = {
  nama: { label: "Nama", placeholder: "Masukkan nama lengkap Anda", required: true },
  grup: { label: "Grup", placeholder: "Contoh: Keluarga, Teman", required: false },
  whatsapp: { label: "No WhatsApp", placeholder: "Contoh: 08123456789", required: false },
  kehadiran: { label: "Kehadiran", placeholder: "", required: true, options: ["Hadir", "Tidak Hadir", "Mungkin Hadir"] },
  jumlah: { label: "Jumlah Tamu", placeholder: "", required: false },
  ucapan: { label: "Ucapan", placeholder: "Tulis doa dan ucapan Anda...", required: false }
};

const fields = computed(() =>
  KEYS.map((k) => {
    const f = (store.rsvpFields || []).find((x) => x.key === k) || {};
    const d = FALLBACK[k];
    return {
      key: k,
      active: f.active ?? true,
      label: f.label || d.label,
      placeholder: f.placeholder ?? d.placeholder,
      required: f.required ?? d.required,
      readOnly: !!f.readOnly,
      options: f.options?.length ? f.options : d.options,
      max: Number(f.maxTamu) || 10,
      def: f.defaultValue ?? ""
    };
  }).filter((f) => f.active)
);

const form = reactive({ nama: "", grup: "", whatsapp: "", kehadiran: "", jumlah: "", ucapan: "" });
function resetForm() {
  const byKey = Object.fromEntries(fields.value.map((f) => [f.key, f]));
  Object.assign(form, {
    nama: props.guest && props.guest !== "Nama Tamu" ? props.guest : "", // nama tamu dari link → terisi otomatis
    grup: "",
    whatsapp: "",
    kehadiran: byKey.kehadiran?.def || "",
    jumlah: byKey.jumlah?.def || "",
    ucapan: ""
  });
}
resetForm();
watch(() => props.guest, (g) => { if (!form.nama && g && g !== "Nama Tamu") form.nama = g; });

const error = ref("");
const busy = ref(false);
const done = ref(false);
const demoWishes = ref([
  { nama: "Keluarga Besar", ucapan: "Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah, mawaddah, warahmah.", status: "Hadir" },
  { nama: "Sahabat Kampus", ucapan: "Bahagia selalu untuk kalian berdua!", status: "Hadir" }
]);

async function submit() {
  error.value = "";
  if (props.editable || busy.value) return;
  const missing = fields.value.find((f) => f.required && !String(form[f.key] ?? "").trim());
  if (missing) { error.value = `${missing.label} wajib diisi.`; return; }
  busy.value = true;
  try {
    if (store.editorId) {
      const res = await accountStore.submitPublicRsvp(store.editorId, {
        name: form.nama,
        grup: form.grup,
        phone: form.whatsapp,
        jumlah: form.jumlah,
        attendance: form.kehadiran,
        comment: form.ucapan
      });
      if (!res?.ok) throw new Error(res?.message || "gagal");
    } else {
      // preview tema (belum ada undangan): simulasi saja
      if (form.ucapan.trim()) demoWishes.value.unshift({ nama: form.nama || "Tamu", ucapan: form.ucapan, status: form.kehadiran || "Hadir" });
    }
    done.value = true;
    resetForm();
    setTimeout(() => { done.value = false; }, 5000);
  } catch (e) {
    console.error("RSVP gagal:", e);
    error.value = "Maaf, RSVP belum terkirim. Silakan coba lagi.";
  } finally {
    busy.value = false;
  }
}

const wishes = computed(() => {
  if (!store.editorId) return demoWishes.value;
  return (store.daftarTamu || [])
    .filter((t) => String(t.ucapan || "").trim())
    .slice()
    .reverse()
    .slice(0, 30)
    .map((t) => ({ nama: t.nama, ucapan: t.ucapan, status: t.hadir === true ? "Hadir" : t.hadir === false ? "Tidak Hadir" : "" }));
});

const show = computed(() => props.editable || store.rsvpAktif !== false);
const rootStyle = computed(() => ({ fontFamily: props.el.font, color: props.el.color || "#4a3a3a", "--pr-accent": props.el.bg || "#b76b78" }));
</script>

<template>
  <div v-if="show" class="pr-root" :class="{ editable }" :style="rootStyle">
    <form class="pr-card" novalidate @submit.prevent="submit">
      <template v-for="f in fields" :key="f.key">
        <label class="pr-field">
          <span class="pr-label">{{ f.label }}<b v-if="f.required"> *</b></span>
          <input v-if="f.key === 'nama'" v-model="form.nama" class="pr-input" type="text" :placeholder="f.placeholder" :readonly="f.readOnly" autocomplete="name" />
          <input v-else-if="f.key === 'grup'" v-model="form.grup" class="pr-input" type="text" :placeholder="f.placeholder" :readonly="f.readOnly" />
          <input v-else-if="f.key === 'whatsapp'" v-model="form.whatsapp" class="pr-input" type="tel" inputmode="tel" :placeholder="f.placeholder" :readonly="f.readOnly" autocomplete="tel" />
          <select v-else-if="f.key === 'kehadiran'" v-model="form.kehadiran" class="pr-input" :disabled="f.readOnly">
            <option value="" disabled>Pilih kehadiran</option>
            <option v-for="o in f.options" :key="o" :value="o">{{ o }}</option>
          </select>
          <select v-else-if="f.key === 'jumlah'" v-model="form.jumlah" class="pr-input" :disabled="f.readOnly">
            <option value="" disabled>Pilih jumlah</option>
            <option v-for="n in f.max" :key="n" :value="String(n)">{{ n }} orang</option>
          </select>
          <textarea v-else v-model="form.ucapan" class="pr-input pr-area" rows="3" :placeholder="f.placeholder" :readonly="f.readOnly" />
        </label>
      </template>

      <p v-if="error" class="pr-msg pr-err" role="alert">{{ error }}</p>
      <p v-if="done" class="pr-msg pr-ok" role="status">{{ el.doneText || "Terima kasih! Konfirmasi Anda sudah kami terima." }}</p>

      <button type="submit" class="pr-btn" :disabled="busy">{{ busy ? "Mengirim…" : el.label || "Kirim RSVP" }}</button>
    </form>

    <div v-if="el.showWishes !== false && wishes.length" class="pr-wishes">
      <div class="pr-wtitle">Ucapan &amp; Doa</div>
      <div class="pr-wlist">
        <div v-for="(w, i) in wishes" :key="i" class="pr-wish">
          <div class="pr-whead">
            <span class="pr-wname">{{ w.nama }}</span>
            <span v-if="w.status" class="pr-chip" :class="{ no: w.status !== 'Hadir' }">{{ w.status }}</span>
          </div>
          <div class="pr-wtext">{{ w.ucapan }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pr-root { width: 100%; text-align: left; }
.pr-root.editable { pointer-events: none; } /* di editor, klik diteruskan ke pembungkus (buka pengaturan) */
.pr-card { background: rgba(255, 255, 255, 0.78); border: 1px solid color-mix(in srgb, var(--pr-accent) 35%, transparent); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 10px; backdrop-filter: blur(2px); }
.pr-field { display: flex; flex-direction: column; gap: 4px; }
.pr-label { font-size: 12px; font-weight: 600; letter-spacing: 0.02em; }
.pr-label b { color: var(--pr-accent); }
/* 16px supaya iOS tidak memperbesar halaman saat kolom difokus */
.pr-input { width: 100%; box-sizing: border-box; font: inherit; font-size: 16px; color: inherit; background: #fff; border: 1px solid rgba(0, 0, 0, 0.14); border-radius: 10px; padding: 9px 12px; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
.pr-input:focus { border-color: var(--pr-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--pr-accent) 22%, transparent); }
.pr-area { resize: none; }
.pr-btn { margin-top: 4px; font: inherit; font-size: 15px; font-weight: 600; color: #fff; background: var(--pr-accent); border: none; border-radius: 999px; padding: 11px 20px; cursor: pointer; transition: transform 0.12s, opacity 0.15s; }
.pr-btn:active { transform: scale(0.98); }
.pr-btn:disabled { opacity: 0.6; cursor: default; }
.pr-msg { margin: 0; font-size: 13px; line-height: 1.4; border-radius: 8px; padding: 8px 10px; }
.pr-err { background: #fdecec; color: #a12a2a; }
.pr-ok { background: #e8f6ee; color: #1f6b3e; }
.pr-wishes { margin-top: 16px; }
.pr-wtitle { font-size: 14px; font-weight: 700; text-align: center; margin-bottom: 8px; }
.pr-wlist { max-height: 230px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 2px; scrollbar-width: thin; }
.pr-wish { background: rgba(255, 255, 255, 0.7); border-radius: 12px; padding: 10px 12px; }
.pr-whead { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.pr-wname { font-size: 13px; font-weight: 700; }
.pr-chip { font-size: 10px; font-weight: 700; color: #1f6b3e; background: #e8f6ee; border-radius: 999px; padding: 2px 8px; white-space: nowrap; }
.pr-chip.no { color: #8a4b12; background: #fbeedd; }
.pr-wtext { font-size: 13px; line-height: 1.45; margin-top: 4px; white-space: pre-wrap; word-break: break-word; }
</style>
