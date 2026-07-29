<template>
  <div class="lap-wrap">
    <!-- Filters -->
    <div class="adm-filters" style="margin-bottom:4px">
      <select class="adm-select" style="width:auto" v-model="filterPaket">
        <option v-for="p in paketFilterOptions" :key="p||'all'" :value="p">{{ p||'Semua Paket' }}</option>
      </select>
      <select class="adm-select" style="width:auto" v-model="filterStatus">
        <option value="">Semua Status</option><option value="selesai">Selesai</option>
        <option value="pending">Pending</option><option value="batal">Dibatalkan</option>
      </select>
      <button class="adm-btn adm-btn-outline" @click="exportCSV">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Export CSV
      </button>
    </div>

    <!-- KPI -->
    <div class="lap-kpi">
      <div v-for="k in kpis" :key="k.label" class="lap-kpi-card" :style="{ borderTopColor:k.color }">
        <div class="lap-kpi-ico" :style="{ background:k.bg, color:k.color }" v-html="k.svg" />
        <div><p class="adm-stat-num" style="font-size:20px">{{ k.value }}</p><p class="td-sub">{{ k.label }}</p></div>
      </div>
    </div>

    <!-- Charts row -->
    <div class="lap-charts">
      <!-- Bar chart -->
      <div class="adm-card" style="flex:2">
        <div class="adm-card-head"><h3 class="adm-card-title">Pendapatan Bulanan</h3><span class="td-sub">2026</span></div>
        <div class="adm-card-body">
          <div class="lap-bar-chart">
            <div v-for="(b,i) in barData" :key="i" class="lap-bar-col">
              <div class="lap-bar-wrap"><div class="lap-bar-fill" :style="{ height:(b.val/maxBar)*100+'%', background:b.val===maxBar?'#7ecec4':'#d1ede9' }" /></div>
              <div class="lap-bar-lbl">{{ b.month }}</div>
              <div class="td-sub" style="font-size:10px">{{ b.val>=1000?(b.val/1000).toFixed(0)+'k':b.val||'-' }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Donut -->
      <div class="adm-card" style="flex:1;min-width:200px">
        <div class="adm-card-head"><h3 class="adm-card-title">Distribusi Paket</h3></div>
        <div class="adm-card-body" style="display:flex;flex-direction:column;align-items:center;gap:14px">
          <svg viewBox="0 0 120 120" width="110" height="110">
            <circle cx="60" cy="60" r="48" fill="none" stroke="#f0f4f8" stroke-width="20"/>
            <circle cx="60" cy="60" r="48" fill="none" stroke="#7ecec4" stroke-width="20" :stroke-dasharray="`${paketPct.Basic*3.016} 301.6`" stroke-dashoffset="0" transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="48" fill="none" stroke="#f6ad55" stroke-width="20" :stroke-dasharray="`${paketPct.Standard*3.016} 301.6`" :stroke-dashoffset="`${-paketPct.Basic*3.016}`" transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="48" fill="none" stroke="#b794f4" stroke-width="20" :stroke-dasharray="`${paketPct.Premium*3.016} 301.6`" :stroke-dashoffset="`${-(paketPct.Basic+paketPct.Standard)*3.016}`" transform="rotate(-90 60 60)"/>
            <text x="60" y="56" text-anchor="middle" font-size="14" font-weight="800" fill="#1a2e45">{{ totalOrder }}</text>
            <text x="60" y="70" text-anchor="middle" font-size="8" fill="#9ca3af">pesanan</text>
          </svg>
          <div style="width:100%">
            <div v-for="p in paketLegend" :key="p.label" class="lap-legend-row">
              <span class="lap-legend-dot" :style="{ background:p.color }"/>
              <span class="td-nm" style="font-size:12px;flex:1">{{ p.label }}</span>
              <span class="td-sub">{{ paketPct[p.label]||0 }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction table -->
    <div class="adm-card">
      <div class="adm-card-head">
        <h3 class="adm-card-title">Riwayat Transaksi</h3>
        <input class="adm-input" style="min-width:180px" v-model="search" placeholder="Cari nama / ID…" />
      </div>
      <div class="adm-table-wrap">
        <table class="adm-table">
          <thead><tr><th>ID</th><th>Customer</th><th>Paket</th><th>Total</th><th>Tanggal</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="t in paginatedTx" :key="t.id">
              <td class="td-mono">#{{ t.id }}</td>
              <td><div class="td-user"><div class="td-av" :style="{ background:(t.color||'#7ecec4')+'22', color:t.color||'#7ecec4' }">{{ (t.nama||'?')[0] }}</div><div><p class="td-nm">{{ t.nama }}</p><p class="td-sub">{{ t.email }}</p></div></div></td>
              <td><span class="cust-paket">{{ t.paket }}</span></td>
              <td class="td-nm" style="white-space:nowrap">Rp {{ t.total }}</td>
              <td class="td-sub">{{ t.tanggal }}</td>
              <td><span class="adm-badge" :class="'bs-'+t.status">{{ statusLabel[t.status]||t.status }}</span></td>
            </tr>
            <tr v-if="!paginatedTx.length"><td colspan="6" class="td-empty">Tidak ada data</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cust-pagination">
        <span class="td-sub">{{ filteredTx.length }} transaksi</span>
        <div style="display:flex;gap:4px">
          <button class="pes-pg" :disabled="page===1" @click="page--">‹</button>
          <button v-for="n in totalPages" :key="n" class="pes-pg" :class="{active:page===n}" @click="page=n">{{ n }}</button>
          <button class="pes-pg" :disabled="page===totalPages" @click="page++">›</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAccountStore } from '~/stores/useAccountStore'
import { getAdminPaketFilterOptions, getAdminPaketNames, mapOrderToLaporanRow } from '~/config/paket'

definePageMeta({ layout: 'admin' })

const accountStore = useAccountStore()
const paketFilterOptions = getAdminPaketFilterOptions()
const filterPaket = ref(''); const filterStatus = ref(''); const search = ref('')
const page = ref(1); const perPage = 10

const statusLabel = { pending:'Pending', proses:'Diproses', selesai:'Selesai', batal:'Dibatalkan', menunggu_konfirmasi:'Menunggu', dikonfirmasi:'Dikonfirmasi' }
const colors = ['#7ecec4','#f6ad55','#b794f4','#68d391','#fc8181','#4299e1']

const transaksi = computed(() => accountStore.orders.map((o,i) => mapOrderToLaporanRow(o, colors[i%colors.length])))
const filteredTx = computed(() => transaksi.value.filter(t => {
  const ms=!filterStatus.value||t.status===filterStatus.value
  const mp=!filterPaket.value||t.paket===filterPaket.value
  const mq=!search.value||t.nama?.toLowerCase().includes(search.value.toLowerCase())||t.id?.includes(search.value)
  return ms&&mp&&mq
}))
const totalPages = computed(() => Math.max(1, Math.ceil(filteredTx.value.length/perPage)))
const paginatedTx = computed(() => filteredTx.value.slice((page.value-1)*perPage, page.value*perPage))
const totalOrder = computed(() => transaksi.value.length)
const totalRevenue = computed(() => transaksi.value.filter(t=>t.status==='selesai').reduce((s,t)=>s+parseInt((t.total||'0').replace(/\./g,''),10),0).toLocaleString('id-ID'))

const kpis = computed(() => [
  { label:'Total Pendapatan', value:'Rp '+totalRevenue.value, color:'#0a7060', bg:'rgba(126,206,196,.15)', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
  { label:'Total Pesanan', value:totalOrder.value, color:'#b45309', bg:'rgba(246,173,85,.15)', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg>' },
  { label:'Selesai', value:transaksi.value.filter(t=>t.status==='selesai').length, color:'#166534', bg:'rgba(104,211,145,.15)', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>' },
  { label:'Dibatalkan', value:transaksi.value.filter(t=>t.status==='batal').length, color:'#b91c1c', bg:'rgba(248,113,113,.15)', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>' },
])

const barData = ref([{month:'Jan',val:820},{month:'Feb',val:940},{month:'Mar',val:760},{month:'Apr',val:1100},{month:'Mei',val:1350},{month:'Jun',val:0},{month:'Jul',val:0},{month:'Agu',val:0},{month:'Sep',val:0},{month:'Okt',val:0},{month:'Nov',val:0},{month:'Des',val:0}])
const maxBar = computed(() => Math.max(...barData.value.map(b=>b.val),1))

const paketCount = computed(() => Object.fromEntries(getAdminPaketNames().map(n=>[n,transaksi.value.filter(t=>t.paket===n).length])))
const paketPct = computed(() => { const tot=totalOrder.value||1; return Object.fromEntries(getAdminPaketNames().map(n=>[n,Math.round(((paketCount.value[n]||0)/tot)*100)])) })
const paketLegend = [{label:'Basic',color:'#7ecec4'},{label:'Standard',color:'#f6ad55'},{label:'Premium',color:'#b794f4'},{label:'Prioritas',color:'#f59e0b'}]

const exportCSV = () => {
  const rows=[['ID','Nama','Email','Paket','Total','Tanggal','Status']]
  transaksi.value.forEach(t=>rows.push([t.id,t.nama,t.email,t.paket,t.total,t.tanggal,statusLabel[t.status]||t.status]))
  const a=document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(rows.map(r=>r.join(',')).join('\n')); a.download='laporan.csv'; a.click()
}
</script>

<style scoped>
.lap-wrap { display:flex; flex-direction:column; gap:20px; }
.lap-kpi { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
@media(min-width:640px) { .lap-kpi { grid-template-columns:repeat(4,1fr); } }
.lap-kpi-card { background:#fff; border-radius:14px; border:1.5px solid #e8edf3; border-top-width:3px; padding:16px; display:flex; align-items:center; gap:12px; }
.lap-kpi-ico { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.lap-charts { display:flex; gap:16px; flex-wrap:wrap; }
.lap-bar-chart { display:flex; align-items:flex-end; gap:6px; height:120px; padding-top:8px; }
.lap-bar-col { display:flex; flex-direction:column; align-items:center; gap:3px; flex:1; }
.lap-bar-wrap { width:100%; flex:1; display:flex; align-items:flex-end; }
.lap-bar-fill { width:100%; border-radius:4px 4px 0 0; min-height:2px; transition:height .3s; }
.lap-bar-lbl { font-size:10px; color:#9ca3af; font-weight:600; }
.lap-legend-row { display:flex; align-items:center; gap:8px; padding:6px 0; border-bottom:1px solid #f5f7fa; }
.lap-legend-row:last-child { border-bottom:none; }
.lap-legend-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.cust-paket { font-size:11px; font-weight:700; background:rgba(126,206,196,.15); color:#0a7060; padding:3px 10px; border-radius:20px; white-space:nowrap; }
.cust-pagination { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; border-top:1px solid #e8edf3; flex-wrap:wrap; gap:10px; }
.pes-pg { width:32px; height:32px; border-radius:8px; border:1.5px solid #e8edf3; background:#fff; font-size:13px; font-weight:700; cursor:pointer; color:#1a2e45; font-family:inherit; }
.pes-pg:hover:not(:disabled) { border-color:#7ecec4; }
.pes-pg.active { background:#1a2e45; color:#fff; border-color:#1a2e45; }
.pes-pg:disabled { opacity:.4; cursor:not-allowed; }
</style>
