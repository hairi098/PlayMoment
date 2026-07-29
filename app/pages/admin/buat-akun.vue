<template>
  <div class="ba-wrap">
    <!-- Success toast -->
    <Transition name="fade">
      <div v-if="successMsg" class="adm-toast" style="background:#166534">✅ {{ successMsg }}</div>
    </Transition>

    <div class="ba-grid">
      <!-- Form -->
      <div class="adm-card">
        <div class="adm-card-head">
          <h2 class="adm-card-title">Buat Akun Customer Baru</h2>
        </div>
        <div class="adm-card-body">
          <!-- Informasi Pribadi -->
          <p class="ba-section">Informasi Pribadi</p>
          <div class="adm-form-grid">
            <div class="adm-field">
              <label class="adm-label">Nama Lengkap *</label>
              <input class="adm-input" v-model="form.nama" placeholder="Nama lengkap" :class="{ 'ba-err': errors.nama }" @input="errors.nama=''" />
              <span v-if="errors.nama" class="ba-errmsg">{{ errors.nama }}</span>
            </div>
            <div class="adm-field">
              <label class="adm-label">No. HP *</label>
              <input class="adm-input" v-model="form.hp" placeholder="08xx-xxxx" :class="{ 'ba-err': errors.hp }" @input="errors.hp=''" />
              <span v-if="errors.hp" class="ba-errmsg">{{ errors.hp }}</span>
            </div>
            <div class="adm-field" style="grid-column:1/-1">
              <label class="adm-label">Email *</label>
              <input class="adm-input" v-model="form.email" type="email" placeholder="email@contoh.com" :class="{ 'ba-err': errors.email }" @input="errors.email=''" />
              <span v-if="errors.email" class="ba-errmsg">{{ errors.email }}</span>
            </div>
          </div>

          <!-- Password -->
          <p class="ba-section">Keamanan Akun</p>
          <div class="adm-form-grid">
            <div class="adm-field">
              <label class="adm-label">Password *</label>
              <div class="ba-pwd-wrap">
                <input class="adm-input" v-model="form.password" :type="showPass?'text':'password'" placeholder="Min 8 karakter" :class="{ 'ba-err': errors.password }" @input="errors.password=''" />
                <button class="ba-eye" type="button" @click="showPass=!showPass">{{ showPass?'🙈':'👁' }}</button>
              </div>
              <span v-if="errors.password" class="ba-errmsg">{{ errors.password }}</span>
            </div>
            <div class="adm-field">
              <label class="adm-label">Konfirmasi Password *</label>
              <div class="ba-pwd-wrap">
                <input class="adm-input" v-model="form.konfirmasi" :type="showKonfirmasi?'text':'password'" placeholder="Ulangi password" :class="{ 'ba-err': errors.konfirmasi }" @input="errors.konfirmasi=''" />
                <button class="ba-eye" type="button" @click="showKonfirmasi=!showKonfirmasi">{{ showKonfirmasi?'🙈':'👁' }}</button>
              </div>
              <span v-if="errors.konfirmasi" class="ba-errmsg">{{ errors.konfirmasi }}</span>
            </div>
          </div>

          <!-- Paket -->
          <p class="ba-section">Paket & Kuota</p>
          <div class="ba-paket-grid">
            <div v-for="p in paketOptions" :key="p.nama" class="ba-paket-card" :class="{ selected: form.paket===p.nama }" @click="form.paket=p.nama">
              <p class="ba-paket-name">{{ p.nama }}</p>
              <p class="ba-paket-masa" style="font-size:11px;color:#9ca3af">{{ p.masaLabel }}</p>
              <p class="ba-paket-harga">{{ p.harga }}</p>
              <span v-if="form.paket===p.nama" class="ba-paket-check">✓</span>
            </div>
          </div>
          <div class="adm-form-grid" style="margin-top:14px">
            <div class="adm-field">
              <label class="adm-label">Kuota Undangan</label>
              <input class="adm-input" v-model.number="form.maxUndangan" type="number" min="1" max="99" />
              <span class="td-sub">Default {{ form.paket }}: {{ defaultMaxUndangan }}</span>
            </div>
            <div class="adm-field">
              <label class="adm-label">Status Awal</label>
              <select class="adm-select" v-model="form.status"><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select>
            </div>
            <div class="adm-field" style="grid-column:1/-1">
              <label class="adm-label">Kode Invoice (opsional)</label>
              <input class="adm-input" v-model="form.invoiceCode" placeholder="ABC123" style="text-transform:uppercase" @input="invoiceLinkMsg=''" />
              <span v-if="invoiceLinkMsg" class="ba-errmsg" :class="{ ok: invoiceLinkOk }">{{ invoiceLinkMsg }}</span>
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
            <button class="adm-btn adm-btn-outline" type="button" @click="resetForm">Reset</button>
            <button class="adm-btn adm-btn-primary" type="button" @click="submit" :disabled="loading">
              {{ loading?'Menyimpan…':'Buat Akun' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar info -->
      <div class="ba-side">
        <div class="adm-card">
          <div class="adm-card-head"><h3 class="adm-card-title">Akun Terbaru</h3></div>
          <div class="adm-card-body" style="padding:12px 16px">
            <div v-if="!akunBaru.length" class="td-empty" style="padding:16px">Belum ada akun</div>
            <div v-for="c in akunBaru" :key="c.id" class="ba-recent">
              <div class="td-av" :style="{ background:(c.color||'#7ecec4')+'22', color:c.color||'#7ecec4' }">{{ (c.nama||'?')[0] }}</div>
              <div><p class="td-nm" style="font-size:12px">{{ c.nama }}</p><p class="td-sub">{{ c.email }}</p></div>
            </div>
          </div>
        </div>
        <div class="adm-card">
          <div class="adm-card-head"><h3 class="adm-card-title">Info Masa Aktif</h3></div>
          <div class="adm-card-body" style="padding:12px 16px">
            <div v-for="p in paketOptions" :key="p.nama" class="ba-masa-row">
              <span class="promo-code">{{ p.nama }}</span>
              <span class="td-nm" style="font-size:12px">{{ p.masaLabel }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAccountStore } from '~/stores/useAccountStore'
import { getDefaultMaxUndangan } from '~/utils/customer-quota'
import { getAdminPaketCards } from '~/config/paket'

definePageMeta({ layout: 'admin' })

const accountStore = useAccountStore()
const paketOptions = getAdminPaketCards()
const showPass = ref(false); const showKonfirmasi = ref(false)
const loading = ref(false); const successMsg = ref('')
const invoiceLinkMsg = ref(''); const invoiceLinkOk = ref(false)

const defaultForm = () => ({ nama:'', email:'', hp:'', password:'', konfirmasi:'', paket:'Premium', maxUndangan:getDefaultMaxUndangan('Premium'), status:'aktif', catatan:'', invoiceCode:'' })
const form = ref(defaultForm())
const errors = ref({ nama:'', email:'', hp:'', password:'', konfirmasi:'' })
const defaultMaxUndangan = computed(() => getDefaultMaxUndangan(form.value.paket))
const akunBaru = computed(() => accountStore.customers.slice(0,5))

watch(() => form.value.paket, (paket) => { form.value.maxUndangan = getDefaultMaxUndangan(paket) })

const resetForm = () => { form.value=defaultForm(); errors.value={nama:'',email:'',hp:'',password:'',konfirmasi:''}; invoiceLinkMsg.value=''; invoiceLinkOk.value=false }

const validate = () => {
  let ok=true
  if(!form.value.nama.trim()) { errors.value.nama='Nama wajib diisi.'; ok=false }
  if(!form.value.email.trim()) { errors.value.email='Email wajib.'; ok=false }
  else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) { errors.value.email='Format email tidak valid.'; ok=false }
  if(!form.value.hp.trim()) { errors.value.hp='No HP wajib.'; ok=false }
  if(!form.value.password) { errors.value.password='Password wajib.'; ok=false }
  else if(form.value.password.length<8) { errors.value.password='Min 8 karakter.'; ok=false }
  if(form.value.password!==form.value.konfirmasi) { errors.value.konfirmasi='Password tidak cocok.'; ok=false }
  return ok
}

const submit = async () => {
  if(!validate()) return
  loading.value=true
  const customer = await accountStore.addCustomer({ nama:form.value.nama, email:form.value.email, hp:form.value.hp, paket:form.value.paket, maxUndangan:form.value.maxUndangan, password:form.value.password, status:form.value.status })
  const code = form.value.invoiceCode?.trim()
  if(code && customer) {
    const linked = await accountStore.linkOrderToCustomerByInvoice(code, customer.id)
    invoiceLinkOk.value=linked.ok; invoiceLinkMsg.value=linked.ok?`Invoice ${code.toUpperCase()} ditautkan.`:linked.message
  }
  successMsg.value=`Akun "${form.value.nama}" berhasil dibuat!`
  setTimeout(() => { successMsg.value='' }, 4000)
  resetForm(); loading.value=false
}
</script>

<style scoped>
.ba-wrap { display:flex; flex-direction:column; gap:20px; }
.ba-grid { display:grid; grid-template-columns:1fr; gap:20px; }
@media(min-width:1100px) { .ba-grid { grid-template-columns:1fr 280px; } }
.ba-section { font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:.8px; margin:0 0 12px; padding-bottom:8px; border-bottom:1px solid #f0f4f8; }
.ba-err { border-color:#ef4444 !important; }
.ba-errmsg { font-size:11px; color:#ef4444; font-weight:600; }
.ba-errmsg.ok { color:#166534; }
.ba-pwd-wrap { position:relative; }
.ba-pwd-wrap .adm-input { padding-right:36px; }
.ba-eye { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:14px; }
.ba-paket-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
@media(max-width:600px) { .ba-paket-grid { grid-template-columns:1fr; } }
.ba-paket-card { border:2px solid #e8edf3; border-radius:12px; padding:14px; cursor:pointer; position:relative; transition:all .18s; background:#fff; }
.ba-paket-card:hover { border-color:#7ecec4; }
.ba-paket-card.selected { border-color:#1a2e45; background:#f7fafc; }
.ba-paket-name { font-size:14px; font-weight:800; color:#1a2e45; margin:0 0 3px; }
.ba-paket-harga { font-size:13px; font-weight:700; color:#7ecec4; margin:4px 0 0; }
.ba-paket-check { position:absolute; top:10px; right:10px; width:20px; height:20px; border-radius:50%; background:#1a2e45; color:#fff; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:900; }
.ba-side { display:flex; flex-direction:column; gap:16px; }
.ba-recent { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid #f5f7fa; }
.ba-recent:last-child { border-bottom:none; }
.ba-masa-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid #f5f7fa; }
.ba-masa-row:last-child { border-bottom:none; }
.promo-code { background:#f0f7f6; padding:3px 8px; border-radius:6px; font-weight:800; color:#0a7060; font-size:12px; }
.fade-enter-active, .fade-leave-active { transition:opacity .25s; }
.fade-enter-from, .fade-leave-to { opacity:0; }
</style>
