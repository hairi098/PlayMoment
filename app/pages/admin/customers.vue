<template>
  <div class="cust-wrap">
    <!-- Stats -->
    <div class="cust-stats">
      <div class="cust-stat"><span class="cs-num">{{ customers.length }}</span><span class="cs-lbl">Total</span></div>
      <div class="cust-stat aktif"><span class="cs-num">{{ customers.filter(c=>c.status==='aktif').length }}</span><span class="cs-lbl">Aktif</span></div>
      <div class="cust-stat nonaktif"><span class="cs-num">{{ customers.filter(c=>c.status==='nonaktif').length }}</span><span class="cs-lbl">Nonaktif</span></div>
    </div>

    <!-- Table -->
    <div class="adm-card">
      <div class="adm-card-head">
        <h2 class="adm-card-title">Data Customer</h2>
        <div class="adm-filters">
          <input class="adm-input" style="min-width:180px" v-model="search" placeholder="Cari nama / email…" />
          <select class="adm-select" style="width:auto" v-model="filterStatus">
            <option value="">Semua Status</option><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option>
          </select>
          <select class="adm-select" style="width:auto" v-model="filterPaket">
            <option v-for="p in paketFilterOptions" :key="p||'all'" :value="p">{{ p||'Semua Paket' }}</option>
          </select>
          <button class="adm-btn adm-btn-teal" @click="openForm('add')">+ Buat Akun</button>
        </div>
      </div>
      <div class="adm-table-wrap">
        <table class="adm-table">
          <thead><tr><th>Customer</th><th>No. HP</th><th>Paket</th><th>Masa Aktif</th><th>Kuota</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            <tr v-for="c in paginated" :key="c.id">
              <td>
                <div class="td-user">
                  <div class="td-av" :style="{ background:(c.color||'#7ecec4')+'22', color:c.color||'#7ecec4' }">{{ (c.nama||'?')[0] }}</div>
                  <div><p class="td-nm">{{ c.nama }}</p><p class="td-sub">{{ c.email }}</p></div>
                </div>
              </td>
              <td class="td-sub">{{ c.hp }}</td>
              <td><span class="cust-paket">{{ c.paket }}</span></td>
              <td>
                <p class="td-nm" style="font-size:12px">{{ formatExpiryDate(c.expiryDate) }}</p>
                <p class="td-sub" :class="{ 'cust-expired': isExpired(c.expiryDate) }">{{ expiryLabel(c.expiryDate) }}</p>
              </td>
              <td class="td-nm" style="text-align:center">{{ accountStore.invitationCountByCustomer(c) }}/{{ (c.maxUndangan??1)>=99?'∞':(c.maxUndangan??1) }}</td>
              <td>
                <button class="cust-toggle" :class="{ aktif: c.status==='aktif' }" @click="toggleStatus(c)">
                  {{ c.status==='aktif' ? 'Aktif' : 'Nonaktif' }}
                </button>
              </td>
              <td>
                <div class="td-actions">
                  <button class="adm-btn adm-btn-outline adm-btn-sm" @click="openForm('edit',c)">Edit</button>
                  <button class="adm-btn adm-btn-outline adm-btn-sm" @click="openExtend(c)">Perpanjang</button>
                  <button class="adm-btn adm-btn-danger adm-btn-sm" @click="hapus(c)">Hapus</button>
                </div>
              </td>
            </tr>
            <tr v-if="!paginated.length"><td colspan="7" class="td-empty">Tidak ada customer</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cust-pagination">
        <span class="td-sub">{{ filtered.length }} customer</span>
        <div style="display:flex;gap:4px">
          <button class="pes-pg" :disabled="page===1" @click="page--">‹</button>
          <button v-for="n in totalPages" :key="n" class="pes-pg" :class="{active:page===n}" @click="page=n">{{ n }}</button>
          <button class="pes-pg" :disabled="page===totalPages" @click="page++">›</button>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <Transition name="modal">
      <div v-if="formOpen" class="adm-modal-overlay" @click.self="formOpen=false">
        <div class="adm-modal">
          <div class="adm-modal-head">
            <h3 class="adm-modal-title">{{ formMode==='add'?'Buat Akun Customer':'Edit Customer' }}</h3>
            <button class="adm-modal-close" @click="formOpen=false">✕</button>
          </div>
          <div class="adm-modal-body">
            <div class="adm-form-grid">
              <div class="adm-field"><label class="adm-label">Nama Lengkap</label><input class="adm-input" v-model="formData.nama" placeholder="Nama customer" /></div>
              <div class="adm-field"><label class="adm-label">Email</label><input class="adm-input" v-model="formData.email" type="email" placeholder="email@customer.com" /></div>
              <div class="adm-field"><label class="adm-label">Password {{ formMode==='edit'?'(kosong = tidak diubah)':'' }}</label><input class="adm-input" v-model="formData.password" type="password" placeholder="Min 8 karakter" /></div>
              <div class="adm-field"><label class="adm-label">No. HP</label><input class="adm-input" v-model="formData.hp" placeholder="08xx-xxxx-xxxx" /></div>
              <div class="adm-field"><label class="adm-label">Paket</label>
                <select class="adm-select" v-model="formData.paket"><option v-for="n in adminPaketNames" :key="n" :value="n">{{ n }}</option></select>
              </div>
              <div class="adm-field"><label class="adm-label">Kuota Undangan</label><input class="adm-input" v-model.number="formData.maxUndangan" type="number" min="1" max="99" /></div>
              <div class="adm-field"><label class="adm-label">Status</label>
                <select class="adm-select" v-model="formData.status"><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select>
              </div>
              <div v-if="formMode==='edit'" class="adm-field"><label class="adm-label">Masa Aktif Berakhir</label><input class="adm-input" v-model="formData.expiryDate" type="date" /></div>
            </div>
          </div>
          <div class="adm-modal-footer">
            <button class="adm-btn adm-btn-outline" @click="formOpen=false">Batal</button>
            <button class="adm-btn adm-btn-primary" @click="simpan">{{ formMode==='add'?'Buat Akun':'Simpan' }}</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Perpanjang Modal -->
    <Transition name="modal">
      <div v-if="extendOpen" class="adm-modal-overlay" @click.self="extendOpen=false">
        <div class="adm-modal">
          <div class="adm-modal-head">
            <h3 class="adm-modal-title">Perpanjang Masa Aktif</h3>
            <button class="adm-modal-close" @click="extendOpen=false">✕</button>
          </div>
          <div class="adm-modal-body">
            <p v-if="extendTarget" class="td-nm" style="margin:0 0 4px">{{ extendTarget.nama }}</p>
            <p v-if="extendTarget" class="td-sub" style="margin:0 0 16px">Berlaku s/d: {{ formatExpiryDate(extendTarget.expiryDate) }} ({{ expiryLabel(extendTarget.expiryDate) }})</p>
            <div class="cust-extend-quick">
              <button class="adm-btn adm-btn-outline adm-btn-sm" @click="applyExtend(7)">+7 hari</button>
              <button class="adm-btn adm-btn-outline adm-btn-sm" @click="applyExtend(30)">+30 hari</button>
              <button class="adm-btn adm-btn-outline adm-btn-sm" @click="applyExtend(90)">+90 hari</button>
            </div>
            <div class="adm-field" style="margin-top:14px"><label class="adm-label">Kustom (hari)</label><input class="adm-input" v-model.number="extendDays" type="number" min="1" max="365" /></div>
          </div>
          <div class="adm-modal-footer">
            <button class="adm-btn adm-btn-outline" @click="extendOpen=false">Batal</button>
            <button class="adm-btn adm-btn-teal" @click="applyExtend(extendDays)">Perpanjang</button>
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
import { getAdminPaketFilterOptions, getAdminPaketNames } from '~/config/paket'

definePageMeta({ layout: 'admin' })

const paketFilterOptions = getAdminPaketFilterOptions()
const adminPaketNames = getAdminPaketNames()
const accountStore = useAccountStore()

const search = ref(''); const filterStatus = ref(''); const filterPaket = ref('')
const page = ref(1); const perPage = 10
const formOpen = ref(false); const formMode = ref('add'); const editTarget = ref(null)
const extendOpen = ref(false); const extendTarget = ref(null); const extendDays = ref(30)
const formData = ref({ nama:'', email:'', password:'', hp:'', paket:'Basic', maxUndangan:1, status:'aktif', expiryDate:'' })

const toDateInputValue = (iso) => { if(!iso) return ''; const d=new Date(iso); return isNaN(d.getTime())?'':d.toISOString().slice(0,10) }
const formatExpiryDate = (iso) => { if(!iso) return '—'; const d=new Date(iso); return isNaN(d.getTime())?'—':d.toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) }
const daysUntilExpiry = (iso) => { if(!iso) return null; const end=new Date(iso); return isNaN(end.getTime())?null:Math.ceil((end.getTime()-Date.now())/86400000) }
const isExpired = (iso) => { const d=daysUntilExpiry(iso); return d!==null&&d<0 }
const expiryLabel = (iso) => { const d=daysUntilExpiry(iso); if(d===null) return 'Belum diatur'; if(d<0) return `Kadaluarsa ${Math.abs(d)} hari lalu`; if(d===0) return 'Berakhir hari ini'; return `${d} hari tersisa` }

const customers = computed(() => accountStore.customers)
const filtered = computed(() => customers.value.filter(c => {
  const ms=!filterStatus.value||c.status===filterStatus.value
  const mp=!filterPaket.value||c.paket===filterPaket.value
  const mq=!search.value||c.nama?.toLowerCase().includes(search.value.toLowerCase())||c.email?.toLowerCase().includes(search.value.toLowerCase())
  return ms&&mp&&mq
}))
const totalPages = computed(() => Math.max(1,Math.ceil(filtered.value.length/perPage)))
const paginated = computed(() => filtered.value.slice((page.value-1)*perPage, page.value*perPage))

const openForm = (mode, c=null) => {
  formMode.value=mode; editTarget.value=c
  formData.value = c ? { nama:c.nama, email:c.email, password:'', hp:c.hp, paket:c.paket, maxUndangan:c.maxUndangan??getDefaultMaxUndangan(c.paket), status:c.status, expiryDate:toDateInputValue(c.expiryDate) }
    : { nama:'', email:'', password:'', hp:'', paket:'Basic', maxUndangan:1, status:'aktif', expiryDate:'' }
  formOpen.value=true
}
const openExtend = (c) => { extendTarget.value=c; extendDays.value=30; extendOpen.value=true }
const applyExtend = async (days) => {
  if(!extendTarget.value) return
  const result = await accountStore.extendCustomerExpiry(extendTarget.value.id, days)
  if(!result?.ok) { alert(result?.message||'Gagal memperpanjang'); return }
  extendTarget.value = accountStore.getCustomerById(extendTarget.value.id)
  extendOpen.value=false
}
const simpan = async () => {
  if(!formData.value.nama||!formData.value.email) { alert('Nama dan email wajib!'); return }
  if(formMode.value==='add'&&(!formData.value.password||formData.value.password.length<8)) { alert('Password minimal 8 karakter'); return }
  if(formMode.value==='add') {
    await accountStore.addCustomer({ nama:formData.value.nama, email:formData.value.email, hp:formData.value.hp, paket:formData.value.paket, maxUndangan:formData.value.maxUndangan, password:formData.value.password, status:formData.value.status })
  } else if(editTarget.value) {
    const patch = { nama:formData.value.nama, email:formData.value.email, hp:formData.value.hp, paket:formData.value.paket, maxUndangan:formData.value.maxUndangan, status:formData.value.status }
    if(formData.value.password?.trim()) patch.password=formData.value.password.trim()
    if(formData.value.expiryDate) patch.expiryDate=new Date(formData.value.expiryDate).toISOString()
    await accountStore.updateCustomer(editTarget.value.id, patch)
  }
  formOpen.value=false
}
const toggleStatus = async (c) => { await accountStore.toggleCustomerStatus(c.id) }
const hapus = async (c) => { if(confirm(`Hapus akun ${c.nama}?`)) await accountStore.deleteCustomer(c.id) }
</script>

<style scoped>
.cust-wrap { display:flex; flex-direction:column; gap:20px; }
.cust-stats { display:flex; gap:10px; flex-wrap:wrap; }
.cust-stat { display:flex; flex-direction:column; align-items:center; padding:12px 20px; background:#fff; border:1.5px solid #e8edf3; border-radius:12px; min-width:90px; gap:2px; }
.cust-stat.aktif { border-color:rgba(104,211,145,.4); background:rgba(104,211,145,.06); }
.cust-stat.nonaktif { border-color:rgba(248,113,113,.4); background:rgba(248,113,113,.06); }
.cs-num { font-size:24px; font-weight:900; color:#1a2e45; }
.cs-lbl { font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.4px; }
.cust-paket { font-size:11px; font-weight:700; background:rgba(126,206,196,.15); color:#0a7060; padding:3px 10px; border-radius:20px; white-space:nowrap; }
.cust-expired { color:#b91c1c !important; }
.cust-toggle { border:none; border-radius:20px; padding:4px 12px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; background:rgba(248,113,113,.15); color:#b91c1c; transition:all .18s; }
.cust-toggle.aktif { background:rgba(104,211,145,.15); color:#166534; }
.cust-pagination { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; border-top:1px solid #e8edf3; flex-wrap:wrap; gap:10px; }
.cust-extend-quick { display:flex; gap:8px; flex-wrap:wrap; }
.pes-pg { width:32px; height:32px; border-radius:8px; border:1.5px solid #e8edf3; background:#fff; font-size:13px; font-weight:700; cursor:pointer; color:#1a2e45; font-family:inherit; }
.pes-pg:hover:not(:disabled) { border-color:#7ecec4; color:#7ecec4; }
.pes-pg.active { background:#1a2e45; color:#fff; border-color:#1a2e45; }
.pes-pg:disabled { opacity:.4; cursor:not-allowed; }
.modal-enter-active, .modal-leave-active { transition:opacity .2s; }
.modal-enter-from, .modal-leave-to { opacity:0; }
</style>
