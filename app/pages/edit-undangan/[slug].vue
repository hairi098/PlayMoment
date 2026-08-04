<template>
  <NuxtPage v-if="isChildRoute" />

  <div v-else class="ep-root">
    <!-- ══ LOADING OVERLAY ══ -->
    <Transition name="ep-overlay-fade">
      <div v-if="pageLoading" class="ep-page-loading-overlay">
        <div class="ep-loading-card">
          <div class="ep-loading-logo-wrap">
            <!-- Spinning ring -->
            <svg class="ep-spin-ring" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="5"/>
              <circle cx="50" cy="50" r="44" fill="none" stroke="#fff" stroke-width="5"
                stroke-linecap="round"
                stroke-dasharray="80 196"
                stroke-dashoffset="0"/>
            </svg>
            <img
              src="/playmoment/logo-white.png"
              alt="PlayMoment"
              class="ep-loading-logo"
            />
          </div>
          <p class="ep-loading-title">Menyiapkan data anda...</p>
          <p class="ep-loading-sub">
            Mohon tunggu sebentar, template sedang dimuat.
          </p>
        </div>
      </div>
    </Transition>
    <!-- ══ TOPBAR ══ -->
    <header class="ep-topbar">
      <button class="ep-back-btn" @click="$router.back()">
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m15 19-7-7 7-7"
          />
        </svg>
      </button>
      <h1 class="ep-topbar-title">
        {{
          store.undangan.judulPengaturan ||
          "— Belum ada judul pengaturan —"
        }}
      </h1>
      <button class="ep-share-btn" @click="goToKirim">
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </header>

    <!-- ══ SCROLLABLE BODY ══ -->
    <div class="ep-body">
      <!-- ── INFO STRIP: Aktif Sampai ── -->
      <div class="ep-info-strip">
        <div class="ep-info-left">
          <span class="ep-info-label">Masa Aktif Akun</span>
          <ClientOnly fallback="-">
            <span
              class="ep-info-date"
              :style="{ color: isAkunExpired ? '#e53e3e' : '' }"
            >
              {{ isAkunExpired ? "⚠ Sudah Berakhir" : masaAktifAkun }}
            </span>
          </ClientOnly>
        </div>
        <button class="ep-perpanjang-btn" @click="perpanjangOpen = true">
          Perpanjang
        </button>
      </div>

      <!-- ── PROMO BANNER ── -->
      <div class="ep-promo-banner">
        <div class="ep-promo-content">
          <div class="ep-promo-avatar">
            <img src="https://i.pravatar.cc/40?img=47" alt="admin" />
          </div>
          <div class="ep-promo-text">
            <strong>Bingung Bikin Sendiri?</strong>
            <span>Sini Kami Bantu Bikin Undangan</span>
          </div>
        </div>
        <a
          href="https://wa.me/628123456789"
          target="_blank"
          class="ep-promo-wa-btn"
        >
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
            />
          </svg>
          WhatsApp Admin
        </a>
      </div>

      <!-- ── SHORTCUT MENU ── -->
      <div class="ep-shortcut-grid">
        <button
          v-for="sc in shortcutMenus"
          :key="sc.key"
          class="ep-sc-item"
          @click="sc.action"
        >
          <div class="ep-sc-ico">
            <img
              :src="sc.img"
              :alt="sc.label"
              :style="{ width: '56px', height: '56px', objectFit: 'contain' }"
            />
          </div>
          <span>{{ sc.label }}</span>
        </button>
      </div>

      <!-- ── STATUS UNDANGAN ── -->
      <div class="ep-status-row">
        <!-- Status Undangan -->
        <div class="ep-status-card">
          <span class="ep-status-label">Status Undangan</span>
          <span style="margin-left:8px;" class="ep-badge-aktif" v-if="store.undanganAktif">Aktif</span>
          <span style="margin-left:8px;" class="ep-badge-nonaktif" v-else>Nonaktif</span>
          <button
            class="ep-toggle"
            :class="{ 'ep-toggle-on': store.undanganAktif }"
            style="margin-left: auto"
            @click="store.undanganAktif = !store.undanganAktif"
          >
            <span class="ep-toggle-knob"></span>
          </button>
        </div>

        <!-- Sound Effect -->
        <div class="ep-status-card" style="gap: 10px; align-items: center">
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#ff7940"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="flex-shrink: 0"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
          <div
            style="
              display: flex;
              flex-direction: column;
              gap: 2px;
              flex: 1;
              min-width: 0;
            "
          >
            <div style="display: flex; align-items: center; gap: 6px">
              <span class="ep-status-label" style="margin: 0"
                >Sound Effect</span
              >
              <span class="ep-badge-aktif" v-if="store.soundEffectAktif"
                >Aktif</span
              >
              <span class="ep-badge-nonaktif" v-else>Nonaktif</span>
            </div>
            <span style="font-size: 11px; color: #9ca3af; font-weight: 400"
              >Suara klik, hover &amp; buka undangan</span
            >
          </div>
          <button
            class="ep-toggle"
            :class="{ 'ep-toggle-on': store.soundEffectAktif }"
            style="flex-shrink: 0; margin-left: auto"
            @click="store.soundEffectAktif = !store.soundEffectAktif"
          >
            <span class="ep-toggle-knob"></span>
          </button>
        </div>

        <!-- Sound Typing -->
        <div class="ep-status-card" style="gap: 10px; align-items: center">
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#7c3aed"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="flex-shrink: 0"
          >
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
          </svg>
          <div
            style="
              display: flex;
              flex-direction: column;
              gap: 2px;
              flex: 1;
              min-width: 0;
            "
          >
            <div style="display: flex; align-items: center; gap: 6px">
              <span class="ep-status-label" style="margin: 0"
                >Sound Typing</span
              >
              <span class="ep-badge-aktif" v-if="store.soundTypingAktif"
                >Aktif</span
              >
              <span class="ep-badge-nonaktif" v-else>Nonaktif</span>
            </div>
            <span style="font-size: 11px; color: #9ca3af; font-weight: 400"
              >Suara tick saat mengetik input</span
            >
          </div>
          <button
            class="ep-toggle"
            :class="{ 'ep-toggle-on': store.soundTypingAktif }"
            style="flex-shrink: 0; margin-left: auto"
            @click="store.soundTypingAktif = !store.soundTypingAktif"
          >
            <span class="ep-toggle-knob"></span>
          </button>
        </div>
      </div>

      <!-- ── CUSTOM COLORS ── -->
      <div class="ep-colors-card">
        <h3 class="ep-colors-title">Custom Colors Undangan</h3>
        <div class="ep-colors-grid">
          <label v-for="c in customColors" :key="c.key" class="ep-color-item">
            <input
              type="color"
              class="ep-color-input"
              v-model="store.customColors[c.key]"
            />
            <span
              class="ep-color-dot"
              :style="{ background: store.customColors[c.key] }"
            ></span>
            <span class="ep-color-lbl">{{ c.label }}</span>
          </label>
        </div>
        <a href="#" class="ep-colors-tutorial">Tutorial</a>
        <button class="ep-save-btn" @click="simpanWarna">
          Simpan Perubahan
        </button>
        <Transition name="color-saved">
          <div v-if="warnaSaved" class="ep-color-saved-notice">
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Warna berhasil disimpan!
          </div>
        </Transition>
      </div>

      <!-- ── SECTION LIST ── -->
      <div class="ep-section-list">
        <div
          v-for="sec in store.themeSections"
          :key="sec.key"
          class="ep-sec-card"
          :class="{ 'ep-sec-off': !store.sectionStates[sec.key]?.active }"
          draggable="true"
          @dragstart="onDragStart($event, sec.key)"
          @dragover.prevent="dragOverKey = sec.key"
          @drop="onDrop($event, sec.key)"
          @dragend="onDragEnd"
          :style="
            dragOverKey === sec.key
              ? 'border-color: #7ecec4; background: #f0faf9'
              : ''
          "
        >
          <!-- Toggle pojok kanan atas -->
          <button
            class="ep-toggle ep-toggle-sm ep-sec-toggle-corner"
            :class="{ 'ep-toggle-on': store.sectionStates[sec.key]?.active }"
            @click.stop="toggleSection(sec.key)"
          >
            <span class="ep-toggle-knob"></span>
          </button>
          <div class="ep-sec-ico-wrap">
            <img
              :src="sectionIcons[sec.key]?.img || ''"
              :alt="sec.name"
              class="ep-sec-ico-img"
            />
          </div>
          <span class="ep-sec-name">{{ sec.name }}</span>
          <div class="ep-sec-actions">
            <button class="ep-edit-btn" @click.stop="openSectionEdit(sec)">
              Edit
            </button>
          </div>
        </div>
      </div>

      <!-- ── MUSIC FOOTER STRIP ── -->
      <div class="ep-music-strip">
        <div class="ep-music-strip-header">
          <span class="ep-music-strip-title">Music</span>
          <span class="ep-badge-aktif" v-if="store.musikAktif">Aktif</span>
          <span class="ep-badge-nonaktif" v-else>Nonaktif</span>
          <button
            class="ep-toggle ep-toggle-sm"
            :class="{ 'ep-toggle-on': store.musikAktif }"
            style="margin-left: auto"
            @click="store.musikAktif = !store.musikAktif"
          >
            <span class="ep-toggle-knob"></span>
          </button>
        </div>
        <div class="ep-music-now">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#7ecec4" stroke-width="2" />
            <polygon points="10 8 16 12 10 16 10 8" fill="#7ecec4" />
          </svg>
          <span class="ep-music-name">{{
            store.undangan.musik || "Bermuara - Mahalini & Rizky Febian"
          }}</span>
          <button class="ep-music-ganti-btn" @click="musikOpen = true">
            Ganti
          </button>
        </div>
        <div class="ep-music-actions">
          <button class="ep-btn-outline" @click="musikOpen = true">
            Costum Music
          </button>
          <button class="ep-btn-primary" @click="musikOpen = true">
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Music
          </button>
        </div>
      </div>

      <!-- ── WATERMARK — grup sendiri, di luar modal Music ── -->
      <div class="ep-wm-section">
        <div class="ep-wm-header-left">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M12 2v20M2 12h20" stroke="#7ecec4" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
            <circle cx="12" cy="12" r="9" stroke="#7ecec4" stroke-width="2"/>
          </svg>
          <span class="ep-wm-title">Watermark</span>
        </div>

        <template v-if="accountStore.currentUser?.role === 'admin'">
          <div class="ep-status-card">
            <span class="ep-status-label">Watermark Logo</span>
            <span class="ep-badge-aktif" v-if="store.showLogoWatermark">Aktif</span>
            <span class="ep-badge-nonaktif" v-else>Nonaktif</span>
            <button
              class="ep-toggle"
              :class="{ 'ep-toggle-on': store.showLogoWatermark }"
              style="margin-left: auto"
              @click="store.showLogoWatermark = !store.showLogoWatermark"
            >
              <span class="ep-toggle-knob"></span>
            </button>
          </div>

          <div class="ep-status-card">
            <span class="ep-status-label">Watermark Musik</span>
            <span style="margin-left:10px;" class="ep-badge-aktif" v-if="store.showMusikWatermark">Aktif</span>
            <span style="margin-left:10px;" class="ep-badge-nonaktif" v-else>Nonaktif</span>
            <button
              class="ep-toggle"
              :class="{ 'ep-toggle-on': store.showMusikWatermark }"
              style="margin-left: auto"
              @click="store.showMusikWatermark = !store.showMusikWatermark"
            >
              <span class="ep-toggle-knob"></span>
            </button>
          </div>
        </template>

        <template v-else>
          <div v-if="store.showLogoWatermark || store.showMusikWatermark" class="ep-wm-info ep-wm-btn-row">
            <a
              v-if="store.showLogoWatermark"
              :href="waHapusLogoUrl"
              target="_blank"
              class="ep-wm-hapus-btn"
            >
              Hapus Logo
            </a>
            <a
              v-if="store.showMusikWatermark"
              :href="waHapusMusikUrl"
              target="_blank"
              class="ep-wm-hapus-btn"
            >
              Hapus Musik
            </a>
          </div>
        </template>
      </div>


      <!-- ── HUBUNGI ADMIN ── -->
      <div class="ep-admin-bar">
        <a
          href="https://wa.me/628123456789"
          target="_blank"
          class="ep-admin-btn"
        >
          Hubungi Admin
        </a>
      </div>
    </div>
    <!-- /ep-body -->

    <!-- ══ PREVIEW MODE: dibuka di tab baru via /preview/[slug] ══ -->

    <!-- ══════════════════════════════════════════════
         MODALS NUXT UI
    ══════════════════════════════════════════════ -->

    <!-- ── MODAL: RSVP Settings ── -->
    <UModal v-model:open="rsvpOpen" title="RSVP Settings" :ui="modalUi">
      <template #body>
        <div class="modal-body-pad">
          <!-- Toggle Fitur RSVP -->
          <div
            class="modal-toggle-row"
            style="
              border: 1.5px solid #7ecec4;
              border-radius: 12px;
              padding: 12px 16px;
              margin-bottom: 20px;
            "
          >
            <div>
              <span class="modal-row-label">Fitur RSVP</span>
              <span
                class="ep-badge-aktif"
                v-if="store.rsvpAktif"
                style="margin-left: 8px"
                >Aktif</span
              >
              <span class="ep-badge-nonaktif" v-else style="margin-left: 8px"
                >Nonaktif</span
              >
            </div>
            <button
              class="ep-toggle"
              @click="store.setRsvpAktif(!store.rsvpAktif)"
              :class="{ 'ep-toggle-on': store.rsvpAktif }"
            >
              <span class="ep-toggle-knob"></span>
            </button>
          </div>

          <p class="modal-section-label">Kolom Inputan</p>
          <p class="modal-section-sub">
            Atur kolom inputan yang ingin ditampilkan
          </p>

          <!-- RSVP Fields -->
          <div class="rsvp-fields-list">
            <div
              v-for="field in store.rsvpFields"
              :key="field.key"
              class="rsvp-field-row-wrap"
            >
              <!-- Row utama -->
              <div class="rsvp-field-row">
                <span class="rsvp-field-name">{{ field.label }}</span>
                <div class="rsvp-field-actions">
                  <button
                    class="ep-toggle ep-toggle-sm"
                    :class="{ 'ep-toggle-on': field.active }"
                    @click="toggleRsvpField(field)"
                  >
                    <span class="ep-toggle-knob"></span>
                  </button>
                  <button
                    class="ep-edit-btn"
                    :class="{
                      'ep-edit-btn-active': expandedRsvpKey === field.key,
                    }"
                    @click="toggleExpandRsvp(field.key)"
                  >
                    <svg
                      width="12"
                      height="12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Expand: form lengkap per field -->
              <div
                v-if="expandedRsvpKey === field.key"
                class="rsvp-field-expand"
              >
                <!-- Label -->
                <div class="rsvp-expand-group">
                  <label class="rsvp-expand-label">Label</label>
                  <input
                    class="modal-input"
                    v-model="field.label"
                    placeholder="Nama label..."
                    @input="saveRsvpFields(field)"
                  />
                </div>

                <!-- Value / Default — khusus kehadiran: select option -->
                <div class="rsvp-expand-group" v-if="field.key === 'kehadiran'">
                  <label class="rsvp-expand-label">Pilihan Kehadiran</label>
                  <div class="rsvp-options-list">
                    <div
                      v-for="(opt, idx) in field.options || [
                        'Hadir',
                        'Tidak Hadir',
                        'Mungkin Hadir',
                      ]"
                      :key="idx"
                      class="rsvp-option-item"
                    >
                      <input
                        class="modal-input rsvp-option-input"
                        :value="opt"
                        @input="
                          updateRsvpOption(field, idx, $event.target.value)
                        "
                        :placeholder="'Opsi ' + (idx + 1)"
                      />
                      <button
                        class="rsvp-option-del"
                        @click="removeRsvpOption(field, idx)"
                        v-if="(field.options || []).length > 1"
                        title="Hapus opsi"
                      >
                        ✕
                      </button>
                    </div>
                    <button
                      class="rsvp-add-option-btn"
                      @click="addRsvpOption(field)"
                    >
                      + Tambah Opsi
                    </button>
                  </div>
                  <label class="rsvp-expand-label" style="margin-top: 10px"
                    >Default Terpilih</label
                  >
                  <select
                    class="modal-input modal-select"
                    v-model="field.defaultValue"
                    @change="saveRsvpFields(field)"
                  >
                    <option value="">— Tidak ada default —</option>
                    <option
                      v-for="opt in field.options || [
                        'Hadir',
                        'Tidak Hadir',
                        'Mungkin Hadir',
                      ]"
                      :key="opt"
                      :value="opt"
                    >
                      {{ opt }}
                    </option>
                  </select>
                </div>

                <!-- Value — khusus jumlah: number + maxTamu -->
                <div
                  class="rsvp-expand-group"
                  v-else-if="field.key === 'jumlah'"
                >
                  <label class="rsvp-expand-label">Value Default</label>
                  <input
                    class="modal-input"
                    type="number"
                    min="1"
                    :max="field.maxTamu || 10"
                    v-model="field.defaultValue"
                    placeholder="Contoh: 2"
                    @input="saveRsvpFields(field)"
                  />
                  <label class="rsvp-expand-label" style="margin-top: 10px"
                    >Maksimal Tamu</label
                  >
                  <input
                    class="modal-input"
                    type="number"
                    min="1"
                    max="100"
                    v-model.number="field.maxTamu"
                    placeholder="Contoh: 5"
                    @input="saveRsvpFields(field)"
                  />
                </div>

                <!-- Value — field lainnya: text biasa -->
                <div class="rsvp-expand-group" v-else>
                  <label class="rsvp-expand-label">Value Default</label>
                  <input
                    class="modal-input"
                    v-model="field.defaultValue"
                    :placeholder="field.placeholder || 'Nilai default...'"
                    @input="saveRsvpFields(field)"
                  />
                </div>

                <!-- Wajib Diisi -->
                <div class="rsvp-expand-group">
                  <label class="rsvp-expand-label">Wajib Diisi</label>
                  <select
                    class="modal-input modal-select"
                    v-model="field.required"
                    @change="saveRsvpFields(field)"
                  >
                    <option :value="true">Ya</option>
                    <option :value="false">Tidak</option>
                  </select>
                </div>

                <!-- Read Only -->
                <div class="rsvp-expand-group">
                  <label class="rsvp-expand-label">Read Only</label>
                  <select
                    class="modal-input modal-select"
                    v-model="field.readOnly"
                    @change="saveRsvpFields(field)"
                  >
                    <option :value="false">Tidak</option>
                    <option :value="true">Ya</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="modal-footer-btns">
          <UButton class="btn-footer-primary" @click="rsvpOpen = false"
            >Simpan Perubahan</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- ── MODAL: Pengaturan ── -->
    <UModal v-model:open="pengaturanOpen" title="Pengaturan" :ui="modalUi">
      <template #body>
        <div class="modal-body-pad">
          <p class="modal-section-label" style="margin-bottom: 12px">
            Tampilan share di WhatsApp
          </p>

          <!-- WA Preview Card — foto landscape penuh di atas, teks di bawah -->
          <div class="wa-preview-card">
            <!-- Foto landscape full width -->
            <div
              class="wa-preview-img wa-preview-img-upload"
              title="Klik untuk ganti thumbnail"
              @click="
                openImageModal(
                  'thumbnailWa',
                  store.undangan.thumbnailWa,
                  'WA Thumbnail',
                )
              "
            >
              <img
                v-if="store.undangan.thumbnailWa"
                :src="store.undangan.thumbnailWa"
                alt="thumbnail wa"
              />
              <div v-else class="wa-preview-placeholder">
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#aaa"
                  stroke-width="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="#aaa" stroke="none" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
                <span>Klik untuk upload foto</span>
              </div>
              <div class="wa-thumb-overlay">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  stroke-width="2.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Ganti Foto</span>
              </div>
            </div>
            <!-- Teks di bawah foto -->
            <div class="wa-preview-text">
              <strong>{{
                store.undangan.judulPengaturan ||
                store.undangan.judul ||
                "The Wedding Of Adam & Hawa"
              }}</strong>
              <p>
                {{
                  store.undangan.deskripsi ||
                  "Tanpa Mengurangi Rasa Hormat. Kami Bermaksud Mengundang Bapak/Ibu/Saudara/i, Pada Acara Pernikahan Kami."
                }}
              </p>
              <div class="wa-preview-domain">
                🔗 playmoment.id/{{ store.undangan.domain || "slug-undangan" }}
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="modal-field-group">
            <label class="modal-field-label">Judul (WA & Preview)</label>
            <p style="font-size: 12px; color: #888; margin: 2px 0 6px 0">
              Muncul di topbar editor, thumbnail WhatsApp, dan daftar undangan.
              <strong style="color: #e53e3e">Tidak terhubung ke konten tema/cover undangan.</strong>
            </p>
            <input
              class="modal-input"
              v-model="store.undangan.judulPengaturan"
              placeholder="Contoh: The Wedding Of Adam & Hawa"
            />
          </div>
          <div class="modal-field-group">
            <label class="modal-field-label">Link Undangan (slug)</label>
            <div class="domain-input-wrap">
              <span class="domain-prefix">playmoment.id/</span>
              <input
                class="modal-input domain-input"
                v-model="store.undangan.domain"
                placeholder="abu-dan-faizah"
                @input="syncPublicSlugFromDomain"
              />
            </div>
          </div>
          <div class="modal-field-group">
            <label class="modal-field-label">Deskripsi Singkat</label>
            <textarea
              class="modal-textarea"
              v-model="store.undangan.deskripsi"
              rows="4"
              placeholder="Tanpa Mengurangi Rasa Hormat. Kami Bermaksud Mengundang..."
            ></textarea>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="modal-footer-btns">
          <UButton class="btn-footer-primary" @click="simpanPengaturan"
            >Simpan Perubahan</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- ── MODAL: Music ── -->
    <UModal v-model:open="musikOpen" title="Music" :ui="modalUi">
      <template #body>
        <div class="modal-body-pad">
          <!-- Toggle Fitur Music -->
          <div
            class="modal-toggle-row"
            style="border: 1.5px solid #7ecec4; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px;"
          >
            <div>
              <span class="modal-row-label">Fitur Music</span>
              <span class="ep-badge-aktif" v-if="store.musikAktif" style="margin-left: 8px">Aktif</span>
              <span class="ep-badge-nonaktif" v-else style="margin-left: 8px">Nonaktif</span>
            </div>
            <button class="ep-toggle" :class="{ 'ep-toggle-on': store.musikAktif }" @click="store.musikAktif = !store.musikAktif">
              <span class="ep-toggle-knob"></span>
            </button>
          </div>

          <!-- Search Bar -->
          <div class="musik-search-row">
            <input
              class="musik-search-input"
              v-model="musikSearch"
              placeholder="Cari Music..."
            />
            <button class="musik-search-btn" @click="musikSearch = ''">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>

          <!-- Lagu List -->
          <div class="musik-list">
            <div
              v-for="lagu in filteredLagu"
              :key="lagu.title"
              class="musik-item"
              :class="{
                'musik-item-selected': store.undangan.musik === lagu.title,
              }"
            >
              <div class="musik-item-left">
                <button
                  class="musik-play-btn"
                  :class="{ 'is-playing': playingUrl === lagu.url }"
                  @click.stop="togglePlay(lagu)"
                  :title="playingUrl === lagu.url ? 'Pause' : 'Preview'"
                >
                  <!-- Pause icon -->
                  <svg v-if="playingUrl === lagu.url" width="14" height="14" fill="#7ecec4" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1"/>
                    <rect x="14" y="4" width="4" height="16" rx="1"/>
                  </svg>
                  <!-- Play icon -->
                  <svg v-else width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#7ecec4" stroke-width="2"/>
                    <polygon points="10 8 16 12 10 16 10 8" fill="#7ecec4"/>
                  </svg>
                </button>
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                    min-width: 0;
                  "
                >
                  <span class="musik-title">{{ lagu.title }}</span>
                  <span
                    v-if="lagu.artis && lagu.artis !== '-'"
                    style="font-size: 10px; color: #9ca3af; font-weight: 500"
                    >{{ lagu.artis }}</span
                  >
                </div>
              </div>
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  flex-shrink: 0;
                "
              >
                <span
                  v-if="lagu.durasi && lagu.durasi !== '-'"
                  style="font-size: 10px; color: #a0aec0; font-weight: 600"
                  >{{ lagu.durasi }}</span
                >
                <button
                  class="musik-pilih-btn"
                  :class="{
                    'musik-pilih-active': store.undangan.musik === lagu.title,
                  }"
                  @click="
                    store.undangan.musik = lagu.title;
                    store.undangan.musikUrl = lagu.url;
                  "
                >
                  {{
                    store.undangan.musik === lagu.title ? "✓ Dipilih" : "Pilih"
                  }}
                </button>
              </div>
            </div>
            <div
              v-if="filteredLagu.length === 0"
              style="
                text-align: center;
                padding: 24px 0;
                color: #9ca3af;
                font-size: 13px;
              "
            >
              Belum ada musik. Upload di <strong>Admin → Kelola Asset</strong>.
            </div>
          </div>

          <button class="musik-load-more" @click="loadMoreMusik">
            Load More
          </button>
        </div>
      </template>
      <template #footer>
        <div class="modal-footer-btns">
          <UButton class="btn-footer-cancel" @click="musikOpen = false; if(_previewAudio){_previewAudio.pause();_previewAudio=null;playingUrl=''}"
            >Batal</UButton
          >
          <UButton class="btn-footer-primary" @click="musikOpen = false; if(_previewAudio){_previewAudio.pause();_previewAudio=null;playingUrl=''}"
            >Simpan Perubahan</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- ── MODAL: Edit Section ── -->
    <UModal
      v-model:open="sectionEditOpen"
      :title="activeSec?.name || 'Edit Section'"
      :ui="modalUi"
    >
      <template #body>
        <div class="modal-body-pad" v-if="activeSec">
          <!-- Toggle aktif section -->
          <div
            class="modal-toggle-row"
            style="
              border: 1.5px solid #7ecec4;
              border-radius: 12px;
              padding: 12px 16px;
              margin-bottom: 16px;
            "
          >
            <div>
              <span class="modal-row-label">Section</span>
              <span
                class="ep-badge-aktif"
                style="margin-left: 8px"
                v-if="store.sectionStates[activeSec.key]?.active"
                >Aktif</span
              >
              <span
                v-else
                style="
                  margin-left: 8px;
                  background: #fee2e2;
                  color: #ef4444;
                  font-size: 11px;
                  font-weight: 700;
                  padding: 2px 8px;
                  border-radius: 20px;
                "
                >Nonaktif</span
              >
            </div>
            <button
              class="ep-toggle"
              :class="{
                'ep-toggle-on': store.sectionStates[activeSec.key]?.active,
              }"
              @click="toggleSection(activeSec.key)"
            >
              <span class="ep-toggle-knob"></span>
            </button>
          </div>

          <!-- Header info section -->
          <div class="sec-modal-header">
            <img
              v-if="sectionIcons[activeSec.key]?.img"
              :src="sectionIcons[activeSec.key].img"
              :alt="activeSec.name"
              :style="{ width: sectionIcons[activeSec.key].width || '38px', height: 'auto', objectFit: 'contain' }"
            />
            <span
              v-else
              class="sec-modal-ico"
              v-html="activeSec.iconSvg"
              :style="{ color: activeSec.color }"
            ></span>
            <div>
              <p class="sec-modal-title">{{ activeSec.name }}</p>
              <p class="sec-modal-sub">Isi data untuk section ini</p>
            </div>
          </div>

          <!-- Form field — accordion expand style -->
          <div v-if="sectionFields[activeSec.key]" class="sec-form-list">
            <div
              v-for="fd in sectionFields[activeSec.key]"
              :key="fd._group || fd.field"
            >
              <!-- Group header pemisah -->
              <div v-if="fd._group" class="sec-group-header">
                {{ fd._group }}
              </div>

              <!-- Field baris biasa -->
              <div v-else class="sec-field-row-wrap">
                <!-- Baris utama: label + toggle + tombol edit -->
                <div class="sec-field-row">
                  <span class="sec-field-name">{{ fd.label }}</span>
                  <div class="sec-field-actions">
                    <button
                      v-if="fd.type !== 'visibility-only'"
                      class="ep-edit-btn"
                      :class="{
                        'ep-edit-btn-active': expandedFieldKey === fd.field,
                      }"
                      @click="
                        expandedFieldKey =
                          expandedFieldKey === fd.field ? null : fd.field
                      "
                    >
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <path
                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        />
                      </svg>
                    </button>
                    <button
                      class="ep-toggle ep-toggle-sm"
                      :class="{
                        'ep-toggle-on': isFieldActive(activeSec.key, fd),
                      }"
                      @click="toggleField(activeSec.key, fd)"
                    >
                      <span class="ep-toggle-knob"></span>
                    </button>
                  </div>
                </div>

                <!-- Expand area: muncul saat klik edit -->
                <div
                  v-if="expandedFieldKey === fd.field"
                  class="sec-field-expand"
                >
                  <!-- Visibility-only -->
                  <p v-if="fd.type === 'visibility-only'" class="sec-form-hint">
                    Aktifkan toggle untuk menampilkan elemen ini di undangan.
                  </p>

                  <!-- Countdown config: toggle aktif + datetime target + warna bg -->
                  <div
                    v-else-if="fd.type === 'countdown-config'"
                    class="sec-countdown-config"
                  >
                    <p class="sec-form-hint">
                      Aktifkan toggle untuk menampilkan countdown. Isi tanggal &
                      waktu target di bawah.
                    </p>
                    <label class="sec-instagram-label" style="margin-top: 8px"
                      >Target Tanggal & Waktu</label
                    >
                    <input
                      class="sec-form-input sec-datetime-input"
                      type="datetime-local"
                      :value="store.sectionContents[fd._s]?.[fd._kTarget] ?? ''"
                      @input="
                        store.sectionContents[fd._s] ??= {};
                        store.sectionContents[fd._s][fd._kTarget] =
                          $event.target.value;
                      "
                    />
                    <div class="sec-text-color-row" style="margin-top: 8px">
                      <label class="sec-text-color-label"
                        >Warna Background</label
                      >
                      <label class="sec-text-color-pick">
                        <input
                          type="color"
                          class="sec-text-color-input"
                          :value="
                            store.sectionContents[fd._s]?.[fd._kBg] || '#1a2e45'
                          "
                          @input="
                            store.sectionContents[fd._s] ??= {};
                            store.sectionContents[fd._s][fd._kBg] =
                              $event.target.value;
                          "
                        />
                        <span
                          class="sec-text-color-dot"
                          :style="{
                            background:
                              store.sectionContents[fd._s]?.[fd._kBg] ||
                              '#1a2e45',
                          }"
                        ></span>
                        <span class="sec-text-color-val">{{
                          store.sectionContents[fd._s]?.[fd._kBg] || "#1a2e45"
                        }}</span>
                      </label>
                      <button
                        v-if="store.sectionContents[fd._s]?.[fd._kBg]"
                        class="sec-text-color-reset"
                        @click="store.sectionContents[fd._s][fd._kBg] = ''"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <!-- Upload foto -->
                  <div v-else-if="fd.type === 'image'" class="sec-img-field">
                    <img
                      v-if="getFieldValue(fd)"
                      :src="getFieldValue(fd)"
                      class="sec-img-preview"
                      alt="preview"
                    />
                    <button class="img-upload-btn" @click="openFieldImage(fd)">
                      <svg
                        width="15"
                        height="15"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      {{ getFieldValue(fd) ? "Ganti Foto" : "Upload Foto" }}
                    </button>
                  </div>

                  <!-- List manager (Rundown) -->
                  <div v-else-if="fd.type === 'list'" class="sec-list-manager">
                    <div
                      v-for="(item, i) in getListItems(fd)"
                      :key="i"
                      class="sec-list-item"
                    >
                      <div class="sec-list-item-fields">
                        <input
                          class="sec-form-input sec-list-input-sm"
                          :value="item.waktu"
                          placeholder="Waktu (09.00)"
                          @input="
                            updateListItem(fd, i, 'waktu', $event.target.value)
                          "
                        />
                        <input
                          class="sec-form-input"
                          :value="item.kegiatan"
                          placeholder="Nama Kegiatan"
                          @input="
                            updateListItem(
                              fd,
                              i,
                              'kegiatan',
                              $event.target.value,
                            )
                          "
                        />
                      </div>
                      <button
                        class="sec-list-remove-btn"
                        @click="removeListItem(fd, i)"
                      >
                        <svg
                          width="13"
                          height="13"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <button class="sec-list-add-btn" @click="addListItem(fd)">
                      <svg
                        width="13"
                        height="13"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Tambah Item
                    </button>
                  </div>

                  <!-- Color list -->
                  <div
                    v-else-if="fd.type === 'color-list'"
                    class="sec-list-manager"
                  >
                    <div
                      v-for="(color, i) in getColorList(fd)"
                      :key="i"
                      class="sec-color-item"
                    >
                      <input
                        class="sec-form-input"
                        :value="color"
                        placeholder="Contoh: Sage Green"
                        @input="updateColorItem(fd, i, $event.target.value)"
                      />
                      <button
                        class="sec-list-remove-btn"
                        @click="removeColor(fd, i)"
                      >
                        <svg
                          width="13"
                          height="13"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <button class="sec-list-add-btn" @click="addColor(fd)">
                      <svg
                        width="13"
                        height="13"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Tambah Warna
                    </button>
                  </div>

                  <!-- Story list (Love Story items) -->
                  <div
                    v-else-if="fd.type === 'story-list'"
                    class="sec-list-manager"
                  >
                    <!-- ── Pilih Layout ── -->
                    <p class="sec-story-layout-title">Pilih Layout Tampilan</p>
                    <div class="sec-story-layout-grid">
                      <button
                        v-for="lo in storyLayouts"
                        :key="lo.value"
                        class="sec-story-layout-btn"
                        :class="{ active: getStoryLayout(fd) === lo.value }"
                        @click="setStoryLayout(fd, lo.value)"
                      >
                        <span
                          class="sec-story-layout-icon"
                          v-html="lo.icon"
                        ></span>
                        <span class="sec-story-layout-name">{{
                          lo.label
                        }}</span>
                      </button>
                    </div>

                    <!-- ── Daftar Momen ── -->
                    <div
                      v-for="(item, i) in getStoryItems(fd)"
                      :key="i"
                      class="sec-story-item"
                    >
                      <div class="sec-story-item-header">
                        <span class="sec-story-item-num"
                          >Momen {{ i + 1 }}</span
                        >
                        <div class="sec-story-item-actions">
                          <button
                            class="sec-story-move-btn"
                            :disabled="i === 0"
                            @click="moveStoryItem(fd, i, -1)"
                            title="Naik"
                          >
                            ↑
                          </button>
                          <button
                            class="sec-story-move-btn"
                            :disabled="i >= getStoryItems(fd).length - 1"
                            @click="moveStoryItem(fd, i, 1)"
                            title="Turun"
                          >
                            ↓
                          </button>
                          <button
                            class="sec-list-remove-btn"
                            @click="removeStoryItem(fd, i)"
                          >
                            <svg
                              width="13"
                              height="13"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              stroke-width="2.5"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <input
                        class="sec-form-input"
                        :value="item.title"
                        placeholder="Judul (cth: Pertemuan Pertama)"
                        @input="
                          updateStoryItem(fd, i, 'title', $event.target.value)
                        "
                      />
                      <input
                        class="sec-form-input"
                        :value="item.date"
                        placeholder="Tanggal (cth: Januari 2020)"
                        @input="
                          updateStoryItem(fd, i, 'date', $event.target.value)
                        "
                      />
                      <textarea
                        class="sec-form-textarea"
                        rows="2"
                        :value="item.description"
                        placeholder="Cerita singkat..."
                        @input="
                          updateStoryItem(
                            fd,
                            i,
                            'description',
                            $event.target.value,
                          )
                        "
                      />

                      <!-- Upload Foto — hanya tampil jika layout pakai foto -->
                      <template v-if="isStoryPhotoLayout(fd)">
                        <p class="sec-story-foto-label">Foto Momen</p>
                        <div class="sec-story-foto-wrap">
                          <div
                            v-if="item.image_url"
                            class="sec-story-foto-preview"
                          >
                            <img
                              :src="item.image_url"
                              alt="preview"
                              class="sec-story-foto-img"
                            />
                            <button
                              class="sec-story-foto-remove"
                              @click="updateStoryItem(fd, i, 'image_url', '')"
                            >
                              ✕
                            </button>
                          </div>
                          <button
                            type="button"
                            class="sec-story-foto-upload"
                            @click="openLoveStoryMedia(i, item.image_url)"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                            >
                              <path
                                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                              />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            {{ item.image_url ? "Ganti Foto" : "Upload Foto" }}
                          </button>
                        </div>
                      </template>
                      <div v-else class="sec-story-no-foto">
                        💡 Pilih layout foto di atas untuk menambahkan gambar
                      </div>
                    </div>

                    <button class="sec-list-add-btn" @click="addStoryItem(fd)">
                      <svg
                        width="13"
                        height="13"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Tambah Momen
                    </button>
                  </div>

                  <!-- Textarea -->
                  <textarea
                    v-else-if="fd.multiline"
                    class="sec-form-textarea"
                    :rows="fd.rows || 3"
                    :placeholder="fd.placeholder || fd.label"
                    :value="getFieldValue(fd)"
                    @input="onFieldInput(fd, $event.target.value)"
                  />
                  <!-- Maps: text tombol + link Google Maps -->
                  <div
                    v-else-if="fd.type === 'maps-link'"
                    class="sec-instagram-wrap"
                  >
                    <label class="sec-instagram-label">Teks di Tombol</label>
                    <input
                      class="sec-form-input"
                      type="text"
                      :placeholder="'Contoh: Buka Google Maps'"
                      :value="getFieldValue(fd)"
                      @input="onFieldInput(fd, $event.target.value)"
                    />
                    <label class="sec-instagram-label" style="margin-top: 10px"
                      >Link Google Maps</label
                    >
                    <div class="sec-instagram-input-row">
                      <span
                        class="sec-instagram-prefix sec-instagram-prefix-link"
                        >maps.google.com/</span
                      >
                      <input
                        class="sec-form-input sec-instagram-input"
                        type="text"
                        placeholder="?q=... atau embed link"
                        :value="getMapsLinkShort(fd)"
                        @input="onMapsLinkInput(fd, $event.target.value)"
                      />
                    </div>
                    <p class="sec-instagram-hint">
                      Full link:
                      {{ getMapsLinkFull(fd) || "https://maps.google.com/..." }}
                    </p>
                  </div>

                  <!-- Instagram: username + link dengan prefix -->
                  <div
                    v-else-if="fd.type === 'instagram'"
                    class="sec-instagram-wrap"
                  >
                    <!-- Input 1: Username (tampil di tombol IG) -->
                    <label class="sec-instagram-label"
                      >Tampilan di Tombol</label
                    >
                    <div class="sec-instagram-input-row">
                      <span class="sec-instagram-prefix">@</span>
                      <input
                        class="sec-form-input sec-instagram-input"
                        type="text"
                        :placeholder="fd.placeholder || 'username'"
                        :value="getIgUsername(fd)"
                        @input="onIgUsernameInput(fd, $event.target.value)"
                      />
                    </div>
                    <!-- Input 2: Link (prefix otomatis https://instagram.com/) -->
                    <label class="sec-instagram-label" style="margin-top: 10px"
                      >Link Instagram</label
                    >
                    <div class="sec-instagram-input-row">
                      <span
                        class="sec-instagram-prefix sec-instagram-prefix-link"
                        >instagram.com/</span
                      >
                      <input
                        class="sec-form-input sec-instagram-input"
                        type="text"
                        :placeholder="fd.placeholder || 'username'"
                        :value="getIgUsername(fd)"
                        @input="onIgUsernameInput(fd, $event.target.value)"
                      />
                    </div>
                    <p class="sec-instagram-hint">
                      Link: https://instagram.com/{{
                        getIgUsername(fd) || "username"
                      }}
                    </p>
                  </div>

                  <!-- Default: text input -->
                  <input
                    v-else-if="!fd.type || fd.type === 'text' || fd.type === 'maps-link-plain'"
                    class="sec-form-input"
                    type="text"
                    :placeholder="fd.placeholder || fd.label"
                    :value="getFieldValue(fd)"
                    @input="onFieldInput(fd, $event.target.value)"
                  />
                </div>
                <!-- /sec-field-expand -->
              </div>
              <!-- /sec-field-row-wrap v-else -->
            </div>
            <!-- /v-for -->
          </div>
          <!-- /sec-form-list -->

          <!-- Kosong jika tidak ada field -->
          <div v-else class="sec-no-fields">
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#d1d5db"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p>Tidak ada field yang bisa diedit untuk section ini.</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="modal-footer-btns">
          <UButton class="btn-footer-cancel" @click="sectionEditOpen = false"
            >Batal</UButton
          >
          <UButton class="btn-footer-primary" @click="saveSectionEdit"
            >Simpan</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- ── MODAL: Edit Field Text ── -->
    <UModal
      v-model:open="fieldEditOpen"
      :title="activeField?.label || 'Edit'"
      :ui="modalUi"
    >
      <template #body>
        <div class="modal-body-pad">
          <textarea
            v-if="activeField"
            class="modal-textarea"
            v-model="fieldValue"
            :rows="activeField.rows || 3"
            :placeholder="activeField.placeholder || activeField.label"
            autofocus
          ></textarea>
        </div>
      </template>
      <template #footer>
        <div class="modal-footer-btns">
          <UButton class="btn-footer-cancel" @click="fieldEditOpen = false"
            >Batal</UButton
          >
          <UButton class="btn-footer-primary" @click="saveFieldValue"
            >Simpan</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- ══ MODAL: Gallery ══ -->
    <UModal v-model:open="galleryModalOpen" title="Gallery" :ui="modalUi">
      <template #body>
        <div class="gal-modal-body">
          <!-- Toggle aktif -->
          <div class="gal-feature-row">
            <div class="gal-feature-left">
              <span class="gal-feature-label">Fitur Gallery</span>
              <span
                class="gal-badge-aktif"
                v-if="store.sectionStates['galeri']?.active"
                >Aktif</span
              >
              <span class="gal-badge-nonaktif" v-else>Nonaktif</span>
            </div>
            <button
              class="ep-toggle ep-toggle-sm"
              :class="{ 'ep-toggle-on': store.sectionStates['galeri']?.active }"
              @click="toggleSection('galeri')"
            >
              <span class="ep-toggle-knob"></span>
            </button>
          </div>

          <!-- Header info section -->
          <div class="sec-modal-header" style="margin: 0 0 12px">
            <span class="sec-modal-ico" style="color: #f59e0b">
              <svg
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </span>
            <div>
              <p class="sec-modal-title">
                {{ store.sectionContents["galeri"]?.judul || "Gallery" }}
              </p>
              <p class="sec-modal-sub">Isi data untuk section ini</p>
            </div>
          </div>

          <!-- Judul & Deskripsi toggle rows -->
          <div class="gal-field-row">
            <span class="gal-field-label">Judul / Heading</span>
            <div class="gal-field-actions">
              <button
                class="ep-edit-btn"
                :class="{ 'ep-edit-btn-active': galExpand === 'judul' }"
                @click="galExpand = galExpand === 'judul' ? null : 'judul'"
              >
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  />
                </svg>
              </button>
              <button
                class="ep-toggle ep-toggle-sm"
                :class="{
                  'ep-toggle-on': isFieldActive('galeri', 'judul'),
                }"
                @click="toggleField('galeri', 'judul')"
              >
                <span class="ep-toggle-knob"></span>
              </button>
            </div>
          </div>
          <div v-if="galExpand === 'judul'" class="sec-field-expand">
            <input
              class="sec-form-input"
              :value="store.sectionContents['galeri']?.['judul'] ?? ''"
              @input="
                store.sectionContents['galeri'] ??= {};
                store.sectionContents['galeri']['judul'] = $event.target.value;
              "
              placeholder="Momen Berharga Kami"
            />
          </div>

          <div class="gal-field-row">
            <span class="gal-field-label">Deskripsi</span>
            <div class="gal-field-actions">
              <button
                class="ep-edit-btn"
                :class="{ 'ep-edit-btn-active': galExpand === 'deskripsi' }"
                @click="
                  galExpand = galExpand === 'deskripsi' ? null : 'deskripsi'
                "
              >
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  />
                </svg>
              </button>
              <button
                class="ep-toggle ep-toggle-sm"
                :class="{
                  'ep-toggle-on': isFieldActive('galeri', 'subJudul'),
                }"
                @click="toggleField('galeri', 'subJudul')"
              >
                <span class="ep-toggle-knob"></span>
              </button>
            </div>
          </div>
          <div v-if="galExpand === 'deskripsi'" class="sec-field-expand">
            <textarea
              class="sec-form-input"
              rows="2"
              :value="store.sectionContents['galeri']?.['subJudul'] ?? ''"
              @input="
                store.sectionContents['galeri'] ??= {};
                store.sectionContents['galeri']['subJudul'] =
                  $event.target.value;
              "
              placeholder="Setiap momen adalah kenangan indah..."
            ></textarea>
          </div>

          <!-- ── Atur isi gallery ── -->
          <p class="gal-section-title">Atur isi gallery</p>

          <!-- Ganti Layout → buka modal layout -->
          <button class="gal-layout-btn" @click="layoutModalOpen = true">
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Ganti Layout Foto
          </button>

          <!-- Grid foto: tampilan ikut layout yang dipilih -->
          <div class="gal-grid-wrap">
            <!-- 1 Kolom -->
            <div
              v-if="galeriLayout === '1col'"
              class="gal-dyn-grid gal-dyn-1col"
            >
              <div
                v-for="(url, i) in galeriSlots"
                :key="i"
                class="gal-slot"
                @click="openGalleryMedia(i)"
              >
                <img v-if="url" :src="url" class="gal-slot-img" />
                <div v-else class="gal-slot-empty">
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#9ca3af"
                    stroke-width="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" /></svg
                  ><span>Pilih Foto</span>
                </div>
                <button
                  v-if="url"
                  class="gal-slot-del"
                  @click.stop="removeGaleriSlot(i)"
                >
                  <svg
                    width="9"
                    height="9"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    stroke-width="3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- 2 Kolom (default) -->
            <div
              v-else-if="galeriLayout === '2col'"
              class="gal-dyn-grid gal-dyn-2col"
            >
              <div
                v-for="(url, i) in galeriSlots"
                :key="i"
                class="gal-slot"
                @click="openGalleryMedia(i)"
              >
                <img v-if="url" :src="url" class="gal-slot-img" />
                <div v-else class="gal-slot-empty">
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#9ca3af"
                    stroke-width="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" /></svg
                  ><span>Pilih Foto</span>
                </div>
                <button
                  v-if="url"
                  class="gal-slot-del"
                  @click.stop="removeGaleriSlot(i)"
                >
                  <svg
                    width="9"
                    height="9"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    stroke-width="3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Masonry (simulasi dengan 2 kolom beda tinggi) -->
            <div
              v-else-if="galeriLayout === 'masonry'"
              class="gal-dyn-grid gal-dyn-masonry"
            >
              <div
                v-for="(url, i) in galeriSlots"
                :key="i"
                class="gal-slot"
                :class="i % 3 === 0 ? 'gal-slot-tall' : 'gal-slot-short'"
                @click="openGalleryMedia(i)"
              >
                <img v-if="url" :src="url" class="gal-slot-img" />
                <div v-else class="gal-slot-empty">
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#9ca3af"
                    stroke-width="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" /></svg
                  ><span>Pilih Foto</span>
                </div>
                <button
                  v-if="url"
                  class="gal-slot-del"
                  @click.stop="removeGaleriSlot(i)"
                >
                  <svg
                    width="9"
                    height="9"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    stroke-width="3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- 3 Kolom -->
            <div
              v-else-if="galeriLayout === '3col'"
              class="gal-dyn-grid gal-dyn-3col"
            >
              <div
                v-for="(url, i) in galeriSlots"
                :key="i"
                class="gal-slot"
                @click="openGalleryMedia(i)"
              >
                <img v-if="url" :src="url" class="gal-slot-img" />
                <div v-else class="gal-slot-empty gal-slot-empty-sm">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#9ca3af"
                    stroke-width="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" /></svg
                  ><span>Pilih</span>
                </div>
                <button
                  v-if="url"
                  class="gal-slot-del"
                  @click.stop="removeGaleriSlot(i)"
                >
                  <svg
                    width="9"
                    height="9"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    stroke-width="3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Hero + Grid -->
            <div
              v-else-if="galeriLayout === 'hero'"
              class="gal-dyn-grid gal-dyn-hero"
            >
              <!-- Slot 0: hero besar -->
              <div class="gal-slot gal-slot-hero" @click="openGalleryMedia(0)">
                <img
                  v-if="galeriSlots[0]"
                  :src="galeriSlots[0]"
                  class="gal-slot-img"
                />
                <div v-else class="gal-slot-empty">
                  <svg
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#9ca3af"
                    stroke-width="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" /></svg
                  ><span>Foto Utama</span>
                </div>
                <button
                  v-if="galeriSlots[0]"
                  class="gal-slot-del"
                  @click.stop="removeGaleriSlot(0)"
                >
                  <svg
                    width="9"
                    height="9"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    stroke-width="3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <!-- Slot 1–5: grid 2 kolom -->
              <div class="gal-dyn-hero-sub">
                <div
                  v-for="i in [1, 2, 3, 4, 5, 6]"
                  :key="i"
                  class="gal-slot"
                  @click="openGalleryMedia(i)"
                >
                  <img
                    v-if="galeriSlots[i]"
                    :src="galeriSlots[i]"
                    class="gal-slot-img"
                  />
                  <div v-else class="gal-slot-empty">
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#9ca3af"
                      stroke-width="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" /></svg
                    ><span>Pilih Foto</span>
                  </div>
                  <button
                    v-if="galeriSlots[i]"
                    class="gal-slot-del"
                    @click.stop="removeGaleriSlot(i)"
                  >
                    <svg
                      width="9"
                      height="9"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="white"
                      stroke-width="3"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- 5 Foto (2x2 + 1 pojok kiri bawah) -->
            <div
              v-else-if="galeriLayout === '5foto'"
              class="gal-dyn-grid gal-dyn-5foto"
            >
              <!-- Baris atas: slot 0 & 1 -->
              <div
                v-for="(url, i) in [galeriSlots[0], galeriSlots[1]]"
                :key="i"
                class="gal-slot"
                @click="openGalleryMedia(i)"
              >
                <img v-if="url" :src="url" class="gal-slot-img" />
                <div v-else class="gal-slot-empty">
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#9ca3af"
                    stroke-width="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>Pilih Foto</span>
                </div>
                <button
                  v-if="url"
                  class="gal-slot-del"
                  @click.stop="removeGaleriSlot(i)"
                >
                  <svg
                    width="9"
                    height="9"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    stroke-width="3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <!-- Baris tengah: slot 2 & 3 -->
              <div
                v-for="(url, idx) in [galeriSlots[2], galeriSlots[3]]"
                :key="idx + 2"
                class="gal-slot"
                @click="openGalleryMedia(idx + 2)"
              >
                <img v-if="url" :src="url" class="gal-slot-img" />
                <div v-else class="gal-slot-empty">
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#9ca3af"
                    stroke-width="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>Pilih Foto</span>
                </div>
                <button
                  v-if="url"
                  class="gal-slot-del"
                  @click.stop="removeGaleriSlot(idx + 2)"
                >
                  <svg
                    width="9"
                    height="9"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    stroke-width="3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <!-- Baris bawah: slot 4 (pojok kiri), kolom kanan kosong -->
              <div class="gal-slot" @click="openGalleryMedia(4)">
                <img
                  v-if="galeriSlots[4]"
                  :src="galeriSlots[4]"
                  class="gal-slot-img"
                />
                <div v-else class="gal-slot-empty">
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#9ca3af"
                    stroke-width="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>Pilih Foto</span>
                </div>
                <button
                  v-if="galeriSlots[4]"
                  class="gal-slot-del"
                  @click.stop="removeGaleriSlot(4)"
                >
                  <svg
                    width="9"
                    height="9"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    stroke-width="3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <!-- Kolom kanan baris bawah: kosong / placeholder visual -->
              <div class="gal-slot-empty-placeholder"></div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="modal-footer-btns">
          <UButton class="btn-footer-cancel" @click="galleryModalOpen = false"
            >Batal</UButton
          >
          <UButton class="btn-footer-primary" @click="galleryModalOpen = false"
            >Simpan Perubahan</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- ══ MODAL: Pilih Layout Halaman ══ -->
    <UModal
      v-model:open="layoutModalOpen"
      title="Pilih Layout Halaman"
      :ui="modalUi"
    >
      <template #body>
        <div class="layout-modal-body">
          <div class="layout-modal-grid">
            <div
              v-for="lo in GALLERY_LAYOUTS"
              :key="lo.key"
              class="layout-modal-card"
              :class="{ 'layout-modal-active': galeriLayout === lo.key }"
              @click="
                galeriLayout = lo.key;
                layoutModalOpen = false;
              "
            >
              <!-- Preview visual mini undangan -->
              <div class="layout-card-preview">
                <!-- Heading -->
                <div class="lcp-heading">
                  <div class="lcp-heading-line lcp-line-short"></div>
                  <div class="lcp-heading-line lcp-line-long"></div>
                </div>
                <!-- Grid foto sesuai layout -->
                <div class="lcp-grid" :class="`lcp-grid-${lo.key}`">
                  <template v-if="lo.key === '1col'">
                    <div
                      class="lcp-cell lcp-cell-img"
                      v-for="n in 3"
                      :key="n"
                    ></div>
                  </template>
                  <template v-else-if="lo.key === '2col'">
                    <div
                      class="lcp-cell lcp-cell-img"
                      v-for="n in 4"
                      :key="n"
                    ></div>
                  </template>
                  <template v-else-if="lo.key === 'masonry'">
                    <div class="lcp-cell lcp-cell-img lcp-tall"></div>
                    <div class="lcp-masonry-col">
                      <div class="lcp-cell lcp-cell-img lcp-short"></div>
                      <div class="lcp-cell lcp-cell-img lcp-short"></div>
                    </div>
                    <div class="lcp-masonry-col">
                      <div class="lcp-cell lcp-cell-img lcp-short"></div>
                      <div class="lcp-cell lcp-cell-img lcp-short"></div>
                    </div>
                    <div class="lcp-cell lcp-cell-img lcp-tall"></div>
                  </template>
                  <template v-else-if="lo.key === '3col'">
                    <div
                      class="lcp-cell lcp-cell-img"
                      v-for="n in 6"
                      :key="n"
                    ></div>
                  </template>
                  <template v-else-if="lo.key === 'hero'">
                    <div class="lcp-cell lcp-cell-img lcp-hero"></div>
                    <div
                      class="lcp-cell lcp-cell-img"
                      v-for="n in 6"
                      :key="n"
                    ></div>
                  </template>
                  <template v-else-if="lo.key === '5foto'">
                    <div
                      class="lcp-cell lcp-cell-img"
                      v-for="n in 4"
                      :key="n"
                    ></div>
                    <div class="lcp-cell lcp-cell-img"></div>
                    <div class="lcp-cell lcp-cell-empty"></div>
                  </template>
                </div>
                <!-- Label + crown -->
                <div class="lcp-footer">
                  <span class="lcp-crown">👑</span>
                  <span class="lcp-label">Gallery</span>
                </div>
              </div>
              <!-- Centang aktif -->
              <div v-if="galeriLayout === lo.key" class="layout-card-check">
                <svg
                  width="11"
                  height="11"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  stroke-width="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ══ MODAL: Media upload (dari tombol Upload ke Media) ══ -->
    <UModal v-model:open="mediaUploadOnly" title="Media" :ui="modalUi">
      <template #body>
        <div class="media-modal-body">
          <div class="media-tabs">
            <button class="media-tab-btn media-tab-active">Gallery</button>
          </div>
          <div class="media-grid-wrap">
            <label class="media-upload-slot">
              <svg
                width="28"
                height="28"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#9ca3af"
                stroke-width="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
                multiple
                class="img-file-input"
                @change="onMediaMultiUpload"
              />
            </label>
            <!-- Loading indicator -->
            <div v-if="isUploading" class="media-loading-item">
              <div class="media-loading-spinner"></div>
              <span>Uploading...</span>
            </div>
            <div
              v-for="(img, i) in mediaGallery"
              :key="i"
              class="media-grid-item"
              :class="{ 'is-landscape': imageOrientations[img.url] }"
            >
              <img
                :src="img.url"
                :alt="img.name"
                @load="onImgLoad($event, img.url)"
              />
              <button class="media-delete-btn" @click.stop="deleteMediaItem(i)">
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
            <div v-if="mediaGallery.length === 0" class="media-empty">
              <p>Belum ada foto. Upload di atas.</p>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="modal-footer-btns">
          <UButton class="btn-footer-primary" @click="mediaUploadOnly = false"
            >Selesai</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- ══ MODAL: Media (untuk Gallery slot) ══ -->
    <UModal v-model:open="galleryMediaOpen" title="Pilih Media" :ui="modalUi">
      <template #body>
        <div class="media-modal-body">
          <div class="media-tabs">
            <button
              class="media-tab-btn"
              :class="{ 'media-tab-active': mediaTab === 'gallery' }"
              @click="mediaTab = 'gallery'"
            >
              Gallery
            </button>
            <button
              class="media-tab-btn media-tab-assets"
              :class="{ 'media-tab-active': mediaTab === 'assets' }"
              @click="mediaTab = 'assets'"
            >
              Assets <span class="media-tab-new">NEW</span>
            </button>
          </div>

          <div v-if="mediaTab === 'gallery'" class="media-grid-wrap">
            <!-- Upload banyak sekaligus -->
            <label class="media-upload-slot">
              <span class="media-upload-icon">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </span>
              <span class="media-upload-text">Tambah Foto</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
                multiple
                class="img-file-input"
                @change="onMediaMultiUpload"
              />
            </label>
            <!-- Loading indicator -->
            <div v-if="isUploading" class="media-loading-item">
              <div class="media-loading-spinner"></div>
              <span>Uploading...</span>
            </div>
            <div
              v-for="(img, i) in mediaGallery"
              :key="i"
              class="media-grid-item"
              :class="{
                'media-grid-selected':
                  galleryMediaTarget !== null
                    ? mediaSelected === img.url
                    : galleryMultiSelect.includes(img.url),
                'is-landscape': imageOrientations[img.url],
              }"
              @click="
                galleryMediaTarget !== null
                  ? (mediaSelected = img.url)
                  : toggleMultiSelect(img.url)
              "
            >
              <img
                :src="img.url"
                :alt="img.name"
                @load="onImgLoad($event, img.url)"
              />
              <button class="media-delete-btn" @click.stop="deleteMediaItem(i)">
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <div
                class="media-grid-check"
                v-if="
                  galleryMediaTarget !== null
                    ? mediaSelected === img.url
                    : galleryMultiSelect.includes(img.url)
                "
              >
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  stroke-width="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <!-- Badge jumlah dipilih (multi) -->
              <div
                v-if="
                  galleryMediaTarget === null &&
                  galleryMultiSelect.includes(img.url)
                "
                class="media-multi-badge"
              >
                {{ galleryMultiSelect.indexOf(img.url) + 1 }}
              </div>
            </div>
          </div>

          <div v-if="mediaTab === 'assets'" class="media-assets-tab-content">
            <!-- Search bar -->
            <div class="media-search-container">
              <input
                v-model="assetsSearch"
                type="text"
                placeholder="Cari asset..."
                class="media-search-input"
              />
              <svg
                class="media-search-icon"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div class="media-grid-wrap">
              <div
                v-for="(img, i) in filteredAssets"
                :key="i"
                class="media-grid-item"
                :class="{
                  'media-grid-selected': mediaSelected === img.url,
                  'is-landscape': imageOrientations[img.url],
                }"
                @click="mediaSelected = img.url"
              >
                <img
                  :src="img.url"
                  :alt="img.name"
                  @load="onImgLoad($event, img.url)"
                />
                <div class="media-asset-label">{{ img.name }}</div>
                <div v-if="mediaSelected === img.url" class="media-grid-check">
                  <svg
                    width="12"
                    height="12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    stroke-width="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
              <div v-if="assetsLoading" class="media-empty">
                <div
                  class="media-loading-spinner"
                  style="margin: 0 auto 8px"
                ></div>
                <p>Memuat asset...</p>
              </div>
              <div v-else-if="filteredAssets.length === 0" class="media-empty">
                <p v-if="assetsSearch">
                  Tidak ada asset dengan nama "{{ assetsSearch }}".
                </p>
                <p v-else>Belum ada asset. Upload dulu di halaman admin.</p>
              </div>
            </div>
          </div>

          <p v-if="galleryMediaTarget === null" class="gal-multi-hint">
            {{
              galleryMultiSelect.length
                ? `${galleryMultiSelect.length} foto dipilih`
                : "Pilih satu atau lebih foto"
            }}
          </p>
        </div>
      </template>
      <template #footer>
        <div class="modal-footer-btns">
          <UButton class="btn-footer-cancel" @click="galleryMediaOpen = false"
            >Batal</UButton
          >
          <UButton
            class="btn-footer-primary"
            :disabled="
              galleryMediaTarget !== null
                ? !mediaSelected
                : galleryMultiSelect.length === 0
            "
            @click="saveGalleryMedia"
            >Insert Image</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- ── MODAL: Media (Gallery + Assets) ── -->
    <UModal v-model:open="imageModalOpen" title="Media" :ui="modalUi">
      <template #body>
        <div class="media-modal-body">
          <!-- Tab switcher -->
          <div class="media-tabs">
            <button
              class="media-tab-btn"
              :class="{ 'media-tab-active': mediaTab === 'gallery' }"
              @click="mediaTab = 'gallery'"
            >
              Gallery
            </button>
            <button
              class="media-tab-btn media-tab-assets"
              :class="{ 'media-tab-active': mediaTab === 'assets' }"
              @click="mediaTab = 'assets'"
            >
              Assets <span class="media-tab-new">NEW</span>
            </button>
          </div>

          <!-- Gallery tab -->
          <div v-if="mediaTab === 'gallery'" class="media-grid-wrap">
            <!-- Slot upload baru -->
            <label class="media-upload-slot">
              <svg
                width="28"
                height="28"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#9ca3af"
                stroke-width="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
                class="img-file-input"
                @change="onMediaFileUpload"
              />
            </label>
            <!-- Loading indicator -->
            <div v-if="isUploading" class="media-loading-item">
              <div class="media-loading-spinner"></div>
              <span>Uploading...</span>
            </div>
            <!-- Grid foto tersimpan -->
            <div
              v-for="(img, i) in mediaGallery"
              :key="i"
              class="media-grid-item"
              :class="{
                'media-grid-selected': mediaSelected === img.url,
                'is-landscape': imageOrientations[img.url],
              }"
              @click="mediaSelected = img.url"
            >
              <img
                :src="img.url"
                :alt="img.name"
                @load="onImgLoad($event, img.url)"
              />
              <button class="media-delete-btn" @click.stop="deleteMediaItem(i)">
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <div v-if="mediaSelected === img.url" class="media-grid-check">
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  stroke-width="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Assets tab (admin upload mentahan) -->
          <div v-if="mediaTab === 'assets'" class="media-assets-tab-content">
            <!-- Search bar -->
            <div class="media-search-container">
              <input
                v-model="assetsSearch"
                type="text"
                placeholder="Cari asset..."
                class="media-search-input"
              />
              <svg
                class="media-search-icon"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div class="media-grid-wrap">
              <div
                v-for="(img, i) in filteredAssets"
                :key="i"
                class="media-grid-item"
                :class="{
                  'media-grid-selected': mediaSelected === img.url,
                  'is-landscape': imageOrientations[img.url],
                }"
                @click="mediaSelected = img.url"
              >
                <img
                  :src="img.url"
                  :alt="img.name"
                  @load="onImgLoad($event, img.url)"
                />
                <div class="media-asset-label">{{ img.name }}</div>
                <div v-if="mediaSelected === img.url" class="media-grid-check">
                  <svg
                    width="12"
                    height="12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    stroke-width="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
              <div v-if="assetsLoading" class="media-empty">
                <div
                  class="media-loading-spinner"
                  style="margin: 0 auto 8px"
                ></div>
                <p>Memuat asset...</p>
              </div>
              <div v-else-if="filteredAssets.length === 0" class="media-empty">
                <p v-if="assetsSearch">
                  Tidak ada asset dengan nama "{{ assetsSearch }}".
                </p>
                <p v-else>Belum ada asset. Upload dulu di halaman admin.</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="modal-footer-btns">
          <UButton
            class="btn-footer-cancel"
            @click="
              imageModalOpen = false;
              mediaSelected = '';
            "
            >Batal</UButton
          >
          <UButton
            class="btn-footer-danger"
            v-if="mediaSelected"
            @click="deleteMediaSelected"
            >Delete Image</UButton
          >
          <UButton
            class="btn-footer-primary"
            :disabled="!mediaSelected"
            @click="saveImage"
            >Insert Image</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- ── MODAL: Tutorial ── -->
    <UModal v-model:open="tutorialOpen" title="Tutorial" :ui="modalUi">
      <template #body>
        <div class="modal-body-pad">
          <div class="tutorial-list">
            <div v-for="(t, i) in tutorials" :key="i" class="tutorial-item">
              <div class="tutorial-num">{{ i + 1 }}</div>
              <div>
                <p class="tutorial-title">{{ t.title }}</p>
                <p class="tutorial-desc">{{ t.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="modal-footer-btns">
          <UButton class="btn-footer-primary" @click="tutorialOpen = false"
            >Mengerti</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- ── MODAL: Perpanjang ── -->
    <UModal
      v-model:open="perpanjangOpen"
      title="Perpanjang Undangan"
      :ui="modalUi"
    >
      <template #body>
        <div class="modal-body-pad">
          <!-- Info aktif saat ini -->
          <div class="perpanjang-info-card">
            <div class="perpanjang-info-row">
              <span class="perpanjang-info-label">Masa Aktif Akun</span>
              <ClientOnly fallback="-">
                <span
                  class="perpanjang-info-val"
                  :style="{ color: isAkunExpired ? '#e53e3e' : '' }"
                >
                  {{ masaAktifAkun }}
                </span>
              </ClientOnly>
            </div>
            <div class="perpanjang-info-row" style="margin-top: 6px">
              <span class="perpanjang-info-label">Status</span>
              <ClientOnly>
                <span class="ep-badge-aktif" v-if="!isAkunExpired">Aktif</span>
                <span class="ep-badge-nonaktif" v-else>Berakhir</span>
              </ClientOnly>
            </div>
          </div>

          <p class="modal-section-label" style="margin-bottom: 12px">
            Pilih Paket Perpanjangan
          </p>

          <!-- Pilihan paket -->
          <div class="perpanjang-paket-list">
            <button
              v-for="paket in perpanjangPaketList"
              :key="paket.id"
              class="perpanjang-paket-card"
              :class="{ 'perpanjang-paket-active': selectedPaket === paket.id }"
              @click="selectedPaket = paket.id"
            >
              <div class="perpanjang-paket-left">
                <div class="perpanjang-paket-check">
                  <svg
                    v-if="selectedPaket === paket.id"
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p class="perpanjang-paket-nama">{{ paket.nama }}</p>
                  <p class="perpanjang-paket-durasi">{{ paket.durasi }}</p>
                </div>
              </div>
              <div class="perpanjang-paket-harga">
                <span v-if="paket.diskon" class="perpanjang-paket-coret"
                  >Rp {{ paket.hargaAsli }}</span
                >
                <span class="perpanjang-paket-price">Rp {{ paket.harga }}</span>
              </div>
              <span v-if="paket.label" class="perpanjang-paket-badge">{{
                paket.label
              }}</span>
            </button>
          </div>

          <!-- Metode Pembayaran -->
          <p
            class="modal-section-label"
            style="margin-bottom: 12px; margin-top: 20px"
          >
            Metode Pembayaran
          </p>
          <div class="perpanjang-payment-list">
            <button
              v-for="pm in paymentMethods"
              :key="pm.id"
              class="perpanjang-payment-item"
              :class="{
                'perpanjang-payment-active': selectedPayment === pm.id,
              }"
              @click="selectedPayment = pm.id"
            >
              <div class="perpanjang-payment-check">
                <svg
                  v-if="selectedPayment === pm.id"
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span class="perpanjang-payment-nama">{{ pm.nama }}</span>
            </button>
          </div>

          <!-- Total -->
          <div class="perpanjang-total-row">
            <span class="perpanjang-total-label">Total Pembayaran</span>
            <span class="perpanjang-total-val"
              >Rp {{ selectedPaketData?.harga || "0" }}</span
            >
          </div>
        </div>
      </template>
      <template #footer>
        <div class="modal-footer-btns">
          <UButton class="btn-footer-cancel" @click="perpanjangOpen = false"
            >Batal</UButton
          >
          <UButton class="btn-footer-primary" @click="konfirmasiPerpanjang"
            >Simpan</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- ── MODAL: Kirim Undangan ── -->
    <UModal v-model:open="kirimOpen" title="Kirim Undangan" :ui="{ content: 'w-[calc(100vw-32px)] max-w-[550px] mx-auto rounded-2xl !bg-white !text-slate-900 ring-1 ring-slate-200' }">
      <template #body>
        <div class="modal-body-pad kirim-modal-scroll" style="max-height: min(70dvh, 600px); overflow-y: auto;">
          <p class="kirim-subtitle" style="font-size: 13px; color: #6b7280; margin: 0 0 14px; font-weight: 600;">
            {{ store.undangan.judul || "Undangan Digital" }}
          </p>

          <div class="kirim-note-box" style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px; background: #fafbfc; margin-bottom: 14px;">
            <p class="kirim-note-title" style="font-size: 13px; font-weight: 800; color: #1a2e45; margin: 0 0 8px;">Catatan</p>
            <ul class="kirim-note-list" style="margin: 0; padding-left: 18px; font-size: 12px; color: #6b7280; line-height: 1.55;">
              <li>Share link umum cocok untuk grup (keluarga, alumni, komunitas).</li>
              <li>Untuk tamu bernama spesifik, tambah ke daftar tamu lalu kirim via WhatsApp agar pesan personal.</li>
            </ul>
          </div>

          <!-- Link -->
          <section class="kirim-section-card" style="border: 1px solid #e5e7eb; border-radius: 14px; padding: 14px; background: #fff; margin-bottom: 12px;">
            <p class="kirim-card-title" style="font-size: 14px; font-weight: 800; color: #1a2e45; margin: 0 0 10px;">Link Undangan</p>
            <a :href="undanganLink" target="_blank" rel="noopener" class="kirim-link-url" style="display: block; font-size: 12px; color: #0a7060; font-weight: 600; word-break: break-all; margin-bottom: 10px;">
              {{ undanganLink }}
            </a>
            <input
              v-model="namaTamu"
              class="modal-input"
              type="text"
              placeholder="Nama tamu (untuk preview link & pesan)"
              style="margin-bottom: 10px;"
            />
            <div class="kirim-link-actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button type="button" class="btn-outline" style="background: #fff; border: 1.5px solid #7ecec4; color: #0a7060; flex: 1; border-radius: 10px; font-size: 13px; font-weight: 700; padding: 10px 16px; cursor: pointer;" @click="shareUndangan">
                Share
              </button>
              <button type="button" class="btn-primary" style="background: #7ecec4; color: #1a2e45; flex: 1; border-radius: 10px; font-size: 13px; font-weight: 700; padding: 10px 16px; cursor: pointer; border: none;" @click="copyLink()">
                {{ copied ? "✓ Disalin" : "Copy Link" }}
              </button>
            </div>
          </section>

          <!-- Template -->
          <section class="kirim-section-card" style="border: 1px solid #e5e7eb; border-radius: 14px; padding: 14px; background: #fff; margin-bottom: 12px;">
            <div class="kirim-card-head" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px;">
              <p class="kirim-card-title" style="font-size: 14px; font-weight: 800; color: #1a2e45; margin: 0;">Template Pesan</p>
              <button type="button" class="btn-text" style="background: none; color: #0a7060; padding: 4px 8px; border: none; font-size: 13px; font-weight: 700; cursor: pointer;" @click="openTemplateModal">
                Edit Template
              </button>
            </div>
            <div class="kirim-pesan-preview" style="background: #f8fafc; border: 1px solid #edf2f7; border-radius: 10px; padding: 12px; font-size: 12px; color: #374151; line-height: 1.7; margin-bottom: 10px;" v-html="templatePreview" />
          </section>

          <!-- Stats -->
          <div class="kirim-stats-row" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
            <div class="kirim-stat-card" style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px 8px; text-align: center; background: #fff;">
              <span class="kirim-stat-label" style="display: block; font-size: 10px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">Hadir</span>
              <span class="kirim-stat-val hadir" style="font-size: 22px; font-weight: 900; color: #16a34a;">{{ store.tamuHadir }}</span>
            </div>
            <div class="kirim-stat-card" style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px 8px; text-align: center; background: #fff;">
              <span class="kirim-stat-label" style="display: block; font-size: 10px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">Tidak Hadir</span>
              <span class="kirim-stat-val tidak" style="font-size: 22px; font-weight: 900; color: #dc2626;">{{ store.tamuTidakHadir }}</span>
            </div>
            <div class="kirim-stat-card" style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px 8px; text-align: center; background: #fff;">
              <span class="kirim-stat-label" style="display: block; font-size: 10px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">Belum Konfirmasi</span>
              <span class="kirim-stat-val belum" style="font-size: 22px; font-weight: 900; color: #d97706;">{{ tamuBelum }}</span>
            </div>
          </div>

          <!-- Tamu actions -->
          <div class="kirim-tamu-actions" style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px;">
            <input
              ref="importInput"
              type="file"
              accept=".csv,.txt"
              style="display: none;"
              @change="handleImportFile"
            />
            <button type="button" class="btn-outline" style="background: #fff; border: 1.5px solid #7ecec4; color: #0a7060; flex: 1; border-radius: 10px; font-size: 13px; font-weight: 700; padding: 10px 16px; cursor: pointer;" @click="triggerImport">
              Impor (.txt / .csv)
            </button>
            <button type="button" class="btn-primary" style="background: #7ecec4; color: #1a2e45; flex: 1; border-radius: 10px; font-size: 13px; font-weight: 700; padding: 10px 16px; cursor: pointer; border: none;" @click="openTamuModal">
              + Tamu
            </button>
          </div>

          <!-- Daftar tamu -->
          <section class="kirim-section-card" style="border: 1px solid #e5e7eb; border-radius: 14px; padding: 14px; background: #fff; margin-bottom: 12px;">
            <p class="kirim-card-title" style="font-size: 14px; font-weight: 800; color: #1a2e45; margin: 0 0 10px;">Daftar Tamu</p>

            <div class="kirim-filter-row" style="display: flex; gap: 8px; margin-bottom: 10px;">
              <select v-model="filterStatus" class="kirim-select" style="flex: 0 0 auto; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 8px 10px; font-size: 12px; font-family: inherit;">
                <option value="semua">Semua status</option>
                <option value="hadir">Hadir</option>
                <option value="tidak">Tidak hadir</option>
                <option value="belum">Belum konfirmasi</option>
              </select>
              <input
                v-model="searchTamu"
                class="modal-input kirim-search"
                type="search"
                placeholder="Cari nama / WA..."
                style="flex: 1; margin-bottom: 0;"
              />
            </div>

            <div class="kirim-tamu-toolbar" style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 10px;">
              <label class="kirim-check-all" style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #374151; flex: 1; min-width: 140px;">
                <input
                  type="checkbox"
                  :checked="allFilteredSelected"
                  @change="toggleSelectAll"
                />
                Pilih semua ({{ filteredTamu.length }})
              </label>
              <button
                type="button"
                class="btn-dark"
                style="background: #1a2e45; color: #fff; border-radius: 10px; font-size: 13px; font-weight: 700; padding: 10px 16px; cursor: pointer; border: none;"
                :disabled="!selectedIds.length"
                @click="kirimKeTerpilih"
              >
                Kirim WA ({{ selectedIds.length }})
              </button>
              <button
                type="button"
                class="btn-danger"
                style="background: #fee2e2; color: #dc2626; border-radius: 10px; font-size: 13px; font-weight: 700; padding: 10px 16px; cursor: pointer; border: none;"
                :disabled="!selectedIds.length"
                @click="hapusTerpilih"
              >
                Hapus
              </button>
            </div>

            <div class="kirim-tamu-list" style="max-height: 250px; overflow-y: auto;">
              <div
                v-for="tamu in filteredTamu"
                :key="tamu.id"
                class="kirim-tamu-item"
                style="display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 8px; padding: 10px 4px; border-bottom: 1px solid #f3f4f6;"
              >
                <label class="kirim-tamu-check" style="display: flex; align-items: center; gap: 8px; cursor: pointer; min-width: 0;">
                  <input
                    type="checkbox"
                    :checked="selectedIds.includes(tamu.id)"
                    @change="toggleSelect(tamu.id)"
                  />
                  <span class="kirim-tamu-nama" style="font-size: 13px; font-weight: 600; color: #1a2e45;">{{ tamu.nama }}</span>
                  <span v-if="tamu.whatsapp" class="kirim-tamu-wa" style="font-size: 11px; color: #9ca3af;">{{ tamu.whatsapp }}</span>
                </label>
                <span class="kirim-tamu-status" :class="statusClass(tamu)" style="font-size: 10px; font-weight: 700; white-space: nowrap;">
                  {{ statusLabel(tamu) }}
                </span>
                <div class="kirim-tamu-btns" style="display: flex; gap: 4px;">
                  <button type="button" class="btn-icon" style="width: 34px; height: 34px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #0a7060;" title="Kirim WA" @click="kirimKeSatu(tamu)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                  <button type="button" class="btn-icon danger" style="width: 34px; height: 34px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #dc2626;" title="Hapus" @click="hapusTamu(tamu.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div v-if="filteredTamu.length === 0" class="kirim-tamu-empty" style="font-size: 12px; color: #9ca3af; text-align: center; padding: 24px 8px; line-height: 1.5;">
                Belum ada tamu. Tambah manual atau impor file (format: Nama atau Nama,0812xxx per baris).
              </div>
            </div>
          </section>
        </div>
      </template>
      <template #footer>
        <div class="modal-footer-btns">
          <UButton class="btn-footer-primary" @click="kirimOpen = false">Tutup</UButton>
        </div>
      </template>
    </UModal>

    <!-- ── MODAL: Tambah Tamu (Nested) ── -->
    <UModal v-model:open="tamuModalOpen" title="Tambah Tamu" :ui="modalUi">
      <template #body>
        <div class="modal-body-pad" style="max-height: min(60dvh, 500px); overflow-y: auto;">
          <p class="kirim-modal-desc" style="font-size: 12px; color: #6b7280; line-height: 1.5; margin: 0 0 14px;">
            Isi data tamu seperti form RSVP. Kehadiran dan jumlah tamu akan diisi tamu saat membuka undangan.
          </p>
          <div
            v-for="field in tamuFormFields"
            :key="field.key"
            class="kirim-form-field"
            style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;"
          >
            <label style="font-size: 12px; font-weight: 700; color: #1a2e45;">
              {{ field.label }}
              <span v-if="field.required" class="kirim-required" style="color: #dc2626;">*</span>
            </label>
            <input
              v-if="field.key !== 'ucapan'"
              v-model="tamuForm[field.key]"
              type="text"
              class="modal-input"
              :placeholder="field.placeholder || field.label"
              :required="field.required"
            />
            <textarea
              v-else
              v-model="tamuForm[field.key]"
              class="modal-textarea"
              rows="3"
              :placeholder="field.placeholder || field.label"
              :required="field.required"
            />
          </div>
          <p v-if="!tamuFormFields.length" class="kirim-modal-desc">
            Tidak ada kolom tamu aktif. Aktifkan kolom di pengaturan RSVP.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="modal-footer-btns">
          <UButton class="btn-footer-cancel" @click="closeTamuModal">Batal</UButton>
          <UButton class="btn-footer-primary" @click="submitTamuForm">Simpan Tamu</UButton>
        </div>
      </template>
    </UModal>

    <!-- ── MODAL: Edit Template Pesan (Nested) ── -->
    <UModal v-model:open="templateModalOpen" title="Edit Template Pesan" :ui="modalUi">
      <template #body>
        <div class="modal-body-pad" style="max-height: min(65dvh, 500px); overflow-y: auto;">
          <p class="kirim-hint" style="font-size: 12px; color: #6b7280; margin: 0 0 8px;">
            Gunakan <code>{nama_tamu}</code> dan <code>{link_undangan}</code> sebagai placeholder.
          </p>
          <textarea v-model="templatePesan" class="modal-textarea" rows="8" style="margin-bottom: 12px;" />
          <p class="kirim-modal-label" style="font-size: 12px; font-weight: 700; color: #1a2e45; margin: 12px 0 8px;">Preview pesan</p>
          <div class="kirim-pesan-preview" style="background: #f8fafc; border: 1px solid #edf2f7; border-radius: 10px; padding: 12px; font-size: 12px; color: #374151; line-height: 1.7;" v-html="templatePreview" />
        </div>
      </template>
      <template #footer>
        <div class="modal-footer-btns" style="display: flex; gap: 8px; width: 100%;">
          <UButton class="btn-footer-cancel" style="flex: 1;" @click="resetTemplate">Reset Default</UButton>
          <UButton class="btn-footer-cancel" style="flex: 1;" @click="closeTemplateModal">Batal</UButton>
          <UButton class="btn-footer-primary" style="flex: 1;" @click="saveTemplateModal">Simpan</UButton>
        </div>
      </template>
    </UModal>
  </div>

  <!-- ══ TOAST — Teleport ke body supaya tidak tertimpa overlay modal ══ -->
  <Teleport to="body">
    <Transition name="toast-fade">
      <div
        v-if="showUploadSuccess"
        class="upload-success-toast"
        :class="toastType === 'error' ? 'upload-toast-error' : ''"
      >
        {{ toastMsg }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {
  ref,
  computed,
  reactive,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUndanganStore } from "@/stores/useUndanganStore";
import { useAccountStore } from "@/stores/useAccountStore";
import { useAssetStore } from "@/stores/useAssetStore";
import { TEMA_DEFAULT_COLORS } from "@/stores/useUndanganStore";
import { hydrateUndanganStoreFromEditor } from "~/composables/useInvitationEditorHydration";
import { supabase } from "~/lib/supabase";
import { useCustomerIdentity } from "~/composables/useCustomerIdentity";
import { useKirimUndangan } from "~/composables/useKirimUndangan";
import { useColorMode } from "#imports";

const kirimOpen = ref(false);
const {
  namaTamu,
  searchTamu,
  filterStatus,
  copied,
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

// ── Store & Router
const store = useUndanganStore();
const accountStore = useAccountStore();

// ── FIX: paksa mode terang, jangan ikut dark mode sistem/browser
// (mencegah UButton, UModal, native <select>/<input type="color">, scrollbar
// dll otomatis ganti tampilan pas HP/browser user diset dark mode)
const colorMode = useColorMode();
colorMode.preference = "light";

// ── Link WA admin: request hapus watermark logo (dipakai customer)
const waHapusLogoUrl = computed(() => {
  const nama =
    store.undangan?.judul || store.undangan?.domain || store.slug || "-";
  const pesan = `Halo Admin PlayMoment, saya mau menghilangkan watermark logo di undangan saya "${nama}" (slug: ${store.slug || "-"}). Mohon info caranya.`;
  return `https://wa.me/628123456789?text=${encodeURIComponent(pesan)}`;
});

// ── Link WA admin: request hapus watermark nama musik (dipakai customer)
const waHapusMusikUrl = computed(() => {
  const nama =
    store.undangan?.judul || store.undangan?.domain || store.slug || "-";
  const pesan = `Halo Admin PlayMoment, saya mau menghilangkan watermark nama musik di undangan saya "${nama}" (slug: ${store.slug || "-"}). Mohon info caranya.`;
  return `https://wa.me/628123456789?text=${encodeURIComponent(pesan)}`;
});
const assetStore = useAssetStore();
const route = useRoute();
const router = useRouter();

// ── Customer identity (masa aktif akun dari Supabase)
const { customerSource } = useCustomerIdentity();

const masaAktifAkun = computed(() => {
  const expiry = customerSource.value?.expiryDate;
  if (!expiry) return "-";
  const d = new Date(expiry);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const isAkunExpired = computed(() => {
  const expiry = customerSource.value?.expiryDate;
  if (!expiry) return false;
  return new Date(expiry) < new Date();
});

const isChildRoute = computed(() => {
  const slug = String(route.params.slug || "");
  if (!slug) return false;
  const base = `/edit-undangan/${slug}`;
  return route.path.startsWith(`${base}/`);
});

// ── Init dari route
onMounted(async () => {
  const editorId = route.params.slug || route.params.id || "";
  if (editorId) store.editorId = String(editorId);

  // Load data dari Supabase dulu sebelum hydrate
  // Tanpa ini getInvitationByEditorId() selalu null, store kosong, tidak bisa save
  await accountStore.loadAll();

  await hydrateUndanganStoreFromEditor(String(editorId));

  // Load assets from Supabase
  assetsLoading.value = true;
  await assetStore.loadAssets();
  assetsLoading.value = false;

  const domainRaw = store.undangan.domain?.trim();
  if (domainRaw && (domainRaw.includes("://") || domainRaw.includes("/"))) {
    store.undangan.domain = domainRaw
      .replace(/^https?:\/\/[^/]+\//, "")
      .replace(/^\//, "");
  }
  if (store.undangan.domain) store.slug = store.undangan.domain;

  const tema = route.query.tema || "";
  if (tema) {
    store.setTema(tema);
    const temaSlug = tema.startsWith("tema-")
      ? tema
      : tema.toLowerCase().replace(/\s+/g, "-");
    store.applyTemaColors(temaSlug);
  }

  // Init section states jika belum ada
  store.themeSections.forEach((sec) => {
    if (!store.sectionStates[sec.key]) {
      store.sectionStates[sec.key] = { active: true };
    }
  });

  // State customColors, rsvpFields, musikAktif, rsvpAktif, daftarTamu
  // sudah diinit di useUndanganStore.js — tidak perlu init ulang di sini

  // Semua data sudah siap — tampilkan editor
  pageLoading.value = false;
});

// Debounce timer untuk auto-save
let _saveTimer = null;

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
    // Debounce 1.5 detik agar tidak flood Supabase setiap keystroke
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => {
      accountStore.saveEditorSnapshot(String(snapshot.editorId), snapshot);
    }, 1500);
  },
  { deep: true },
);

function persistEditorSnapshot() {
  if (!store.editorId) return;
  accountStore.saveEditorSnapshot(String(store.editorId), {
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
    musikAktif: store.musikAktif,
    rsvpAktif: store.rsvpAktif,
    undanganAktif: store.undanganAktif,
    soundEffectAktif: store.soundEffectAktif,
    soundTypingAktif: store.soundTypingAktif,
    showLogoWatermark: store.showLogoWatermark,
    showMusikWatermark: store.showMusikWatermark,
  });
}

// ── Tema component map
const temaMap = {
  "tema-1": defineAsyncComponent(() => import("@/components/themes/v1/Tema1.vue")),
  "tema-2": defineAsyncComponent(() => import("@/components/themes/v2/Tema2.vue")),
  "tema-3": defineAsyncComponent(() => import("@/components/themes/Tema3.vue")),
  "tema-4": defineAsyncComponent(() => import("@/components/themes/Tema4.vue")),
};
const temaComponent = computed(
  () => temaMap[store.temaSlug] ?? temaMap["tema-1"],
);

// ── Modal UI config (Nuxt UI)
const modalUi = {
  content:
    "w-[calc(100vw-32px)] max-w-[450px] mx-auto my-auto max-h-[85vh] rounded-2xl !bg-white !text-slate-900 ring-1 ring-slate-200",
  title: "!text-[#1a2e45] dark:!text-[#1a2e45]",
  description: "!text-slate-500 dark:!text-slate-500",
};

// ── Modal booleans
const rsvpOpen = ref(false);
const pageLoading = ref(true);
const pengaturanOpen = ref(false);
const musikOpen = ref(false);
const sectionEditOpen = ref(false);
const fieldEditOpen = ref(false);
const imageModalOpen = ref(false);
const tutorialOpen = ref(false);
const perpanjangOpen = ref(false);
// Preview → buka di tab baru
async function openPreview() {
  const publicSlug = store.slug || store.undangan.domain?.trim();
  if (!publicSlug) return;

  // 1. Paksa save ke Supabase sekarang (tidak tunggu debounce)
  clearTimeout(_saveTimer);
  const snapshot = {
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
    musikAktif: store.musikAktif,
    rsvpAktif: store.rsvpAktif,
    undanganAktif: store.undanganAktif,
    soundEffectAktif: store.soundEffectAktif,
    soundTypingAktif: store.soundTypingAktif,
    showLogoWatermark: store.showLogoWatermark,
    showMusikWatermark: store.showMusikWatermark,
  };
  await accountStore.saveEditorSnapshot(String(store.editorId), snapshot);

  // 2. Broadcast ke tab preview via BroadcastChannel agar langsung sync
  try {
    const bc = new BroadcastChannel("undangan-preview-sync");
    bc.postMessage({ type: "SYNC", slug: publicSlug, payload: snapshot });
    bc.close();
  } catch (e) {}

  window.open(`/preview/${publicSlug}`, "_blank");
}

// ── Active states
const activeSec = ref(null);
const activeField = ref(null);
const fieldValue = ref("");

// ── Drag & drop sections
const dragKey = ref(null);
const dragOverKey = ref(null);

function saveRsvpFields(field) {
  // Simpan SEMUA property field ke store, bukan hanya label
  store.updateRsvpFieldFull(field.key, {
    label: field.label,
    required: field.required,
    readOnly: field.readOnly,
    defaultValue: field.defaultValue,
    placeholder: field.placeholder,
    options: field.options,
    maxTamu: field.maxTamu,
  });
}

function onDragStart(e, key) {
  dragKey.value = key;
  e.dataTransfer.effectAllowed = "move";
}
function onDrop(e, targetKey) {
  if (!dragKey.value || dragKey.value === targetKey) return;
  // FIX: gunakan store.reorderSections() — jangan mutasi computed langsung
  store.reorderSections(dragKey.value, targetKey);
  dragOverKey.value = null;
  dragKey.value = null;
}
function onDragEnd() {
  dragKey.value = null;
  dragOverKey.value = null;
}

// ── Toggle section active/inactive
function toggleSection(key) {
  if (!store.sectionStates[key]) {
    store.sectionStates[key] = { active: true };
  } else {
    store.sectionStates[key].active = !store.sectionStates[key].active;
  }
}

// ── Toggle per-field active/inactive (utk field visibility-only di modal edit)
// - Field biasa (fd = string key ATAU object tanpa type 'visibility-only'):
//   disimpan di store.sectionStates[sectionKey].fields[fieldKey], default aktif (true)
// - Field type 'visibility-only' (mis. Background Overlay):
//   langsung baca/tulis ke store.sectionContents[fd._s][fd._k], karena itu
//   adalah nilai boolean asli yang dibaca komponen Tema untuk nampilin elemen
function isFieldActive(sectionKey, fd) {
  if (fd && typeof fd === "object" && fd.type === "visibility-only") {
    return store.sectionContents[fd._s]?.[fd._k] !== false;
  }
  const fieldKey = fd && typeof fd === "object" ? fd.field : fd;
  return store.sectionStates[sectionKey]?.fields?.[fieldKey] !== false;
}
function toggleField(sectionKey, fd) {
  if (fd && typeof fd === "object" && fd.type === "visibility-only") {
    if (!store.sectionContents[fd._s]) store.sectionContents[fd._s] = {};
    store.sectionContents[fd._s][fd._k] = !isFieldActive(sectionKey, fd);
    return;
  }
  const fieldKey = fd && typeof fd === "object" ? fd.field : fd;
  if (!store.sectionStates[sectionKey]) {
    store.sectionStates[sectionKey] = { active: true, fields: {} };
  }
  if (!store.sectionStates[sectionKey].fields) {
    store.sectionStates[sectionKey].fields = {};
  }
  store.sectionStates[sectionKey].fields[fieldKey] = !isFieldActive(
    sectionKey,
    fd,
  );
}

// ── Open edit section modal
function openSectionEdit(sec) {
  if (sec.key === "galeri") {
    galleryModalOpen.value = true;
    return;
  }
  activeSec.value = sec;
  expandedFieldKey.value = null;
  sectionEditOpen.value = true;
}

// ── Per-section field definitions
// _t: 'und'       → store.undangan[field]
// _t: 'sec'       → store.sectionContents[_s][_k]
// _t: 'galeri'    → store.undangan.galeri[_idx]
// type: 'image'         → upload button UI
// type: 'list'          → add/edit/remove items (rundown)
// type: 'color-list'    → add/edit/remove warna (dresscode)
// type: 'visibility-only' → hanya toggle, tidak ada input teks
const sectionFields = {
  // ── 1. Opening / Cover
  opening: [
    {
      field: "fotoCouple",
      label: "📷 Foto Couple (Cover)",
      type: "image",
      _t: "und",
    },
    {
      field: "openingOverlay",
      label: "Background Overlay",
      type: "visibility-only",
      _t: "sec",
      _s: "opening",
      _k: "showOverlay",
    },
    { field: "judul", label: "Judul Acara", _t: "und" },
    {
      field: "namaMempelai",
      label: "Nama Mempelai (di bawah judul)",
      type: "text",
      placeholder: "Adam & Hawa",
      _t: "sec",
      _s: "opening",
      _k: "namaMempelai",
    },
    {
      field: "kepadaYth",
      label: "Text Yth. Bapak/Ibu…",
      _t: "sec",
      _s: "opening",
      _k: "kepadaYth",
    },
    {
      field: "openingBtnText",
      label: "Text di Dalam Button",
      _t: "sec",
      _s: "opening",
      _k: "btnText",
    },
  ],

  // ── 2. Mempelai (key untuk section 'mempelai')
  mempelai: [
    { _group: "Heading Modal" },

    {
      field: "mempelaiJudulModal",
      label: "Judul / Heading Modal",
      _t: "sec",
      _s: "mempelai",
      _k: "judulModal",
    },

    {
      field: "mempelaiDesc",
      label: "Deskripsi Modal",
      _t: "sec",
      _s: "mempelai",
      _k: "desc",
      multiline: true,
      rows: 3,
    },

    { _group: "Mempelai Wanita" },

    {
      field: "brideLabelSub",
      label: "Label / Sub-judul Wanita",
      _t: "sec",
      _s: "bride",
      _k: "labelSub",
    },

    {
      field: "nama1",
      label: "Nama Pendek Wanita",
      _t: "und",
    },

    {
      field: "fotoBride",
      label: "📷 Foto Mempelai Wanita",
      type: "image",
      _t: "und",
    },

    {
      field: "brideFull",
      label: "Nama Lengkap Wanita",
      _t: "sec",
      _s: "bride",
      _k: "namaLengkap",
    },

    {
      field: "brideOrangTua",
      label: "Putri dari (Orang Tua)",
      _t: "sec",
      _s: "bride",
      _k: "orangTua",
      multiline: true,
      rows: 3,
    },

    {
      field: "instagramBride",
      label: "Instagram Wanita",
      _t: "und",
      type: "instagram",
      placeholder: "username",
    },

    { _group: "Mempelai Pria" },

    {
      field: "groomLabelSub",
      label: "Label / Sub-judul Pria",
      _t: "sec",
      _s: "groom",
      _k: "labelSub",
    },

    {
      field: "nama2",
      label: "Nama Pendek Pria",
      _t: "und",
    },

    {
      field: "fotoGroom",
      label: "📷 Foto Mempelai Pria",
      type: "image",
      _t: "und",
    },

    {
      field: "groomFull",
      label: "Nama Lengkap Pria",
      _t: "sec",
      _s: "groom",
      _k: "namaLengkap",
    },

    {
      field: "groomOrangTua",
      label: "Putra dari (Orang Tua)",
      _t: "sec",
      _s: "groom",
      _k: "orangTua",
      multiline: true,
      rows: 3,
    },

    {
      field: "instagramGroom",
      label: "Instagram Pria",
      _t: "und",
      type: "instagram",
      placeholder: "username",
    },
  ],
  // ── 3. Quotes / Ayat
  quotes: [
    {
      field: "quotesText",
      label: "Quotes / Ayat (Baris 1)",
      _t: "sec",
      _s: "quotes",
      _k: "text",
      multiline: true,
      rows: 4,
    },
    {
      field: "quotesText2",
      label: "Quotes / Ayat (Baris 2)",
      _t: "sec",
      _s: "quotes",
      _k: "text2",
      multiline: true,
      rows: 4,
    },
    {
      field: "quotesSource",
      label: "Nama Surah / Sumber Ayat",
      _t: "sec",
      _s: "quotes",
      _k: "source",
    },
  ],

  // ── 4. Event / Acara
  acara: [
    {
      field: "acaraJudul",
      label: "Judul / Heading Modal",
      _t: "sec",
      _s: "acara",
      _k: "judulAkad",
    },
    {
      field: "acaraDesc",
      label: "Deskripsi",
      _t: "sec",
      _s: "acara",
      _k: "desc",
      multiline: true,
      rows: 3,
    },
    {
      field: "acaraCountdown",
      label: "Countdown Hitung Mundur",
      type: "countdown-config",
      _t: "sec",
      _s: "acara",
      _k: "showCountdown",
      _kTarget: "countdownTarget",
      _kBg: "countdownBg",
    },
    { field: "tanggalAkad", label: "Tanggal Akad", _t: "und" },
    { field: "waktuAkad", label: "Waktu Akad", _t: "und" },
    { field: "lokasiAkad", label: "Nama Tempat Akad", _t: "und" },
    {
      field: "alamatAkad",
      label: "Alamat Akad",
      _t: "und",
      multiline: true,
      rows: 2,
    },
    {
      field: "mapsAkad",
      label: "Tombol Maps Akad",
      type: "maps-link",
      _t: "sec",
      _s: "acara",
      _k: "mapsAkad",
      linkField: "linkMapsAkad",
      linkT: "und",
    },
    { field: "tanggalResepsi", label: "Tanggal Resepsi", _t: "und" },
    { field: "waktuResepsi", label: "Waktu Resepsi", _t: "und" },
    { field: "lokasiResepsi", label: "Nama Tempat Resepsi", _t: "und" },
    {
      field: "alamatResepsi",
      label: "Alamat Resepsi",
      _t: "und",
      multiline: true,
      rows: 2,
    },
    {
      field: "mapsResepsi",
      label: "Tombol Maps Resepsi",
      type: "maps-link",
      _t: "sec",
      _s: "acara",
      _k: "mapsResepsi",
      linkField: "linkMapsResepsi",
      linkT: "und",
    },
  ],

  // ── 5. Galeri
  galeri: [
    {
      field: "galeriJudul",
      label: "Judul / Heading",
      _t: "sec",
      _s: "galeri",
      _k: "judul",
    },
    {
      field: "galeriSubJudul",
      label: "Deskripsi",
      _t: "sec",
      _s: "galeri",
      _k: "subJudul",
    },
    {
      field: "galeri_0",
      label: "Foto Frame 1",
      type: "image",
      _t: "galeri",
      _idx: 0,
    },
    {
      field: "galeri_1",
      label: "Foto Frame 2",
      type: "image",
      _t: "galeri",
      _idx: 1,
    },
    {
      field: "galeri_2",
      label: "Foto Frame 3",
      type: "image",
      _t: "galeri",
      _idx: 2,
    },
    {
      field: "galeri_3",
      label: "Foto Frame 4",
      type: "image",
      _t: "galeri",
      _idx: 3,
    },
    {
      field: "galeri_4",
      label: "Foto Frame 5",
      type: "image",
      _t: "galeri",
      _idx: 4,
    },
    {
      field: "galeri_5",
      label: "Foto Frame 6",
      type: "image",
      _t: "galeri",
      _idx: 5,
    },
  ],

  // ── 6. RSVP
  rsvp: [
    {
      field: "rsvpJudul",
      label: "Judul / Heading Modal",
      _t: "sec",
      _s: "rsvp",
      _k: "judul",
    },
    {
      field: "rsvpDesc",
      label: "Deskripsi RSVP",
      _t: "sec",
      _s: "rsvp",
      _k: "desc",
      multiline: true,
      rows: 3,
    },
    {
      field: "rsvpBatasKonfirmasi",
      label: "Batas Konfirmasi (Tanggal)",
      _t: "sec",
      _s: "rsvp",
      _k: "batasKonfirmasi",
      placeholder: "Contoh: 20 Mei 2025",
    },
    {
      field: "rsvpBtnText",
      label: "Text Button Konfirmasi",
      _t: "sec",
      _s: "rsvp",
      _k: "btnText",
    },
    {
      field: "rsvpBtnTextAfter",
      label: "Text Setelah Konfirmasi",
      _t: "sec",
      _s: "rsvp",
      _k: "btnTextAfter",
      placeholder: "Contoh: Terima Kasih!",
    },
  ],

  // ── 7. Maps
  maps: [
    {
      field: "mapsJudul",
      label: "Judul / Heading Modal",
      _t: "sec",
      _s: "maps",
      _k: "judul",
    },
    {
      field: "mapsDesc",
      label: "Deskripsi",
      _t: "sec",
      _s: "maps",
      _k: "desc",
      multiline: true,
      rows: 3,
    },
    {
      field: "mapsBtnText",
      label: "Tombol Maps",
      type: "maps-link",
      _t: "sec",
      _s: "maps",
      _k: "btnText",
      linkField: "linkMapsResepsi",
      linkT: "und",
    },
    { field: "lokasiResepsi", label: "Nama Tempat Acara", _t: "und" },
    {
      field: "alamatResepsi",
      label: "Alamat Acara",
      _t: "und",
      multiline: true,
      rows: 2,
    },
  ],

  // ── 8. Gift
  gift: [
    {
      field: "giftJudul",
      label: "Judul / Heading Modal",
      _t: "sec",
      _s: "gift",
      _k: "judul",
    },
    {
      field: "giftDesc",
      label: "Deskripsi Gift",
      _t: "sec",
      _s: "gift",
      _k: "desc",
      multiline: true,
      rows: 3,
    },
    { field: "logoBank", label: "Upload Logo Bank", type: "image", _t: "und" },
    { field: "namaBankRekening", label: "Nama Bank", _t: "und" },
    { field: "nomorRekening", label: "Nomor Rekening", _t: "und" },
    { field: "namaRekening", label: "Atas Nama Rekening", _t: "und" },
    {
      field: "giftWaMe",
      label: "No. WhatsApp Konfirmasi",
      placeholder: "628123456789",
      _t: "sec",
      _s: "gift",
      _k: "waMe",
    },
    {
      field: "giftKonfirmasiText",
      label: "Teks Tombol Konfirmasi",
      placeholder: "Konfirmasi Bukti Trf",
      _t: "sec",
      _s: "gift",
      _k: "konfirmasiText",
    },
  ],

  // ── 9. Rundown
  rundown: [
    {
      field: "rundownJudul",
      label: "Judul / Heading Modal",
      _t: "sec",
      _s: "rundown",
      _k: "judul",
    },
    {
      field: "rundownDesc",
      label: "Deskripsi",
      _t: "sec",
      _s: "rundown",
      _k: "desc",
      multiline: true,
      rows: 3,
    },
    {
      field: "rundownItems",
      label: "Isi Rundown",
      type: "list",
      _t: "sec",
      _s: "rundown",
      _k: "items",
    },
  ],

  // ── 10. Dresscode
  dresscode: [
    {
      field: "dresscodeJudul",
      label: "Judul / Heading Modal",
      _t: "sec",
      _s: "dresscode",
      _k: "judul",
    },
    {
      field: "dresscodeDesc",
      label: "Deskripsi",
      _t: "sec",
      _s: "dresscode",
      _k: "description",
      multiline: true,
      rows: 3,
    },
    {
      field: "dresscodeImage",
      label: "Upload Foto Contoh Dresscode",
      type: "image",
      _t: "und",
    },
    {
      field: "dresscodeTema",
      label: "Nama Tema Dresscode",
      _t: "sec",
      _s: "dresscode",
      _k: "theme",
    },
    {
      field: "dresscodeColors",
      label: "Kategori Warna Dresscode",
      type: "color-list",
      _t: "sec",
      _s: "dresscode",
      _k: "colors",
    },
  ],

  // ── 11. Contact
  contact: [
    {
      field: "contactJudul",
      label: "Heading / Judul Acara",
      _t: "sec",
      _s: "contact",
      _k: "judul",
    },
    {
      field: "fotoContact",
      label: "Upload Foto Profil",
      type: "image",
      _t: "und",
    },
    {
      field: "contactNama",
      label: "Nama Contact Person",
      _t: "sec",
      _s: "contact",
      _k: "nama",
    },
    {
      field: "contactLabel",
      label: "Jabatan / Label (contoh: Panitia)",
      _t: "sec",
      _s: "contact",
      _k: "labelContact",
      placeholder: "Panitia / Contact Person",
    },
    {
      field: "contactBtnText",
      label: "Text di Button",
      _t: "sec",
      _s: "contact",
      _k: "btnText",
    },
    {
      field: "contactWa",
      label: "Link / Nomor WhatsApp",
      _t: "sec",
      _s: "contact",
      _k: "wa",
      placeholder: "628123456789",
    },
  ],

  // ── Wedding (cover slide)
  wedding: [
    {
      field: "weddingSub",
      label: "Text Sub / Label",
      _t: "sec",
      _s: "wedding",
      _k: "subText",
    },
    {
      field: "fotoCouple",
      label: "Foto Bersama (Cover)",
      type: "image",
      _t: "und",
    },
    {
      field: "weddingAmpersand",
      label: "Simbol & Antar Nama",
      _t: "sec",
      _s: "wedding",
      _k: "ampersand",
      placeholder: "&",
    },
    { field: "tanggalAkad", label: "Tanggal Akad", _t: "und" },
  ],

  // ── Ucapan & Doa
  ucapan: [
    {
      field: "ucapanJudul",
      label: "Judul Ucapan",
      _t: "sec",
      _s: "ucapan",
      _k: "judul",
    },
    {
      field: "ucapanSubJudul",
      label: "Sub Judul / Deskripsi",
      _t: "sec",
      _s: "ucapan",
      _k: "subJudul",
    },
    {
      field: "ucapanBtnText",
      label: "Text Tombol",
      _t: "sec",
      _s: "ucapan",
      _k: "btnText",
    },
  ],

  // ── Penutup
  penutup: [
    {
      field: "penutupDesc",
      label: "Teks Penutup",
      _t: "sec",
      _s: "penutup",
      _k: "desc",
      multiline: true,
      rows: 4,
    },
    {
      field: "penutupHormat",
      label: "Hormat Kami",
      _t: "sec",
      _s: "penutup",
      _k: "hormat",
    },
    {
      field: "penutupAmpersand",
      label: "Simbol & Antar Nama",
      _t: "sec",
      _s: "penutup",
      _k: "ampersand",
      placeholder: "&",
    },
    {
      field: "fotoCouple",
      label: "Foto Couple (Penutup)",
      type: "image",
      _t: "und",
    },
  ],

  // ── Salam / Opening Screen
  salam: [
    {
      field: "salamTitle",
      label: "Judul Salam",
      _t: "sec",
      _s: "salam",
      _k: "judul",
    },
    {
      field: "salamMessage",
      label: "Pesan Salam",
      _t: "sec",
      _s: "salam",
      _k: "message",
      multiline: true,
      rows: 5,
    },
    { field: "fotoCouple", label: "Foto Salam", type: "image", _t: "und" },
  ],

  // ── Love Story
  lovestory: [
    {
      field: "lovestoryJudul",
      label: "Judul Love Story",
      _t: "sec",
      _s: "lovestory",
      _k: "judul",
    },
    {
      field: "lovestoryDesc",
      label: "Deskripsi",
      _t: "sec",
      _s: "lovestory",
      _k: "desc",
      multiline: true,
      rows: 3,
    },
    {
      field: "lovestoryItems",
      label: "Isi Love Story",
      type: "story-list",
      _t: "sec",
      _s: "lovestory",
      _k: "items",
    },
  ],
};

function toggleRsvpField(field) {
  field.active = !field.active;
  saveRsvpFields(field);
}

// ── RSVP option helpers (untuk field kehadiran)
function addRsvpOption(field) {
  if (!field.options) field.options = [];
  field.options.push("Opsi Baru");
  saveRsvpFields(field);
}
function removeRsvpOption(field, idx) {
  if (!field.options) return;
  const removedVal = field.options[idx];
  field.options.splice(idx, 1);
  if (field.defaultValue === removedVal) field.defaultValue = "";
  saveRsvpFields(field);
}
function updateRsvpOption(field, idx, val) {
  if (!field.options) return;
  field.options[idx] = val;
  saveRsvpFields(field);
}

// ── Open field editor
function openFieldModal(fd) {
  activeField.value = fd;
  // Baca nilai dari store
  if (fd._t === "und") {
    fieldValue.value = store.undangan[fd.field] ?? "";
  } else if (fd._t === "sec") {
    fieldValue.value = store.sectionContents?.[fd._s]?.[fd._k] ?? "";
  }
  fieldEditOpen.value = true;
}

function onEditText(field, value, label, opts) {
  openFieldModal({ field, label, _t: "und", placeholder: label, rows: 3 });
}

// Buka media upload only (dari tombol "Upload ke Media" di gallery modal)
function openMediaForUpload() {
  mediaUploadOnly.value = true;
}

// ── Toast notification system (harus di atas validateImageFile)
const showUploadSuccess = ref(false);
const toastMsg = ref("");
const toastType = ref("success"); // 'success' | 'error'

function showToast(msg, type = "success", duration = 3500) {
  toastMsg.value = msg;
  toastType.value = type;
  showUploadSuccess.value = true;
  setTimeout(() => {
    showUploadSuccess.value = false;
  }, duration);
}

// ── Validasi file gambar: hanya png/jpg/jpeg/webp, max 3MB
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_IMAGE_SIZE_MB = 3;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

function validateImageFile(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    showToast(
      `❌ Format tidak didukung: ${file.name} — hanya PNG, JPG, WEBP`,
      "error",
    );
    return false;
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    showToast(
      `❌ File terlalu besar: ${file.name} (${sizeMB} MB) — maks ${MAX_IMAGE_SIZE_MB} MB`,
      "error",
    );
    return false;
  }
  return true;
}

// Upload langsung ke slot galeri (dari modal gallery, bukan media picker)
async function onGaleriMultiUpload(e) {
  const files = Array.from(e.target.files || []);
  const arr = [...(store.undangan.galeri || Array(7).fill(""))];

  // Validasi semua file sebelum upload
  for (const file of files) {
    if (!validateImageFile(file)) {
      e.target.value = "";
      return;
    }
  }

  isUploading.value = true;
  try {
    let successCount = 0;
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const fileName = `undangan/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("foto-assets")
        .upload(fileName, file, { upsert: false });

      if (error) {
        console.error("Upload galeri gagal:", error);
        continue;
      }

      const { data: publicData } = supabase.storage
        .from("foto-assets")
        .getPublicUrl(fileName);

      const url = publicData.publicUrl;
      mediaGallery.value.unshift({ url, name: file.name });

      let si = arr.findIndex((s) => !s);
      if (si === -1) arr.push(url);
      else arr[si] = url;
      successCount++;
    }
    store.undangan.galeri = [...arr];
    if (successCount > 0) {
      showToast(`✅ ${successCount} foto berhasil diupload!`);
    }
  } finally {
    isUploading.value = false;
    e.target.value = "";
  }
}

// ── Gallery modal helpers
function openGalleryMedia(idx) {
  // idx = number → ganti 1 foto, null → tambah banyak sekaligus
  galleryMediaTarget.value = idx;
  galleryMultiSelect.value = [];
  mediaTab.value = "gallery";
  mediaSelected.value = "";
  galleryMediaOpen.value = true;
}

function saveGalleryMedia() {
  const arr = [...(store.undangan.galeri || Array(7).fill(""))];
  if (galleryMediaTarget.value !== null) {
    // Ganti satu slot
    arr[galleryMediaTarget.value] = mediaSelected.value || "";
  } else {
    // Multi: isi slot kosong dari kiri
    let si = 0;
    for (const url of galleryMultiSelect.value) {
      while (si < arr.length && arr[si]) si++;
      if (si >= arr.length) arr.push(url);
      else arr[si] = url;
    }
  }
  store.undangan.galeri = arr;
  persistEditorSnapshot();
  galleryMediaOpen.value = false;
  galleryMultiSelect.value = [];
  mediaSelected.value = "";
}

function removeGaleriSlot(i) {
  const arr = [...(store.undangan.galeri || [])];
  arr[i] = "";
  store.undangan.galeri = arr;
  persistEditorSnapshot();
}

// ── Multi-select toggle untuk gallery media picker
function toggleMultiSelect(url) {
  const idx = galleryMultiSelect.value.indexOf(url);
  if (idx === -1) galleryMultiSelect.value.push(url);
  else galleryMultiSelect.value.splice(idx, 1);
}

// ── Hitung slot galeri (min 6)
const DEFAULT_GALERI = [
  "/assets/invitations/gallery1.png",
  "/assets/invitations/gallery2.jpeg",
  "/assets/invitations/gallery3.jpeg",
  "/assets/invitations/gallery4.jpeg",
  "/assets/invitations/gallery5.jpeg",
  "/assets/invitations/gallery6.jpeg",
  "/assets/invitations/gallery7.jpeg",
  "/assets/invitations/gallery8.jpeg",
];

const galeriSlots = computed(() => {
  const arr = store.undangan.galeri || [];
  const slots = [...arr];
  while (slots.length < 8) {
    slots.push("");
  }
  // Slot yang kosong ("" atau null/undefined) tampilkan default gallery image
  return slots.map((url, i) => url || DEFAULT_GALERI[i] || "");
});

// ── Upload multiple file ke mediaGallery sekaligus
async function onMediaMultiUpload(e) {
  const files = Array.from(e.target.files || []);

  // Validasi semua file sebelum upload
  for (const file of files) {
    if (!validateImageFile(file)) {
      e.target.value = "";
      return;
    }
  }

  isUploading.value = true;
  try {
    let successCount = 0;
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const fileName = `undangan/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("foto-assets")
        .upload(fileName, file, { upsert: false });

      if (error) {
        console.error("Upload multi gagal:", error);
        continue;
      }

      const { data: publicData } = supabase.storage
        .from("foto-assets")
        .getPublicUrl(fileName);

      const url = publicData.publicUrl;
      const updated = [...mediaGallery.value];
      updated.unshift({ url, name: file.name });
      mediaGallery.value = updated;
      if (galleryMediaOpen.value && galleryMediaTarget.value === null) {
        galleryMultiSelect.value.push(url);
      }
      successCount++;
    }
    if (successCount > 0) {
      showToast(`✅ ${successCount} foto berhasil diupload!`);
    }
  } finally {
    isUploading.value = false;
    e.target.value = "";
  }
}

// ── Get galeri layout (default '2col')
const galeriLayout = computed({
  get: () => store.undangan.galeriLayout || "2col",
  set: (v) => {
    store.undangan.galeriLayout = v;
    persistEditorSnapshot();
  },
});

function getMapsLinkFull(fd) {
  return store.undangan[fd.linkField] ?? "";
}
function getMapsLinkShort(fd) {
  const full = getMapsLinkFull(fd);
  return full
    .replace(/^https?:\/\/(www\.)?maps\.google\.com\//i, "")
    .replace(/^https?:\/\/(www\.)?google\.com\/maps\//i, "")
    .trim();
}
function onMapsLinkInput(fd, val) {
  // Jika user paste full URL, simpan apa adanya; jika hanya path, tambahkan prefix
  const trimmed = val.trim();
  if (trimmed.startsWith("http")) {
    store.undangan[fd.linkField] = trimmed;
  } else {
    store.undangan[fd.linkField] = trimmed
      ? `https://maps.google.com/${trimmed}`
      : "";
  }
}

// ── Helper khusus Instagram: username saja (tanpa @ dan tanpa URL prefix)
function getIgUsername(fd) {
  const raw = store.undangan[fd.field] ?? "";
  // Bersihkan prefix https://instagram.com/ atau @ jika ada
  return raw
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .trim();
}

function onIgUsernameInput(fd, val) {
  // Simpan hanya username bersih (tanpa @ dan tanpa URL)
  const clean = val
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .trim();
  store.undangan[fd.field] = clean;
}

// ── Baca nilai field dari store (dipakai di form section edit)
function getFieldValue(fd) {
  if (fd._t === "und") return store.undangan[fd.field] ?? "";
  if (fd._t === "sec") return store.sectionContents?.[fd._s]?.[fd._k] ?? "";
  if (fd._t === "galeri") return store.undangan.galeri?.[fd._idx] ?? "";
  return "";
}

// ── Tulis nilai field ke store secara langsung (live saat user ketik)
function onFieldInput(fd, val) {
  if (fd._t === "und") {
    store.undangan[fd.field] = val;
  } else if (fd._t === "sec") {
    if (!store.sectionContents[fd._s]) store.sectionContents[fd._s] = {};
    store.sectionContents[fd._s][fd._k] = val;
  } else if (fd._t === "galeri") {
    const arr = [...(store.undangan.galeri || [])];
    while (arr.length <= fd._idx) arr.push(null);
    arr[fd._idx] = val;
    store.undangan.galeri = arr;
  }
}

// ── Toggle visibility per field (ON/OFF di modal edit section)

// ── Buka imageModal dari field definition
function openFieldImage(fd) {
  let target, currentUrl;
  if (fd._t === "galeri") {
    target = `galeri_${fd._idx}`;
    currentUrl = store.undangan.galeri?.[fd._idx] ?? "";
  } else {
    target = fd.field;
    currentUrl = store.undangan[fd.field] ?? "";
  }
  openImageModal(target, currentUrl, fd.label);
}

// ── List manager (Rundown items)
function getListItems(fd) {
  return store.sectionContents?.[fd._s]?.[fd._k] || [];
}
function addListItem(fd) {
  if (!store.sectionContents[fd._s]) store.sectionContents[fd._s] = {};
  const arr = [...(store.sectionContents[fd._s][fd._k] || [])];
  arr.push({ waktu: "", kegiatan: "" });
  store.sectionContents[fd._s][fd._k] = arr;
}
function removeListItem(fd, idx) {
  const arr = [...(store.sectionContents?.[fd._s]?.[fd._k] || [])];
  arr.splice(idx, 1);
  store.sectionContents[fd._s][fd._k] = arr;
}
function updateListItem(fd, idx, key, val) {
  const arr = [...(store.sectionContents?.[fd._s]?.[fd._k] || [])];
  if (!arr[idx]) arr[idx] = {};
  arr[idx] = { ...arr[idx], [key]: val };
  store.sectionContents[fd._s][fd._k] = arr;
}

// ── Story list manager (Love Story items)
function getStoryItems(fd) {
  return store.sectionContents?.[fd._s]?.[fd._k] || [];
}
function addStoryItem(fd) {
  if (!store.sectionContents[fd._s]) store.sectionContents[fd._s] = {};
  const arr = [...(store.sectionContents[fd._s][fd._k] || [])];
  arr.push({ title: "", description: "", date: "", image_url: "" });
  store.sectionContents[fd._s][fd._k] = arr;
}
function removeStoryItem(fd, idx) {
  const arr = [...(store.sectionContents?.[fd._s]?.[fd._k] || [])];
  arr.splice(idx, 1);
  store.sectionContents[fd._s][fd._k] = arr;
}
function updateStoryItem(fd, idx, key, val) {
  const arr = [...(store.sectionContents?.[fd._s]?.[fd._k] || [])];
  if (!arr[idx]) arr[idx] = {};
  arr[idx] = { ...arr[idx], [key]: val };
  store.sectionContents[fd._s][fd._k] = arr;
}

// ── Story layout & upload foto
const storyLayouts = [
  {
    value: "foto-atas",
    label: "Foto Atas",
    icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="3" y="3" width="26" height="12" rx="2" fill="#7ecec4"/><rect x="3" y="18" width="26" height="3" rx="1.5" fill="#ddd"/><rect x="3" y="24" width="18" height="2.5" rx="1.25" fill="#eee"/></svg>`,
  },
  {
    value: "foto-kanan",
    label: "Foto Kanan",
    icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="3" y="7" width="13" height="3" rx="1.5" fill="#ddd"/><rect x="3" y="13" width="10" height="2.5" rx="1.25" fill="#eee"/><rect x="18" y="5" width="11" height="22" rx="2" fill="#7ecec4"/></svg>`,
  },
  {
    value: "foto-kiri",
    label: "Foto Kiri",
    icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="3" y="5" width="11" height="22" rx="2" fill="#7ecec4"/><rect x="17" y="7" width="12" height="3" rx="1.5" fill="#ddd"/><rect x="17" y="13" width="10" height="2.5" rx="1.25" fill="#eee"/></svg>`,
  },
  {
    value: "teks-klasik",
    label: "Teks Klasik",
    icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="5" y="6" width="22" height="3" rx="1.5" fill="#ddd"/><rect x="7" y="12" width="18" height="2.5" rx="1.25" fill="#eee"/><rect x="7" y="18" width="18" height="2.5" rx="1.25" fill="#eee"/></svg>`,
  },
  {
    value: "teks-quote",
    label: "Teks Quote",
    icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><text x="3" y="22" font-size="20" fill="#7ecec4" font-family="serif">"</text><rect x="13" y="9" width="15" height="3" rx="1.5" fill="#ddd"/><rect x="11" y="15" width="17" height="2.5" rx="1.25" fill="#eee"/></svg>`,
  },
  {
    value: "teks-timeline",
    label: "Timeline",
    icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="9" cy="9" r="3" fill="#7ecec4"/><line x1="9" y1="12" x2="9" y2="21" stroke="#7ecec4" stroke-width="2"/><circle cx="9" cy="24" r="3" fill="#7ecec4"/><rect x="15" y="7" width="13" height="3" rx="1.5" fill="#ddd"/></svg>`,
  },
];
function getStoryLayout(fd) {
  return store.sectionContents?.[fd._s]?.layout || "foto-atas";
}
function setStoryLayout(fd, val) {
  if (!store.sectionContents[fd._s]) store.sectionContents[fd._s] = {};
  store.sectionContents[fd._s].layout = val;
}
function isStoryPhotoLayout(fd) {
  return ["foto-atas", "foto-kanan", "foto-kiri"].includes(getStoryLayout(fd));
}
function moveStoryItem(fd, idx, dir) {
  const arr = [...(store.sectionContents?.[fd._s]?.[fd._k] || [])];
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= arr.length) return;
  [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
  store.sectionContents[fd._s][fd._k] = arr;
}
function openLoveStoryMedia(idx, currentUrl) {
  openImageModal(`love_story_${idx}`, currentUrl, `Foto Momen ${idx + 1}`);
}

// ── Color list manager (Dresscode warna)
function getColorList(fd) {
  return store.sectionContents?.[fd._s]?.[fd._k] || [];
}
function addColor(fd) {
  if (!store.sectionContents[fd._s]) store.sectionContents[fd._s] = {};
  const arr = [...(store.sectionContents[fd._s][fd._k] || [])];
  arr.push("");
  store.sectionContents[fd._s][fd._k] = arr;
}
function removeColor(fd, idx) {
  const arr = [...(store.sectionContents?.[fd._s]?.[fd._k] || [])];
  arr.splice(idx, 1);
  store.sectionContents[fd._s][fd._k] = arr;
}
function updateColorItem(fd, idx, val) {
  const arr = [...(store.sectionContents?.[fd._s]?.[fd._k] || [])];
  arr[idx] = val;
  store.sectionContents[fd._s][fd._k] = arr;
}

// ── Simpan dan tutup modal section edit
function saveSectionEdit() {
  sectionEditOpen.value = false;
  // Paksa save sekarang agar tidak bergantung pada debounce watcher
  persistEditorSnapshot();
}

function saveFieldValue() {
  if (!activeField.value) return;
  const fd = activeField.value;
  if (fd._t === "und") {
    store.undangan[fd.field] = fieldValue.value;
  } else if (fd._t === "sec") {
    if (!store.sectionContents) store.sectionContents = {};
    if (!store.sectionContents[fd._s]) store.sectionContents[fd._s] = {};
    store.sectionContents[fd._s][fd._k] = fieldValue.value;
  }
  fieldEditOpen.value = false;
}

const galleryModalOpen = ref(false);
const galleryMediaOpen = ref(false);
const galleryMediaTarget = ref(null);
const galleryMultiSelect = ref([]);
const galExpand = ref(null);
const layoutModalOpen = ref(false);
const mediaUploadOnly = ref(false);
const isUploading = ref(false);

// New states for search and dynamic orientation
const assetsSearch = ref("");
const assetsLoading = ref(false);
const imageOrientations = reactive({});

function onImgLoad(event, url) {
  const { naturalWidth, naturalHeight } = event.target;
  imageOrientations[url] = naturalWidth > naturalHeight;
}

// Layout options gallery
const GALLERY_LAYOUTS = [
  { key: "1col", label: "1 Kolom", preview: [[1], [1], [1]] },
  {
    key: "2col",
    label: "2 Kolom",
    preview: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    key: "masonry",
    label: "Masonry",
    preview: [
      [2, 1],
      [1, 2],
    ],
  },
  {
    key: "3col",
    label: "3 Kolom",
    preview: [
      [1, 1, 1],
      [1, 1, 1],
    ],
  },
  { key: "hero", label: "Hero + Grid", preview: [[3], [1, 1]] },
  {
    key: "5foto",
    label: "5 Foto",
    preview: [
      [1, 1],
      [1, 1],
      [1, 0],
    ],
  },
];

const imageModal = reactive({
  show: false,
  target: "",
  currentUrl: "",
  urlInput: "",
  previewNew: "",
  fileData: null,
});

// ── Media Library state
const mediaTab = ref("gallery");
const mediaSelected = ref("");
const mediaGallery = computed({
  get: () => store.undangan.mediaGallery || [],
  set: (val) => {
    store.undangan.mediaGallery = val;
  },
});
// mediaAssets diambil dari assetStore (admin upload di /admin/asset)
const mediaAssets = computed(() =>
  assetStore.fotoAsset.map((f) => ({
    url: f.url,
    name: f.nama,
    kategori: f.kategori,
  })),
);

const filteredAssets = computed(() => {
  if (!assetsSearch.value) return mediaAssets.value;
  const q = assetsSearch.value.toLowerCase().trim();
  return mediaAssets.value.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      (f.kategori || "").toLowerCase().includes(q),
  );
});

function openImageModal(target, currentUrl = "", label = "") {
  imageModal.target = target;
  imageModal.currentUrl = currentUrl || store.undangan?.images?.[target] || "";
  imageModal.urlInput = "";
  imageModal.previewNew = "";
  imageModal.fileData = null;
  mediaTab.value = "gallery";
  mediaSelected.value = "";
  imageModalOpen.value = true;
}

// Upload foto ke Supabase Storage, simpan URL permanen
async function onMediaFileUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validasi format dan ukuran
  if (!validateImageFile(file)) {
    e.target.value = "";
    return;
  }

  isUploading.value = true;
  try {
    const ext = file.name.split(".").pop();
    const fileName = `undangan/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("foto-assets")
      .upload(fileName, file, { upsert: false });

    if (error) {
      console.error("Upload gagal:", error);
      showToast("❌ Upload foto gagal, coba lagi.", "error");
      return;
    }

    const { data: publicData } = supabase.storage
      .from("foto-assets")
      .getPublicUrl(fileName);

    const url = publicData.publicUrl;
    const updated = [...mediaGallery.value];
    updated.unshift({ url, name: file.name });
    mediaGallery.value = updated;
    mediaSelected.value = url;

    // Trigger toast notification
    showToast("✅ Foto berhasil diupload!");
  } catch (err) {
    console.error("Upload error:", err);
    showToast("❌ Terjadi kesalahan saat upload, coba lagi.", "error");
  } finally {
    isUploading.value = false;
    e.target.value = "";
  }
}

// Hapus item dari gallery
function deleteMediaItem(i) {
  if (mediaSelected.value === mediaGallery.value[i]?.url)
    mediaSelected.value = "";
  const updated = [...mediaGallery.value];
  updated.splice(i, 1);
  mediaGallery.value = updated;
}

// Hapus item yang sedang dipilih
function deleteMediaSelected() {
  const idx = mediaGallery.value.findIndex(
    (m) => m.url === mediaSelected.value,
  );
  if (idx !== -1) {
    const updated = [...mediaGallery.value];
    updated.splice(idx, 1);
    mediaGallery.value = updated;
  }
  mediaSelected.value = "";
}

async function onImageFileChange(e) {
  await onMediaFileUpload(e);
  // Otomatis simpan ke field setelah upload selesai
  if (mediaSelected.value) {
    saveImage();
  }
}

function onImageUrlInput() {
  const url = imageModal.urlInput.trim();
  if (url.startsWith("http")) {
    imageModal.previewNew = url;
    imageModal.fileData = null;
  }
}

function saveImage() {
  const { target } = imageModal;
  const selectedUrl = mediaSelected.value;
  if (!selectedUrl) return;
  const galeriMatch = target.match(/^galeri_(\d+)$/);
  const storyMatch = target.match(/^love_story_(\d+)$/);
  if (galeriMatch) {
    const idx = parseInt(galeriMatch[1]);
    const arr = [...(store.undangan.galeri || [])];
    while (arr.length <= idx) arr.push(null);
    arr[idx] = selectedUrl;
    store.undangan.galeri = arr;
  } else if (storyMatch) {
    const idx = parseInt(storyMatch[1]);
    if (!store.sectionContents.lovestory) store.sectionContents.lovestory = {};
    const arr = [...(store.sectionContents.lovestory.items || [])];
    if (arr[idx]) {
      arr[idx].image_url = selectedUrl;
      store.sectionContents.lovestory.items = arr;
    }
  } else {
    if (target in store.undangan) {
      store.undangan[target] = selectedUrl;
    } else {
      if (!store.undangan.images) store.undangan.images = {};
      store.undangan.images[target] = selectedUrl;
    }
  }
  mediaSelected.value = "";
  imageModalOpen.value = false;
}

// ── Custom Colors
// ── SHORTCUT MENU — ganti img path & width sesuai file iconmu
const shortcutMenus = computed(() => [
  {
    key: "pengaturan",
    label: "Pengaturan",
    img: "/icons/menu/pengaturan.png", // ← ganti path ikonmu
    width: "32px", // ← atur width bebas
    action: () => {
      // Hanya isi deskripsi default kalau masih kosong
      // judulPengaturan TIDAK diambil dari store.undangan.judul —
      // keduanya adalah field terpisah (metadata vs konten tema)
      if (!store.undangan.deskripsi) {
        store.undangan.deskripsi =
          "Tanpa Mengurangi Rasa Hormat. Kami Bermaksud Mengundang Bapak/Ibu/Saudara/i, Pada Acara Pernikahan Kami.";
      }
      pengaturanOpen.value = true;
    },
  },
  {
    key: "rsvp",
    label: "RSVP",
    img: "/icons/menu/rsvp.png",
    width: "32px",
    action: () => {
      rsvpOpen.value = true;
    },
  },
  {
    key: "musik",
    label: "Music",
    img: "/icons/menu/music.png",
    width: "30px",
    action: () => {
      musikOpen.value = true;
    },
  },
  {
    key: "preview",
    label: "Preview",
    img: "/icons/menu/preview.png",
    width: "32px",
    action: () => openPreview(),
  },
  {
    key: "kirim",
    label: "Kirim",
    img: "/icons/menu/kirim.png",
    width: "28px",
    action: () => goToKirim(),
  },
  {
    key: "tutorial",
    label: "Tutorial",
    img: "/icons/menu/tutorial.png",
    width: "30px",
    action: () => {
      tutorialOpen.value = true;
    },
  },
]);

// ── SECTION ICONS — ganti img path & width sesuai file iconmu
// key harus sama dengan key di DEFAULT_SECTIONS di store
const sectionIcons = {
  opening: { img: "/icons/sections/cover.png", width: "38px" },
  mempelai: { img: "/icons/sections/mempelai.png", width: "38px" },
  quotes: { img: "/icons/sections/quotes.png", width: "36px" },
  acara: { img: "/icons/sections/acara.png", width: "34px" },
  galeri: { img: "/icons/sections/galeri.png", width: "36px" },
  rsvp: { img: "/icons/sections/rsvp.png", width: "34px" },
  maps: { img: "/icons/sections/maps.png", width: "36px" },
  lovestory: { img: "/icons/sections/lovestory.png", width: "34px" },
  gift: { img: "/icons/sections/gift.png", width: "34px" },
  rundown: { img: "/icons/sections/rundown.png", width: "32px" },
  dresscode: { img: "/icons/sections/dresscode.png", width: "36px" },
  contact: { img: "/icons/sections/contact.png", width: "32px" },
  penutup: { img: "/icons/sections/penutup.png", width: "34px" },
};

const customColors = [
  { key: "tombol", label: "Warna Tombol" },
  { key: "popup", label: "Custom Heading Modal" },
  { key: "efek", label: "Warna Efek" },
  { key: "border", label: "Custom Border" },
];

const warnaSaved = ref(false);

function simpanWarna() {
  // Broadcast perubahan warna langsung ke tab preview
  try {
    const bc = new BroadcastChannel("undangan-preview-sync");
    bc.postMessage({ type: "COLORS", customColors: { ...store.customColors } });
    bc.close();
  } catch (e) {}
  // Paksa simpan ke DB (tidak tunggu debounce watcher)
  persistEditorSnapshot();
  warnaSaved.value = true;
  setTimeout(() => {
    warnaSaved.value = false;
  }, 2800);
}

// ── Music — daftar lagu diambil dari assetStore (admin upload di /admin/asset)
const musikSearch = ref("");
const visibleCount = ref(6);
const playingUrl = ref("");
let _previewAudio = null;

function togglePlay(lagu) {
  if (!lagu.url) return;
  if (playingUrl.value === lagu.url) {
    _previewAudio?.pause();
    playingUrl.value = "";
    return;
  }
  if (_previewAudio) { _previewAudio.pause(); _previewAudio = null; }
  playingUrl.value = lagu.url;
  _previewAudio = new Audio(lagu.url);
  _previewAudio.volume = 0.7;
  _previewAudio.play().catch(() => {});
  _previewAudio.onended = () => { playingUrl.value = ""; };
}

// allLagu diambil live dari assetStore agar sinkron dengan admin
const allLagu = computed(() =>
  assetStore.musikAsset.map((m) => ({
    title: m.nama,
    artis: m.artis,
    url: m.url,
    durasi: m.durasi,
  })),
);

const filteredLagu = computed(() => {
  if (musikSearch.value.trim()) {
    const q = musikSearch.value.toLowerCase();
    return allLagu.value.filter(
      l =>
        l.title.toLowerCase().includes(q) ||
        (l.artis || "").toLowerCase().includes(q)
    );
  }
  return allLagu.value.slice(0, visibleCount.value);
});
function loadMoreMusik() {
  visibleCount.value = Math.min(visibleCount.value + 4, allLagu.value.length);
}

function goToKirim() {
  router.push(`/edit-undangan/${store.editorId}/kirim`);
}

const publicSlug = computed(() => {
  const raw = (store.undangan?.domain || store.slug || "").trim();
  return raw.replace(/^https?:\/\/[^/]+\//, "").replace(/^\//, "");
});

function syncPublicSlugFromDomain() {
  store.slug = publicSlug.value;
}

const expandedRsvpKey = ref(null);
const expandedFieldKey = ref(null);

function toggleExpandRsvp(key) {
  expandedRsvpKey.value = expandedRsvpKey.value === key ? null : key;
}

// ── Tutorial content
const tutorials = [
  {
    title: "Edit Konten",
    desc: 'Klik tombol "Edit" pada setiap section untuk mengubah teks, foto, dan detail undangan.',
  },
  {
    title: "Aktifkan Section",
    desc: "Gunakan toggle di setiap section untuk menampilkan atau menyembunyikan bagian tertentu.",
  },
  {
    title: "Drag & Drop",
    desc: "Seret section untuk mengubah urutan tampilan undangan kamu.",
  },
  {
    title: "Custom Warna",
    desc: "Ubah warna tombol, efek, dan teks sesuai selera di bagian Custom Colors.",
  },
  {
    title: "Kirim Undangan",
    desc: 'Klik tombol "Kirim" untuk membagikan link undangan ke tamu.',
  },
];

// ── Perpanjang
const selectedPaket = ref(null);
const selectedPayment = ref(null);

const perpanjangPaketList = [
  {
    id: "1bln",
    nama: "Paket 1 Bulan",
    durasi: "+30 hari aktif",
    harga: "29.000",
    hargaAsli: "",
    diskon: false,
    label: "",
  },
  {
    id: "3bln",
    nama: "Paket 3 Bulan",
    durasi: "+90 hari aktif",
    harga: "69.000",
    hargaAsli: "87.000",
    diskon: true,
    label: "Hemat 21%",
  },
  {
    id: "6bln",
    nama: "Paket 6 Bulan",
    durasi: "+180 hari aktif",
    harga: "119.000",
    hargaAsli: "174.000",
    diskon: true,
    label: "🔥 Terlaris",
  },
  {
    id: "12bln",
    nama: "Paket 1 Tahun",
    durasi: "+365 hari aktif",
    harga: "199.000",
    hargaAsli: "348.000",
    diskon: true,
    label: "Hemat 43%",
  },
];

const paymentMethods = [
  { id: "transfer", nama: "Transfer Bank (BCA / Mandiri / BNI)" },
  { id: "qris", nama: "QRIS" },
  { id: "gopay", nama: "GoPay / OVO / Dana" },
];

const selectedPaketData = computed(
  () => perpanjangPaketList.find((p) => p.id === selectedPaket.value) || null,
);

function konfirmasiPerpanjang() {
  if (!selectedPaket.value || !selectedPayment.value) return;
  alert(
    `Pesanan diterima!\nPaket: ${selectedPaketData.value?.nama}\nMetode: ${paymentMethods.find((p) => p.id === selectedPayment.value)?.nama}\n\nSilakan hubungi admin untuk konfirmasi pembayaran.`,
  );
  perpanjangOpen.value = false;
  selectedPaket.value = null;
  selectedPayment.value = null;
}

// ── Upload Thumbnail WA (modal Pengaturan) → simpan ke Supabase Storage
async function onThumbnailUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  isUploading.value = true;
  try {
    const ext = file.name.split(".").pop();
    const fileName = `undangan/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("foto-assets")
      .upload(fileName, file, { upsert: false });

    if (error) {
      console.error("Upload thumbnail gagal:", error);
      showToast("❌ Upload foto gagal, coba lagi.", "error");
      return;
    }

    const { data: publicData } = supabase.storage
      .from("foto-assets")
      .getPublicUrl(fileName);

    const url = publicData.publicUrl;
    // Simpan ke store (reactive) — hanya thumbnailWa, tidak mengubah fotoCouple/cover tema
    store.undangan = { ...store.undangan, thumbnailWa: url };

    // Paksa simpan snapshot sekarang agar tidak menunggu debounce watcher
    if (store.editorId) {
      accountStore.saveEditorSnapshot(String(store.editorId), {
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
        musikAktif: store.musikAktif,
        rsvpAktif: store.rsvpAktif,
        undanganAktif: store.undanganAktif,
        soundEffectAktif: store.soundEffectAktif,
        soundTypingAktif: store.soundTypingAktif,
        showLogoWatermark: store.showLogoWatermark,
        showMusikWatermark: store.showMusikWatermark,
      });
    }
  } catch (err) {
    console.error("Upload thumbnail error:", err);
    showToast("❌ Terjadi kesalahan saat upload.", "error");
  } finally {
    isUploading.value = false;
    e.target.value = "";
  }
}

// ── Simpan Pengaturan WA (judul, deskripsi, domain, thumbnail)
async function simpanPengaturan() {
  if (store.editorId) {
    await accountStore.saveEditorSnapshot(String(store.editorId), {
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
      musikAktif: store.musikAktif,
      rsvpAktif: store.rsvpAktif,
      undanganAktif: store.undanganAktif,
      soundEffectAktif: store.soundEffectAktif,
      soundTypingAktif: store.soundTypingAktif,
      showLogoWatermark: store.showLogoWatermark,
      showMusikWatermark: store.showMusikWatermark,
    });
  }
  pengaturanOpen.value = false;
}
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ══ PAGE LOADING SCREEN ══ */
/* ══ LOADING OVERLAY (tampil di atas editor) ══ */
.ep-page-loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 60, 55, 0.55);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
/* UNUSED — kept as dead class to avoid breaking anything */
.ep-page-loading {
  position: fixed;
  inset: 0;
  background: #7ecec4;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.ep-loading-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 40px 36px;
  text-align: center;
  background: #5bbfb5;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  min-width: 260px;
  max-width: 320px;
}
.ep-loading-logo-wrap {
  width: 96px;
  height: 96px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}
/* SVG spinning ring */
.ep-spin-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  animation: ep-ring-spin 1.1s linear infinite;
}
@keyframes ep-ring-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.ep-loading-logo {
  width: 58px;
  height: 58px;
  object-fit: contain;
  position: relative;
  z-index: 1;
}
.ep-loading-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: 0.2px;
  line-height: 1.4;
}
.ep-loading-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.5;
}
/* Overlay fade transition */
.ep-overlay-fade-enter-active,
.ep-overlay-fade-leave-active {
  transition: opacity 0.35s ease;
}
.ep-overlay-fade-enter-from,
.ep-overlay-fade-leave-to {
  opacity: 0;
}

.ep-root {
  min-height: 100dvh;
  background: #f5f7fa;
  font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  color: #1a2e45;
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
}

/* ── TOPBAR ── */
.ep-topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1px solid #edf2f7;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
}
.ep-back-btn,
.ep-share-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #1a2e45;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.15s;
  flex-shrink: 0;
}
.ep-back-btn:hover,
.ep-share-btn:hover {
  background: #f0f4f8;
}
.ep-share-btn {
  margin-left: auto;
  color: #7ecec4;
}
.ep-topbar-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a2e45;
  flex: 1;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── BODY ── */
.ep-body {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 24px;
}

/* ── INFO STRIP ── */
.ep-info-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f4f8;
}
.ep-info-left {
  display: flex;
  flex-direction: column;
}
.ep-info-label {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
}
.ep-info-date {
  font-size: 12px;
  color: #374151;
  font-weight: 600;
}
.ep-perpanjang-btn {
  background: #1a2e45;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.ep-perpanjang-btn:hover {
  background: #243d5c;
}

/* ── PROMO BANNER ── */
.ep-promo-banner {
  margin: 12px 16px;
  background: linear-gradient(135deg, #1a2e45, #2d4a70);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.ep-promo-content {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ep-promo-avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
}
.ep-promo-text {
  display: flex;
  flex-direction: column;
}
.ep-promo-text strong {
  font-size: 13px;
  color: #fff;
  font-weight: 700;
}
.ep-promo-text span {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);
}
.ep-promo-wa-btn {
  background: #25d366;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  flex-shrink: 0;
  transition: background 0.15s;
}
.ep-promo-wa-btn:hover {
  background: #1ebe5a;
}

/* ── SHORTCUT GRID ── */
.ep-shortcut-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f4f8;
}
.ep-sc-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1.5px solid #7ecec4;
  border-radius: 12px;
  padding: 12px 8px 10px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  transition: all 0.15s;
  box-shadow:
    0 4px 0 #5bbdb3,
    0 6px 12px rgba(126, 206, 196, 0.25);
}
.ep-sc-item:hover {
  background: #ffffff;
  border-color: #5bbdb3;
  transform: translateY(2px);
  box-shadow:
    0 2px 0 #5bbdb3,
    0 4px 8px rgba(126, 206, 196, 0.2);
}
.ep-sc-ico {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
}

/* ── STATUS ROW ── */
.ep-status-row {
  padding: 12px 16px 0;
}
.ep-status-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1.5px solid #7ecec4;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 10px;
  box-shadow:
    0 4px 0 #5bbdb3,
    0 6px 16px rgba(126, 206, 196, 0.2);
}
.ep-status-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ep-status-label {
  font-size: 14px;
  font-weight: 700;
  color: #1a2e45;
}
.ep-badge-aktif {
  display: inline-flex;
  align-items: center;
  background: #dcfce7;
  color: #15803d;
  border-radius: 50px;
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 700;
}

.ep-badge-nonaktif {
  display: inline-flex;
  align-items: center;
  background: #fee2e2;
  color: #ef4444;
  border-radius: 50px;
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 700;
}

/* ── TOGGLE SWITCH ── */
.ep-toggle {
  position: relative;
  width: 46px;
  height: 26px;
  background: #d1d5db;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background 0.25s;
  flex-shrink: 0;
  padding: 0;
}
.ep-toggle-sm {
  width: 38px;
  height: 22px;
}
.ep-toggle-on {
  background: #7ecec4;
}
.ep-toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: left 0.25s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}
.ep-toggle-sm .ep-toggle-knob {
  width: 16px;
  height: 16px;
}
.ep-toggle-on .ep-toggle-knob {
  left: calc(100% - 23px);
}
.ep-toggle-sm.ep-toggle-on .ep-toggle-knob {
  left: calc(100% - 19px);
}

/* ── CUSTOM COLORS CARD ── */
.ep-colors-card {
  margin: 12px 16px;
  background: #fff;
  border: 1.5px solid #7ecec4;
  border-radius: 16px;
  padding: 18px 16px;
  box-shadow:
    0 4px 0 #5bbdb3,
    0 6px 16px rgba(126, 206, 196, 0.2);
}
.ep-colors-title {
  font-size: 14px;
  font-weight: 800;
  color: #1a2e45;
  margin-bottom: 14px;
}
.ep-colors-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}
.ep-color-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1.5px solid #7ecec4;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  position: relative;
  box-shadow:
    0 3px 0 #5bbdb3,
    0 5px 10px rgba(126, 206, 196, 0.18);
}
.ep-color-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}
.ep-color-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
.ep-color-lbl {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}
.ep-colors-tutorial {
  display: block;
  font-size: 12px;
  color: #7ecec4;
  font-weight: 700;
  margin-bottom: 12px;
  text-decoration: none;
}
.ep-save-btn {
  width: 100%;
  background: #1a2e45;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 13px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.15s,
    transform 0.1s;
}
.ep-save-btn:hover {
  background: #243d5c;
}

/* ── Color saved notice ── */
.ep-color-saved-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  border: 1.5px solid #6ee7b7;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  color: #065f46;
  margin-top: 8px;
}

/* Transition */
.color-saved-enter-active {
  transition: all 0.3s ease;
}
.color-saved-leave-active {
  transition: all 0.4s ease;
}
.color-saved-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.color-saved-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.ep-save-btn:active {
  transform: scale(0.97);
}

/* ── SECTION LIST ── */
.ep-section-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 16px;
  margin-top: 4px;
}
.ep-sec-card {
  background: #fff;
  border: 1.5px solid #7ecec4;
  border-radius: 14px;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: grab;
  transition: all 0.15s;
  box-shadow:
    0 4px 0 #5bbdb3,
    0 6px 16px rgba(126, 206, 196, 0.2);
  height: 137px;
  position: relative;
  justify-content: center;
  box-sizing: border-box;
}
.ep-sec-card:hover {
  border-color: #5bbdb3;
  background: #f9fffe;
  transform: translateY(2px);
  box-shadow:
    0 2px 0 #5bbdb3,
    0 4px 8px rgba(126, 206, 196, 0.15);
}
.ep-sec-card.ep-sec-off {
  opacity: 0.5;
}
.ep-sec-toggle-corner {
  position: absolute !important;
  top: 8px;
  right: 8px;
}
.ep-sec-ico-wrap {
  width: 56px;
  height: 56px;
  background: #f0faf9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ep-sec-ico {
  display: flex;
}
.ep-sec-ico-img {
  display: block;
  object-fit: contain;
  width: 56px;
  height: 56px;
}
.ep-sec-name {
  font-size: 12px;
  font-weight: 700;
  color: #1a2e45;
  text-align: center;
}
.ep-sec-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ep-edit-btn {
  background: #1a2e45;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 5px 14px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.ep-edit-btn:hover {
  background: #243d5c;
}

/* ── MUSIC STRIP ── */
.ep-music-strip {
  margin: 14px 16px 0;
  background: #fff;
  border: 1px solid #edf2f7;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 1px 8px rgba(26, 46, 69, 0.05);
}
.ep-wm-section {
  margin: 12px 16px 0;
}
.ep-wm-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.ep-wm-title {
  font-size: 14px;
  font-weight: 800;
  color: #1a2e45;
}
.ep-wm-info {
  display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border: 1.5px solid #7ecec4;
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 10px;
    box-shadow: 0 4px 0 #5bbdb3, 0 6px 16px rgba(126, 206, 196, 0.2);
}
.ep-wm-btn-row {
  display: flex;
  gap: 10px;
}
.ep-wm-hapus-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a2e45;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 13px 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background 0.15s;
}
.ep-wm-hapus-btn:hover {
  background: #243d5c;
}
.ep-music-strip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.ep-music-strip-title {
  font-size: 14px;
  font-weight: 800;
  color: #1a2e45;
}
.ep-music-now {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
}
.ep-music-name {
  font-size: 12px;
  color: #374151;
  flex: 1;
  font-weight: 500;
}
.ep-music-ganti-btn {
  background: #e0f7f4;
  color: #0f766e;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}
.ep-music-actions {
  display: flex;
  gap: 10px;
}

/* ── BUTTONS ── */
.ep-btn-outline {
  flex: 1;
  background: #fff;
  color: #1a2e45;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  padding: 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.ep-btn-outline:hover {
  border-color: #7ecec4;
  color: #0f766e;
}
.ep-btn-primary {
  flex: 1;
  background: #1a2e45;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.15s;
}
.ep-btn-primary:hover {
  background: #243d5c;
}
.ep-btn-dark {
  background: #1a2e45;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.ep-btn-dark-full {
  width: 100%;
  background: #1a2e45;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 11px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
}
.ep-btn-danger {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ── ADMIN BAR ── */
.ep-admin-bar {
  margin: 14px 16px;
}
.ep-admin-btn {
  display: block;
  width: 100%;
  background: #1a2e45;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 15px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background 0.15s;
}
.ep-admin-btn:hover {
  background: #243d5c;
}

/* ── PREVIEW OVERLAY ── */
/* ════════════════════
   MODAL STYLES
════════════════════ */
.modal-body-pad {
  padding: 6px 16px 12px;
}

/* Force light modal regardless system theme */
:deep(.u-modal-content) {
  background: #ffffff !important;
  color: #1a2e45 !important;
  overflow: hidden !important;
  box-shadow: 0 18px 48px rgba(26, 46, 69, 0.18) !important;
  display: flex !important;
  flex-direction: column !important;
  /* ── Paksa center presisi di tengah layar (override posisi bawaan Nuxt UI) ── */
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  right: auto !important;
  bottom: auto !important;
  margin: 0 !important;
  transform: translate(-50%, -50%) !important;
  max-height: 85dvh !important;
}

:deep(.u-modal-body) {
  overflow-y: auto !important;
}

:deep(.u-modal-header),
:deep(.u-modal-body),
:deep(.u-modal-footer) {
  background: #ffffff !important;
  color: #1a2e45 !important;
}

:deep(.u-modal-header) {
  min-height: 64px !important;
  padding: 18px 24px !important;
  border-bottom: 1px solid #edf2f7 !important;
}

:deep(.u-modal-body) {
  padding: 0 !important;
}

:deep(.u-modal-footer) {
  padding: 18px 24px !important;
  border-top: 1px solid #edf2f7 !important;
}
.modal-section-label {
  font-size: 14px;
  font-weight: 800;
  color: #1a2e45;
}
.modal-section-sub {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
  margin-bottom: 14px;
}
.modal-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-row-label {
  font-size: 14px;
  font-weight: 700;
  color: #1a2e45;
}

/* RSVP */
.rsvp-fields-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}
.rsvp-field-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #edf2f7;
  border-radius: 10px;
  padding: 12px 14px;
  background: #fafbfc;
}
.rsvp-field-name {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}
.rsvp-field-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Pengaturan */
.wa-preview-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background: #d9fdd3;
  margin-bottom: 18px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.wa-preview-img {
  width: 100%;
  height: 180px;
  background: #c8e6c9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}
.wa-preview-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.wa-preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #80cbc4;
  cursor: pointer;
}
.wa-preview-text {
  padding: 10px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.wa-preview-domain {
  font-size: 10px;
  color: #6b7280;
  margin-top: 4px;
}
.wa-preview-text strong {
  font-size: 14px;
  color: #111b21;
  font-weight: 700;
  display: block;
  line-height: 1.3;
}
.wa-preview-text p {
  font-size: 12px;
  color: #54656f;
  line-height: 1.45;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.modal-field-group {
  margin-bottom: 14px;
}
.modal-field-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 6px;
}
.modal-input {
  width: 100%;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 13px;
  color: #1a2e45;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}
.modal-input:focus {
  border-color: #7ecec4;
  box-shadow: 0 0 0 3px rgba(126, 206, 196, 0.15);
}
.domain-input-wrap {
  display: flex;
  align-items: stretch;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}
.domain-input-wrap:focus-within {
  border-color: #7ecec4;
  box-shadow: 0 0 0 3px rgba(126, 206, 196, 0.15);
}
.domain-prefix {
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  background: #f8fafc;
  border-right: 1.5px solid #e2e8f0;
  white-space: nowrap;
}
.domain-input {
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
.modal-textarea {
  width: 100%;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 13px;
  color: #1a2e45;
  outline: none;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;
}
.modal-textarea:focus {
  border-color: #7ecec4;
}

/* Music modal */
.musik-item-selected {
  background: rgba(126, 206, 196, 0.08) !important;
  border-color: #7ecec4 !important;
}
.musik-search-row {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
  background: #fff;
}
.musik-filter-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  white-space: nowrap;
  cursor: pointer;
}
.musik-filter-select {
  padding: 10px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  background: #f8fafc;
  border: none;
  border-right: 1px solid #e2e8f0;
  outline: none;
  font-family: inherit;
  cursor: pointer;
  max-width: 120px;
}
.musik-search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
  color: #374151;
  background: transparent;
}
.musik-search-btn {
  background: #7ecec4;
  border: none;
  padding: 10px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.musik-search-btn:hover {
  background: #5bb8ae;
}
.musik-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
}
.musik-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 2px;
  border-bottom: 1px solid #f3f4f6;
}
.musik-item-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.musik-play-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid #7ecec4;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.musik-play-btn:hover,
.musik-play-btn.is-playing {
  background: #e8f7f5;
}
.musik-title {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}
.musik-pilih-btn {
  background: #1a2e45;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.musik-pilih-btn.musik-pilih-active {
  background: #7ecec4;
  color: #fff;
}
.musik-load-more {
  width: 100%;
  background: transparent;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #7ecec4;
  cursor: pointer;
  margin-top: 4px;
}

/* Kirim Undangan */
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
  margin-bottom: 8px;
}
.kirim-note-list {
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.kirim-note-list li {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.55;
}
.kirim-section-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  background: #fff;
  margin-bottom: 12px;
}
.kirim-card-title {
  font-size: 13px;
  font-weight: 800;
  color: #1a2e45;
  margin-bottom: 10px;
}
.kirim-link-url {
  display: block;
  font-size: 12px;
  color: #7ecec4;
  font-weight: 600;
  word-break: break-all;
  margin-bottom: 8px;
  text-decoration: underline;
}
.kirim-link-actions {
  display: flex;
  gap: 10px;
}
.kirim-share-btn {
  justify-content: center;
  display: flex;
  align-items: center;
  gap: 6px;
}
.kirim-pesan-preview {
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 10px;
  padding: 12px;
  font-size: 12px;
  color: #374151;
  line-height: 1.7;
}
.kirim-stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}
.kirim-stat-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  background: #fff;
}
.kirim-stat-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 4px;
}
.kirim-stat-val {
  font-size: 26px;
  font-weight: 900;
}
.kirim-hadir {
  color: #16a34a;
}
.kirim-tidak {
  color: #dc2626;
}
.kirim-tamu-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}
.kirim-tamu-search {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}
.kirim-tamu-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.kirim-tamu-selected {
  font-size: 11px;
  color: #9ca3af;
  margin-bottom: 6px;
}
.kirim-tamu-list {
  min-height: 40px;
}
.kirim-tamu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 4px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 12px;
  color: #374151;
}
.kirim-tamu-status {
  font-size: 11px;
  font-weight: 700;
}
.kirim-tamu-status.hadir {
  color: #16a34a;
}
.kirim-tamu-status.tidak {
  color: #dc2626;
}
.kirim-tamu-empty {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  padding: 16px 0;
}

/* Section edit */
.sec-preview-wrap {
  border: 1px solid #edf2f7;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 14px;
  max-height: 300px;
  overflow-y: auto;
}
.field-pills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}
.field-pill {
  background: #f0faf9;
  color: #0f766e;
  border: 1.5px solid #c8ede9;
  border-radius: 50px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.field-pill:hover {
  background: #7ecec4;
  color: #fff;
  border-color: #7ecec4;
}
.sec-toolbar {
  display: flex;
  gap: 10px;
}
.ep-tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}
.ep-tool-btn:hover {
  background: #f0faf9;
  border-color: #7ecec4;
  color: #0f766e;
}
.ep-tool-danger {
  color: #dc2626 !important;
}
.ep-tool-danger:hover {
  background: #fee2e2 !important;
  border-color: #fca5a5 !important;
}

/* Image modal */
.img-preview-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}
.img-preview {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}
.img-preview-label {
  font-size: 11px;
  color: #6b7280;
}
.img-upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: #f8fafc;
  border: 1.5px dashed #d1d5db;
  border-radius: 10px;
  padding: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: 12px;
}
.img-upload-btn:hover {
  border-color: #7ecec4;
  color: #0f766e;
  background: #f0faf9;
}
.img-file-input {
  display: none;
}
.img-url-section {
}
.img-url-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
}

/* Tutorial */
.tutorial-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.tutorial-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.tutorial-num {
  width: 28px;
  height: 28px;
  background: #7ecec4;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
}
.tutorial-title {
  font-size: 13px;
  font-weight: 700;
  color: #1a2e45;
  margin-bottom: 3px;
}
.tutorial-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.55;
}

/* Modal footer */
.modal-footer-btns {
  display: flex;
  gap: 12px;
  padding: 0;
  width: 100%;
}

/* Tombol Batal */
.btn-footer-cancel {
  flex: 1;
  justify-content: center !important;
  border-radius: 14px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  height: 44px !important;
  background: #e8eaed !important;
  color: #1a2e45 !important;
  border: none !important;
  box-shadow: none !important;
  transition:
    opacity 0.15s,
    transform 0.1s !important;
}
.btn-footer-cancel:hover {
  background: #dde0e4 !important;
  color: #1a2e45 !important;
}
.btn-footer-cancel:active {
  transform: scale(0.97) !important;
}

/* Tombol Simpan / Aksi utama */
.btn-footer-primary {
  flex: 1;
  justify-content: center !important;
  border-radius: 14px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  height: 44px !important;
  background: #1a2e45 !important;
  color: #fff !important;
  border: none !important;
  box-shadow: none !important;
  transition:
    opacity 0.15s,
    transform 0.1s !important;
}
.btn-footer-primary:hover {
  background: #243d5c !important;
  color: #fff !important;
}
.btn-footer-primary:active {
  transform: scale(0.97) !important;
}
.btn-footer-primary:disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

/* ── MODAL EDIT SECTION — FORM LANGSUNG ── */
.sec-modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 18px;
  border: 1px solid #edf2f7;
}
.sec-modal-ico {
  display: flex;
  flex-shrink: 0;
}
.sec-modal-title {
  font-size: 14px;
  font-weight: 800;
  color: #1a2e45;
}
.sec-modal-sub {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.sec-form-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sec-form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Accordion row style (mirip RSVP fields) */
.sec-group-header {
  font-size: 11px;
  font-weight: 700;
  color: #7ecec4;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 16px 4px 8px;
  border-bottom: 1.5px solid #e2e8f0;
  margin-bottom: 6px;
}
.sec-group-header:first-child {
  padding-top: 4px;
}
.sec-field-row-wrap {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;
}
.sec-field-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 14px;
  background: #fff;
  flex-wrap: wrap;
}
.sec-field-name {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  flex: 1 1 140px;
  min-width: 0;
  word-break: break-word;
}
.sec-field-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sec-field-expand {
  padding: 0 14px 14px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid #f1f5f9;
  padding-top: 12px;
}
.sec-form-label {
  font-size: 12px;
  font-weight: 700;
  color: #374151;
}
.sec-form-input,
.sec-form-textarea {
  width: 100%;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 13px;
  color: #1a2e45;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
  background: #fff;
}
.sec-form-input:focus,
.sec-form-textarea:focus {
  border-color: #7ecec4;
  box-shadow: 0 0 0 3px rgba(126, 206, 196, 0.15);
}
.sec-form-textarea {
  resize: vertical;
  min-height: 72px;
}

.sec-no-fields {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 32px 16px;
  color: #9ca3af;
  font-size: 13px;
  text-align: center;
}

/* ── Sec form item header (label + toggle) ── */
.sec-form-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.sec-form-hint {
  font-size: 11px;
  color: #9ca3af;
  font-style: italic;
  padding: 4px 0;
}
.sec-form-hidden-hint {
  font-size: 11px;
  color: #d1d5db;
  font-style: italic;
  padding: 4px 0;
  text-align: center;
}

/* ── Sec image field ── */
.sec-img-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sec-img-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

/* ── Sec list manager (Rundown, Dresscode warna) ── */
.sec-list-manager {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sec-list-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sec-list-item-fields {
  display: flex;
  flex: 1;
  gap: 8px;
  flex-wrap: wrap;
}
.sec-list-input-sm {
  max-width: 90px;
  flex-shrink: 0;
}
.sec-list-remove-btn {
  background: #fee2e2;
  border: none;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #dc2626;
  flex-shrink: 0;
  transition: background 0.15s;
}
.sec-list-remove-btn:hover {
  background: #fca5a5;
}
.sec-list-add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0faf9;
  border: 1.5px dashed #7ecec4;
  border-radius: 10px;
  padding: 9px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #0f766e;
  cursor: pointer;
  transition: all 0.15s;
  justify-content: center;
}
.sec-list-add-btn:hover {
  background: #7ecec4;
  color: #fff;
}

/* ── Sec color item ── */
.sec-color-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── Sec story item (Love Story editor) ── */
.sec-story-item {
  background: #fdf4ff;
  border: 1.5px solid #e9d5ff;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 10px;
}
.sec-story-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.sec-story-item-num {
  font-size: 12px;
  font-weight: 700;
  color: #7c3aed;
  letter-spacing: 0.5px;
}
/* ── Story layout picker ── */
.sec-story-layout-title {
  font-size: 12px;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 8px;
}
.sec-story-layout-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 14px;
}
.sec-story-layout-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 4px 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.18s;
}
.sec-story-layout-btn:hover {
  border-color: #7ecec4;
  background: #f0faf9;
}
.sec-story-layout-btn.active {
  border-color: #7ecec4;
  background: #e8f8f6;
  box-shadow: 0 0 0 3px rgba(126, 206, 196, 0.2);
}
.sec-story-layout-icon {
  line-height: 0;
}
.sec-story-layout-name {
  font-size: 10px;
  font-weight: 700;
  color: #1a2e45;
}
/* ── Story item actions (move + delete) ── */
.sec-story-item-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}
.sec-story-move-btn {
  width: 26px;
  height: 26px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f9f9f9;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.sec-story-move-btn:hover:not(:disabled) {
  background: #ede9fe;
  color: #7c3aed;
}
.sec-story-move-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
/* ── Story foto upload ── */
.sec-story-foto-label {
  font-size: 11px;
  font-weight: 700;
  color: #555;
  margin: 2px 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.sec-story-foto-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sec-story-foto-preview {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1.5px solid #e5e7eb;
}
.sec-story-foto-img {
  width: 100%;
  height: 110px;
  object-fit: cover;
  display: block;
}
.sec-story-foto-remove {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  border: none;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sec-story-foto-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 2px dashed #d1faf4;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  background: #f0faf9;
  color: #5dbdb2;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.18s;
}
.sec-story-foto-upload:hover {
  background: #e0f5f2;
  border-color: #7ecec4;
}
.sec-story-foto-upload--loading {
  opacity: 0.65;
  cursor: not-allowed;
  pointer-events: none;
  background: #f0faf9;
  border-color: #b2e8e2;
}
.spin {
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.sec-story-no-foto {
  font-size: 11px;
  color: #aaa;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 8px 10px;
  text-align: center;
}

/* ── PERPANJANG MODAL ── */
.perpanjang-info-card {
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 20px;
}
.perpanjang-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.perpanjang-info-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}
.perpanjang-info-val {
  font-size: 13px;
  font-weight: 700;
  color: #1a2e45;
}

.perpanjang-paket-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.perpanjang-paket-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  overflow: hidden;
}
.perpanjang-paket-card:hover {
  border-color: #7ecec4;
  background: #f0faf9;
}
.perpanjang-paket-active {
  border-color: #7ecec4 !important;
  background: #f0faf9 !important;
  box-shadow: 0 0 0 3px rgba(126, 206, 196, 0.2);
}
.perpanjang-paket-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.perpanjang-paket-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  color: #fff;
}
.perpanjang-paket-active .perpanjang-paket-check {
  background: #7ecec4;
  border-color: #7ecec4;
}
.perpanjang-paket-nama {
  font-size: 13px;
  font-weight: 700;
  color: #1a2e45;
}
.perpanjang-paket-durasi {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}
.perpanjang-paket-harga {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.perpanjang-paket-coret {
  font-size: 11px;
  color: #9ca3af;
  text-decoration: line-through;
}
.perpanjang-paket-price {
  font-size: 14px;
  font-weight: 800;
  color: #1a2e45;
}
.perpanjang-paket-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #7ecec4;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 0 10px 0 10px;
}

.perpanjang-payment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.perpanjang-payment-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-align: left;
  transition: all 0.15s;
}
.perpanjang-payment-item:hover {
  border-color: #7ecec4;
  background: #f0faf9;
}
.perpanjang-payment-active {
  border-color: #7ecec4 !important;
  background: #f0faf9 !important;
}
.perpanjang-payment-check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  transition: all 0.2s;
}
.perpanjang-payment-active .perpanjang-payment-check {
  background: #7ecec4;
  border-color: #7ecec4;
}
.perpanjang-payment-nama {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.perpanjang-total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1a2e45;
  border-radius: 12px;
  padding: 14px 18px;
  margin-top: 18px;
}
.perpanjang-total-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
}
.perpanjang-total-val {
  font-size: 18px;
  font-weight: 800;
  color: #7ecec4;
}

/* ── TEMPLATE PREVIEW ── */
.template-preview-box {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px;
  font-size: 13px;
  color: #374151;
  line-height: 1.7;
  min-height: 80px;
}
.rsvp-field-row-wrap {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;
}
.rsvp-field-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #fff;
}
.rsvp-field-expand {
  padding: 0 14px 14px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid #f1f5f9;
}
.rsvp-expand-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
}
/* ══ LAYOUT PICKER MODAL ══ */
.layout-modal-body {
  padding: 8px 0 4px;
}
.layout-modal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 0 12px 8px;
}
.layout-modal-card {
  position: relative;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  background: #fff;
}
.layout-modal-card:hover {
  border-color: #7ecec4;
}
.layout-modal-active {
  border-color: #7ecec4 !important;
  box-shadow: 0 0 0 2px #7ecec430;
}
.layout-card-preview {
  padding: 8px 6px 4px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 130px;
}
.lcp-heading {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
}
.lcp-heading-line {
  height: 4px;
  border-radius: 2px;
  background: #cbd5e1;
}
.lcp-line-short {
  width: 40%;
}
.lcp-line-long {
  width: 65%;
}

/* Grid sesuai layout */
.lcp-grid {
  flex: 1;
  display: grid;
  gap: 2px;
}
.lcp-grid-1col {
  grid-template-columns: 1fr;
}
.lcp-grid-2col {
  grid-template-columns: 1fr 1fr;
}
.lcp-grid-masonry {
  grid-template-columns: 1fr 1fr;
}
.lcp-grid-3col {
  grid-template-columns: 1fr 1fr 1fr;
}
.lcp-grid-hero {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
}
.lcp-grid-5foto {
  grid-template-columns: 1fr 1fr;
}
.lcp-cell-empty {
  border-radius: 3px;
  min-height: 18px;
  background: transparent;
}

.lcp-cell-img {
  background: #e2e8f0;
  border-radius: 3px;
  min-height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lcp-cell-img::after {
  content: "";
  display: block;
  width: 8px;
  height: 6px;
  background: #94a3b8;
  border-radius: 1px;
  clip-path: polygon(0 70%, 30% 30%, 55% 55%, 75% 20%, 100% 70%);
}
.lcp-tall {
  min-height: 38px;
}
.lcp-short {
  min-height: 17px;
}
.lcp-hero {
  grid-column: 1 / -1;
  min-height: 32px;
}
.lcp-masonry-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lcp-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 0 2px;
}
.lcp-crown {
  font-size: 10px;
}
.lcp-label {
  font-size: 10px;
  font-weight: 700;
  color: #475569;
}

.layout-card-check {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #7ecec4;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ══ GALLERY MODAL ══ */
.gal-modal-body {
  padding: 6px 16px 12px;
}

.gal-feature-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  margin: 0 0 12px;
}
.gal-feature-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.gal-feature-label {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}
.gal-badge-aktif {
  background: #dcfce7;
  color: #16a34a;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}
.gal-badge-nonaktif {
  background: #f1f5f9;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}
.gal-field-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 0;
  border-bottom: 1px solid #f1f5f9;
}
.gal-field-label {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}
.gal-field-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.gal-section-title {
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
  margin: 16px 0 10px;
}
.gal-layout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1.5px solid #7ecec4;
  border-radius: 24px;
  background: #fff;
  color: #7ecec4;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 0;
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 10px;
}
.gal-layout-btn:hover {
  background: #f0faf9;
}

/* Layout picker */
.gal-layout-picker {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 12px;
}
.gal-layout-opt {
  flex-shrink: 0;
  width: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 6px;
  border-radius: 10px;
  border: 2px solid transparent;
  transition:
    border-color 0.15s,
    background 0.15s;
}
.gal-layout-opt:hover {
  background: #f0faf9;
}
.gal-layout-active {
  border-color: #7ecec4 !important;
  background: #f0faf9;
}
.gal-layout-preview {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.gal-lp-row {
  display: flex;
  gap: 2px;
  height: 14px;
}
.gal-lp-cell {
  border-radius: 2px;
  background: #cbd5e1;
  flex: 1;
}
.gal-layout-name {
  font-size: 10px;
  color: #64748b;
  font-weight: 600;
  text-align: center;
}

/* Grid foto dinamis */
.gal-grid-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

/* gal-multi-upload removed */

/* Layout grids */
.gal-dyn-grid {
  display: grid;
  gap: 6px;
}
.gal-dyn-1col {
  grid-template-columns: 1fr;
}
.gal-dyn-1col .gal-slot {
  aspect-ratio: 16/7;
}

.gal-dyn-2col {
  grid-template-columns: 1fr 1fr;
}
.gal-dyn-2col .gal-slot {
  aspect-ratio: 1;
}

.gal-dyn-masonry {
  display: block !important;
  column-count: 2;
  column-gap: 6px;
}
.gal-dyn-masonry .gal-slot {
  break-inside: avoid;
  display: block;
  margin-bottom: 6px;
  aspect-ratio: unset;
}
.gal-dyn-masonry .gal-slot-tall {
  aspect-ratio: unset;
}
.gal-dyn-masonry .gal-slot-short {
  aspect-ratio: unset;
}
.gal-dyn-masonry .gal-slot-img {
  width: 100%;
  height: auto;
  display: block;
}

.gal-dyn-3col {
  grid-template-columns: 1fr 1fr 1fr;
}
.gal-dyn-3col .gal-slot {
  aspect-ratio: 1;
}

.gal-dyn-hero {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.gal-slot-hero {
  aspect-ratio: 16/9 !important;
  width: 100%;
}
.gal-dyn-hero-sub {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.gal-dyn-hero-sub .gal-slot {
  aspect-ratio: 1;
}

/* 5 Foto: 2x2 + 1 bawah pojok kiri */
.gal-dyn-5foto {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.gal-dyn-5foto .gal-slot {
  aspect-ratio: 1;
}
.gal-slot-empty-placeholder {
  border-radius: 10px;
  background: transparent;
  border: 2px dashed transparent;
}

/* Slot shared styles */
.gal-slot {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 2px dashed #e2e8f0;
  transition: border-color 0.15s;
  background: #f8fafc;
}
.gal-slot:hover {
  border-color: #7ecec4;
}
.gal-slot-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
/* Hover overlay for gallery slots containing an image */
.gal-slot:has(.gal-slot-img)::after {
  content: "📷 Ganti Foto";
  position: absolute;
  inset: 0;
  background: rgba(26, 46, 69, 0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 2;
  backdrop-filter: blur(2px);
}
.gal-slot:has(.gal-slot-img):hover::after {
  opacity: 1;
}
.gal-slot-empty {
  width: 100%;
  height: 100%;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #9ca3af;
  font-size: 11px;
}
.gal-slot-empty-sm {
  font-size: 9px;
  gap: 3px;
}
.gal-slot-del {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ef4444;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10; /* Keep delete button clickable and above overlay */
}

.gal-multi-hint {
  padding: 8px 16px 0;
  font-size: 12px;
  color: #7ecec4;
  font-weight: 600;
  text-align: center;
}
.media-multi-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #7ecec4;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ══ MEDIA MODAL ══ */
.media-modal-body {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: min(66vh, 540px);
  overflow: hidden;
}
.media-tabs {
  display: flex;
  gap: 0;
  padding: 10px 22px 0;
  border-bottom: 1.5px solid #e2e8f0;
  margin-bottom: 0;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 5;
}
.media-tab-btn {
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2.5px solid transparent;
  margin-bottom: -1.5px;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.media-tab-btn:first-child {
  border-radius: 8px 8px 0 0;
}
.media-tab-active {
  color: #7ecec4;
  border-bottom-color: #7ecec4 !important;
  background: #f0faf9;
}
.media-tab-new {
  background: #7ecec4;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}
.media-tab-assets {
  color: #7ecec4;
}
.media-assets-tab-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.media-assets-tab-content .media-grid-wrap {
  flex: 1;
  min-height: 0;
}
.media-grid-wrap {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-flow: row;
  gap: 10px;
  padding: 6px 14px 16px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  flex: 1;
  min-height: 0;
}
.media-grid-wrap::-webkit-scrollbar {
  width: 8px;
}
.media-grid-wrap::-webkit-scrollbar-track {
  background: transparent;
}
.media-grid-wrap::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}
.media-upload-slot {
  aspect-ratio: 1 / 1;
  min-height: auto;
  border: 1.5px dashed #c7d6df;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  background: #f8fafc;
  color: #64748b;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s,
    transform 0.15s;
  align-self: start;
}
.media-upload-slot:hover {
  border-color: #7ecec4;
  background: #f0faf9;
  color: #1a2e45;
}
.media-upload-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #eef3f7;
  display: flex;
  align-items: center;
  justify-content: center;
}
.media-upload-text {
  font-size: 10px;
  font-weight: 800;
}
.media-grid-item {
  position: relative;
  aspect-ratio: 1 / 1;
  min-height: auto;
  border-radius: 12px;
  cursor: pointer;
  border: 2.5px solid transparent;
  background: #f0f4f8;
  transition:
    border-color 0.15s,
    box-shadow 0.15s,
    transform 0.15s;
  align-self: start;
  overflow: hidden;
}
.media-grid-item.is-landscape {
  aspect-ratio: 1 / 1;
}
.media-grid-item::before {
  content: "🖼️";
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: #f1f5f9;
  color: #cbd5e1;
  z-index: 0;
  border-radius: 12px;
}
.media-grid-item img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #fff;
  border-radius: 10px;
}
.media-grid-item:hover {
  border-color: #7ecec4;
  box-shadow: 0 4px 14px rgba(126, 206, 196, 0.25);
  transform: translateY(-1px);
}
.media-grid-selected {
  border-color: #7ecec4 !important;
  box-shadow: 0 0 0 3px rgba(126, 206, 196, 0.3) !important;
}
.media-delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: #ff5c5c;
  border: 1px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 1;
  box-shadow: 0 3px 8px rgba(255, 92, 92, 0.35);
  transition:
    background 0.15s,
    transform 0.15s;
  z-index: 10;
}
.media-delete-btn:hover {
  background: #e04b4b;
  transform: scale(1.08);
}
.media-loading-item {
  aspect-ratio: 3 / 4;
  min-height: auto;
  border-radius: 12px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #7ecec4;
  font-size: 12px;
  font-weight: 700;
  position: relative;
  overflow: hidden;
  align-self: start;
}
.media-loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e2e8f0;
  border-top-color: #7ecec4;
  border-radius: 50%;
  animation: media-spin 1s linear infinite;
}
@keyframes media-spin {
  to {
    transform: rotate(360deg);
  }
}
.media-uploading {
  grid-column: 1 / -1;
  text-align: center;
  padding: 10px;
  font-size: 13px;
  color: #7ecec4;
  font-weight: 600;
  background: #f0faf9;
  border-radius: 8px;
  border: 1.5px dashed #7ecec4;
}
.media-grid-check {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #7ecec4;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 480px) {
  :deep(.u-modal-header) {
    padding: 16px 18px !important;
  }

  :deep(.u-modal-footer) {
    padding: 14px 18px !important;
  }

  .modal-body-pad,
  .gal-modal-body {
    padding: 6px 12px 12px;
  }

  .sec-modal-header {
    padding: 12px;
    gap: 10px;
  }

  .sec-field-row {
    padding: 10px 12px;
  }

  .media-modal-body {
    height: min(68vh, 520px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .media-tabs {
    padding: 12px 18px 0;
  }

  .media-grid-wrap {
    gap: 6px;
    padding: 8px 12px 14px;
  }

  .media-upload-slot,
  .media-grid-item,
  .media-loading-item {
    min-height: auto;
    border-radius: 8px;
  }

  .modal-footer-btns {
    gap: 10px;
  }
}
.media-empty {
  grid-column: 1/-1;
  padding: 32px 16px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
}
.media-asset-label {
  display: none;
}
.media-url-section {
  padding: 12px 16px 0;
}
.media-url-label {
  font-size: 11px;
  color: #9ca3af;
  margin-bottom: 6px;
}
.btn-footer-danger {
  background: #fee2e2 !important;
  color: #ef4444 !important;
  border: none;
  font-weight: 600;
  font-size: 13px;
  border-radius: 10px;
  padding: 9px 16px;
}

/* ── INSTAGRAM INPUT ── */
.sec-countdown-config {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sec-datetime-input {
  width: 100%;
  cursor: pointer;
  background: #fff;
}

.sec-instagram-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sec-instagram-label {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 2px;
}
.sec-instagram-input-row {
  display: flex;
  align-items: center;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  transition: border-color 0.15s;
}
.sec-instagram-input-row:focus-within {
  border-color: #7ecec4;
}
.sec-instagram-prefix {
  padding: 0 10px;
  font-size: 13px;
  font-weight: 700;
  color: #9ca3af;
  background: #f8fafc;
  border-right: 1.5px solid #e2e8f0;
  height: 38px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex-shrink: 0;
}
.sec-instagram-prefix-link {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}
.sec-instagram-input {
  border: none !important;
  border-radius: 0 !important;
  flex: 1;
  min-width: 0;
  background: transparent;
}
.sec-instagram-hint {
  font-size: 10px;
  color: #9ca3af;
  margin-top: 4px;
  word-break: break-all;
}

.ep-edit-btn-active {
  background: #7ecec4 !important;
  color: #fff !important;
}

/* ── WA Thumbnail Upload Overlay ── */
.wa-preview-img-upload {
  display: block;
  overflow: hidden;
}
.wa-thumb-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.42);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.18s;
  border-radius: inherit;
}
.wa-thumb-overlay span {
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.3px;
}
.wa-preview-img-upload:hover .wa-thumb-overlay {
  opacity: 1;
}

/* ── Text Color Picker Row ── */
.sec-text-color-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
}
.sec-text-color-label {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  white-space: nowrap;
}
.sec-text-color-pick {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex: 1;
  position: relative;
}
.sec-text-color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  cursor: pointer;
}
.sec-text-color-val {
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  font-family: monospace;
}
.sec-text-color-reset {
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

/* ── RSVP Expand Form ── */
.rsvp-expand-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}
.modal-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px !important;
  cursor: pointer;
}
.rsvp-options-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.rsvp-option-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.rsvp-option-input {
  flex: 1;
  margin-bottom: 0 !important;
}
.rsvp-option-del {
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 6px;
  width: 26px;
  height: 26px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rsvp-add-option-btn {
  background: #f0fdf9;
  color: #10b981;
  border: 1.5px dashed #10b981;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: background 0.15s;
}
.rsvp-add-option-btn:hover {
  background: #d1fae5;
}

/* ── WA BUBBLE PREVIEW ── */
.wa-preview-wrap {
  background: #e5ddd5;
  border-radius: 12px;
  padding: 16px 14px;
  margin-bottom: 18px;
}
.wa-bubble {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  display: flex;
}
.wa-bubble-img-wrap {
  width: 100px;
  flex-shrink: 0;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 100px;
}
.wa-bubble-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  display: block;
}
.wa-bubble-img-empty {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8e8e8;
}
.wa-bubble-ganti-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  padding: 7px 4px;
  background: #1a2e45;
  color: #7ecec4;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  border: none;
}
.wa-bubble-ganti-btn input {
  display: none;
}
.wa-bubble-text {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
}
.wa-bubble-title {
  font-size: 13px;
  font-weight: 800;
  color: #111;
  margin: 0;
  line-height: 1.3;
}
.wa-bubble-desc {
  font-size: 12px;
  color: #555;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Assets Search Bar ── */
.media-search-container {
  position: sticky;
  top: 39px;
  z-index: 4;
  background: #fff;
  margin: 0;
  padding: 6px 14px 8px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.media-search-input {
  width: 100%;
  border: 1.5px solid #e2e8f0;
  border-radius: 999px;
  padding: 9px 14px 9px 36px;
  font-size: 13px;
  color: #1a2e45;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
  background: #f8fafc;
}
.media-search-input:focus {
  border-color: #7ecec4;
  box-shadow: 0 0 0 3px rgba(126, 206, 196, 0.15);
  background: #fff;
}
.media-search-icon {
  position: absolute;
  left: 26px;
  top: 50%;
  transform: translateY(-50%);
  color: #7ecec4;
  pointer-events: none;
}

/* ── Success Toast Banner ── */
.upload-success-toast {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: #def7ec;
  color: #03543f;
  border: 1.5px solid #bdf5d4;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 8px 30px rgba(3, 84, 63, 0.12);
  z-index: 100000;
  text-align: center;
  letter-spacing: 0.2px;
}

/* Success Toast Transitions */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-fade-enter-from {
  transform: translate(-50%, -24px);
  opacity: 0;
}
.toast-fade-leave-to {
  transform: translate(-50%, -10px);
  opacity: 0;
}

/* Toast Error Variant */
.upload-toast-error {
  background: #fef2f2;
  color: #991b1b;
  border-color: #fca5a5;
  box-shadow: 0 8px 30px rgba(153, 27, 27, 0.12);
}
</style>

<!-- FIX DARK MODE: tidak scoped, biar berlaku ke :root/html juga -->
<style>
:root {
  color-scheme: light only;
}
</style>