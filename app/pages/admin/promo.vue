<template>
  <div class="promo-wrap">
    <p class="adm-page-desc">Kode promo otomatis bisa dipakai di halaman checkout customer.</p>

    <div class="adm-card">
      <div class="adm-card-head">
        <h2 class="adm-card-title">Daftar Promo</h2>
        <button class="adm-btn adm-btn-teal" @click="openForm('add')">+ Promo Baru</button>
      </div>
      <div class="adm-table-wrap">
        <table class="adm-table">
          <thead><tr><th>Kode</th><th>Label</th><th>Diskon</th><th>Min. Belanja</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            <tr v-for="p in promos" :key="p.id">
              <td><code class="promo-code">{{ p.code }}</code></td>
              <td>{{ p.label }}</td>
              <td>
                <span v-if="p.type==='percent'">{{ p.value }}%</span>
                <span v-else>Rp {{ formatRp(p.value) }}</span>
                <span v-if="p.type==='percent'&&p.maxDiskon" class="td-sub"> (maks. Rp {{ formatRp(p.maxDiskon) }})</span>
              </td>
              <td>{{ p.minBelanja ? `Rp ${formatRp(p.minBelanja)}` : '—' }}</td>
              <td>
                <button class="promo-toggle" :class="{ on: p.active }" @click="toggle(p)">
                  {{ p.active ? 'Aktif' : 'Nonaktif' }}
                </button>
              </td>
              <td>
                <div class="td-actions">
                  <button class="adm-btn adm-btn-outline adm-btn-sm" @click="openForm('edit', p)">Edit</button>
                  <button class="adm-btn adm-btn-danger adm-btn-sm" @click="hapus(p)">Hapus</button>
                </div>
              </td>
            </tr>
            <tr v-if="!promos.length"><td colspan="6" class="td-empty">Belum ada promo</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Form Modal -->
    <Transition name="modal">
      <div v-if="formOpen" class="adm-modal-overlay" @click.self="formOpen=false">
        <div class="adm-modal">
          <div class="adm-modal-head">
            <h3 class="adm-modal-title">{{ formMode==='add' ? 'Tambah Promo' : 'Edit Promo' }}</h3>
            <button class="adm-modal-close" @click="formOpen=false">✕</button>
          </div>
          <div class="adm-modal-body">
            <div class="adm-field"><label class="adm-label">Kode Promo *</label><input class="adm-input" v-model="formData.code" placeholder="HEMAT10" style="text-transform:uppercase" /></div>
            <div class="adm-field"><label class="adm-label">Label</label><input class="adm-input" v-model="formData.label" placeholder="Diskon pelanggan baru" /></div>
            <div class="adm-field"><label class="adm-label">Tipe Diskon</label>
              <select class="adm-select" v-model="formData.type"><option value="fixed">Nominal (Rp)</option><option value="percent">Persen (%)</option></select>
            </div>
            <div class="adm-field"><label class="adm-label">{{ formData.type==='percent' ? 'Persen (%)' : 'Nominal (Rp)' }}</label><input class="adm-input" v-model.number="formData.value" type="number" min="1" /></div>
            <div v-if="formData.type==='percent'" class="adm-field"><label class="adm-label">Maks. Diskon (Rp)</label><input class="adm-input" v-model.number="formData.maxDiskon" type="number" min="0" placeholder="50000" /></div>
            <div class="adm-field"><label class="adm-label">Minimal Belanja (Rp)</label><input class="adm-input" v-model.number="formData.minBelanja" type="number" min="0" /></div>
            <div class="adm-field"><label class="adm-label">Status</label>
              <select class="adm-select" v-model="formData.active"><option :value="true">Aktif</option><option :value="false">Nonaktif</option></select>
            </div>
          </div>
          <div class="adm-modal-footer">
            <button class="adm-btn adm-btn-outline" @click="formOpen=false">Batal</button>
            <button class="adm-btn adm-btn-primary" @click="simpan">Simpan</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAccountStore } from '~/stores/useAccountStore'
import { formatRupiahNumber } from '~/config/paket'

definePageMeta({ layout: 'admin' })

const accountStore = useAccountStore()
const promos = computed(() => accountStore.promos)
const formatRp = (n) => formatRupiahNumber(Number(n) || 0)

const formOpen = ref(false)
const formMode = ref('add')
const editTarget = ref(null)
const formData = ref({ code:'', label:'', type:'fixed', value:10000, minBelanja:0, maxDiskon:null, active:true })

const openForm = (mode, p=null) => {
  formMode.value = mode; editTarget.value = p
  formData.value = p ? { code:p.code, label:p.label, type:p.type, value:p.value, minBelanja:p.minBelanja??0, maxDiskon:p.maxDiskon??null, active:p.active }
    : { code:'', label:'', type:'fixed', value:10000, minBelanja:0, maxDiskon:null, active:true }
  formOpen.value = true
}
const simpan = () => {
  const payload = { ...formData.value, maxDiskon: formData.value.maxDiskon||null }
  if (formMode.value==='add') accountStore.addPromo(payload)
  else if (editTarget.value) accountStore.updatePromo(editTarget.value.id, payload)
  formOpen.value = false
}
const toggle = (p) => accountStore.updatePromo(p.id, { ...p, active: !p.active })
const hapus = (p) => { if (confirm(`Hapus promo "${p.code}"?`)) accountStore.deletePromo(p.id) }
</script>

<style scoped>
.promo-wrap { display:flex; flex-direction:column; gap:20px; }
.promo-code { background:#f0f7f6; padding:4px 9px; border-radius:6px; font-weight:800; color:#0a7060; font-size:12px; }
.promo-toggle { border:none; border-radius:20px; padding:4px 12px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; background:rgba(248,113,113,.15); color:#b91c1c; transition:all .18s; }
.promo-toggle.on { background:rgba(104,211,145,.15); color:#166534; }
.modal-enter-active, .modal-leave-active { transition:opacity .2s; }
.modal-enter-from, .modal-leave-to { opacity:0; }
</style>
