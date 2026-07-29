<template>
  <div class="peng-wrap">
    <Transition name="fade"><div v-if="toastMsg" class="adm-toast">✅ {{ toastMsg }}</div></Transition>

    <div class="peng-layout">
      <!-- Tabs sidebar -->
      <div class="peng-tabs">
        <button v-for="t in tabs" :key="t.key" class="peng-tab" :class="{ active: activeTab===t.key }" @click="activeTab=t.key">
          <span v-html="t.svg" />{{ t.label }}
        </button>
      </div>

      <!-- Panel -->
      <div class="adm-card peng-panel">
        <!-- PROFIL -->
        <template v-if="activeTab==='profil'">
          <div class="adm-card-head"><h2 class="adm-card-title">Profil Admin</h2></div>
          <div class="adm-card-body">
            <div class="peng-avatar-row">
              <div class="peng-avatar">{{ profil.nama[0]||'A' }}</div>
              <div><p class="td-nm">{{ profil.nama }}</p><p class="td-sub">Super Admin</p></div>
            </div>
            <div class="adm-form-grid">
              <div class="adm-field"><label class="adm-label">Nama Lengkap</label><input class="adm-input" v-model="profil.nama" /></div>
              <div class="adm-field"><label class="adm-label">No. HP</label><input class="adm-input" v-model="profil.hp" /></div>
              <div class="adm-field" style="grid-column:1/-1"><label class="adm-label">Email</label><input class="adm-input" v-model="profil.email" type="email" /></div>
            </div>
            <p class="ba-section" style="margin-top:20px">Ganti Password</p>
            <div class="adm-form-grid">
              <div class="adm-field"><label class="adm-label">Password Lama</label><input class="adm-input" v-model="profil.passLama" :type="showPassLama?'text':'password'" placeholder="••••••••" /></div>
              <div class="adm-field"><label class="adm-label">Password Baru</label><input class="adm-input" v-model="profil.passBaru" :type="showPassBaru?'text':'password'" placeholder="Min 8 karakter" /></div>
              <div class="adm-field"><label class="adm-label">Konfirmasi Password</label><input class="adm-input" v-model="profil.passKonfirmasi" :type="showPassBaru?'text':'password'" placeholder="Ulangi password" /></div>
            </div>
            <div style="display:flex;justify-content:flex-end;margin-top:20px">
              <button class="adm-btn adm-btn-primary" @click="simpanProfil">Simpan Perubahan</button>
            </div>
          </div>
        </template>

        <!-- BISNIS -->
        <template v-if="activeTab==='bisnis'">
          <div class="adm-card-head"><h2 class="adm-card-title">Informasi Bisnis</h2></div>
          <div class="adm-card-body">
            <div class="adm-form-grid">
              <div class="adm-field"><label class="adm-label">Nama Brand</label><input class="adm-input" v-model="bisnis.nama" placeholder="NamaBrand" /></div>
              <div class="adm-field"><label class="adm-label">Tagline</label><input class="adm-input" v-model="bisnis.tagline" /></div>
              <div class="adm-field"><label class="adm-label">Email Bisnis</label><input class="adm-input" v-model="bisnis.email" type="email" /></div>
              <div class="adm-field"><label class="adm-label">No. WhatsApp</label><input class="adm-input" v-model="bisnis.wa" placeholder="62xxx" /></div>
              <div class="adm-field" style="grid-column:1/-1"><label class="adm-label">Alamat</label><textarea class="adm-textarea" v-model="bisnis.alamat" rows="2" /></div>
            </div>
            <p class="ba-section" style="margin-top:20px">Harga Paket</p>
            <div class="peng-paket-grid">
              <div v-for="p in paketList" :key="p.key" class="peng-paket-card">
                <p class="td-nm" style="font-size:13px">{{ p.key }}</p>
                <p class="td-sub" style="font-size:11px">{{ p.features }}</p>
                <div class="peng-price-input"><span class="td-sub" style="padding:0 8px">Rp</span><input class="adm-input" v-model="bisnis.harga[p.key]" type="text" style="border-left:none;border-radius:0 10px 10px 0" /></div>
              </div>
            </div>
            <div style="display:flex;justify-content:flex-end;margin-top:20px">
              <button class="adm-btn adm-btn-primary" @click="simpanBisnis">Simpan Perubahan</button>
            </div>
          </div>
        </template>

        <!-- NOTIFIKASI -->
        <template v-if="activeTab==='notif'">
          <div class="adm-card-head"><h2 class="adm-card-title">Notifikasi</h2></div>
          <div class="adm-card-body">
            <div class="peng-notif-list">
              <div v-for="n in notifSettings" :key="n.key" class="peng-notif-row">
                <div><p class="td-nm" style="font-size:13px;margin:0 0 3px">{{ n.label }}</p><p class="td-sub">{{ n.desc }}</p></div>
                <button class="peng-toggle" :class="{ on: n.val }" @click="n.val=!n.val"><span class="peng-toggle-knob" /></button>
              </div>
            </div>
            <div style="display:flex;justify-content:flex-end;margin-top:20px">
              <button class="adm-btn adm-btn-primary" @click="simpanNotif">Simpan</button>
            </div>
          </div>
        </template>

        <!-- KEAMANAN -->
        <template v-if="activeTab==='keamanan'">
          <div class="adm-card-head"><h2 class="adm-card-title">Keamanan</h2></div>
          <div class="adm-card-body">
            <div class="peng-sec-list">
              <div v-for="s in securityOpts" :key="s.key" class="peng-sec-row">
                <div class="peng-sec-ico" :style="{ background:s.bg, color:s.color }" v-html="s.svg" />
                <div style="flex:1"><p class="td-nm" style="font-size:13px;margin:0 0 3px">{{ s.label }}</p><p class="td-sub">{{ s.desc }}</p></div>
                <button class="adm-btn adm-btn-outline adm-btn-sm" @click="s.action">{{ s.btnLabel }}</button>
              </div>
            </div>
            <p class="ba-section" style="margin-top:24px">Sesi Aktif</p>
            <div class="peng-sesi-list">
              <div v-for="s in sesi" :key="s.id" class="peng-sesi-row">
                <div class="peng-sec-ico" style="background:#f0f4f8;color:#4a5568" v-html="s.svg" />
                <div style="flex:1"><p class="td-nm" style="font-size:13px;margin:0 0 3px">{{ s.device }}<span v-if="s.current" class="peng-current">Saat ini</span></p><p class="td-sub">{{ s.location }} · {{ s.time }}</p></div>
                <button v-if="!s.current" class="adm-btn adm-btn-danger adm-btn-sm" @click="revokeSession(s.id)">Cabut</button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getInitialBusinessPrices, getAdminPriceFormRows } from '~/config/paket'

definePageMeta({ layout: 'admin' })

const activeTab = ref('profil')
const toastMsg = ref('')
const showPassLama = ref(false); const showPassBaru = ref(false)
const showToast = (msg) => { toastMsg.value=msg; setTimeout(()=>{ toastMsg.value='' },3000) }

const tabs = [
  { key:'profil',   label:'Profil',      svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { key:'bisnis',   label:'Bisnis',      svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>' },
  { key:'notif',    label:'Notifikasi',  svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' },
  { key:'keamanan', label:'Keamanan',    svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
]

const profil = ref({ nama:'Admin Utama', email:'admin@brand.com', hp:'0812-0000-0001', passLama:'', passBaru:'', passKonfirmasi:'' })
const bisnis = ref({ nama:'NamaBrand', tagline:'Undangan Digital Terbaik', email:'info@brand.com', wa:'6281200000001', alamat:'Jl. Contoh No. 1', harga:getInitialBusinessPrices() })
const paketList = getAdminPriceFormRows()

const notifSettings = ref([
  { key:'pesananBaru',    label:'Pesanan Baru',         desc:'Notifikasi saat ada pesanan masuk.',          val:true },
  { key:'pesananSelesai', label:'Pesanan Selesai',       desc:'Notifikasi saat pesanan selesai.',            val:true },
  { key:'akunBaru',       label:'Akun Customer Baru',   desc:'Notifikasi saat customer baru mendaftar.',    val:false },
  { key:'pesananBatal',   label:'Pesanan Dibatalkan',    desc:'Notifikasi saat pesanan dibatalkan.',         val:true },
  { key:'emailSummary',   label:'Ringkasan Email',       desc:'Laporan singkat setiap Senin pagi.',          val:false },
])

const securityOpts = ref([
  { key:'twofa', label:'Autentikasi Dua Faktor', desc:'Tambah lapisan keamanan saat login.', btnLabel:'Aktifkan', bg:'rgba(126,206,196,.15)', color:'#0a7060', action:()=>showToast('Fitur 2FA segera tersedia.'), svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>' },
  { key:'log',   label:'Log Aktivitas',          desc:'Riwayat semua tindakan di panel admin.', btnLabel:'Lihat Log', bg:'rgba(246,173,85,.15)', color:'#c07a00', action:()=>showToast('Log sedang dimuat...'), svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
])

const sesi = ref([
  { id:1, device:'Chrome · Windows 11', location:'Banjarmasin, ID', time:'Aktif sekarang', current:true, svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
  { id:2, device:'Safari · iPhone',     location:'Jakarta, ID',     time:'2 jam lalu',   current:false, svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' },
])

const revokeSession = (id) => { sesi.value=sesi.value.filter(s=>s.id!==id); showToast('Sesi dicabut.') }
const simpanProfil = () => showToast('Profil berhasil disimpan.')
const simpanBisnis = () => showToast('Informasi bisnis berhasil disimpan.')
const simpanNotif  = () => showToast('Notifikasi berhasil disimpan.')
</script>

<style scoped>
.peng-wrap { display:flex; flex-direction:column; gap:20px; }
.peng-layout { display:grid; grid-template-columns:180px 1fr; gap:16px; align-items:start; }
@media(max-width:640px) { .peng-layout { grid-template-columns:1fr; } }
.peng-tabs { background:#fff; border-radius:14px; border:1.5px solid #e8edf3; overflow:hidden; display:flex; flex-direction:column; gap:2px; padding:8px; }
@media(max-width:640px) { .peng-tabs { flex-direction:row; flex-wrap:wrap; } }
.peng-tab { display:flex; align-items:center; gap:8px; padding:10px 12px; border-radius:10px; border:none; background:none; cursor:pointer; font-family:inherit; font-size:13px; font-weight:600; color:#6b7280; text-align:left; transition:all .18s; }
.peng-tab:hover { background:#f0f4f8; color:#1a2e45; }
.peng-tab.active { background:rgba(126,206,196,.15); color:#0a7060; font-weight:700; }
.peng-panel { min-height:300px; }
.peng-avatar-row { display:flex; align-items:center; gap:14px; margin-bottom:20px; }
.peng-avatar { width:52px; height:52px; border-radius:50%; background:linear-gradient(135deg,#7ecec4,#2a9d8f); display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:800; color:#fff; flex-shrink:0; }
.ba-section { font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:.8px; margin:0 0 12px; padding-bottom:8px; border-bottom:1px solid #f0f4f8; }
.peng-paket-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(180px,1fr)); gap:12px; }
.peng-paket-card { border:1.5px solid #e8edf3; border-radius:12px; padding:14px; }
.peng-price-input { display:flex; align-items:center; margin-top:8px; border:1.5px solid #e2e8f0; border-radius:10px; overflow:hidden; }
.peng-notif-list { display:flex; flex-direction:column; gap:2px; }
.peng-notif-row { display:flex; align-items:center; gap:14px; padding:14px 0; border-bottom:1px solid #f5f7fa; }
.peng-notif-row:last-child { border-bottom:none; }
.peng-toggle { width:44px; height:24px; border-radius:12px; border:none; background:#e5e7eb; cursor:pointer; position:relative; flex-shrink:0; transition:background .2s; }
.peng-toggle.on { background:#7ecec4; }
.peng-toggle-knob { position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; transition:transform .2s; }
.peng-toggle.on .peng-toggle-knob { transform:translateX(20px); }
.peng-sec-list, .peng-sesi-list { display:flex; flex-direction:column; gap:12px; }
.peng-sec-row, .peng-sesi-row { display:flex; align-items:center; gap:14px; padding:14px; border:1.5px solid #e8edf3; border-radius:12px; }
.peng-sec-ico { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.peng-current { margin-left:8px; font-size:10px; font-weight:700; color:#166534; background:rgba(104,211,145,.15); padding:2px 8px; border-radius:20px; }
.fade-enter-active, .fade-leave-active { transition:opacity .25s; }
.fade-enter-from, .fade-leave-to { opacity:0; }
</style>
