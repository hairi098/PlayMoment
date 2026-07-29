<template>
  <div class="kirim-page">
    <header class="kirim-topbar">
      <button
        type="button"
        class="kirim-back"
        aria-label="Kembali"
        @click="goBack"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="m15 19-7-7 7-7" />
        </svg>
      </button>
      <h1 class="kirim-title">Kirim Undangan</h1>
      <div class="kirim-topbar-spacer" />
    </header>

    <div class="kirim-body">
      <p v-if="store.undangan.judulPengaturan || store.undangan.judul" class="kirim-subtitle">
        {{ store.undangan.judulPengaturan || store.undangan.judul }}
      </p>

      <div class="kirim-note-box">
        <p class="kirim-note-title">Catatan</p>
        <ul class="kirim-note-list">
          <li>
            Share link umum cocok untuk grup (keluarga, alumni, komunitas).
          </li>
          <li>
            Untuk tamu bernama spesifik, tambah ke daftar tamu lalu kirim via
            WhatsApp agar pesan personal.
          </li>
        </ul>
      </div>

      <!-- Link -->
      <section class="kirim-section-card">
        <p class="kirim-card-title">Link Undangan</p>
        <a :href="undanganLink" target="_blank" rel="noopener" class="kirim-link-url">
          {{ undanganLink }}
        </a>
        <input
          v-model="namaTamu"
          class="kirim-input"
          type="text"
          placeholder="Nama tamu"
        />
        <div class="kirim-link-actions">
          <button type="button" class="btn-outline" @click="shareUndangan">
            Share
          </button>
          <button type="button" class="btn-primary" @click="copyLink()">
            {{ copied ? "✓ Disalin" : "Copy Link" }}
          </button>
        </div>
      </section>

      <!-- Template -->
      <section class="kirim-section-card">
        <div class="kirim-card-head">
          <p class="kirim-card-title">Template Pesan</p>
          <button type="button" class="btn-text" @click="openTemplateModal">
            Edit Template
          </button>
        </div>
        <div class="kirim-pesan-preview" v-html="templatePreview" />
      </section>

      <!-- Stats -->
      <div class="kirim-stats-row">
        <div class="kirim-stat-card">
          <span class="kirim-stat-label">Hadir</span>
          <span class="kirim-stat-val hadir">{{ store.tamuHadir }}</span>
        </div>
        <div class="kirim-stat-card">
          <span class="kirim-stat-label">Tidak Hadir</span>
          <span class="kirim-stat-val tidak">{{ store.tamuTidakHadir }}</span>
        </div>
        <div class="kirim-stat-card">
          <span class="kirim-stat-label">Belum Konfirmasi</span>
          <span class="kirim-stat-val belum">{{ tamuBelum }}</span>
        </div>
      </div>

      <!-- Tamu actions -->
      <div class="kirim-tamu-actions">
        <input
          ref="importInput"
          type="file"
          accept=".csv,.txt"
          class="hidden-input"
          @change="handleImportFile"
        />
        <button type="button" class="btn-outline" @click="importModalOpen = true">
          Impor Excel / CSV
        </button>
        <button type="button" class="btn-primary" @click="openTamuModal">
          + Tamu
        </button>
      </div>

      <!-- Daftar tamu -->
      <section class="kirim-section-card">
        <p class="kirim-card-title">Daftar Tamu</p>

        <!-- Skeleton loading saat data belum siap -->
        <div v-if="isLoadingTamu" class="kirim-tamu-skeleton" style="min-height:180px">
          <div v-for="i in 3" :key="i" class="kirim-skeleton-row">
            <div class="ks-check"></div>
            <div class="ks-body">
              <div class="ks-line w60"></div>
              <div class="ks-line w40"></div>
            </div>
            <div class="ks-status"></div>
            <div class="ks-btns"></div>
          </div>
        </div>

        <template v-else>

        <div class="kirim-filter-row">
          <select v-model="filterStatus" class="kirim-select">
            <option value="semua">Semua status</option>
            <option value="hadir">Hadir</option>
            <option value="tidak">Tidak hadir</option>
            <option value="belum">Belum konfirmasi</option>
          </select>
          <input
            v-model="searchTamu"
            class="kirim-input kirim-search"
            type="search"
            placeholder="Cari nama / WA..."
          />
        </div>

        <div class="kirim-tamu-toolbar">
          <label class="kirim-check-all">
            <input
              type="checkbox"
              :checked="allFilteredSelected"
              @change="toggleSelectAll"
            />
            Pilih semua ({{ filteredTamu.length }})
          </label>
          <!-- Tombol Kirim WA massal disembunyikan sementara (belum ada API broadcast) -->
          <!-- <button
            type="button"
            class="btn-dark"
            :disabled="!selectedIds.length"
            @click="kirimKeTerpilih"
          >
            Kirim WA ({{ selectedIds.length }})
          </button> -->
          <button
            type="button"
            class="btn-danger"
            :disabled="!selectedIds.length"
            @click="hapusTerpilih"
          >
            Hapus
          </button>
        </div>

        <div class="kirim-tamu-list">
          <div
            v-for="tamu in showAllTamu ? filteredTamu : filteredTamu.slice(0, 10)"
            :key="tamu.id"
            class="kirim-tamu-item"
          >
            <!-- Baris utama: checkbox + info + status + tombol -->
            <div class="kirim-tamu-main">
              <label class="kirim-tamu-check">
                <input
                  type="checkbox"
                  :checked="selectedIds.includes(tamu.id)"
                  @change="toggleSelect(tamu.id)"
                />
                <div class="kirim-tamu-info">
                  <div class="kirim-tamu-row1">
                    <span class="kirim-tamu-nama">{{ tamu.nama }}</span>
                    <span v-if="tamu.whatsapp" class="kirim-tamu-wa">{{ tamu.whatsapp }}</span>
                  </div>
                  <!-- Badge jumlah & ucapan singkat -->
                  <div v-if="tamu.hadir !== null && tamu.hadir !== undefined" class="kirim-tamu-detail">
                    <span v-if="tamu.jumlah" class="kirim-detail-badge jumlah">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      {{ tamu.jumlah }} orang
                    </span>
                    <span v-if="tamu.ucapan" class="kirim-detail-ucapan">
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      {{ tamu.ucapan }}
                    </span>
                  </div>
                </div>
              </label>
              <div class="kirim-tamu-right">
                <span class="kirim-tamu-status" :class="statusClass(tamu)">
                  {{ statusLabel(tamu) }}
                </span>
                <div class="kirim-tamu-btns">
                  <!-- Preview detail (hanya kalau sudah konfirmasi) -->
                  <button
                    v-if="tamu.hadir !== null && tamu.hadir !== undefined"
                    type="button"
                    class="btn-icon preview"
                    title="Lihat Detail"
                    @click="previewTamu = tamu"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button type="button" class="btn-icon" title="Salin Link" @click="salinLinkTamu(tamu)">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                  <button type="button" class="btn-icon edit" title="Edit Tamu" @click="openEditTamu(tamu)">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button type="button" class="btn-icon" title="Kirim WA" @click="kirimKeSatu(tamu)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                  <button type="button" class="btn-icon danger" title="Hapus" @click="hapusTamu(tamu.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="filteredTamu.length === 0" class="kirim-tamu-empty">
            Belum ada tamu. Tambah manual atau impor file (format: Nama atau Nama,0812xxx per baris).
          </div>

          <!-- Tombol Lihat Semua / Sembunyikan -->
          <button
            v-if="filteredTamu.length > 10"
            type="button"
            class="btn-lihat-semua"
            @click="showAllTamu = !showAllTamu"
          >
            {{ showAllTamu ? 'Sembunyikan' : `Lihat Semua (${filteredTamu.length} tamu)` }}
          </button>
        </div>
        </template>
      </section>
    </div>

    <!-- Modal: Tambah Tamu -->
    <Transition name="modal">
      <div v-if="tamuModalOpen" class="kirim-modal-overlay" @click.self="closeTamuModal">
        <div class="kirim-modal-box">
          <div class="kirim-modal-header">
            <h2 class="kirim-modal-title">{{ editingTamuId ? 'Edit Tamu' : 'Tambah Tamu' }}</h2>
            <button type="button" class="kirim-modal-close" aria-label="Tutup" @click="closeTamuModal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="kirim-modal-body">
            <p class="kirim-modal-desc">
              Isi data tamu seperti form RSVP. Kehadiran dan jumlah tamu akan diisi tamu saat membuka undangan.
            </p>
            <div
              v-for="field in tamuFormFields"
              :key="field.key"
              class="kirim-form-field"
            >
              <label>
                {{ field.label }}
                <span v-if="field.required" class="kirim-required">*</span>
              </label>
              <input
                v-if="field.key !== 'ucapan'"
                v-model="tamuForm[field.key]"
                type="text"
                class="kirim-input kirim-input-modal"
                :placeholder="field.placeholder || field.label"
                :required="field.required"
              />
              <textarea
                v-else
                v-model="tamuForm[field.key]"
                class="kirim-textarea kirim-input-modal"
                rows="3"
                :placeholder="field.placeholder || field.label"
                :required="field.required"
              />
            </div>
            <p v-if="!tamuFormFields.length" class="kirim-modal-desc">
              Tidak ada kolom tamu aktif. Aktifkan kolom di pengaturan RSVP (kecuali kehadiran & jumlah).
            </p>
          </div>
          <div class="kirim-modal-footer">
            <button type="button" class="btn-cancel" @click="closeTamuModal">Batal</button>
            <button type="button" class="btn-primary" @click="submitTamuForm">Simpan Tamu</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal: Edit Template Pesan -->
    <Transition name="modal">
      <div v-if="templateModalOpen" class="kirim-modal-overlay" @click.self="closeTemplateModal">
        <div class="kirim-modal-box kirim-modal-wide">
          <div class="kirim-modal-header">
            <h2 class="kirim-modal-title">Edit Template Pesan</h2>
            <button type="button" class="kirim-modal-close" @click="closeTemplateModal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="kirim-modal-body">
            <p class="kirim-hint">
              Gunakan <code>{nama_tamu}</code> dan <code>{link_undangan}</code> sebagai placeholder.
            </p>
            <textarea v-model="templatePesan" class="kirim-textarea" rows="12" />
            <p class="kirim-modal-label">Preview pesan</p>
            <div class="kirim-pesan-preview" v-html="templatePreview" />
          </div>
          <div class="kirim-modal-footer">
            <button type="button" class="btn-outline" @click="resetTemplate">Reset Default</button>
            <button type="button" class="btn-cancel" @click="closeTemplateModal">Batal</button>
            <button type="button" class="btn-primary" @click="saveTemplateModal">Simpan</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal: Preview Detail Tamu -->
    <Transition name="modal">
      <div v-if="previewTamu" class="kirim-modal-overlay" @click.self="previewTamu = null">
        <div class="kirim-modal-box">
          <div class="kirim-modal-header">
            <h2 class="kirim-modal-title">Detail Tamu</h2>
            <button type="button" class="kirim-modal-close" @click="previewTamu = null">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="kirim-modal-body">
            <!-- Status badge -->
            <div class="preview-status-row">
              <span class="kirim-tamu-status" :class="statusClass(previewTamu)" style="font-size:13px;padding:5px 14px;border-radius:20px;font-weight:700">
                {{ statusLabel(previewTamu) }}
              </span>
            </div>
            <!-- Info rows -->
            <div class="preview-info-list">
              <div class="preview-info-row">
                <span class="preview-info-label">Nama</span>
                <span class="preview-info-val">{{ previewTamu.nama || '-' }}</span>
              </div>
              <div class="preview-info-row">
                <span class="preview-info-label">No WhatsApp</span>
                <span class="preview-info-val">{{ previewTamu.whatsapp || '-' }}</span>
              </div>
              <div class="preview-info-row">
                <span class="preview-info-label">Jumlah Hadir</span>
                <span class="preview-info-val">{{ previewTamu.jumlah ? previewTamu.jumlah + ' orang' : '-' }}</span>
              </div>
              <div v-if="previewTamu.ucapan" class="preview-info-row preview-info-ucapan">
                <span class="preview-info-label">Ucapan & Do'a</span>
                <p class="preview-ucapan-text">{{ previewTamu.ucapan }}</p>
              </div>
            </div>
          </div>
          <div class="kirim-modal-footer">
            <button type="button" class="btn-outline" style="flex:1" @click="kirimKeSatu(previewTamu); previewTamu = null">
              Kirim
            </button>
            <button type="button" class="btn-primary" style="flex:1" @click="previewTamu = null">Tutup</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal: Impor Excel / CSV -->
    <Transition name="modal">
      <div v-if="importModalOpen" class="kirim-modal-overlay" @click.self="importModalOpen = false">
        <div class="kirim-modal-box">
          <div class="kirim-modal-header">
            <h2 class="kirim-modal-title">Impor From Excel</h2>
            <button type="button" class="kirim-modal-close" @click="importModalOpen = false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="kirim-modal-body">
            <ul class="impor-info-list">
              <li>Import data tamu sekaligus menggunakan file Excel</li>
              <li>Ukuran file maksimal 500kb</li>
              <li>
                Format file harus sesuai: kolom <strong>nama</strong> dan <strong>whatsapp</strong>. Download sample klik
                <a href="/sample-tamu.csv" download class="impor-link">disini</a>
              </li>
              <li>Semakin banyak data, maka proses import akan semakin lama</li>
              <li>Mohon untuk tidak melakukan refresh halaman saat proses import berlangsung</li>
              <li>
                Butuh bantuan? silakan hubungi
                <a href="https://wa.me/6281234567890" target="_blank" class="impor-link-wa">Tim Support</a>
              </li>
            </ul>

            <!-- File input custom -->
            <label class="impor-upload-area" :class="{ 'has-file': importFileName }">
              <input
                ref="importInput"
                type="file"
                accept=".csv,.txt,.xlsx,.xls"
                style="display:none"
                @change="onImportFileChange"
              />
              <svg v-if="!importFileName" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#7ecec4" stroke-width="2">
                <path stroke-linecap="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span v-if="importFileName" class="impor-upload-name">📄 {{ importFileName }}</span>
              <span v-else class="impor-upload-text">Klik untuk pilih file (.xlsx atau .csv)</span>
            </label>
          </div>
          <div class="kirim-modal-footer">
            <button type="button" class="btn-cancel" style="flex:1" @click="importModalOpen = false">Close</button>
            <button type="button" class="btn-primary" style="flex:1;background:#7ecec4;color:#1a2e45;font-weight:800" @click="submitImport">Import</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="toast">
      <div v-if="toastMsg" class="kirim-toast">{{ toastMsg }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUndanganStore } from "~/stores/useUndanganStore";
import { useAccountStore } from "~/stores/useAccountStore";
import { hydrateUndanganStoreFromEditor } from "~/composables/useInvitationEditorHydration";
import { useKirimUndangan } from "~/composables/useKirimUndangan";

const route = useRoute();
const router = useRouter();
const store = useUndanganStore();
const accountStore = useAccountStore();

const editorId = computed(() => String(route.params.slug || ""));

const {
  namaTamu,
  searchTamu,
  filterStatus,
  copied,
  toastMsg,
  selectedIds,
  tamuModalOpen,
  templateModalOpen,
  tamuForm,
  tamuFormFields,
  importInput,
  undanganLink,
  templatePesan,
  templatePreview,
  filteredTamu,
  tamuBelum,
  allFilteredSelected,
  copyLink,
  shareUndangan,
  openTamuModal,
  closeTamuModal,
  openEditTamu,
  salinLinkTamu,
  submitTamuForm,
  openTemplateModal,
  closeTemplateModal,
  saveTemplateModal,
  hapusTamu,
  hapusTerpilih,
  toggleSelect,
  toggleSelectAll,
  kirimKeTerpilih,
  kirimKeSatu,
  triggerImport,
  handleImportFile,
  resetTemplate,
  statusLabel,
  statusClass,
} = useKirimUndangan();

function goBack() {
  router.push(`/edit-undangan/${editorId.value}`);
}

// ── Modal Impor
const importModalOpen = ref(false);
const importFileName = ref("");
const importFile = ref(null);
const showAllTamu = ref(false);
const isLoadingTamu = ref(true);
const previewTamu = ref(null);

function onImportFileChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > 500 * 1024) {
    alert("Ukuran file melebihi 500kb");
    e.target.value = "";
    return;
  }
  importFile.value = file;
  importFileName.value = file.name;
}

function submitImport() {
  if (!importFile.value) {
    alert("Pilih file terlebih dahulu");
    return;
  }
  // Gunakan handleImportFile dari composable dengan file yang dipilih
  const fakeEvent = { target: { files: [importFile.value], value: "" } };
  handleImportFile(fakeEvent);
  importModalOpen.value = false;
  importFileName.value = "";
  importFile.value = null;
}

onMounted(async () => {
  const id = editorId.value;
  if (id) store.editorId = id;
  await hydrateUndanganStoreFromEditor(id);

  // Reload editorData langsung dari Supabase agar daftarTamu terbaru (dari RSVP) ikut terbawa
  await accountStore.loadInvitationEditorData(id);
  const inv = accountStore.getInvitationByEditorId(id);
  if (inv?.editorData && Array.isArray(inv.editorData.daftarTamu)) {
    store.daftarTamu = inv.editorData.daftarTamu;
  }

  const domainRaw = store.undangan.domain?.trim();
  if (domainRaw && (domainRaw.includes("://") || domainRaw.includes("/"))) {
    store.undangan.domain = domainRaw
      .replace(/^https?:\/\/[^/]+\//, "")
      .replace(/^\//, "");
  }
  if (store.undangan.domain) store.slug = store.undangan.domain;

  // Simpan scroll position sebelum loading selesai, restore setelah render
  const scrollY = window.scrollY;
  _hydrated.value = true;
  isLoadingTamu.value = false;
  await nextTick();
  window.scrollTo({ top: scrollY, behavior: "instant" });
});

// Debounce timer — hindari flood Supabase setiap keystroke
let _saveTimer = null;
onUnmounted(() => clearTimeout(_saveTimer));

// Flag: jangan simpan ke DB sebelum hydration selesai
const _hydrated = ref(false);

watch(
  () => ({
    editorId: store.editorId,
    slug: store.slug,
    temaSlug: store.temaSlug,
    undangan: JSON.parse(JSON.stringify(store.undangan)),
    sectionContents: JSON.parse(JSON.stringify(store.sectionContents)),
    sectionStates: JSON.parse(JSON.stringify(store.sectionStates)),
    customColors: JSON.parse(JSON.stringify(store.customColors)),
    textColors: JSON.parse(JSON.stringify(store.textColors)),
    rsvpFields: JSON.parse(JSON.stringify(store.rsvpFields)),
    daftarTamu: JSON.parse(JSON.stringify(store.daftarTamu)),
    undanganAktif: store.undanganAktif,
    musikAktif: store.musikAktif,
    rsvpAktif: store.rsvpAktif,
    soundEffectAktif: store.soundEffectAktif,
    soundTypingAktif: store.soundTypingAktif,
    showLogoWatermark: store.showLogoWatermark,
    showMusikWatermark: store.showMusikWatermark,
  }),
  (snapshot) => {
    if (!snapshot.editorId) return;
    if (!_hydrated.value) return; // jangan simpan sebelum hydration selesai
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => {
      accountStore.saveEditorSnapshot(String(snapshot.editorId), snapshot);
    }, 1500);
  },
  { deep: true },
);
</script>

<style scoped>
.kirim-page {
  min-height: 100dvh;
  background: #f0f7f6;
  font-family: "Nunito", "Segoe UI", sans-serif;
  display: flex;
  flex-direction: column;
}

.kirim-topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 20;
}

.kirim-back {
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1a2e45;
}

.kirim-title {
  flex: 1;
  font-size: 17px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0;
  text-align: center;
}

.kirim-topbar-spacer {
  width: 40px;
}

.kirim-body {
  flex: 1;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
  padding: 16px 16px 48px;
}

.kirim-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 14px;
  font-weight: 600;
}

.kirim-note-box {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  background: #fafbfc;
  margin-bottom: 14px;
}

.kirim-note-title {
  font-size: 13px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 8px;
}

.kirim-note-list {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.55;
}

.kirim-section-card {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  background: #fff;
  margin-bottom: 12px;
}

.kirim-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.kirim-card-title {
  font-size: 14px;
  font-weight: 800;
  color: #1a2e45;
  margin: 0 0 10px;
}

.kirim-card-head .kirim-card-title {
  margin-bottom: 0;
}

.kirim-link-url {
  display: block;
  font-size: 12px;
  color: #0a7060;
  font-weight: 600;
  word-break: break-all;
  margin-bottom: 10px;
}

.kirim-input {
  width: 100%;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.kirim-link-actions,
.kirim-tamu-actions,
.kirim-template-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.btn-primary,
.btn-outline,
.btn-dark,
.btn-danger,
.btn-text {
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 16px;
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.btn-primary {
  background: #7ecec4;
  color: #1a2e45;
  flex: 1;
}

.btn-outline {
  background: #fff;
  border: 1.5px solid #7ecec4;
  color: #0a7060;
  flex: 1;
}

.btn-dark {
  background: #1a2e45;
  color: #fff;
}

.btn-dark:disabled,
.btn-danger:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-danger {
  background: #fee2e2;
  color: #dc2626;
}

.btn-text {
  background: none;
  color: #0a7060;
  padding: 4px 8px;
}

.kirim-pesan-preview {
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 10px;
  padding: 12px;
  font-size: 12px;
  color: #374151;
  line-height: 1.7;
  margin-bottom: 10px;
}

.kirim-hint {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 8px;
}

.kirim-hint code {
  background: #f3f4f6;
  padding: 1px 4px;
  border-radius: 4px;
  font-size: 11px;
}

.kirim-textarea {
  width: 100%;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
}

.kirim-stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.kirim-stat-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
  background: #fff;
}

.kirim-stat-label {
  display: block;
  font-size: 10px;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 4px;
}

.kirim-stat-val {
  font-size: 22px;
  font-weight: 900;
}

.kirim-stat-val.hadir {
  color: #16a34a;
}

.kirim-stat-val.tidak {
  color: #dc2626;
}

.kirim-stat-val.belum {
  color: #d97706;
}

.kirim-filter-row {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.kirim-select {
  flex: 0 0 auto;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 12px;
  font-family: inherit;
}

.kirim-search {
  flex: 1;
  margin-bottom: 0;
}

.kirim-tamu-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.kirim-check-all {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  flex: 1;
  min-width: 140px;
}

.kirim-tamu-list {
  overflow-y: visible;
}

.kirim-tamu-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: start;
  gap: 8px;
  padding: 10px 4px;
  border-bottom: 1px solid #f3f4f6;
}

.kirim-tamu-item {
  padding: 10px 4px;
  border-bottom: 1px solid #f3f4f6;
}

.kirim-tamu-main {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
}

.kirim-tamu-check {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  flex: 1;
  min-width: 0;
}

.kirim-tamu-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.kirim-tamu-btns {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.kirim-tamu-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.kirim-tamu-row1 {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.kirim-tamu-detail {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.kirim-detail-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
}

.kirim-detail-badge.jumlah {
  background: #e0f2fe;
  color: #0369a1;
}

.kirim-detail-ucapan {
  font-size: 11px;
  color: #6b7280;
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.kirim-tamu-nama {
  font-size: 13px;
  font-weight: 600;
  color: #1a2e45;
}

.kirim-tamu-wa {
  font-size: 11px;
  color: #9ca3af;
}

.kirim-tamu-status {
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.kirim-tamu-status.hadir {
  color: #16a34a;
}

.kirim-tamu-status.tidak {
  color: #dc2626;
}

.kirim-tamu-status.belum {
  color: #d97706;
}

.kirim-tamu-btns {
  display: flex;
  gap: 4px;
}

.btn-icon {
  width: 34px;
  height: 34px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #0a7060;
}

.btn-icon.edit { color: #1a2e45; }
.btn-icon.preview { color: #6366f1; border-color: #e0e7ff; background: #f5f3ff; }
.btn-icon.preview:hover { background: #ede9fe; }

.btn-icon.danger {
  color: #dc2626;
}

/* ── Preview Detail Tamu ── */
.preview-status-row {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.preview-info-list {
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}
.preview-info-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}
.preview-info-row:last-child { border-bottom: none; }
.preview-info-ucapan { flex-direction: column; gap: 6px; }
.preview-info-label {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 100px;
  flex-shrink: 0;
}
.preview-info-val {
  font-size: 14px;
  font-weight: 600;
  color: #1a2e45;
}
.preview-ucapan-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 12px;
  width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
}

.kirim-tamu-empty {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  padding: 24px 8px;
  line-height: 1.5;
}

.btn-lihat-semua {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background: #f0f7f6;
  border: 1.5px solid #d1ede9;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #0a7060;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}
.btn-lihat-semua:hover {
  background: #e2f4f2;
}

.hidden-input {
  display: none;
}

.kirim-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #1a2e45;
  color: #fff;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}

.kirim-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 46, 69, 0.45);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.kirim-modal-box {
  background: #fff;
  border-radius: 18px;
  width: 100%;
  max-width: 420px;
  max-height: min(90dvh, 720px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.kirim-modal-wide {
  max-width: 520px;
}

.kirim-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid #e5e7eb;
}

.kirim-modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1a2e45;
}

.kirim-modal-close {
  width: 36px;
  height: 36px;
  border: none;
  background: #f3f4f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
}

.kirim-modal-body {
  padding: 16px 18px;
  overflow-y: auto;
  flex: 1;
}

.kirim-modal-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 14px;
}

.kirim-modal-label {
  font-size: 12px;
  font-weight: 700;
  color: #1a2e45;
  margin: 12px 0 8px;
}

.kirim-form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.kirim-form-field label {
  font-size: 12px;
  font-weight: 700;
  color: #1a2e45;
}

.kirim-required {
  color: #dc2626;
}

.kirim-input-modal {
  margin-bottom: 0;
}

.kirim-modal-footer {
  display: flex;
  gap: 8px;
  padding: 14px 18px;
  border-top: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.kirim-modal-footer .btn-primary,
.kirim-modal-footer .btn-outline,
.kirim-modal-footer .btn-cancel {
  flex: 1;
  min-width: 100px;
}

.btn-cancel {
  background: #fff;
  border: 1.5px solid #e2e8f0;
  color: #718096;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 16px;
  cursor: pointer;
  font-family: inherit;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-active .kirim-modal-box,
.modal-leave-active .kirim-modal-box {
  transition: transform 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .kirim-modal-box,
.modal-leave-to .kirim-modal-box {
  transform: scale(0.96);
}

@media (max-width: 480px) {
  .kirim-stats-row {
    grid-template-columns: 1fr;
  }

  .kirim-tamu-item {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .kirim-tamu-btns {
    justify-content: flex-end;
  }
}

/* ── Modal Impor ── */
.impor-info-list {
  list-style-type: disc !important;
  padding-left: 20px !important;
  margin: 0 0 20px !important;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.impor-info-list li {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  display: list-item !important;
}
.impor-link {
  color: #7ecec4;
  font-weight: 700;
  text-decoration: none;
}
.impor-link:hover { text-decoration: underline; }
.impor-link-wa {
  color: #0a7060;
  font-weight: 700;
  text-decoration: none;
}
.impor-link-wa:hover { text-decoration: underline; }
.impor-file-input {
  display: block;
  width: 100%;
  padding: 10px 14px;
  border: 1.5px dashed #d1d5db;
  border-radius: 10px;
  font-size: 13px;
  font-family: inherit;
  background: #f8fafc;
  cursor: pointer;
  color: #374151;
  box-sizing: border-box;
}
.impor-file-input:hover {
  border-color: #7ecec4;
  background: #f0faf9;
}
.impor-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 20px 16px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  box-sizing: border-box;
}
.impor-upload-area:hover {
  border-color: #7ecec4;
  background: #f0faf9;
}
.impor-upload-area.has-file {
  border-color: #7ecec4;
  background: #f0faf9;
}
.impor-upload-text {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
}
.impor-upload-name {
  font-size: 13px;
  color: #0a7060;
  font-weight: 700;
}

/* ── Skeleton Daftar Tamu ── */
@keyframes ks-shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.kirim-tamu-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 200px;
}
.kirim-skeleton-row {
  display: grid;
  grid-template-columns: 20px 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 12px 4px;
  border-bottom: 1px solid #f3f4f6;
}
.ks-check {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e8f4f2 25%, #f0faf9 50%, #e8f4f2 75%);
  background-size: 800px 100%;
  animation: ks-shimmer 1.4s infinite;
  flex-shrink: 0;
}
.ks-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ks-line {
  height: 11px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e8f4f2 25%, #f0faf9 50%, #e8f4f2 75%);
  background-size: 800px 100%;
  animation: ks-shimmer 1.4s infinite;
}
.ks-line.w60 { width: 60%; }
.ks-line.w40 { width: 40%; }
.ks-status {
  width: 80px;
  height: 11px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e8f4f2 25%, #f0faf9 50%, #e8f4f2 75%);
  background-size: 800px 100%;
  animation: ks-shimmer 1.4s infinite;
}
.ks-btns {
  width: 60px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(90deg, #e8f4f2 25%, #f0faf9 50%, #e8f4f2 75%);
  background-size: 800px 100%;
  animation: ks-shimmer 1.4s infinite;
}
</style>
