<template>
  <div class="adm-dash">
    <!-- Stats -->
    <div class="adm-stats">
      <div v-for="(s, i) in summaryStats" :key="i" class="adm-stat" :style="{ borderLeftColor: s.color }">
        <div class="adm-stat-ico" :style="{ background: s.bg }"><span v-html="s.svg" /></div>
        <div><p class="adm-stat-num">{{ s.value }}</p><p class="adm-stat-lbl">{{ s.label }}</p></div>
      </div>
    </div>

    <!-- Quick links -->
    <div class="adm-shortcuts">
      <button class="adm-sc" @click="navigateTo('/admin/pesanan')">
        <span class="adm-sc-ico">📋</span><span>Kelola Pesanan</span>
        <span v-if="accountStore.pendingOrders.length" class="adm-sc-badge">{{ accountStore.pendingOrders.length }}</span>
      </button>
      <button class="adm-sc" @click="navigateTo('/admin/customers')">
        <span class="adm-sc-ico">👥</span><span>Data Customer</span>
      </button>
      <button class="adm-sc" @click="navigateTo('/admin/undangan')">
        <span class="adm-sc-ico">💌</span><span>Semua Undangan</span>
      </button>
      <button class="adm-sc" @click="navigateTo('/admin/asset')">
        <span class="adm-sc-ico">🖼</span><span>Kelola Asset</span>
      </button>
    </div>

    <!-- Recent orders -->
    <section class="adm-card">
      <div class="adm-card-head">
        <h2 class="adm-card-title">Pesanan Terbaru</h2>
        <button class="adm-btn-outline" @click="navigateTo('/admin/pesanan')">Lihat Semua →</button>
      </div>
      <div class="adm-table-wrap">
        <table class="adm-table">
          <thead><tr><th>ID</th><th>Customer</th><th>Paket</th><th>Tanggal</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="p in recentOrders" :key="p.id">
              <td class="td-mono">#{{ p.id }}</td>
              <td><div class="td-user"><div class="td-av">{{ (p.nama||'?')[0] }}</div><div><p class="td-nm">{{ p.nama }}</p><p class="td-sub">{{ p.email }}</p></div></div></td>
              <td>{{ p.paket }}</td>
              <td class="td-sub">{{ p.tanggal }}</td>
              <td><span class="adm-badge" :class="'bs-'+p.status">{{ statusLabel[p.status]||p.status }}</span></td>
            </tr>
            <tr v-if="!recentOrders.length"><td colspan="5" class="td-empty">Belum ada pesanan</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAccountStore } from '~/stores/useAccountStore'

definePageMeta({ layout: 'admin' })

const accountStore = useAccountStore()

const summaryStats = computed(() => [
  { label: 'Total Pesanan',         value: accountStore.orders.length,    color: '#7ecec4', bg: 'rgba(126,206,196,.12)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#7ecec4" stroke-width="2" width="20" height="20"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>` },
  { label: 'Menunggu Konfirmasi',   value: accountStore.pendingOrders.length, color: '#f6ad55', bg: 'rgba(246,173,85,.12)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#f6ad55" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
  { label: 'Total Customer',        value: accountStore.customers.length, color: '#68d391', bg: 'rgba(104,211,145,.12)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#68d391" stroke-width="2" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>` },
  { label: 'Total Undangan',        value: accountStore.invitations.length, color: '#b794f4', bg: 'rgba(183,148,244,.12)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#b794f4" stroke-width="2" width="20" height="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>` },
])

const statusLabel = {
  menunggu_konfirmasi: 'Menunggu', pending: 'Pending',
  dikonfirmasi: 'Dikonfirmasi', batal: 'Dibatalkan',
}

const recentOrders = computed(() => [...accountStore.orders].slice(0, 8))
</script>

<style scoped>
.adm-dash { display: flex; flex-direction: column; gap: 20px; }

/* Stats */
.adm-stats { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
@media(min-width:640px){ .adm-stats { grid-template-columns: repeat(4,1fr); } }
.adm-stat {
  background:#fff; border-radius:14px; padding:16px;
  display:flex; align-items:center; gap:14px;
  border:1.5px solid #e8edf3; border-left-width:4px;
}
.adm-stat-ico { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.adm-stat-num { font-size:26px; font-weight:900; color:#1a2e45; margin:0 0 2px; }
.adm-stat-lbl { font-size:12px; color:#6b7280; font-weight:600; margin:0; }

/* Shortcuts */
.adm-shortcuts { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
@media(min-width:640px){ .adm-shortcuts { grid-template-columns:repeat(4,1fr); } }
.adm-sc {
  display:flex; align-items:center; gap:10px;
  background:#fff; border:1.5px solid #e8edf3; border-radius:14px;
  padding:14px 16px; cursor:pointer; font-family:inherit;
  font-size:13px; font-weight:700; color:#1a2e45;
  transition:border-color .2s, box-shadow .2s; position:relative;
}
.adm-sc:hover { border-color:#7ecec4; box-shadow:0 2px 12px rgba(126,206,196,.15); }
.adm-sc-ico { font-size:20px; }
.adm-sc-badge {
  position:absolute; top:10px; right:10px;
  background:#ef4444; color:#fff; font-size:10px; font-weight:800;
  min-width:18px; height:18px; border-radius:9px;
  display:flex; align-items:center; justify-content:center; padding:0 4px;
}

/* Card */
.adm-card { background:#fff; border-radius:16px; border:1.5px solid #e8edf3; overflow:hidden; }
.adm-card-head { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid #e8edf3; flex-wrap:wrap; gap:8px; }
.adm-card-title { font-size:15px; font-weight:800; color:#1a2e45; margin:0; }
.adm-btn-outline { padding:7px 14px; border-radius:10px; border:1.5px solid #e8edf3; background:#fff; font-size:12px; font-weight:700; color:#4a5568; cursor:pointer; font-family:inherit; transition:border-color .2s; }
.adm-btn-outline:hover { border-color:#7ecec4; color:#1a2e45; }

/* Table */
.adm-table-wrap { overflow-x:auto; }
.adm-table { width:100%; border-collapse:collapse; font-size:13px; }
.adm-table th { text-align:left; padding:10px 16px; font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:.5px; border-bottom:1px solid #f0f4f8; background:#f7fafc; white-space:nowrap; }
.adm-table td { padding:11px 16px; border-bottom:1px solid #f5f7fa; vertical-align:middle; }
.adm-table tr:last-child td { border-bottom:none; }
.adm-table tr:hover td { background:#fafcff; }

.td-mono { font-weight:700; color:#7ecec4; font-family:monospace; }
.td-user { display:flex; align-items:center; gap:10px; }
.td-av { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,#7ecec4,#2a9d8f); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#fff; flex-shrink:0; }
.td-nm { font-size:13px; font-weight:700; color:#1a2e45; margin:0 0 1px; white-space:nowrap; }
.td-sub { font-size:11px; color:#9ca3af; margin:0; white-space:nowrap; }
.td-empty { text-align:center; color:#a0aec0; padding:24px; font-size:13px; }

/* Badges */
.adm-badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; white-space:nowrap; }
.bs-menunggu_konfirmasi,.bs-pending { background:rgba(246,173,85,.15); color:#b45309; }
.bs-dikonfirmasi { background:rgba(104,211,145,.15); color:#166534; }
.bs-batal { background:rgba(248,113,113,.15); color:#b91c1c; }
</style>
