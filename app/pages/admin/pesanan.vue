<template>
  <div class="pes-wrap">
    <!-- Toast -->
    <Transition name="fade">
      <div v-if="toastMsg" class="adm-toast">{{ toastMsg }}</div>
    </Transition>

    <!-- Chips -->
    <div class="pes-chips">
      <div v-for="c in chips" :key="c.label" class="pes-chip" :style="{ background:c.bg, borderColor:c.border }">
        <span class="pes-chip-num" :style="{ color:c.color }">{{ c.num }}</span>
        <span class="pes-chip-lbl" :style="{ color:c.color }">{{ c.label }}</span>
      </div>
    </div>

    <!-- Table card -->
    <div class="adm-card">
      <div class="adm-card-head">
        <h2 class="adm-card-title">Daftar Pesanan</h2>
        <div class="adm-filters">
          <input class="adm-input" style="min-width:180px" v-model="search" placeholder="Cari nama / email…" />
          <select class="adm-select" style="width:auto" v-model="filterStatus">
            <option value="">Semua Status</option>
            <option value="menunggu_konfirmasi">Menunggu</option>
            <option value="dikonfirmasi">Dikonfirmasi</option>
            <option value="batal">Dibatalkan</option>
          </select>
          <select class="adm-select" style="width:auto" v-model="filterPaket">
            <option v-for="p in paketFilterOptions" :key="p||'all'" :value="p">{{ p||'Semua Paket' }}</option>
          </select>
        </div>
      </div>

      <div class="adm-table-wrap">
        <table class="adm-table">
          <thead>
            <tr><th>ID</th><th>Customer</th><th>Paket</th><th>Total</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in paginated" :key="p.id">
              <td>
                <p class="td-mono">#{{ p.id }}</p>
                <span v-if="p.invoiceCode" class="pes-inv">{{ p.invoiceCode }}</span>
                <span v-if="p.pembayaranDikonfirmasi" class="pes-paid">Sudah bayar</span>
              </td>
              <td>
                <div class="td-user">
                  <div class="td-av">{{ (p.nama||'?')[0] }}</div>
                  <div><p class="td-nm">{{ p.nama }}</p><p class="td-sub">{{ p.email }}</p></div>
                </div>
              </td>
              <td><span class="pes-paket">{{ p.paket }}</span></td>
              <td class="td-nm" style="white-space:nowrap">Rp {{ p.total }}</td>
              <td class="td-sub" style="white-space:nowrap">{{ p.tanggal }}</td>
              <td><span class="adm-badge" :class="'bs-'+p.status">{{ statusLabel[p.status]||p.status }}</span></td>
              <td>
                <div class="td-actions">
                  <button v-if="isAwaiting(p)" class="adm-btn adm-btn-teal adm-btn-sm" @click="bukaKonfirmasi(p)">Konfirmasi</button>
                  <button v-if="isAwaiting(p)" class="adm-btn adm-btn-danger adm-btn-sm" @click="tolak(p)">Tolak</button>
                  <button class="adm-btn adm-btn-outline adm-btn-sm" @click="lihat(p)">Lihat</button>
                  <button class="adm-btn adm-btn-danger adm-btn-sm" @click="hapus(p)">Hapus</button>
                </div>
              </td>
            </tr>
            <tr v-if="!paginated.length"><td colspan="7" class="td-empty">Tidak ada pesanan</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pes-pagination">
        <span class="td-sub">{{ filtered.length }} pesanan</span>
        <div style="display:flex;gap:4px">
          <button class="pes-pg" :disabled="page===1" @click="page--">‹</button>
          <button v-for="n in totalPages" :key="n" class="pes-pg" :class="{active:page===n}" @click="page=n">{{ n }}</button>
          <button class="pes-pg" :disabled="page===totalPages" @click="page++">›</button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Transition name="modal">
      <div v-if="selectedPesanan" class="adm-modal-overlay" @click.self="selectedPesanan=null">
        <div class="adm-modal">
          <div class="adm-modal-head">
            <h3 class="adm-modal-title">Detail #{{ selectedPesanan.id }}</h3>
            <button class="adm-modal-close" @click="selectedPesanan=null">✕</button>
          </div>
          <div class="adm-modal-body">
            <div v-for="r in detailRows(selectedPesanan)" :key="r.label" class="pes-detail-row">
              <span class="td-sub">{{ r.label }}</span><span class="td-nm">{{ r.val }}</span>
            </div>
          </div>
          <div class="adm-modal-footer">
            <button class="adm-btn adm-btn-outline" @click="selectedPesanan=null">Tutup</button>
            <button v-if="isAwaiting(selectedPesanan)" class="adm-btn adm-btn-teal" @click="bukaKonfirmasi(selectedPesanan)">Konfirmasi</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Konfirmasi Modal -->
    <Transition name="modal">
      <div v-if="confirmTarget" class="adm-modal-overlay" @click.self="tutupKonfirmasi">
        <div class="adm-modal">
          <div class="adm-modal-head">
            <h3 class="adm-modal-title">Konfirmasi #{{ confirmTarget.id }}</h3>
            <button class="adm-modal-close" @click="tutupKonfirmasi">✕</button>
          </div>
          <div class="adm-modal-body">
            <p class="td-sub" style="margin:0 0 14px">Customer <strong>{{ confirmTarget.nama }}</strong> akan dapat login dan membuat undangan.</p>
            <div class="adm-field" style="margin-bottom:12px">
              <label class="adm-label">Kuota undangan</label>
              <input class="adm-input" v-model.number="confirmMaxUndangan" type="number" min="1" max="99" />
              <span class="td-sub">Default {{ confirmTarget.paket }}: {{ defaultKuota }} undangan</span>
            </div>
            <div class="adm-field" style="margin-bottom:12px">
              <label class="adm-label">Password login (kosong = auto)</label>
              <input class="adm-input" v-model="confirmPassword" type="text" placeholder="12345678" />
            </div>
            <div class="adm-field">
              <label class="adm-label">Catatan admin</label>
              <textarea class="adm-textarea" v-model="confirmCatatan" rows="2" placeholder="Opsional…" />
            </div>
            <p v-if="confirmError" style="font-size:12px;color:#ef4444;font-weight:600;margin-top:8px">{{ confirmError }}</p>
          </div>
          <div class="adm-modal-footer">
            <button class="adm-btn adm-btn-outline" @click="tutupKonfirmasi">Batal</button>
            <button class="adm-btn adm-btn-teal" :disabled="confirmLoading" @click="jalankanKonfirmasi">
              {{ confirmLoading ? 'Memproses…' : 'Ya, Konfirmasi' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAccountStore } from '~/stores/useAccountStore'
import { getDefaultMaxUndangan } from '~/utils/customer-quota'
import { getAdminPaketFilterOptions } from '~/config/paket'

definePageMeta({ layout: 'admin' })

const paketFilterOptions = getAdminPaketFilterOptions()
const accountStore = useAccountStore()

const search = ref('')
const filterStatus = ref('')
const filterPaket = ref('')
const page = ref(1)
const perPage = 10
const selectedPesanan = ref(null)
const confirmTarget = ref(null)
const confirmMaxUndangan = ref(1)
const confirmCatatan = ref('')
const confirmPassword = ref('')
const confirmError = ref('')
const confirmLoading = ref(false)
const toastMsg = ref('')

const statusLabel = {
  menunggu_konfirmasi: 'Menunggu', pending: 'Menunggu',
  dikonfirmasi: 'Dikonfirmasi', batal: 'Dibatalkan', proses: 'Diproses', selesai: 'Selesai',
}
const isAwaiting = (p) => p?.status === 'menunggu_konfirmasi' || p?.status === 'pending'

const chips = computed(() => [
  { label:'Total',       num:accountStore.orders.length,                                  color:'#1a2e45', bg:'#f0f7f6', border:'#d1ede9' },
  { label:'Menunggu',    num:accountStore.orders.filter(p=>isAwaiting(p)).length,          color:'#b45309', bg:'rgba(246,173,85,.1)',  border:'rgba(246,173,85,.3)' },
  { label:'Dikonfirmasi',num:accountStore.orders.filter(p=>p.status==='dikonfirmasi').length, color:'#166534', bg:'rgba(126,206,196,.1)', border:'rgba(126,206,196,.3)' },
  { label:'Dibatalkan',  num:accountStore.orders.filter(p=>p.status==='batal').length,     color:'#b91c1c', bg:'rgba(248,113,113,.1)', border:'rgba(248,113,113,.3)' },
])

const defaultKuota = computed(() => confirmTarget.value ? getDefaultMaxUndangan(confirmTarget.value.paket) : 1)

const filtered = computed(() => accountStore.orders.filter(p => {
  const ms = !filterStatus.value || p.status === filterStatus.value
  const mp = !filterPaket.value  || p.paket  === filterPaket.value
  const mq = !search.value || p.nama?.toLowerCase().includes(search.value.toLowerCase()) || p.email?.toLowerCase().includes(search.value.toLowerCase())
  return ms && mp && mq
}))
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))
const paginated = computed(() => filtered.value.slice((page.value-1)*perPage, page.value*perPage))

const detailRows = (p) => [
  { label:'ID', val:'#'+p.id }, { label:'Invoice', val:p.invoiceCode||'-' },
  { label:'Customer', val:p.nama }, { label:'Email', val:p.email },
  { label:'No. HP', val:p.hp||'-' }, { label:'Paket', val:p.paket },
  { label:'Total', val:'Rp '+p.total }, { label:'Tanggal', val:p.tanggal },
  { label:'Kuota', val:(p.maxUndangan??'-')+' undangan' },
  { label:'Status', val:statusLabel[p.status]||p.status },
  { label:'Catatan', val:p.catatan||'-' },
]

const lihat = (p) => { selectedPesanan.value = p }
const bukaKonfirmasi = (p) => {
  confirmTarget.value = p
  // Selalu pakai default kuota dari paket — tidak perlu input manual
  confirmMaxUndangan.value = getDefaultMaxUndangan(p.paket)
  confirmCatatan.value = ''; confirmPassword.value = ''; confirmError.value = ''
  selectedPesanan.value = null
}
const tutupKonfirmasi = () => { confirmTarget.value = null; confirmError.value = '' }
const jalankanKonfirmasi = async () => {
  const max = Number(confirmMaxUndangan.value)
  if (!max || max < 1) { confirmError.value = 'Kuota minimal 1.'; return }
  confirmLoading.value = true
  const result = await accountStore.confirmOrder(confirmTarget.value.id, { maxUndangan: max, catatanAdmin: confirmCatatan.value.trim(), password: confirmPassword.value.trim() })
  confirmLoading.value = false
  if (!result.ok) { confirmError.value = result.message; return }
  toastMsg.value = `✅ Pesanan #${confirmTarget.value.id} dikonfirmasi. Login: ${result.order?.email} / ${result.loginPassword}`
  tutupKonfirmasi()
  setTimeout(() => { toastMsg.value = '' }, 7000)
}
const tolak = async (p) => {
  const alasan = prompt(`Alasan penolakan #${p.id}:`) ?? ''
  const result = await accountStore.rejectOrder(p.id, alasan)
  if (!result.ok) alert(result.message)
  else { toastMsg.value = `Pesanan #${p.id} ditolak.`; setTimeout(() => { toastMsg.value = '' }, 3000) }
}
const hapus = (p) => { if (confirm(`Hapus pesanan #${p.id}?`)) accountStore.deleteOrder(p.id) }
</script>

<style scoped>
.pes-wrap { display:flex; flex-direction:column; gap:20px; }
.pes-chips { display:flex; flex-wrap:wrap; gap:10px; }
.pes-chip { display:flex; flex-direction:column; align-items:center; padding:10px 18px; border-radius:12px; border:1.5px solid; min-width:88px; gap:2px; }
.pes-chip-num { font-size:22px; font-weight:900; }
.pes-chip-lbl { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.4px; }
.pes-inv { font-size:10px; font-weight:700; color:#9ca3af; background:#f0f4f8; padding:2px 7px; border-radius:5px; display:inline-block; margin-top:3px; }
.pes-paid { font-size:10px; font-weight:700; color:#166534; background:rgba(104,211,145,.15); padding:2px 7px; border-radius:5px; display:inline-block; margin-top:3px; }
.pes-paket { font-size:11px; font-weight:700; background:rgba(126,206,196,.15); color:#0a7060; padding:3px 10px; border-radius:20px; white-space:nowrap; }
.pes-pagination { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; border-top:1px solid #e8edf3; flex-wrap:wrap; gap:10px; }
.pes-pg { width:32px; height:32px; border-radius:8px; border:1.5px solid #e8edf3; background:#fff; font-size:13px; font-weight:700; cursor:pointer; color:#1a2e45; font-family:inherit; transition:all .15s; }
.pes-pg:hover:not(:disabled) { border-color:#7ecec4; color:#7ecec4; }
.pes-pg.active { background:#1a2e45; color:#fff; border-color:#1a2e45; }
.pes-pg:disabled { opacity:.4; cursor:not-allowed; }
.pes-detail-row { display:flex; justify-content:space-between; gap:12px; padding:8px 0; border-bottom:1px solid #f5f7fa; }
.pes-detail-row:last-child { border-bottom:none; }

.modal-enter-active, .modal-leave-active { transition:opacity .2s; }
.modal-enter-from, .modal-leave-to { opacity:0; }
.fade-enter-active, .fade-leave-active { transition:opacity .25s; }
.fade-enter-from, .fade-leave-to { opacity:0; }
</style>
