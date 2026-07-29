<template>
  <div class="und-wrap" @click="activeDropdown=null">
    <!-- Toast -->
    <Transition name="fade"><div v-if="toast" class="adm-toast">{{ toast }}</div></Transition>

    <!-- Chips + filters -->
    <div class="und-top">
      <div class="und-chips">
        <div v-for="c in chips" :key="c.label" class="und-chip" :style="{ background:c.bg, borderColor:c.border }">
          <span class="und-chip-num" :style="{ color:c.color }">{{ c.num }}</span>
          <span class="und-chip-lbl" :style="{ color:c.color }">{{ c.label }}</span>
        </div>
      </div>
      <div class="adm-filters">
        <input class="adm-input" style="min-width:180px" v-model="search" placeholder="Cari undangan…" />
        <select class="adm-select" style="width:auto" v-model="filterStatus">
          <option value="">Semua Status</option>
          <option v-for="s in statusOptions" :key="s.val" :value="s.val">{{ s.label }}</option>
        </select>
        <select class="adm-select" style="width:auto" v-model="filterPaket">
          <option v-for="p in paketOptions" :key="p||'all'" :value="p">{{ p||'Semua Paket' }}</option>
        </select>
      </div>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="isLoading" class="und-grid">
      <div v-for="i in 6" :key="i" class="und-card und-skeleton">
        <div class="usk-thumb"></div>
        <div class="usk-body">
          <div class="usk-line w70"></div>
          <div class="usk-line w45"></div>
          <div class="usk-line w30"></div>
          <div class="usk-foot">
            <div class="usk-line w40"></div>
            <div class="usk-badge"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div v-else-if="paginated.length" class="und-grid">
      <div v-for="u in paginated" :key="u.id" class="und-card">
        <!-- Thumb -->
        <div class="und-thumb" :style="{ background: u.thumbBg || '#2a9d8f' }">
          <img v-if="u.thumbImg" :src="u.thumbImg" :alt="u.judul" class="und-thumb-img" />
          <div v-else class="und-thumb-mono" :style="{ color: u.thumbColor||'#fff' }">{{ u.monogram }}</div>
          <span class="und-status-badge" :class="'ustatus-'+u.status">{{ statusLabel[u.status]||u.status }}</span>
        </div>
        <!-- Body -->
        <div class="und-body">
          <div class="und-body-top">
            <div class="und-info">
              <h3 class="td-nm und-title">{{ u.judul }}</h3>
              <p class="td-sub">{{ u.tanggalAcara }}</p>
              <p class="td-sub">{{ u.tema }}</p>
            </div>
            <!-- Three-dot menu -->
            <div style="position:relative" @click.stop>
              <button class="und-menu-btn" @click.stop="toggleMenu(u.id)">⋮</button>
              <Transition name="dropdown">
                <div v-if="activeDropdown===u.id" class="und-menu">
                  <button class="und-menu-item" @click="editUndangan(u)">✏️ Edit</button>
                  <button class="und-menu-item" @click="previewUndangan(u)">👁 Preview</button>
                  <button class="und-menu-item" @click="kirimUndangan(u)">📤 Kirim</button>
                  <div style="height:1px;background:#f0f4f8;margin:4px 0" />
                  <button class="und-menu-item und-menu-danger" @click="hapus(u)">🗑 Hapus</button>
                </div>
              </Transition>
            </div>
          </div>
          <div class="und-customer">
            <div class="td-av" :style="{ background:(u.color||'#7ecec4')+'22', color:u.color||'#7ecec4', width:'24px', height:'24px', fontSize:'11px' }">{{ (u.customer||'?')[0] }}</div>
            <span class="td-sub">{{ u.customer }}</span>
            <span class="und-paket">{{ u.paket }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="td-empty" style="padding:48px;text-align:center">Tidak ada undangan ditemukan</div>

    <!-- Pagination -->
    <div class="cust-pagination">
      <span class="td-sub">{{ filtered.length }} undangan</span>
      <div style="display:flex;gap:4px">
        <button class="pes-pg" :disabled="page===1" @click="page--">‹</button>
        <button v-for="n in totalPages" :key="n" class="pes-pg" :class="{active:page===n}" @click="page=n">{{ n }}</button>
        <button class="pes-pg" :disabled="page===totalPages" @click="page++">›</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAccountStore } from '~/stores/useAccountStore'
import { getAdminPaketFilterOptions } from '~/config/paket'

definePageMeta({ layout: 'admin' })

const router = useRouter()
const accountStore = useAccountStore()

const isLoading = ref(true);

onMounted(async () => {
  await accountStore.loadAll();
  // Load editor_data untuk foto thumbnail
  const invs = accountStore.invitations;
  await Promise.all(
    invs.filter(inv => !inv.editorData && inv.editorId)
        .map(inv => accountStore.loadInvitationEditorData(inv.editorId))
  );
  isLoading.value = false;
})

const search = ref(''); const filterStatus = ref(''); const filterPaket = ref('')
const page = ref(1); const perPage = 9
const activeDropdown = ref(null); const toast = ref('')

const statusLabel = { aktif:'Aktif', draft:'Draft', selesai:'Selesai', nonaktif:'Nonaktif' }
const statusOptions = [{ val:'aktif', label:'Aktif' },{ val:'draft', label:'Draft' },{ val:'selesai', label:'Selesai' }]
const paketOptions = getAdminPaketFilterOptions()

const undangan = computed(() => accountStore.invitations.map(item => {
  const customer = accountStore.customers.find(c => String(c.id)===String(item.customerId))
  const edData = item.editorData
  const thumbImg = edData?.undangan?.thumbnailWa
    || (edData?.undangan?.fotoCouple && !edData.undangan.fotoCouple.startsWith('/assets') ? edData.undangan.fotoCouple : null)
    || item.foto
    || ''
  return { ...item, thumbImg, judul:edData?.undangan?.judulPengaturan||item.judul||'', color:customer?.color??'#7ecec4' }
}))

const chips = computed(() => [
  { label:'Total',   num:undangan.value.length,                                      color:'#1a2e45', bg:'#f0f7f6', border:'#d1ede9' },
  { label:'Aktif',   num:undangan.value.filter(u=>u.status==='aktif').length,        color:'#0a7060', bg:'rgba(126,206,196,.1)', border:'rgba(126,206,196,.3)' },
  { label:'Draft',   num:undangan.value.filter(u=>u.status==='draft').length,        color:'#b45309', bg:'rgba(246,173,85,.1)',  border:'rgba(246,173,85,.3)' },
  { label:'Selesai', num:undangan.value.filter(u=>u.status==='selesai').length,      color:'#166534', bg:'rgba(104,211,145,.1)', border:'rgba(104,211,145,.3)' },
])

const filtered = computed(() => undangan.value.filter(u => {
  const ms=!filterStatus.value||u.status===filterStatus.value
  const mp=!filterPaket.value||u.paket===filterPaket.value
  const mq=!search.value||u.customer?.toLowerCase().includes(search.value.toLowerCase())||u.judul?.toLowerCase().includes(search.value.toLowerCase())
  return ms&&mp&&mq
}))
const totalPages = computed(() => Math.max(1,Math.ceil(filtered.value.length/perPage)))
const paginated = computed(() => filtered.value.slice((page.value-1)*perPage, page.value*perPage))

let toastTimer = null
const showToast = (msg) => { toast.value=msg; clearTimeout(toastTimer); toastTimer=setTimeout(()=>{toast.value=''},2500) }
const toggleMenu = (id) => { activeDropdown.value=activeDropdown.value===id?null:id }
const editUndangan = (u) => { activeDropdown.value=null; router.push(`/edit-undangan/${u.editorId||u.slug}`) }
const previewUndangan = (u) => { activeDropdown.value=null; window.open(`/preview/${u.slug}`,'_blank') }
const kirimUndangan = (u) => { activeDropdown.value=null; router.push(`/edit-undangan/${u.editorId||u.slug}/kirim`) }
const hapus = (u) => { activeDropdown.value=null; if(confirm(`Hapus undangan "${u.judul}"?`)) { accountStore.deleteInvitation(u.id); showToast('Undangan dihapus') } }
</script>

<style scoped>
.und-wrap { display:flex; flex-direction:column; gap:20px; }
.und-top { display:flex; flex-wrap:wrap; gap:14px; justify-content:space-between; }
.und-chips { display:flex; flex-wrap:wrap; gap:8px; }
.und-chip { display:flex; flex-direction:column; align-items:center; padding:8px 16px; border-radius:10px; border:1.5px solid; min-width:72px; gap:1px; }
.und-chip-num { font-size:20px; font-weight:900; }
.und-chip-lbl { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.4px; }

.und-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(240px,1fr)); gap:16px; }
.und-card { background:#fff; border-radius:16px; border:1.5px solid #e8edf3; overflow:hidden; transition:box-shadow .2s; }
.und-card:hover { box-shadow:0 4px 16px rgba(26,46,69,.08); }
.und-thumb { height:130px; position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.und-thumb-img { width:100%; height:100%; object-fit:cover; }
.und-thumb-mono { font-size:36px; font-weight:900; opacity:.6; }
.und-status-badge { position:absolute; top:10px; left:10px; font-size:10px; font-weight:700; padding:3px 8px; border-radius:20px; }
.ustatus-aktif { background:rgba(104,211,145,.9); color:#166534; }
.ustatus-draft { background:rgba(246,173,85,.9); color:#92400e; }
.ustatus-selesai { background:rgba(126,206,196,.9); color:#0a7060; }
.ustatus-nonaktif { background:rgba(248,113,113,.9); color:#b91c1c; }
.und-body { padding:14px; }
.und-body-top { display:flex; justify-content:space-between; gap:8px; margin-bottom:10px; }
.und-title { font-size:13px; margin:0 0 3px; line-height:1.4; }
.und-info { flex:1; min-width:0; }
.und-menu-btn { background:none; border:none; cursor:pointer; font-size:20px; color:#9ca3af; padding:2px 6px; border-radius:6px; line-height:1; }
.und-menu-btn:hover { background:#f0f4f8; color:#1a2e45; }
.und-menu { position:absolute; top:100%; right:0; background:#fff; border-radius:12px; border:1.5px solid #e8edf3; box-shadow:0 8px 24px rgba(0,0,0,.1); min-width:160px; z-index:50; overflow:hidden; }
.und-menu-item { display:flex; align-items:center; gap:8px; width:100%; padding:10px 14px; background:none; border:none; cursor:pointer; font-size:13px; font-weight:600; color:#1a2e45; font-family:inherit; transition:background .15s; text-align:left; }
.und-menu-item:hover { background:#f7fafc; }
.und-menu-danger { color:#ef4444; }
.und-menu-danger:hover { background:#fef2f2; }
.und-customer { display:flex; align-items:center; gap:8px; }
.und-paket { margin-left:auto; font-size:10px; font-weight:700; background:rgba(126,206,196,.15); color:#0a7060; padding:2px 8px; border-radius:20px; }

.cust-pagination { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.pes-pg { width:32px; height:32px; border-radius:8px; border:1.5px solid #e8edf3; background:#fff; font-size:13px; font-weight:700; cursor:pointer; color:#1a2e45; font-family:inherit; }
.pes-pg:hover:not(:disabled) { border-color:#7ecec4; }
.pes-pg.active { background:#1a2e45; color:#fff; border-color:#1a2e45; }
.pes-pg:disabled { opacity:.4; cursor:not-allowed; }
.dropdown-enter-active,.dropdown-leave-active { transition:opacity .15s,transform .15s; }
.dropdown-enter-from,.dropdown-leave-to { opacity:0; transform:translateY(-4px); }
.fade-enter-active,.fade-leave-active { transition:opacity .25s; }
.fade-enter-from,.fade-leave-to { opacity:0; }

/* ── Skeleton ── */
@keyframes adm-shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.und-skeleton { pointer-events: none; }
.usk-thumb {
  height: 130px;
  background: linear-gradient(90deg, #e8edf3 25%, #f3f6fa 50%, #e8edf3 75%);
  background-size: 800px 100%;
  animation: adm-shimmer 1.4s infinite;
}
.usk-body { padding: 14px; display: flex; flex-direction: column; gap: 8px; }
.usk-line {
  height: 11px; border-radius: 6px;
  background: linear-gradient(90deg, #e8edf3 25%, #f3f6fa 50%, #e8edf3 75%);
  background-size: 800px 100%;
  animation: adm-shimmer 1.4s infinite;
}
.usk-line.w70 { width: 70%; }
.usk-line.w45 { width: 45%; }
.usk-line.w30 { width: 30%; }
.usk-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
.usk-badge {
  width: 52px; height: 20px; border-radius: 20px;
  background: linear-gradient(90deg, #e8edf3 25%, #f3f6fa 50%, #e8edf3 75%);
  background-size: 800px 100%;
  animation: adm-shimmer 1.4s infinite;
}
</style>
