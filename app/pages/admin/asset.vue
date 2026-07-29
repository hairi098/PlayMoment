<template>
  <div class="asset-wrap">
    <Transition name="fade"><div v-if="toastMsg" class="adm-toast">✅ {{ toastMsg }}</div></Transition>

    <!-- Tabs -->
    <div class="asset-tabs">
      <button class="asset-tab" :class="{ active: activeTab==='foto' }" @click="activeTab='foto'">
        🖼 Foto Asset <span class="asset-tab-count">{{ assetStore.fotoAsset.length }}</span>
      </button>
      <button class="asset-tab" :class="{ active: activeTab==='musik' }" @click="activeTab='musik'">
        🎵 Musik <span class="asset-tab-count">{{ assetStore.musikAsset.length }}</span>
      </button>
    </div>

    <!-- FOTO TAB -->
    <template v-if="activeTab==='foto'">
      <div class="adm-card">
        <div class="adm-card-head">
          <div class="adm-filters">
            <select class="adm-select" style="width:auto" v-model="filterKategori">
              <option value="">Semua Kategori</option>
              <option v-for="k in assetStore.kategoriList" :key="k" :value="k">{{ capitalize(k) }}</option>
            </select>
            <input class="adm-input" style="min-width:180px" v-model="searchFoto" placeholder="Cari foto…" />
          </div>
          <button class="adm-btn adm-btn-teal" @click="openUploadFoto">+ Upload Foto</button>
        </div>
        <div class="adm-card-body">
          <div v-if="filteredFoto.length" class="asset-foto-grid">
            <div v-for="foto in filteredFoto" :key="foto.id" class="asset-foto-card">
              <div class="asset-foto-thumb">
                <img :src="foto.url" :alt="foto.nama" @error="onImgError($event)" />
                <div class="asset-foto-overlay">
                  <button class="asset-ov-btn" @click="previewFoto(foto)">👁</button>
                  <button class="asset-ov-btn" @click="editFoto(foto)">✏️</button>
                  <button class="asset-ov-btn danger" @click="hapusFoto(foto)">🗑</button>
                </div>
              </div>
              <div style="padding:10px">
                <p class="td-nm" style="font-size:12px;margin:0 0 4px">{{ foto.nama }}</p>
                <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
                  <span class="promo-code" style="font-size:10px">{{ capitalize(foto.kategori) }}</span>
                  <span class="td-sub" style="font-size:10px">{{ foto.ukuran }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="td-empty" style="padding:48px">Belum ada foto. Klik <strong>Upload Foto</strong>.</div>
        </div>
      </div>
    </template>

    <!-- MUSIK TAB -->
    <template v-if="activeTab==='musik'">
      <div class="adm-card">
        <div class="adm-card-head">
          <input class="adm-input" style="min-width:220px" v-model="searchMusik" placeholder="Cari nama lagu / artis…" />
          <button class="adm-btn adm-btn-teal" @click="openUploadMusik">+ Upload Musik</button>
        </div>
        <div class="adm-table-wrap">
          <table class="adm-table">
            <thead><tr><th>Lagu</th><th>Artis</th><th>Durasi</th><th>Ukuran</th><th>Aksi</th></tr></thead>
            <tbody>
              <tr v-for="musik in filteredMusik" :key="musik.id">
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    <button class="asset-play-btn" :class="{ playing: currentPlay===musik.id }" @click="togglePlay(musik)">
                      {{ currentPlay===musik.id ? '⏸' : '▶' }}
                    </button>
                    <span class="td-nm" style="font-size:13px">{{ musik.nama }}</span>
                  </div>
                </td>
                <td class="td-sub">{{ musik.artis }}</td>
                <td class="td-sub">{{ musik.durasi }}</td>
                <td class="td-sub">{{ musik.ukuran }}</td>
                <td>
                  <div class="td-actions">
                    <button class="adm-btn adm-btn-outline adm-btn-sm" @click="editMusik(musik)">Edit</button>
                    <button class="adm-btn adm-btn-danger adm-btn-sm" @click="hapusMusik(musik)">Hapus</button>
                  </div>
                </td>
              </tr>
              <tr v-if="!filteredMusik.length"><td colspan="5" class="td-empty">Belum ada musik</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Modal Upload Foto -->
    <Transition name="modal">
      <div v-if="showUploadFoto" class="adm-modal-overlay" @click.self="showUploadFoto=false">
        <div class="adm-modal">
          <div class="adm-modal-head">
            <h3 class="adm-modal-title">{{ editFotoTarget?'Edit Foto':'Upload Foto Asset' }}</h3>
            <button class="adm-modal-close" @click="showUploadFoto=false">✕</button>
          </div>
          <div class="adm-modal-body">
            <div v-if="!editFotoTarget" class="asset-dropzone" :class="{ hover:dzHover, hasfile:fotoPreviewUrl }" @dragover.prevent="dzHover=true" @dragleave="dzHover=false" @drop.prevent="onFotoDrop" @click="$refs.fotoInput.click()">
              <input ref="fotoInput" type="file" accept="image/*" style="display:none" @change="onFotoSelect" />
              <img v-if="fotoPreviewUrl" :src="fotoPreviewUrl" class="asset-dz-preview" />
              <template v-else><div style="font-size:32px">🖼</div><p class="td-sub">Drag & drop atau klik untuk pilih foto</p><p class="td-sub" style="font-size:11px">PNG, JPG, WEBP — maks 5MB</p></template>
            </div>
            <div class="adm-field" style="margin-top:12px"><label class="adm-label">Nama Asset *</label><input class="adm-input" v-model="fotoForm.nama" placeholder="Nama foto" /></div>
            <div class="adm-form-grid" style="margin-top:10px">
              <div class="adm-field"><label class="adm-label">Kategori</label>
                <select class="adm-select" v-model="fotoForm.kategori"><option v-for="k in assetStore.kategoriList" :key="k" :value="k">{{ capitalize(k) }}</option></select>
              </div>
              <div class="adm-field"><label class="adm-label">Deskripsi</label><input class="adm-input" v-model="fotoForm.deskripsi" placeholder="Keterangan…" /></div>
            </div>
          </div>
          <div class="adm-modal-footer">
            <button class="adm-btn adm-btn-outline" @click="showUploadFoto=false">Batal</button>
            <button class="adm-btn adm-btn-primary" @click="simpanFoto" :disabled="fotoUploading||(!editFotoTarget&&!fotoPreviewUrl)">{{ fotoUploading?'Upload…':editFotoTarget?'Simpan':'Upload & Simpan' }}</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Preview Foto -->
    <Transition name="modal">
      <div v-if="previewFotoTarget" class="adm-modal-overlay" @click.self="previewFotoTarget=null">
        <div class="adm-modal" style="max-width:600px">
          <div class="adm-modal-head"><h3 class="adm-modal-title">{{ previewFotoTarget.nama }}</h3><button class="adm-modal-close" @click="previewFotoTarget=null">✕</button></div>
          <div class="adm-modal-body" style="padding:0"><img :src="previewFotoTarget.url" style="width:100%;max-height:60vh;object-fit:contain" @error="onImgError($event)" /></div>
          <div class="adm-modal-footer">
            <button class="adm-btn adm-btn-outline" @click="previewFotoTarget=null">Tutup</button>
            <button class="adm-btn adm-btn-primary" @click="copyUrl(previewFotoTarget.url)">Salin URL</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Upload Musik -->
    <Transition name="modal">
      <div v-if="showUploadMusik" class="adm-modal-overlay" @click.self="showUploadMusik=false">
        <div class="adm-modal">
          <div class="adm-modal-head">
            <h3 class="adm-modal-title">{{ editMusikTarget?'Edit Musik':'Upload Musik' }}</h3>
            <button class="adm-modal-close" @click="showUploadMusik=false">✕</button>
          </div>
          <div class="adm-modal-body">
            <div v-if="!editMusikTarget" class="asset-dropzone" :class="{ hover:dzMusikHover, hasfile:musikFileName }" @dragover.prevent="dzMusikHover=true" @dragleave="dzMusikHover=false" @drop.prevent="onMusikDrop" @click="$refs.musikInput.click()">
              <input ref="musikInput" type="file" accept="audio/*" style="display:none" @change="onMusikSelect" />
              <template v-if="musikFileName"><div style="font-size:32px">🎵</div><p class="td-nm">{{ musikFileName }}</p><p class="td-sub">{{ musikFileSize }}</p></template>
              <template v-else><div style="font-size:32px">🎵</div><p class="td-sub">Drag & drop atau klik untuk pilih audio</p><p class="td-sub" style="font-size:11px">MP3, WAV — maks 20MB</p></template>
            </div>
            <audio v-if="musikPreviewUrl&&!editMusikTarget" :src="musikPreviewUrl" controls style="width:100%;margin:10px 0" />
            <div class="adm-form-grid" style="margin-top:12px">
              <div class="adm-field"><label class="adm-label">Nama Lagu *</label><input class="adm-input" v-model="musikForm.nama" placeholder="Judul lagu" /></div>
              <div class="adm-field"><label class="adm-label">Artis</label><input class="adm-input" v-model="musikForm.artis" placeholder="Nama artis" /></div>
              <div class="adm-field" style="grid-column:1/-1"><label class="adm-label">Deskripsi</label><input class="adm-input" v-model="musikForm.deskripsi" placeholder="Keterangan…" /></div>
            </div>
          </div>
          <div class="adm-modal-footer">
            <button class="adm-btn adm-btn-outline" @click="showUploadMusik=false">Batal</button>
            <button class="adm-btn adm-btn-teal" @click="simpanMusik" :disabled="musikUploading||(!editMusikTarget&&!musikFileName)">{{ musikUploading?'Upload…':editMusikTarget?'Simpan':'Upload & Simpan' }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAssetStore } from '~/stores/useAssetStore'

definePageMeta({ layout: 'admin' })

const assetStore = useAssetStore()
onMounted(() => { assetStore.loadAssets() })

const activeTab = ref('foto')
const toastMsg = ref('')
let toastTimer = null
const showToast = (msg) => { toastMsg.value=msg; clearTimeout(toastTimer); toastTimer=setTimeout(()=>{ toastMsg.value='' },3000) }
const capitalize = (str) => str ? str[0].toUpperCase()+str.slice(1) : ''
const formatBytes = (bytes) => { if(!bytes) return '-'; if(bytes<1024) return bytes+' B'; if(bytes<1048576) return (bytes/1024).toFixed(1)+' KB'; return (bytes/1048576).toFixed(1)+' MB' }

// ── FOTO ──
const searchFoto = ref(''); const filterKategori = ref('')
const showUploadFoto = ref(false); const editFotoTarget = ref(null); const previewFotoTarget = ref(null)
const dzHover = ref(false); const fotoPreviewUrl = ref(''); const fotoFileName = ref('')
const fotoFileObj = ref(null); const fotoUploading = ref(false)
const fotoForm = ref({ nama:'', kategori:'lainnya', deskripsi:'' })

const filteredFoto = computed(() => assetStore.fotoAsset.filter(f => {
  const mk=!filterKategori.value||f.kategori===filterKategori.value
  const mq=!searchFoto.value||f.nama?.toLowerCase().includes(searchFoto.value.toLowerCase())
  return mk&&mq
}))

const resetFotoForm = () => { fotoForm.value={nama:'',kategori:'lainnya',deskripsi:''}; fotoPreviewUrl.value=''; fotoFileName.value=''; fotoFileObj.value=null; editFotoTarget.value=null; dzHover.value=false }
const openUploadFoto = () => { resetFotoForm(); showUploadFoto.value=true }
const editFoto = (foto) => { editFotoTarget.value=foto; fotoForm.value={nama:foto.nama,kategori:foto.kategori,deskripsi:foto.deskripsi}; showUploadFoto.value=true }
const previewFoto = (foto) => { previewFotoTarget.value=foto }
const onImgError = (e) => { e.target.style.display='none' }

const processFotoFile = (file) => {
  if(!file||!file.type.startsWith('image/')) { alert('File harus berupa gambar.'); return }
  if(file.size>5*1024*1024) { alert('Maks 5 MB.'); return }
  fotoFileObj.value=file; fotoFileName.value=file.name; fotoPreviewUrl.value=URL.createObjectURL(file)
  if(!fotoForm.value.nama) fotoForm.value.nama=file.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ')
}
const onFotoSelect = (e) => { processFotoFile(e.target.files[0]) }
const onFotoDrop = (e) => { dzHover.value=false; processFotoFile(e.dataTransfer.files[0]) }

const simpanFoto = async () => {
  if(!fotoForm.value.nama.trim()) { alert('Nama wajib.'); return }
  if(editFotoTarget.value) {
    const res=await assetStore.updateFotoAsset(editFotoTarget.value.id, fotoForm.value)
    if(res?.ok===false) { alert('Gagal: '+res.message); return }
    showToast('Foto diperbarui.'); showUploadFoto.value=false; resetFotoForm(); return
  }
  if(!fotoFileObj.value) { alert('Pilih file foto.'); return }
  try {
    fotoUploading.value=true
    const { publicUrl, path } = await assetStore.uploadFotoToStorage(fotoFileObj.value)
    await assetStore.addFotoAsset({ ...fotoForm.value, url:publicUrl, _path:path, ukuran:formatBytes(fotoFileObj.value.size), tipe:fotoFileObj.value.type })
    await assetStore.loadAssets()
    showToast('Foto berhasil diupload.'); showUploadFoto.value=false; resetFotoForm()
  } catch(err) { alert('Gagal upload: '+(err.message||err)) }
  finally { fotoUploading.value=false }
}
const hapusFoto = async (foto) => { if(confirm(`Hapus "${foto.nama}"?`)) { await assetStore.deleteFotoAsset(foto.id); showToast('Foto dihapus.') } }
const copyUrl = (url) => { navigator.clipboard.writeText(url).then(()=>showToast('URL disalin.')); previewFotoTarget.value=null }

// ── MUSIK ──
const searchMusik = ref('')
const showUploadMusik = ref(false); const editMusikTarget = ref(null)
const dzMusikHover = ref(false); const musikFileName = ref(''); const musikFileSize = ref('')
const musikPreviewUrl = ref(''); const musikFileObj = ref(null); const musikUploading = ref(false)
const musikForm = ref({ nama:'', artis:'', deskripsi:'' })
const currentPlay = ref(null); let audioEl = null

const filteredMusik = computed(() => assetStore.musikAsset.filter(m => !searchMusik.value||m.nama?.toLowerCase().includes(searchMusik.value.toLowerCase())||m.artis?.toLowerCase().includes(searchMusik.value.toLowerCase())))

const resetMusikForm = () => { musikForm.value={nama:'',artis:'',deskripsi:''}; musikFileName.value=''; musikFileSize.value=''; musikPreviewUrl.value=''; musikFileObj.value=null; editMusikTarget.value=null; dzMusikHover.value=false }
const openUploadMusik = () => { resetMusikForm(); showUploadMusik.value=true }
const editMusik = (musik) => { editMusikTarget.value=musik; musikForm.value={nama:musik.nama,artis:musik.artis,deskripsi:musik.deskripsi}; showUploadMusik.value=true }

const processMusikFile = (file) => {
  if(!file||!file.type.startsWith('audio/')) { alert('File harus audio.'); return }
  if(file.size>20*1024*1024) { alert('Maks 20 MB.'); return }
  musikFileObj.value=file; musikFileName.value=file.name; musikFileSize.value=formatBytes(file.size); musikPreviewUrl.value=URL.createObjectURL(file)
  if(!musikForm.value.nama) musikForm.value.nama=file.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ')
}
const onMusikSelect = (e) => { processMusikFile(e.target.files[0]) }
const onMusikDrop = (e) => { dzMusikHover.value=false; processMusikFile(e.dataTransfer.files[0]) }

const simpanMusik = async () => {
  if(!musikForm.value.nama.trim()) { alert('Nama wajib.'); return }
  if(editMusikTarget.value) {
    const res=await assetStore.updateMusikAsset(editMusikTarget.value.id, musikForm.value)
    if(res?.ok===false) { alert('Gagal: '+res.message); return }
    showToast('Musik diperbarui.'); showUploadMusik.value=false; resetMusikForm(); return
  }
  if(!musikFileObj.value) { alert('Pilih file musik.'); return }
  try {
    musikUploading.value=true
    const { publicUrl, path } = await assetStore.uploadMusikToStorage(musikFileObj.value)
    await assetStore.addMusikAsset({ ...musikForm.value, url:publicUrl, _path:path, ukuran:musikFileSize.value, tipe:musikFileObj.value.type })
    await assetStore.loadAssets()
    showToast('Musik berhasil diupload.'); showUploadMusik.value=false; resetMusikForm()
  } catch(err) { alert('Gagal upload: '+(err.message||err)) }
  finally { musikUploading.value=false }
}
const hapusMusik = async (musik) => {
  if(currentPlay.value===musik.id) { audioEl?.pause(); currentPlay.value=null }
  if(confirm(`Hapus "${musik.nama}"?`)) { await assetStore.deleteMusikAsset(musik.id); showToast('Musik dihapus.') }
}
const togglePlay = (musik) => {
  if(currentPlay.value===musik.id) { audioEl?.pause(); currentPlay.value=null }
  else { audioEl?.pause(); audioEl=new Audio(musik.url); audioEl.play().catch(()=>showToast('Gagal putar audio.')); currentPlay.value=musik.id; audioEl.onended=()=>{ currentPlay.value=null } }
}
</script>

<style scoped>
.asset-wrap { display:flex; flex-direction:column; gap:20px; }
.asset-tabs { display:flex; gap:8px; flex-wrap:wrap; }
.asset-tab { padding:10px 18px; border-radius:10px; border:1.5px solid #e8edf3; background:#fff; font-size:13px; font-weight:700; color:#6b7280; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:8px; transition:all .18s; }
.asset-tab:hover { border-color:#7ecec4; color:#0a7060; }
.asset-tab.active { background:#1a2e45; color:#fff; border-color:#1a2e45; }
.asset-tab-count { background:rgba(255,255,255,.2); border-radius:20px; padding:1px 7px; font-size:11px; }
.asset-tab:not(.active) .asset-tab-count { background:#f0f4f8; color:#6b7280; }

.asset-foto-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(160px,1fr)); gap:14px; }
.asset-foto-card { border:1.5px solid #e8edf3; border-radius:12px; overflow:hidden; background:#fff; }
.asset-foto-thumb { position:relative; height:120px; overflow:hidden; background:#f0f4f8; }
.asset-foto-thumb img { width:100%; height:100%; object-fit:cover; }
.asset-foto-overlay { position:absolute; inset:0; background:rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; gap:8px; opacity:0; transition:opacity .2s; }
.asset-foto-card:hover .asset-foto-overlay { opacity:1; }
.asset-ov-btn { background:rgba(255,255,255,.9); border:none; border-radius:8px; padding:6px 8px; cursor:pointer; font-size:14px; transition:background .15s; }
.asset-ov-btn.danger { background:rgba(239,68,68,.9); }
.asset-dropzone { border:2px dashed #e8edf3; border-radius:12px; padding:28px; text-align:center; cursor:pointer; transition:all .18s; display:flex; flex-direction:column; align-items:center; gap:8px; }
.asset-dropzone.hover { border-color:#7ecec4; background:#f0faf9; }
.asset-dropzone.hasfile { border-color:#7ecec4; border-style:solid; }
.asset-dz-preview { max-height:120px; border-radius:8px; object-fit:contain; }
.asset-play-btn { background:linear-gradient(135deg,#7ecec4,#2a9d8f); border:none; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#fff; font-size:12px; flex-shrink:0; transition:transform .15s; }
.asset-play-btn:hover { transform:scale(1.1); }
.asset-play-btn.playing { background:linear-gradient(135deg,#f6ad55,#e67e22); }
.promo-code { background:#f0f7f6; padding:3px 8px; border-radius:6px; font-weight:800; color:#0a7060; font-size:10px; }
.modal-enter-active,.modal-leave-active { transition:opacity .2s; }
.modal-enter-from,.modal-leave-to { opacity:0; }
.fade-enter-active,.fade-leave-active { transition:opacity .25s; }
.fade-enter-from,.fade-leave-to { opacity:0; }
</style>
