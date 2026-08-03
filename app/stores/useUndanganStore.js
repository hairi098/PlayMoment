// stores/useUndanganStore.js
import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";

// ─────────────────────────────────────────────
// ICON SVG PER SECTION (inline, color dari prop)
// ─────────────────────────────────────────────
const SECTION_ICONS = {
  opening: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.8"/>
    <path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,

  mempelai: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <circle cx="9" cy="7" r="3" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="15" cy="7" r="3" stroke="currentColor" stroke-width="1.8"/>
    <path d="M3 20c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12 10v2m-2 2h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  quotes: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" stroke="currentColor" stroke-width="1.8"/>
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" stroke="currentColor" stroke-width="1.8"/>
  </svg>`,

  acara: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="12" cy="16" r="2" stroke="currentColor" stroke-width="1.8"/>
  </svg>`,

  galeri: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
    <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
    <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
    <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
  </svg>`,

  rsvp: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 10h8M8 14h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,

  maps: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="1.8"/>
  </svg>`,

  lovestory: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  </svg>`,

  gift: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <path d="M20 12v10H4V12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M22 7H2v5h20V7z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12 22V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="currentColor" stroke-width="1.8"/>
  </svg>`,

  rundown: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.8"/>
    <path d="M9 12h6M9 16h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,

  dresscode: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <path d="M9 3L6 6l-3 3 3 3v9h12V12l3-3-3-3-3-3s-1 3-3 3-3-3-3-3z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  contact: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.71 16.21l.21.71z" stroke="currentColor" stroke-width="1.8"/>
  </svg>`,

  ucapan: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  penutup: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
    <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  wedding: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <path d="M12 2L9.5 8.5 3 9.27l5 4.87-1.18 6.88L12 17.77l5.18 3.25L15.82 14.14 21 9.27l-6.5-.77L12 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  </svg>`,

  salam: `<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="currentColor" stroke-width="1.8"/>
    <path d="M6 1v3M10 1v3M14 1v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,
};

// ─────────────────────────────────────────────
// SECTION DEFAULTS PER TEMA
// ─────────────────────────────────────────────
const DEFAULT_SECTIONS = [
  { key: "opening", name: "Cover", color: "#7ecec4" },
  { key: "mempelai", name: "Mempelai", color: "#f472b6" },
  { key: "quotes", name: "Qoutes", color: "#a78bfa" },
  { key: "acara", name: "Event", color: "#60a5fa" },
  { key: "maps", name: "Maps", color: "#34d399" },
  { key: "lovestory", name: "Love Story", color: "#f87171" },
  { key: "galeri", name: "Gallery", color: "#fbbf24" },
  { key: "rsvp", name: "RSVP", color: "#2fc6da" },
  { key: "gift", name: "Gift", color: "#f59e0b" },
  { key: "rundown", name: "Rundown", color: "#6366f1" },
  { key: "dresscode", name: "Drescode", color: "#ec4899" },
  { key: "contact", name: "Contact", color: "#10b981" },
  { key: "penutup", name: "Penutup", color: "#94a3b8" },
];

// ─────────────────────────────────────────────
// DEFAULT COLORS PER TEMA
// ─────────────────────────────────────────────
export const TEMA_DEFAULT_COLORS = {
  "tema-1": {
    tombol: "#7c3aed",
    popup: "#1a2e45",
    efek: "#f472b6",
    border: "#1a2e45",
  },
};

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────
export const useUndanganStore = defineStore(
  "undangan",
  () => {
    // ── Identitas undangan
    const editorId = ref("");
    const slug = ref("");
    const temaSlug = ref("tema-1");

    // ── Data utama undangan
    const undangan = reactive({
      // Meta / pengaturan
      judul: "",
      deskripsi: "",
      domain: "",
      templatePesanKirim: "",
      aktifSampai: "22 Desember 2026 at 20.22",
      kategori: "wedding",
      musik: "",
      musikUrl: "",
      musikFileName: "",
      mediaGallery: [],
      thumbnailWa: "",
      judulPengaturan: "",   // Judul di topbar editor & pesan WA — tidak terhubung ke cover tema

      // Mempelai
      nama1: "",
      nama2: "",
      fotoBride: "/assets/invitations/mempelai-wanita.png",
      fotoGroom: "/assets/invitations/mempelai-pria.png",
      fotoCouple: "/assets/invitations/no-image.webp",
      instagramBride: "",
      instagramGroom: "",

      // Acara
      tanggalAkad: "",
      waktuAkad: "",
      lokasiAkad: "",
      alamatAkad: "",
      linkMapsAkad: "",
      tanggalResepsi: "",
      waktuResepsi: "",
      lokasiResepsi: "",
      alamatResepsi: "",
      linkMapsResepsi: "",

      // Gift / rekening
      logoBank: "/assets/invitations/bca.jpg",
      namaBankRekening: "",
      nomorRekening: "",
      namaRekening: "",

      // Dresscode
      dresscodeImage: "/assets/invitations/gallery-landscape1.png",

      // Contact
      fotoContact: "/assets/invitations/gallery-potroit1.png",

      // Galeri (array 6 slot)
      galeri: [
        "/assets/invitations/gallery1.png",
        "/assets/invitations/gallery2.jpeg",
        "/assets/invitations/gallery3.jpeg",
        "/assets/invitations/gallery4.jpeg",
        "/assets/invitations/gallery5.jpeg",
        "/assets/invitations/gallery6.jpeg",
        "/assets/invitations/gallery7.jpeg",
        "/assets/invitations/gallery8.jpeg",
      ],
      galeriLayout: "2col",

      // Images bucket
      images: {},
    });

    // ── Status undangan aktif/nonaktif
    const undanganAktif = ref(true);
    // Masa aktif akun customer sudah habis
    const undanganExpired = ref(false);

    // ── Fitur tambahan
    const musikAktif = ref(true);
    const rsvpAktif = ref(true);

    // ── Isi tiap section
    const sectionContents = reactive({
      opening: {
        showOverlay: true,
        kepadaYth: "Yth. Bapak/Ibu/Saudara/i",
        btnText: "Buka Undangan",
      },
      mempelai: {
        judulModal: "Profil Mempelai",
        desc: "",
      },
      bride: {
        labelSub: "Mempelai Wanita",
        modalDesc: "Dengan memohon rahmat dan ridho Allah SWT",
        namaLengkap: "",
        orangTua: "",
        igLink: "",
      },
      groom: {
        labelSub: "Mempelai Pria",
        modalDesc: "Dengan memohon rahmat dan ridho Allah SWT",
        namaLengkap: "",
        orangTua: "",
        igLink: "",
      },
      quotes: {
        text: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri",
        text2:
          "agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
        source: "QS. Ar-Rum: 21",
      },
      acara: {
        judulAkad: "Akad Nikah & Resepsi",
        desc: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.",
        showCountdown: true,
        countdownTarget: "",
        countdownBg: "",
        mapsAkad: "Lihat di Google Maps",
        mapsResepsi: "Lihat di Google Maps",
      },
      galeri: {
        judul: "Galeri Foto",
        subJudul: "Momen indah yang kami abadikan bersama",
      },
      rsvp: {
        judul: "Konfirmasi Kehadiran",
        desc: "Mohon konfirmasi kehadiran Anda untuk membantu persiapan kami.",
        batasKonfirmasi: "20 Mei 2025",
        btnText: "Konfirmasi Kehadiran",
        btnTextAfter: "Terima Kasih!",
      },
      maps: {
        judul: "Lokasi Acara",
        desc: "Kami menantikan kehadiran Anda di lokasi berikut.",
        btnText: "Buka di Google Maps",
      },
      gift: {
        judul: "Wedding Gift",
        desc: "Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika ingin memberikan tanda kasih, Anda dapat melalui rekening berikut.",
      },
      rundown: {
        judul: "Rundown Acara",
        desc: "Jadwal rangkaian acara pernikahan kami.",
        items: [
          { waktu: "08.00", kegiatan: "Pembukaan" },
          { waktu: "09.00", kegiatan: "Akad Nikah" },
          { waktu: "11.00", kegiatan: "Resepsi" },
          { waktu: "14.00", kegiatan: "Penutup" },
        ],
      },
      dresscode: {
        judul: "Dresscode",
        description:
          "Harap menyesuaikan pakaian dengan tema yang telah kami tentukan.",
        theme: "Sage & Dusty Rose",
        colors: ["Sage Green", "Dusty Rose", "Cream White"],
      },
      contact: {
        judul: "Informasi Lebih Lanjut",
        nama: "",
        labelContact: "Panitia / Contact Person",
        btnText: "Hubungi via WhatsApp",
        wa: "",
      },
      lovestory: {
        judul: "Love Story",
        desc: "Perjalanan cinta kami yang indah menuju hari bahagia.",
        items: [
          {
            title: "Pertemuan Pertama",
            description:
              "Kami bertemu di sebuah tempat yang tak terduga dan langsung merasakan koneksi yang luar biasa.",
            date: "Januari 2020",
            image_url: "/assets/invitations/gallery5.jpeg",
          },
          {
            title: "Kencan Pertama",
            description:
              "Kencan pertama kami penuh tawa dan cerita, momen yang tak terlupakan.",
            date: "Februari 2020",
            image_url: "/assets/invitations/gallery6.jpeg",
          },
          {
            title: "Lamaran",
            description:
              "Momen paling berkesan dalam hidup kami, ketika ia melamar dengan penuh cinta.",
            date: "Juni 2023",
            image_url: "/assets/invitations/gallery7.jpeg",
          },
        ],
      },
      ucapan: {
        judul: "Ucapan & Doa",
        subJudul: "Tuliskan doa dan ucapan terbaik Anda untuk kami.",
        btnText: "Kirim Ucapan",
      },
      penutup: {
        desc: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
        hormat: "Hormat Kami",
        ampersand: "&",
      },
      wedding: {
        subText: "The Wedding Of",
        ampersand: "&",
      },
      salam: {
        judul: "Assalamualaikum Warahmatullahi Wabarakatuh",
        message:
          "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.",
      },
    });

    // ── State aktif/nonaktif tiap section
    const sectionStates = ref(
      Object.fromEntries(
        DEFAULT_SECTIONS.map((s) => [s.key, { active: true }]),
      ),
    );

    // ── Sound toggles
    const soundEffectAktif = ref(true);
    const soundTypingAktif = ref(true);

    // ── Watermark toggles (hanya bisa diubah admin)
    const showLogoWatermark = ref(true);
    const showMusikWatermark = ref(true);

    // ── Custom colors
    const customColors = reactive({
      tombol: "#7ecec4",
      popup: "#1a2e45",
      efek: "#f472b6",
      border: "#1a2e45",
    });

    // ── Text colors (per-elemen override warna teks di tema)
    const textColors = reactive({});

    // ── RSVP fields konfigurasi
    const rsvpFields = ref([
      {
        key: "nama",
        label: "Nama",
        active: true,
        required: true,
        readOnly: false,
        placeholder: "Masukkan nama lengkap Anda",
      },
      {
        key: "grup",
        label: "Grup",
        active: true,
        required: false,
        readOnly: false,
        placeholder: "Contoh: Keluarga, Teman",
      },
      {
        key: "whatsapp",
        label: "No WhatsApp",
        active: true,
        required: false,
        readOnly: false,
        placeholder: "Contoh: 08123456789",
      },
      {
        key: "kehadiran",
        label: "Kehadiran",
        active: true,
        required: true,
        readOnly: false,
        placeholder: "",
        defaultValue: "",
        options: ["Hadir", "Tidak Hadir", "Mungkin Hadir"],
      },
      {
        key: "jumlah",
        label: "Jumlah Tamu",
        active: true,
        required: false,
        readOnly: false,
        placeholder: "",
        defaultValue: "2",
        maxTamu: 5,
      },
      {
        key: "ucapan",
        label: "Ucapan",
        active: true,
        required: false,
        readOnly: false,
        placeholder: "Tulis doa dan ucapan Anda...",
      },
    ]);

    // ── Daftar tamu
    const daftarTamu = ref([]);

    // ── Computed: stats tamu
    const tamuHadir = computed(
      () => daftarTamu.value.filter((t) => t.hadir === true).length,
    );
    const tamuTidakHadir = computed(
      () => daftarTamu.value.filter((t) => t.hadir === false).length,
    );

    // ── Theme sections
    const themeSections = computed(() =>
      DEFAULT_SECTIONS.map((s) => ({
        ...s,
        iconSvg: SECTION_ICONS[s.key] || SECTION_ICONS.opening,
      })),
    );

    // ── Terapkan warna default tema ke customColors
    function applyTemaColors(slug) {
      const defaults = TEMA_DEFAULT_COLORS[slug];
      if (!defaults) return;
      customColors.tombol = defaults.tombol;
      customColors.popup = defaults.popup;
      customColors.efek = defaults.efek;
      customColors.border = defaults.border;
    }

    // ── Set tema aktif
    function setTema(namaAtauSlug) {
      if (namaAtauSlug.startsWith("tema-")) {
        temaSlug.value = namaAtauSlug;
      } else {
        temaSlug.value =
          namaAtauSlug.toLowerCase().replace(/\s+/g, "-") || "tema-1";
      }
    }

    // ── Reorder sections (drag & drop)
    function reorderSections(fromKey, toKey) {
      const list = [...DEFAULT_SECTIONS];
      const fromIdx = list.findIndex((s) => s.key === fromKey);
      const toIdx = list.findIndex((s) => s.key === toKey);
      if (fromIdx === -1 || toIdx === -1) return;
      const [moved] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, moved);
      DEFAULT_SECTIONS.splice(0, DEFAULT_SECTIONS.length, ...list);
    }

    // ── Update label field RSVP
    function updateRsvpField(key, newLabel) {
      const field = rsvpFields.value.find((f) => f.key === key);
      if (field) field.label = newLabel;
    }

    // ── Update semua property field RSVP
    function updateRsvpFieldFull(key, patch) {
      const field = rsvpFields.value.find((f) => f.key === key);
      if (field) Object.assign(field, patch);
    }

    // ── Toggle rsvpAktif sekaligus sync ke sectionStates.rsvp
    function setRsvpAktif(val) {
      rsvpAktif.value = val;
      if (sectionStates.value.rsvp) {
        sectionStates.value.rsvp.active = val;
      }
    }

    // ─────────────────────────────────────────────
    // FUNGSI INTEGRASI ASSET LIBRARY
    // Dipakai di halaman edit undangan untuk memilih
    // musik & foto dari koleksi asset yang diupload admin
    // ─────────────────────────────────────────────

    /**
     * Set musik undangan dari asset yang dipilih di Asset Library
     * Contoh: undanganStore.setMusikFromAsset(assetStore.musikAsset[0])
     */
    function setMusikFromAsset(musikAsset) {
      if (!musikAsset) return;
      undangan.musik = musikAsset.nama;
      undangan.musikUrl = musikAsset.url;
      undangan.musikFileName = musikAsset.nama;
    }

    /**
     * Set foto mempelai / couple / contact / dresscode dari Asset Library
     * fieldKey: 'fotoBride' | 'fotoGroom' | 'fotoCouple' | 'fotoContact' | 'dresscodeImage'
     * Contoh: undanganStore.setFotoFromAsset('fotoCouple', assetStore.fotoAsset[0])
     */
    function setFotoFromAsset(fieldKey, fotoAsset) {
      if (!fotoAsset) return;
      if (!(fieldKey in undangan)) return;
      undangan[fieldKey] = fotoAsset.url;
    }

    /**
     * Set satu slot galeri (index 0–6) dari Asset Library
     * Contoh: undanganStore.setGaleriSlotFromAsset(2, assetStore.fotoAsset[1])
     */
    function setGaleriSlotFromAsset(index, fotoAsset) {
      if (!fotoAsset) return;
      if (index < 0 || index > 6) return;
      if (!undangan.galeri) undangan.galeri = [];
      undangan.galeri[index] = fotoAsset.url;
    }

    /**
     * Set seluruh galeri (maks 8 foto) dari array asset yang dipilih
     * Contoh: undanganStore.setGaleriFromAssets([asset1, asset2, asset3])
     */
    function setGaleriFromAssets(fotoAssetList) {
      if (!Array.isArray(fotoAssetList)) return;
      undangan.galeri = fotoAssetList.slice(0, 8).map((f) => f.url);
    }

    /**
     * Tambah foto ke mediaGallery (galeri tambahan di luar 8 slot utama)
     * Contoh: undanganStore.addToMediaGallery(assetStore.fotoAsset[0])
     */
    function addToMediaGallery(fotoAsset) {
      if (!fotoAsset) return;
      if (!undangan.mediaGallery) undangan.mediaGallery = [];
      const sudahAda = undangan.mediaGallery.some((m) => m.id === fotoAsset.id);
      if (!sudahAda) {
        undangan.mediaGallery.push({
          id: fotoAsset.id,
          url: fotoAsset.url,
          nama: fotoAsset.nama,
        });
      }
    }

    /**
     * Hapus foto dari mediaGallery berdasarkan id asset
     * Contoh: undanganStore.removeFromMediaGallery('FA-001')
     */
    function removeFromMediaGallery(fotoAssetId) {
      if (!undangan.mediaGallery) return;
      undangan.mediaGallery = undangan.mediaGallery.filter(
        (m) => m.id !== fotoAssetId,
      );
    }

    // ── Reset store ke default
    function $reset() {
      editorId.value = "";
      slug.value = "";
      temaSlug.value = "tema-1";
      undanganAktif.value = true;
      undanganExpired.value = false;
      musikAktif.value = true;
      rsvpAktif.value = true;
      daftarTamu.value = [];
      showLogoWatermark.value = true;
      showMusikWatermark.value = true;
    }

    return {
      // State
      editorId,
      slug,
      temaSlug,
      undangan,
      undanganAktif,
      undanganExpired,
      musikAktif,
      rsvpAktif,
      soundEffectAktif,
      soundTypingAktif,
      showLogoWatermark,
      showMusikWatermark,
      sectionContents,
      sectionStates,
      customColors,
      rsvpFields,
      daftarTamu,

      // Computed
      themeSections,
      tamuHadir,
      tamuTidakHadir,

      // Text colors
      textColors,

      // Actions lama
      setTema,
      applyTemaColors,
      reorderSections,
      updateRsvpField,
      updateRsvpFieldFull,
      setRsvpAktif,
      $reset,

      // ✅ Actions baru — integrasi Asset Library
      setMusikFromAsset,
      setFotoFromAsset,
      setGaleriSlotFromAsset,
      setGaleriFromAssets,
      addToMediaGallery,
      removeFromMediaGallery,
    };
  },
  {
    // ✅ Persist dihapus — data undangan sudah tersimpan di Supabase
    // via saveEditorSnapshot(). localStorage hanya bikin data bocor antar customer.
  },
);