<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useUndanganStore } from "@/stores/useUndanganStore";
import { useAccountStore } from "@/stores/useAccountStore";
// createError adalah auto-import Nuxt 3, tidak perlu import manual

const store = useUndanganStore();
const accountStore = useAccountStore();

// ── SOUND EFFECTS ──
// Suara pop/bubble ala game
function createAudioContext() {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

// Suara klik → pop pendek seperti gelembung meletup
function playClickSound() {
  if (!store.soundEffectAktif) return;
  const ctx = createAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);

  osc.type = "sine";
  osc.frequency.setValueAtTime(520, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + 0.01); // attack cepat
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12); // decay

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.13);
  osc.onended = () => ctx.close();
}

// Suara hover → pop kecil ringan
function playHoverSound() {
  if (!store.soundEffectAktif) return;
  const ctx = createAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);

  osc.type = "sine";
  osc.frequency.setValueAtTime(680, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 0.07);

  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.08);
  osc.onended = () => ctx.close();
}

// Suara buka undangan → 3 pop naik berurutan (ala game level up)
function playOpenSound() {
  if (!store.soundEffectAktif) return;
  const ctx = createAudioContext();
  if (!ctx) return;

  const pops = [320, 480, 640]; // frekuensi tiap pop, makin tinggi
  pops.forEach((startFreq, i) => {
    const delay = i * 0.1;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2000, ctx.currentTime + delay);
    filter.frequency.exponentialRampToValueAtTime(
      500,
      ctx.currentTime + delay + 0.1,
    );

    osc.type = "sine";
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime + delay);
    osc.frequency.exponentialRampToValueAtTime(
      startFreq * 0.45,
      ctx.currentTime + delay + 0.12,
    );

    gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(
      0.22,
      ctx.currentTime + delay + 0.01,
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + delay + 0.14,
    );

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.15);
    if (i === pops.length - 1) osc.onended = () => ctx.close();
  });
}

// Suara ketik → tick ringan saat input karakter
function playTypingSound() {
  if (!store.soundTypingAktif) return;
  const ctx = createAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "square";
  osc.frequency.setValueAtTime(900, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.03);

  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.045);
  osc.onended = () => ctx.close();
}

const isOpen = ref(false);
const isTransitioning = ref(false);
// showInitialLoading selalu false — loading ditangani oleh preview/[slug].vue
const showInitialLoading = ref(false);

// Watch reaktif: jika sectionStates.opening.active berubah ke false setelah mount
// (misal dari BroadcastChannel sync di preview), langsung buka undangan
watch(
  () => (store.sectionStates as any)?.opening?.active,
  (active) => {
    if (active === false && !isOpen.value) {
      isOpen.value = true;
      showInitialLoading.value = false;
      // onAfterOpen didefinisikan di bawah — aman dipanggil di sini karena
      // watch callback hanya jalan saat runtime, bukan saat inisialisasi
      nextTick(() => onAfterOpen());
    }
  },
);
const lightIsOn = ref(false);
const musicIsOn = ref(true);

// ── Background Music ──────────────────────────────────────
let bgAudio: HTMLAudioElement | null = null;

watch(
  () => store.undangan.musikUrl,
  (url) => {
    if (!url) return;
    if (bgAudio) {
      bgAudio.pause();
      bgAudio = null;
    }
    bgAudio = new Audio(url);
    bgAudio.loop = true;
    bgAudio.volume = 0.5;
    if (musicIsOn.value) bgAudio.play().catch(() => {});
  },
  { immediate: true },
);

watch(musicIsOn, (on) => {
  if (!bgAudio) return;
  if (on) bgAudio.play().catch(() => {});
  else bgAudio.pause();
});

const openInvitation = () => {
  playOpenSound();
  if (bgAudio && musicIsOn.value) {
    bgAudio
      .play()
      .catch((err) => console.log("Failed to play background music:", err));
  }
  // Request fullscreen
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  else if ((el as any).webkitRequestFullscreen)
    (el as any).webkitRequestFullscreen();

  isTransitioning.value = true;
  setTimeout(() => {
    isOpen.value = true;
    onAfterOpen();
  }, 2500);
  setTimeout(() => {
    isTransitioning.value = false;
  }, 3000);
};
const modalProfile = ref(false);
const modalGift = ref(false);
const modalGallery = ref(false);
const modalRsvp = ref(false);
const modalEvent = ref(false);
const modalLoveStory = ref(false);
const modalDresscode = ref(false);
const modalMaps = ref(false);
const modalRundown = ref(false);
const modalContact = ref(false);

// ── Info kontak & sosial PlayMoment (footer menu panel) ──
// Ganti value di sini kalau nomor/username berubah
const platformInfo = {
  instagram: "@playmoment.id",
  instagramUrl: "https://instagram.com/playmoment.id",
  website: "playmoment.id",
  websiteUrl: "https://playmoment.id",
  whatsapp: "6281234567890",
  phoneDisplay: "+62 812 3456 7890",
};
const currentYear = new Date().getFullYear();

const template = ref({
  id: 1,
  name: "cafe",
  description: "tema cafe lucu dan sederhana",
  image_url: "/themes/lucu/preview.png",
  price: 10000,
  discount_price: 8000,
  is_active: true,
  bg_desktop_url: "/themes/onepiece/bg-desktop.jpeg",
  bg_mobile_url: "/themes/onepiece/bg-mobile.jpeg",
  assets: [
    {
      key: "quotes",
      Image_url: "/themes/onepiece/profile.png",
      Width: "77%",
      top: "35%",
      left: "12%",
    },
    {
      key: "profile",
      Image_url: "/themes/onepiece/profile.png",
      Width: " 77%",
      top: "35%",
      left: "12%",
    },
    {
      key: "gift",
      Image_url: "/themes/onepiece/gift.png",
      Width: "28%",
      top: "50%",
      left: "1.4%",
    },
    {
      key: "gallery",
      Image_url: "/themes/onepiece/gallery.png",
      Width: "30%",
      top: "17.8%",
      left: "18.8%",
    },
    {
      key: "rsvp",
      Image_url: "/themes/onepiece/rsvp.png",
      Width: "48%",
      top: "75.5%",
      left: "48.4%",
    },
    {
      key: "event",
      Image_url: "/themes/onepiece/event.png",
      Width: "35.5%",
      top: "37.5%",
      left: "63%",
    },
    {
      key: "dresscode",
      Image_url: "/themes/onepiece/drescode.png",
      Width: "42%",
      top: "31%",
      left: "2%",
    },
    {
      key: "maps",
      Image_url: "/themes/onepiece/maps.png",
      Width: "38%",
      top: "68%",
      left: "27%",
    },
    {
      key: "lovestory",
      Image_url: "/themes/onepiece/love-story.png",
      Width: "36%",
      top: "54%",
      left: "68%",
    },
    {
      key: "rundown",
      Image_url: "/themes/onepiece/salam.png",
      Width: "40.5%",
      top: "68%",
      left: "2%",
    },
    {
      key: "contact",
      Image_url: "/themes/onepiece/salam.png",
      Width: "40.5%",
      top: "68%",
      left: "2%",
    },
  ],
});

// ── GALERI: dari store.undangan.galeri (foto upload user)
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

const galleries = computed(() => {
  const arr = store.undangan.galeri || [];
  const slots = [...arr];
  while (slots.length < 8) slots.push("");
  // Jangan filter — index harus tetap konsisten dengan slot di editor
  // (slot 0 = hero, slot 1-6 = sub-grid, dll)
  return slots.map((url: string | null, i: number) => ({
    image_url: url || DEFAULT_GALERI[i] || "",
  }));
});

// Layout galeri dari store
const galeriLayout = computed(() => store.undangan.galeriLayout || "2col");

// ── GIFT / REKENING: dari store
const gifts = computed(() => [
  {
    image_url: store.undangan.logoBank || "/assets/invitations/bca.jpg",
    bank: store.undangan.namaBankRekening || "Bank BCA",
    account_number: store.undangan.nomorRekening || "1234567890",
    account_name: store.undangan.namaRekening || "Adam Putra Santosa",
    waMe: (store.sectionContents as any).gift?.waMe || "https",
    konfirmasiText:
      (store.sectionContents as any).gift?.konfirmasiText ||
      "Konfirmasi Bukti Trf",
  },
]);

// ── LOVE STORY: dari store.sectionContents.lovestory.items
const LoveStorys = computed(() => {
  const items = (store.sectionContents as any).lovestory?.items;
  if (items && Array.isArray(items) && items.length) return items;
  return [
    {
      image_url: "https://picsum.photos/seed/love/300/200",
      title: "Pertemuan Pertama",
      description: "Kami bertemu di sebuah kafe kecil di pinggir kota.",
      date: "2020-01-15",
    },
    {
      image_url: "https://picsum.photos/seed/picsum/300/200",
      title: "Kencan Pertama",
      description:
        "Kencan pertama kami di taman bunga yang indah, penuh warna dan tawa.",
      date: "2020-02-20",
    },
    {
      image_url: "https://picsum.photos/seed/wood/300/200",
      title: "Engagement",
      description: "Momen yang sangat berkesan dan tidak terlupakan.",
      date: "2021-06-10",
    },
    {
      image_url: "https://picsum.photos/seed/jungle/400/200",
      title: "Ceremony",
      description: "Hari bahagia yang kami nantikan akhirnya tiba.",
      date: "2022-12-12",
    },
  ];
});

// ── LOVE STORY LAYOUT: dari store.sectionContents.lovestory.layout
const loveStoryLayout = computed(
  () => (store.sectionContents as any).lovestory?.layout || "foto-atas",
);

// ── PROFIL MEMPELAI: dari store
const profiles = computed(() => [
  {
    image_url:
      store.undangan.fotoBride || "https://picsum.photos/seed/bride/300/400",
    name: store.undangan.nama1 || "Nama Mempelai Wanita",
    namaLengkap:
      (store.sectionContents as any).bride?.namaLengkap || "Hawa Putri Pertiwi",
    bio:
      (store.sectionContents as any).bride?.orangTua ||
      "Putri dari Bapak Adam Sr. & Ibu Siti",
    instagram: store.undangan.instagramBride
      ? `@${store.undangan.instagramBride.replace(/^@/, "")}`
      : "@instagram",
    igLink: store.undangan.instagramBride
      ? `https://instagram.com/${store.undangan.instagramBride.replace(/^@/, "")}`
      : (store.sectionContents as any).bride?.igLink || "",
    label: (store.sectionContents as any).bride?.labelSub || "Mempelai Wanita",
  },
  {
    image_url:
      store.undangan.fotoGroom || "https://picsum.photos/seed/groom/300/400",
    name: store.undangan.nama2 || "Nama Mempelai Pria",
    namaLengkap:
      (store.sectionContents as any).groom?.namaLengkap || "Adam Putra Santosa",
    bio:
      (store.sectionContents as any).groom?.orangTua ||
      "Putra dari Bapak Ibrahim & Ibu Maryam",
    instagram: store.undangan.instagramGroom
      ? `@${store.undangan.instagramGroom.replace(/^@/, "")}`
      : "@instagram",
    igLink: store.undangan.instagramGroom
      ? `https://instagram.com/${store.undangan.instagramGroom.replace(/^@/, "")}`
      : (store.sectionContents as any).groom?.igLink || "",
    label: (store.sectionContents as any).groom?.labelSub || "Mempelai Pria",
  },
]);

// ── ACARA / EVENT: dari store
const events = computed(() => [
  {
    name: (store.sectionContents as any).acara?.judulAkad || "Akad Nikah",
    date: store.undangan.tanggalAkad || "Sabtu, 12 Juli 2025",
    time: store.undangan.waktuAkad || "08.00 - 10.00 WIB",
    location: store.undangan.lokasiAkad || "Masjid Al-Ikhlas",
    address: store.undangan.alamatAkad || "Jl. Mawar No. 1, Jakarta Selatan",
    mapsLink: store.undangan.linkMapsAkad || "",
    mapsText:
      (store.sectionContents as any).acara?.mapsAkad || "Lihat di Google Maps",
  },
  {
    name: "Resepsi",
    date: store.undangan.tanggalResepsi || "Sabtu, 12 Juli 2025",
    time: store.undangan.waktuResepsi || "11.00 - 14.00 WIB",
    location: store.undangan.lokasiResepsi || "Gedung Serbaguna Bahagia",
    address:
      store.undangan.alamatResepsi || "Jl. Melati No. 5, Jakarta Selatan",
    mapsLink: store.undangan.linkMapsResepsi || "",
    mapsText:
      (store.sectionContents as any).acara?.mapsResepsi ||
      "Lihat di Google Maps",
  },
]);

// ── DRESSCODE: dari store.sectionContents.dresscode
const dresscode = computed(() => ({
  theme: (store.sectionContents as any).dresscode?.theme || "Elegant Garden",
  colors: (store.sectionContents as any).dresscode?.colors || [
    "Sage Green",
    "Dusty Rose",
    "Cream",
  ],
  description:
    (store.sectionContents as any).dresscode?.description ||
    "Kami mengundang Anda untuk mengenakan pakaian dengan nuansa taman yang elegan.",
  image_url:
    store.undangan.dresscodeImage ||
    "https://picsum.photos/seed/dresscode/400/300",
}));

// ── MAPS: dari store
const mapLocation = computed(() => {
  const link =
    store.undangan.linkMapsResepsi ||
    "https://maps.google.com/?q=-6.200000,106.816666";
  // Coba ekstrak embed dari link Google Maps biasa
  let embedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.666!2d106.816666!3d-6.200000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDknMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890";
  return {
    judul: (store.sectionContents as any).maps?.judul || "Lokasi Acara",
    desc:
      (store.sectionContents as any).maps?.desc ||
      "Acara resepsi pernikahan kami akan diselenggarakan di lokasi berikut.",
    venue: store.undangan.lokasiResepsi || "Gedung Serbaguna Bahagia",
    address:
      store.undangan.alamatResepsi || "Jl. Melati No. 5, Jakarta Selatan",
    google_maps_url: link,
    embed_url: embedUrl,
    btnText:
      (store.sectionContents as any).maps?.btnText || "Buka di Google Maps",
  };
});

// ── SALAM / PENUTUP: dari store
const salamMessage = computed(() => ({
  judul:
    (store.sectionContents as any).salam?.judul ||
    "Assalamualaikum Warahmatullahi Wabarakatuh",
  message:
    (store.sectionContents as any).salam?.message ||
    "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.",
  penutup:
    (store.sectionContents as any).penutup?.desc ||
    "Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
  hormat:
    (store.sectionContents as any).penutup?.hormat || "Kami yang berbahagia,",
  signature: `${store.undangan.nama1 || "Hawa"} ${(store.sectionContents as any).penutup?.ampersand || "&"} ${store.undangan.nama2 || "Adam"}`,
  image_url:
    store.undangan.fotoCouple || "https://picsum.photos/seed/salam/400/300",
}));

// ── OPENING / COVER: dari store
const openingData = computed(() => ({
  kepadaYth: (store.sectionContents as any).opening?.kepadaYth || "Kepada Yth.",
  namaTamu: (store.undangan as any).namaTamu || "Nama Tamu",
  btnText:
    (store.sectionContents as any).opening?.btnText || "▶ Play Invitation",
  judul: store.undangan.judul || "The Wedding Of",
}));

// ── RSVP: konfigurasi dari store.rsvpFields
const rsvpConfig = computed(() => {
  const fields = store.rsvpFields || [];
  const f = (key: string) => fields.find((f: any) => f.key === key);

  const namaField = f("nama");
  const grupField = f("grup");
  const whatsappField = f("whatsapp");
  const kehadiranField = f("kehadiran");
  const jumlahField = f("jumlah");
  const ucapanField = f("ucapan");

  return {
    // Visibility — semua 6 field dari store
    showNama: namaField?.active ?? true,
    showGrup: grupField?.active ?? true,
    showWhatsapp: whatsappField?.active ?? true,
    showKehadiran: kehadiranField?.active ?? true,
    showJumlah: jumlahField?.active ?? true,
    showUcapan: ucapanField?.active ?? true,

    // Label per field (dari store, bisa diubah admin)
    labelNama: namaField?.label || "Nama",
    labelGrup: grupField?.label || "Grup",
    labelWhatsapp: whatsappField?.label || "No WhatsApp",
    labelKehadiran: kehadiranField?.label || "Kehadiran",
    labelJumlah: jumlahField?.label || "Jumlah Tamu",
    labelUcapan: ucapanField?.label || "Ucapan",

    // Placeholder / defaultValue
    placeholderNama: namaField?.placeholder || "Masukkan nama lengkap Anda",
    placeholderGrup: grupField?.placeholder || "Contoh: Keluarga, Teman",
    placeholderWhatsapp: whatsappField?.placeholder || "Contoh: 08123456789",
    defaultJumlah: jumlahField?.defaultValue || "",
    defaultKehadiran: kehadiranField?.defaultValue || "",
    placeholderUcapan:
      ucapanField?.placeholder || "Tulis doa dan ucapan Anda...",

    // Required & readOnly
    requiredNama: namaField?.required ?? true,
    requiredGrup: grupField?.required ?? false,
    requiredWhatsapp: whatsappField?.required ?? false,
    requiredKehadiran: kehadiranField?.required ?? true,
    requiredJumlah: jumlahField?.required ?? false,
    requiredUcapan: ucapanField?.required ?? false,
    readOnlyNama: namaField?.readOnly ?? false,
    readOnlyGrup: grupField?.readOnly ?? false,
    readOnlyWhatsapp: whatsappField?.readOnly ?? false,
    readOnlyKehadiran: kehadiranField?.readOnly ?? false,
    readOnlyJumlah: jumlahField?.readOnly ?? false,
    readOnlyUcapan: ucapanField?.readOnly ?? false,

    // Opsi kehadiran (dinamis dari store)
    opsiKehadiran: kehadiranField?.options || [
      "Hadir",
      "Tidak Hadir",
      "Mungkin Hadir",
    ],

    // Maks tamu
    maxTamu: jumlahField?.maxTamu || 10,

    // Konten section
    judul: (store.sectionContents as any).rsvp?.judul || "Konfirmasi Kehadiran",
    desc: (store.sectionContents as any).rsvp?.desc || "",
    batas: (store.sectionContents as any).rsvp?.batasKonfirmasi || "",
    btnText: (store.sectionContents as any).rsvp?.btnText || "Kirim RSVP",
    btnTextAfter:
      (store.sectionContents as any).rsvp?.btnTextAfter || "Terima Kasih! 🎉",
  };
});

// ── RUNDOWN: dari store
const rundownData = computed(() => ({
  judul: (store.sectionContents as any).rundown?.judul || "Rundown Acara",
  desc: (store.sectionContents as any).rundown?.desc || "",
  items: (store.sectionContents as any).rundown?.items || [],
}));

// ── WELCOME / OPENING (setelah undangan diklik buka, sebelum quotes): dari store
const welcomeData = computed(() => ({
  label: (store.sectionContents as any).welcome?.label || "Undangan Pernikahan",
  judul: (store.sectionContents as any).welcome?.judul || "Selamat Datang",
  pesan:
    (store.sectionContents as any).welcome?.pesan ||
    "Kami dengan penuh kebahagiaan mengundang Anda untuk turut merayakan hari istimewa kami. 🙏",
}));

// ── QUOTES: dari store
const quotesData = computed(() => ({
  text: (store.sectionContents as any).quotes?.text || "",
  text2: (store.sectionContents as any).quotes?.text2 || "",
  source: (store.sectionContents as any).quotes?.source || "",
}));

// 0 = Tidak Hadir. 1 = Hadir, 2 = Mungkin hadir
interface Guest {
  name: string | null;
  grup: string | null;
  whatsapp: string | null;
  jumlah: string | null;
  comment: string | null;
  attendance: string;
}

// Mulai kosong — diisi dari store.daftarTamu (hanya tamu yang sudah submit RSVP)
const guests = ref<Guest[]>([]);

// ── Attendance options dinamis dari store.rsvpFields
const attendanceStatus = computed(() =>
  (
    rsvpConfig.value.opsiKehadiran || ["Hadir", "Tidak Hadir", "Mungkin Hadir"]
  ).map((label: string) => ({ value: label, label })),
);

const newGuest = ref({
  name: null as string | null,
  grup: null as string | null,
  whatsapp: null as string | null,
  jumlah: null as string | null,
  comment: null as string | null,
  attendance: "" as string,
});

// Reset newGuest dengan defaultValue dari store
function resetNewGuest() {
  newGuest.value = {
    name: null,
    grup: null,
    whatsapp: null,
    jumlah: null,
    comment: null,
    attendance: "",
  };
}

// Init defaultValue saat pertama load
resetNewGuest();

const rsvpSubmitted = ref(false);

// ── COUNTDOWN TIMER ──
const countdownTime = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let countdownTimer: ReturnType<typeof setInterval> | null = null;

const showCountdown = computed(
  () => (store.sectionContents as any).acara?.showCountdown ?? true,
);
const countdownTarget = computed(
  () => (store.sectionContents as any).acara?.countdownTarget || "",
);

function updateCountdown() {
  const target = countdownTarget.value;
  if (!target) {
    countdownTime.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return;
  }
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) {
    countdownTime.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return;
  }
  countdownTime.value = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

// ── UCAPAN / PESAN TAMU (chat bubble di bawah) ──
const showUcapan = ref(true);
const showMenuPanel = ref(false);

// Auto-rotate ucapan: tampil 2 bubble bergantian
const ucapanPage = ref(0);
const ucapanVisible = ref(true);
let ucapanTimer: ReturnType<typeof setInterval> | null = null;

const visibleUcapan = computed(() => {
  const total = guests.value.length;
  if (total === 0) return null;
  return guests.value[ucapanPage.value % total];
});

const startUcapanRotate = () => {
  ucapanTimer = setInterval(() => {
    ucapanPage.value++;
  }, 3500);
};

onMounted(async () => {
  if (store.daftarTamu && store.daftarTamu.length > 0) {
    guests.value = store.daftarTamu
      .filter((t: any) => t.hadir !== null && t.hadir !== undefined)
      .map((t: any) => ({
        name: t.nama,
        grup: t.grup || null,
        whatsapp: t.whatsapp || null,
        jumlah: t.jumlah ? String(t.jumlah) : null,
        comment: t.ucapan || t.comment || null,
        attendance: t.hadir === true ? "Hadir" : t.hadir === false ? "Tidak Hadir" : "",
      }));
  }
  startUcapanRotate();
  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);

  // ── Jika section opening dinonaktifkan → langsung buka tanpa cover
  // Pakai nextTick agar store sudah ter-hydrate sepenuhnya
  await nextTick();
  const openingActive = (store.sectionStates as any)?.opening?.active !== false;
  if (!openingActive) {
    isOpen.value = true;
    showInitialLoading.value = false;
    onAfterOpen();
    return;
  }

  // Loading pertama: nunggu aset penting beneran selesai dimuat
  const MAX_WAIT = 8000; // maksimal 8 detik, apapun kondisi jaringan
  const MIN_WAIT = 1000; // minimal 1 detik biar tidak langsung kedip hilang

  const urlsToLoad: string[] = [
    template.value.bg_mobile_url,
    store.undangan.fotoCouple,
    store.undangan.fotoBride,
    store.undangan.fotoGroom,
  ].filter(Boolean) as string[];

  const startTime = Date.now();

  const done = () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_WAIT - elapsed);
    setTimeout(() => {
      showInitialLoading.value = false;
    }, remaining);
  };

  if (urlsToLoad.length === 0) {
    // Tidak ada aset yang perlu dimuat
    setTimeout(done, MIN_WAIT);
  } else {
    // Buat promise untuk tiap gambar
    const imagePromises = urlsToLoad.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // error pun tetap lanjut
          img.src = url;
        }),
    );

    // Race antara semua gambar selesai vs timeout maksimal
    const timeout = new Promise<void>((resolve) =>
      setTimeout(resolve, MAX_WAIT),
    );

    Promise.race([Promise.all(imagePromises), timeout]).then(done);
  }
});
onUnmounted(() => {
  if (ucapanTimer) clearInterval(ucapanTimer);
  if (countdownTimer) clearInterval(countdownTimer);
  bgAudio?.pause();
  bgAudio = null;
});
// Notifikasi lampu saat pertama buka
const showLightNotif = ref(false);
// Welcome bubble ucapan - tampil dulu sebelum ucapan tamu
const showWelcomeBubble = ref(false);
// Welcome modal
const showWelcomeModal = ref(false);
// Tampilkan notif lampu setelah undangan dibuka (menu panel nggak lagi auto-muncul)
const onAfterOpen = () => {
  showWelcomeBubble.value = true;
  // Setelah 3.5 detik, sembunyikan welcome bubble → tampil ucapan tamu
  setTimeout(() => {
    showWelcomeBubble.value = false;
  }, 6000);
  setTimeout(() => {
    showLightNotif.value = true;
  }, 600);
  setTimeout(() => {
    showLightNotif.value = false;
  }, 6000);
};

const handleRsvp = async () => {
  playClickSound();
  try {
    const isHadir =
      newGuest.value.attendance === "Hadir" ||
      String(newGuest.value.attendance).toLowerCase() === "hadir";
    const res = await accountStore.submitPublicRsvp(store.editorId, {
      name: newGuest.value.name,
      phone: newGuest.value.whatsapp || newGuest.value.phone,
      jumlah: newGuest.value.jumlah,
      attendance: isHadir ? "Hadir" : "Tidak Hadir",
      comment: newGuest.value.comment,
    });
    if (res.ok) {
      guests.value = (res.daftarTamu || [])
        .filter((t: any) => t.hadir !== null && t.hadir !== undefined)
        .map((t: any) => ({
          name: t.nama,
          grup: t.grup || null,
          whatsapp: t.whatsapp || null,
          jumlah: t.jumlah ? String(t.jumlah) : null,
          comment: t.ucapan || t.comment || null,
          attendance: t.hadir === true ? "Hadir" : t.hadir === false ? "Tidak Hadir" : "",
        }));
      resetNewGuest();
      rsvpSubmitted.value = true;
      setTimeout(() => (rsvpSubmitted.value = false), 3000);
    }
  } catch (error) {
    console.error("Error submitting RSVP:", error);
  }
};

const copiedIndex = ref<number | null>(null);

const copyToClipboard = (text: string, index: number) => {
  playClickSound();
  navigator.clipboard.writeText(text);
  copiedIndex.value = index;
  setTimeout(() => {
    copiedIndex.value = null;
  }, 2000);
};

// ── MAP asset key → section state key
// Beberapa asset key berbeda dari section state key di store
const assetToSection: Record<string, string> = {
  profile: "mempelai",
  gallery: "galeri",
  event: "acara",
};
function assetSectionKey(key: string): string {
  return assetToSection[key] || key;
}

// ── Scroll ke section terkait (dulu: buka modal) ──
const clickAsset = (key: string) => {
  playClickSound();
  const sectionKey = assetSectionKey(key);
  const el = document.getElementById(`sec-${sectionKey}`);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
};

// Helper: tutup modal dengan suara
function closeModal(setter: () => void) {
  playClickSound();
  setter();
}

// ── FIELD VISIBILITY helper
// Baca sectionStates[sectionKey].fields[fieldKey]
// Default: true (tampil) jika belum pernah diset
// Untuk type visibility-only: langsung baca sectionContents[s][k]
function isVisible(sectionKey: string, fieldKey: string): boolean {
  return (store.sectionStates as any)?.[sectionKey]?.fields?.[fieldKey] !== false;
}
</script>

<template>
  <section
    :style="{
      '--c-tombol': store.customColors.tombol || '#7c3aed',
      '--c-popup': store.customColors.popup || '#1a2e45',
      '--c-efek': store.customColors.efek || '#f472b6',
      '--c-text': '#1a2e45',
      '--c-border': store.customColors.border || '#1a2e45',
    }"
    class="invitation-root"
  >
    <template v-if="isOpen">
      <!-- ══ TOMBOL KANAN ATAS: Musik + Contact ══ -->
      <div class="right-btns">
        <button
          v-if="store.musikAktif"
          class="side-btn side-btn--active"
          :style="{
            '--btn-color': store.customColors.tombol || '#7c3aed',
            '--btn-border': store.customColors.border || '#1a2e45',
          }"
          @mouseenter="playHoverSound()"
          @click="
            musicIsOn = !musicIsOn;
            playClickSound();
          "
          :title="musicIsOn ? 'Matikan Musik' : 'Nyalakan Musik'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <line v-if="!musicIsOn" x1="3" y1="3" x2="21" y2="21" stroke="white" stroke-width="2.5" stroke-linecap="round" />
          </svg>
        </button>
        <button
          v-if="store.sectionStates.contact?.active !== false"
          class="side-btn side-btn--active"
          :style="{
            '--btn-color': store.customColors.tombol || '#7c3aed',
            '--btn-border': store.customColors.border || '#1a2e45',
          }"
          @mouseenter="playHoverSound()"
          @click="
            playClickSound();
            document.getElementById('sec-contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          "
          title="Hubungi Kami"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.553 4.113 1.522 5.842L.057 23.882l6.175-1.621A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.881 9.881 0 0 1-5.031-1.378l-.361-.215-3.736.98.998-3.648-.235-.374A9.847 9.847 0 0 1 2.105 12C2.105 6.526 6.526 2.105 12 2.105c5.473 0 9.894 4.421 9.894 9.895 0 5.473-4.421 9.894-9.894 9.894z" />
          </svg>
        </button>
      </div>

      <!-- ══ TOMBOL HAMBURGER MENU (pojok kiri atas) — quick nav ══ -->
      <button
        class="hamburger-btn"
        :style="{
          background: store.customColors.tombol || '#7c3aed',
          borderColor: store.customColors.border || '#1a2e45',
        }"
        @click="
          showMenuPanel = !showMenuPanel;
          playClickSound();
        "
        @mouseenter="playHoverSound()"
        title="Menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <!-- ══ WELCOME BUBBLE (muncul saat pertama buka) ══ -->
      <Transition name="ucapan-fade">
        <div v-if="showWelcomeBubble && showUcapan" class="ucapan-wrap">
          <div class="ucapan-row">
            <div class="ucapan-avatar" :style="{ background: store.customColors.tombol || '#7c3aed' }">🎉</div>
            <div class="ucapan-bubble ucapan-bubble--welcome">
              <div class="ucapan-nama" :style="{ color: store.customColors.efek || '#f472b6' }">Selamat Datang!</div>
              <div class="ucapan-text">Terima kasih sudah membuka undangan kami. Semoga bisa hadir ya! 💕</div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ══ UCAPAN / CHAT BUBBLE (auto-rotate 1 bubble) ══ -->
      <div v-if="!showWelcomeBubble && showUcapan && guests.length === 0" class="ucapan-empty-card">
        <p class="ucapan-empty-text">Silahkan konfirmasi kehadiran dan berikan ucapan terbaik untuk kami.</p>
        <button
          class="ucapan-empty-btn"
          :style="{ background: store.customColors.tombol || '#7c3aed', borderColor: store.customColors.border || '#1a2e45' }"
          @click="
            document.getElementById('sec-rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            playClickSound();
          "
          @mouseenter="playHoverSound()"
        >
          Konfirmasi Kehadiran
        </button>
      </div>
      <div v-else-if="!showWelcomeBubble && showUcapan && visibleUcapan" class="ucapan-wrap">
        <Transition name="ucapan-fade" mode="out-in">
          <div :key="ucapanPage" class="ucapan-row">
            <div class="ucapan-avatar" :style="{ background: store.customColors.tombol || '#7c3aed' }">
              {{ (visibleUcapan.name || "?").trim().charAt(0).toUpperCase() }}
            </div>
            <div class="ucapan-bubble">
              <div class="ucapan-nama" :style="{ color: store.customColors.efek || '#f472b6' }">{{ visibleUcapan.name }}</div>
              <div class="ucapan-text">{{ visibleUcapan.comment }}</div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- ══ TOMBOL UCAPAN (bawah kiri) ══ -->
      <div class="ucapan-btns">
        <button
          class="ucapan-icon-btn"
          :style="{ background: store.customColors.tombol || '#7c3aed', borderColor: store.customColors.border || '#1a2e45' }"
          @click="
            document.getElementById('sec-rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            playClickSound();
          "
          @mouseenter="playHoverSound()"
          title="Tambah ucapan"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <button
          class="ucapan-icon-btn"
          :style="{ background: store.customColors.tombol || '#7c3aed', borderColor: store.customColors.border || '#1a2e45' }"
          @click="
            showUcapan = !showUcapan;
            playClickSound();
          "
          @mouseenter="playHoverSound()"
          title="Sembunyikan/tampilkan ucapan"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
            <path v-if="showUcapan" d="m18 15-6-6-6 6" />
            <path v-else d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <button
          class="ucapan-pill-btn"
          :style="{ background: store.customColors.tombol || '#7c3aed', borderColor: store.customColors.border || '#1a2e45' }"
          @click="
            showUcapan = !showUcapan;
            playClickSound();
          "
          @mouseenter="playHoverSound()"
        >
          {{ showUcapan ? "Sembunyikan Ucapan" : "Lihat Ucapan" }}
        </button>
      </div>

      <!-- ══ WELCOME MODAL (auto muncul saat undangan dibuka) ══ -->
      <Transition name="welcome-pop">
        <div v-if="showWelcomeModal" class="welcome-backdrop">
          <div class="welcome-box" :style="{ '--c-tombol': store.customColors.tombol || '#7c3aed', '--c-efek': store.customColors.efek || '#f472b6' }">
            <div class="welcome-deco-top">
              <span class="welcome-deco-line"></span>
              <span class="welcome-deco-star">✦</span>
              <span class="welcome-deco-line"></span>
            </div>
            <div class="welcome-icon" :style="{ background: `linear-gradient(135deg, ${store.customColors.tombol || '#7c3aed'}, ${store.customColors.efek || '#f472b6'})` }">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div class="welcome-label">Undangan Pernikahan</div>
            <div class="welcome-greeting">Selamat Datang</div>
            <div class="welcome-name" :style="{ color: store.customColors.tombol || '#7c3aed' }">{{ openingData.namaTamu }}</div>
            <div class="welcome-divider"><span></span><span class="welcome-diamond">◆</span><span></span></div>
            <p class="welcome-pesan">Kami dengan penuh kebahagiaan mengundang Anda untuk turut merayakan hari istimewa kami. 🙏</p>
            <button
              class="welcome-btn"
              :style="{ background: `linear-gradient(135deg, ${store.customColors.tombol || '#7c3aed'}, ${store.customColors.efek || '#f472b6'})` }"
              @click="
                showWelcomeModal = false;
                playClickSound();
              "
            >
              Lihat Undangan ✨
            </button>
          </div>
        </div>
      </Transition>

      <!-- ══ MENU PANEL (quick nav ke section) ══ -->
      <Transition name="menu-slide">
        <div v-if="showMenuPanel" class="menu-backdrop" @click="showMenuPanel = false">
          <div class="menu-panel" @click.stop :style="{ '--c-tombol': store.customColors.tombol || '#7c3aed', '--c-efek': store.customColors.efek || '#f472b6', '--c-popup': store.customColors.popup || '#1a2e45' }">
            <div class="menu-panel-header" :style="{ background: store.customColors.popup || '#1a2e45' }">
              <span class="menu-panel-title">Selamat Datang 👋</span>
              <button class="menu-panel-close" @click="showMenuPanel = false; playClickSound();">✕</button>
            </div>
            <div class="menu-panel-sub" :style="{ background: store.customColors.popup || '#1a2e45' }">
              <span>Pilih menu untuk melompat ke bagian undangan</span>
            </div>
            <div class="menu-panel-body">
              <template v-for="asset in template.assets" :key="asset.key">
                <button
                  v-if="store.sectionStates[assetSectionKey(asset.key)]?.active !== false"
                  class="menu-card"
                  @click="clickAsset(asset.key); showMenuPanel = false;"
                >
                  <div class="menu-card-img-wrap" :style="{ background: `linear-gradient(135deg, color-mix(in srgb, ${store.customColors.tombol || '#7c3aed'} 15%, white), color-mix(in srgb, ${store.customColors.efek || '#f472b6'} 10%, white))` }">
                    <img :src="asset.Image_url" :alt="asset.key" class="menu-card-img" />
                  </div>
                  <div class="menu-card-info">
                    <div class="menu-card-title">
                      {{ asset.key === 'quotes' ? 'Quotes'
                       : asset.key === 'profile' ? ((store.sectionContents as any).mempelai?.judulModal || 'Profil Mempelai')
                       : asset.key === 'gift' ? ((store.sectionContents as any).gift?.judul || 'Amplop Digital')
                       : asset.key === 'gallery' ? ((store.sectionContents as any).galeri?.judul || 'Gallery Foto')
                       : asset.key === 'rsvp' ? ((store.sectionContents as any).rsvp?.judul || 'RSVP & Ucapan')
                       : asset.key === 'event' ? ((store.sectionContents as any).acara?.judulAkad || 'Data Acara')
                       : asset.key === 'lovestory' ? ((store.sectionContents as any).lovestory?.judul || 'Love Story')
                       : asset.key === 'dresscode' ? ((store.sectionContents as any).dresscode?.judul || 'Dresscode')
                       : asset.key === 'maps' ? ((store.sectionContents as any).maps?.judul || 'Lokasi Acara')
                       : asset.key === 'rundown' ? ((store.sectionContents as any).rundown?.judul || 'Rundown Acara')
                       : asset.key === 'contact' ? ((store.sectionContents as any).contact?.judul || 'Informasi Kontak')
                       : asset.key }}
                    </div>
                    <div class="menu-card-desc">
                      {{ asset.key === 'profile' ? ((store.sectionContents as any).mempelai?.desc || '')
                       : asset.key === 'gift' ? ((store.sectionContents as any).gift?.desc || '')
                       : asset.key === 'gallery' ? ((store.sectionContents as any).galeri?.subJudul || '')
                       : asset.key === 'rsvp' ? ((store.sectionContents as any).rsvp?.desc || '')
                       : asset.key === 'event' ? ((store.sectionContents as any).acara?.desc || '')
                       : asset.key === 'lovestory' ? ((store.sectionContents as any).lovestory?.desc || '')
                       : asset.key === 'dresscode' ? ((store.sectionContents as any).dresscode?.description || '')
                       : asset.key === 'maps' ? ((store.sectionContents as any).maps?.desc || '')
                       : asset.key === 'rundown' ? ((store.sectionContents as any).rundown?.desc || '')
                       : asset.key === 'contact' ? ((store.sectionContents as any).contact?.labelContact || '')
                       : '' }}
                    </div>
                  </div>
                  <svg class="menu-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    :stroke="store.customColors.tombol || '#7c3aed'"
                    stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </template>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ══════════════════════════════════════════════════════ -->
      <!-- ══ KONTEN UNDANGAN — SCROLL NORMAL, SEMUA SECTION ══ -->
      <!-- ══════════════════════════════════════════════════════ -->
      <div class="scroll-invitation">

        <!-- ══ WELCOME / OPENING (muncul setelah undangan diklik buka) ══ -->
        <section
          v-if="store.sectionStates.welcome?.active !== false"
          id="sec-welcome"
          class="inv-section"
        >
          <div class="mp-new-welcome-wrap">
            <div class="mp-new-welcome-box">
              <div class="mp-new-welcome-deco">
                <span></span><span class="mp-new-welcome-diamond">◆</span><span></span>
              </div>
              <div class="mp-new-welcome-label" v-if="isVisible('welcome', 'welcomeLabel')">{{ welcomeData.label }}</div>
              <div class="mp-new-welcome-judul" :style="{ color: store.customColors.tombol || '#7c3aed' }" v-if="isVisible('welcome', 'welcomeJudul')">
                {{ welcomeData.judul }}
              </div>
              <div class="mp-new-welcome-tamu" v-if="openingData.namaTamu">{{ openingData.namaTamu }}</div>
              <p class="mp-new-welcome-pesan" v-if="isVisible('welcome', 'welcomePesan')">{{ welcomeData.pesan }}</p>
            </div>
          </div>
        </section>

        <!-- ══ QUOTES ══ -->
        <section
          v-if="store.sectionStates.quotes?.active !== false"
          id="sec-quotes"
          class="inv-section"
        >
          <div class="mp-new-quotes-wrap" style="margin:0;">
            <div class="mp-new-quotes-box">
              <p class="mp-new-quotes-text" v-if="isVisible('quotes', 'quotesText')">
                "{{ quotesData.text || "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri" }}
                {{ quotesData.text2 || "agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang." }}"
              </p>
              <p class="mp-new-quotes-source" v-if="isVisible('quotes', 'quotesSource')">
                — {{ quotesData.source || "QS. Ar-Rum: 21" }}
              </p>
            </div>
          </div>
        </section>

        <!-- ══ PROFIL MEMPELAI ══ -->
        <section
          v-if="store.sectionStates.mempelai?.active !== false"
          id="sec-mempelai"
          class="inv-section"
        >
          <div class="inv-card">
            <div class="modal-custom-header" :style="{ background: store.customColors.popup || '#1a2e45' }">
              <span class="modal-custom-header-title">{{ (store.sectionContents as any).mempelai?.judulModal || "Profil Mempelai" }}</span>
            </div>
            <div class="modal-body-inner mp-new-body">
              <p class="mp-new-intro" v-if="isVisible('mempelai', 'mempelaiDesc')">
                {{ (store.sectionContents as any).mempelai?.desc || "Dua pribadi yang berbeda, tapi saling melengkapi dalam satu cerita" }}
              </p>

              <div class="mp-new-card mp-new-card--bride">
                <div class="mp-new-card-photo-wrap" v-if="isVisible('mempelai', 'fotoBride')">
                  <img :src="profiles[0].image_url" alt="The Bride" class="mp-new-card-photo" />
                </div>
                <div class="mp-new-card-info">
                  <h4 class="mp-new-card-label" v-if="isVisible('mempelai', 'brideLabelSub')">{{ profiles[0].label }}</h4>
                  <h2 class="mp-new-card-name" v-if="isVisible('mempelai', 'nama1')">{{ profiles[0].namaLengkap || profiles[0].name }}</h2>
                  <p class="mp-new-card-bio" v-if="isVisible('mempelai', 'brideOrangTua')">{{ profiles[0].bio || "Putri dari Bapak ... dan Ibu ..." }}</p>
                  <a
                    v-if="isVisible('mempelai', 'instagramBride')"
                    :href="profiles[0].igLink || `https://instagram.com/${profiles[0].instagram.replace('@', '')}`"
                    target="_blank" rel="noopener noreferrer"
                    class="mp-new-card-ig mp-new-card-ig--bride"
                    @click="playClickSound()"
                    :style="{ borderColor: 'var(--c-border)', color: 'var(--c-border)' }"
                    >{{ profiles[0].instagram }}</a>
                </div>
              </div>

              <div class="mp-new-card mp-new-card--groom">
                <div class="mp-new-card-photo-wrap" v-if="isVisible('mempelai', 'fotoGroom')">
                  <img :src="profiles[1].image_url" alt="The Groom" class="mp-new-card-photo" />
                </div>
                <div class="mp-new-card-info">
                  <h4 class="mp-new-card-label" v-if="isVisible('mempelai', 'groomLabelSub')">{{ profiles[1].label }}</h4>
                  <h2 class="mp-new-card-name" v-if="isVisible('mempelai', 'nama2')">{{ profiles[1].namaLengkap || profiles[1].name }}</h2>
                  <p class="mp-new-card-bio" v-if="isVisible('mempelai', 'groomOrangTua')">{{ profiles[1].bio || "Putra dari Bapak ... dan Ibu ..." }}</p>
                  <a
                    v-if="isVisible('mempelai', 'instagramGroom')"
                    :href="profiles[1].igLink || `https://instagram.com/${profiles[1].instagram.replace('@', '')}`"
                    target="_blank" rel="noopener noreferrer"
                    class="mp-new-card-ig mp-new-card-ig--groom"
                    @click="playClickSound()"
                    :style="{ borderColor: 'var(--c-border)', color: 'var(--c-border)' }"
                    >{{ profiles[1].instagram }}</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ══ ACARA / EVENT + COUNTDOWN ══ -->
        <section
          v-if="store.sectionStates.acara?.active !== false"
          id="sec-acara"
          class="inv-section"
        >
          <div class="inv-card">
            <div class="modal-custom-header" :style="{ background: store.customColors.popup || '#1a2e45' }">
              <span class="modal-custom-header-title">Acara</span>
            </div>
            <div class="modal-body-inner">
              <p class="text-sm text-gray-500 text-center italic mb-3" v-if="isVisible('acara', 'acaraDesc')">
                {{ (store.sectionContents as any).acara?.desc || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir." }}
              </p>

              <div v-if="showCountdown" class="countdown-wrap mb-4" :style="{ background: (store.sectionContents as any).acara?.countdownBg || 'var(--c-popup, #1a2e45)' }">
                <div class="countdown-grid">
                  <div class="countdown-cell">
                    <span class="countdown-num">{{ String(countdownTime.days).padStart(2, "0") }}</span>
                    <span class="countdown-lbl">Hari</span>
                  </div>
                  <div class="countdown-sep">:</div>
                  <div class="countdown-cell">
                    <span class="countdown-num">{{ String(countdownTime.hours).padStart(2, "0") }}</span>
                    <span class="countdown-lbl">Jam</span>
                  </div>
                  <div class="countdown-sep">:</div>
                  <div class="countdown-cell">
                    <span class="countdown-num">{{ String(countdownTime.minutes).padStart(2, "0") }}</span>
                    <span class="countdown-lbl">Menit</span>
                  </div>
                  <div class="countdown-sep">:</div>
                  <div class="countdown-cell">
                    <span class="countdown-num">{{ String(countdownTime.seconds).padStart(2, "0") }}</span>
                    <span class="countdown-lbl">Detik</span>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <div v-for="(event, i) in events" :key="i" class="relative bg-white text-black rounded-xl p-5 shadow-md border border-gray-100">
                  <div class="text-center mb-3">
                    <h3 class="text-lg font-semibold tracking-wide modal-section-item-title">{{ event.name }}</h3>
                    <div class="w-12 h-0.5 bg-gray-300 mx-auto mt-2"></div>
                  </div>
                  <div class="space-y-2 text-sm text-gray-700">
                    <div class="flex items-center justify-center gap-2" v-if="i === 0 ? isVisible('acara', 'tanggalAkad') : isVisible('acara', 'tanggalResepsi')">
                      <span>📅</span> {{ event.date }}
                    </div>
                    <div class="flex items-center justify-center gap-2" v-if="i === 0 ? isVisible('acara', 'waktuAkad') : isVisible('acara', 'waktuResepsi')">
                      <span>🕐</span> {{ event.time }}
                    </div>
                    <div class="flex items-center justify-center gap-2 font-medium" v-if="i === 0 ? isVisible('acara', 'lokasiAkad') : isVisible('acara', 'lokasiResepsi')">
                      <span>📍</span> {{ event.location }}
                    </div>
                    <div class="text-center text-sm text-gray-500 px-4" v-if="i === 0 ? isVisible('acara', 'alamatAkad') : isVisible('acara', 'alamatResepsi')">
                      {{ event.address }}
                    </div>
                  </div>
                  <a
                    :href="event.mapsLink || '#'"
                    :target="event.mapsLink ? '_blank' : '_self'"
                    rel="noopener noreferrer"
                    class="modal-custom-btn mt-3 block w-full text-center"
                    @click="playClickSound()"
                    @mouseenter="playHoverSound()"
                    :style="{ background: store.customColors.tombol || '#7c3aed' }"
                  >
                    {{ event.mapsText }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ══ MAPS ══ -->
        <section
          v-if="store.sectionStates.maps?.active !== false"
          id="sec-maps"
          class="inv-section"
        >
          <div class="inv-card">
            <div class="modal-custom-header" :style="{ background: store.customColors.popup || '#1a2e45' }">
              <span class="modal-custom-header-title">{{ mapLocation.judul }}</span>
            </div>
            <div class="modal-body-inner">
              <div class="bg-white text-black rounded-lg p-4">
                <p v-if="mapLocation.desc" class="text-sm text-gray-500 mb-3 text-center">{{ mapLocation.desc }}</p>
                <div class="maps-iframe-wrapper" :style="{ borderColor: 'var(--c-border)' }">
                  <ClientOnly>
                    <iframe :src="mapLocation.embed_url" class="w-full h-full" loading="lazy" />
                  </ClientOnly>
                </div>
                <div class="maps-info-center">
                  <h3 class="maps-venue-name" v-if="isVisible('maps', 'lokasiResepsi')">{{ mapLocation.venue }}</h3>
                  <p class="maps-venue-address" v-if="isVisible('maps', 'alamatResepsi')">{{ mapLocation.address }}</p>
                </div>
                <a
                  :href="mapLocation.google_maps_url"
                  target="_blank" rel="noopener noreferrer"
                  class="modal-custom-btn block w-full text-center"
                  @click="playClickSound()"
                  @mouseenter="playHoverSound()"
                  :style="{ background: store.customColors.tombol || '#7c3aed' }"
                >
                  {{ mapLocation.btnText }}
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- ══ RUNDOWN ══ -->
        <section
          v-if="store.sectionStates.rundown?.active !== false"
          id="sec-rundown"
          class="inv-section"
        >
          <div class="inv-card">
            <div class="modal-custom-header" :style="{ background: store.customColors.popup || '#1a2e45' }">
              <span class="modal-custom-header-title">{{ rundownData.judul }}</span>
            </div>
            <div class="modal-body-inner">
              <div class="modal-rundown-wrap">
                <p v-if="rundownData.desc" class="modal-rundown-desc">{{ rundownData.desc }}</p>
                <div class="modal-timeline">
                  <div v-for="(item, i) in rundownData.items" :key="i" class="modal-timeline-item">
                    <div class="modal-timeline-left">
                      <div class="modal-timeline-time">{{ item.waktu }}</div>
                    </div>
                    <div class="modal-timeline-connector">
                      <div class="modal-timeline-dot"></div>
                      <div v-if="i < rundownData.items.length - 1" class="modal-timeline-line"></div>
                    </div>
                    <div class="modal-timeline-right">
                      <div class="modal-timeline-activity">{{ item.kegiatan }}</div>
                    </div>
                  </div>
                  <div v-if="!rundownData.items.length" class="modal-empty-state">Belum ada rundown yang ditambahkan.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ══ GALLERY ══ -->
        <section
          v-if="store.sectionStates.galeri?.active !== false"
          id="sec-galeri"
          class="inv-section"
        >
          <div class="inv-card">
            <div class="modal-custom-header" :style="{ background: store.customColors.popup || '#1a2e45' }">
              <span class="modal-custom-header-title">{{ (store.sectionContents as any).galeri?.judul || "Gallery" }}</span>
            </div>
            <div class="modal-body-inner">
              <div class="text-center mb-4">
                <h3 v-if="isVisible('galeri', 'galeriJudul')" class="text-base font-bold mb-1 modal-section-item-title">
                  {{ (store.sectionContents as any).galeri?.judul || "Galeri Foto" }}
                </h3>
                <p v-if="isVisible('galeri', 'galeriSubJudul')" class="text-xs text-gray-500 italic">
                  {{ (store.sectionContents as any).galeri?.subJudul || "Momen indah yang kami abadikan bersama" }}
                </p>
              </div>

              <div v-if="galeriLayout === '1col'" class="flex flex-col gap-2">
                <img v-for="(img, i) in galleries" :src="img.image_url" alt="foto galeri" class="rounded-md w-full object-cover" style="max-height: 260px" :key="i" />
              </div>
              <div v-else-if="galeriLayout === '2col'" class="grid grid-cols-2 gap-2">
                <img v-for="(img, i) in galleries" :src="img.image_url" alt="foto galeri" class="rounded-md w-full object-cover aspect-square" :key="i" />
              </div>
              <div v-else-if="galeriLayout === 'masonry'" class="columns-2 gap-2 space-y-2">
                <img v-for="(img, i) in galleries" :src="img.image_url" alt="foto galeri" class="rounded-md w-full break-inside-avoid" :key="i" />
              </div>
              <div v-else-if="galeriLayout === '3col'" class="grid grid-cols-3 gap-1">
                <img v-for="(img, i) in galleries" :src="img.image_url" alt="foto galeri" class="rounded-md w-full object-cover aspect-square" :key="i" />
              </div>
              <div v-else-if="galeriLayout === 'hero'" class="flex flex-col gap-2">
                <img :src="galleries[0]?.image_url" alt="foto galeri hero" class="rounded-md w-full object-cover" style="height: 220px" />
                <div class="grid grid-cols-2 gap-2">
                  <img v-for="(img, i) in galleries.slice(1, 7)" :src="img.image_url" alt="foto galeri" class="rounded-md w-full object-cover aspect-square" :key="i" />
                </div>
              </div>
              <div v-else-if="galeriLayout === '5foto'" class="flex flex-col gap-2">
                <div class="grid grid-cols-2 gap-2">
                  <img v-for="(img, i) in galleries.slice(0, 2)" :src="img.image_url" :key="'5a' + i" alt="foto galeri" class="rounded-md w-full object-cover aspect-square" />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <img v-for="(img, i) in galleries.slice(2, 4)" :src="img.image_url" :key="'5b' + i" alt="foto galeri" class="rounded-md w-full object-cover aspect-square" />
                </div>
                <img v-if="galleries[4]" :src="galleries[4].image_url" alt="foto galeri" class="rounded-md w-full object-cover" style="max-height: 220px" />
              </div>
              <div v-else class="columns-2 gap-2 space-y-2">
                <img v-for="(img, i) in galleries" :src="img.image_url" alt="foto galeri" class="rounded-md w-full break-inside-avoid" :key="i" />
              </div>
            </div>
          </div>
        </section>

        <!-- ══ DRESSCODE ══ -->
        <section
          v-if="store.sectionStates.dresscode?.active !== false"
          id="sec-dresscode"
          class="inv-section"
        >
          <div class="inv-card">
            <div class="modal-custom-header" :style="{ background: store.customColors.popup || '#1a2e45' }">
              <span class="modal-custom-header-title">{{ (store.sectionContents as any).dresscode?.judul || "Dress Code" }}</span>
            </div>
            <div class="modal-body-inner">
              <div class="bg-white text-black rounded-lg p-5">
                <img v-if="isVisible('dresscode', 'dresscodeImage')" :src="dresscode.image_url" alt="dresscode" class="w-full h-48 object-cover rounded-md mb-4" />
                <h3 class="text-xl font-semibold mb-3" v-if="isVisible('dresscode', 'dresscodeTema')">{{ dresscode.theme }}</h3>
                <div class="mb-4" v-if="isVisible('dresscode', 'dresscodeColors')">
                  <div class="font-medium mb-2">Warna yang Disarankan:</div>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(color, i) in dresscode.colors" :key="i" class="px-3 py-1 bg-gray-100 rounded-full text-sm">{{ color }}</span>
                  </div>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed" v-if="isVisible('dresscode', 'dresscodeDesc')">{{ dresscode.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- ══ LOVE STORY ══ -->
        <section
          v-if="store.sectionStates.lovestory?.active !== false"
          id="sec-lovestory"
          class="inv-section"
        >
          <div class="inv-card">
            <div class="modal-custom-header" :style="{ background: store.customColors.popup || '#1a2e45' }">
              <span class="modal-custom-header-title">{{ (store.sectionContents as any).lovestory?.judul || "Love Story" }}</span>
            </div>
            <div class="modal-body-inner">
              <p class="text-sm text-gray-500 mb-4 text-center italic">
                {{ (store.sectionContents as any).lovestory?.desc || "Perjalanan cinta kami yang indah menuju hari bahagia." }}
              </p>

              <div v-if="loveStoryLayout === 'foto-atas'" class="modal-story-timeline">
                <div v-for="(story, i) in LoveStorys" :key="i" class="modal-story-item">
                  <div class="modal-story-date-badge">{{ story.date }}</div>
                  <img v-if="story.image_url" :src="story.image_url" alt="foto love story" class="modal-story-img" />
                  <div class="modal-story-content">
                    <div class="modal-story-title">{{ story.title }}</div>
                    <div class="modal-story-desc">{{ story.description }}</div>
                  </div>
                </div>
              </div>

              <div v-else-if="loveStoryLayout === 'foto-kanan'" class="modal-story-timeline">
                <div v-for="(story, i) in LoveStorys" :key="i" class="modal-story-item modal-story-item--row">
                  <div class="modal-story-content modal-story-content--flex">
                    <div class="modal-story-date-inline">{{ story.date }}</div>
                    <div class="modal-story-title">{{ story.title }}</div>
                    <div class="modal-story-desc">{{ story.description }}</div>
                  </div>
                  <img v-if="story.image_url" :src="story.image_url" alt="foto love story" class="modal-story-img modal-story-img--side" />
                </div>
              </div>

              <div v-else-if="loveStoryLayout === 'foto-kiri'" class="modal-story-timeline">
                <div v-for="(story, i) in LoveStorys" :key="i" class="modal-story-item modal-story-item--row">
                  <img v-if="story.image_url" :src="story.image_url" alt="foto love story" class="modal-story-img modal-story-img--side" />
                  <div class="modal-story-content modal-story-content--flex">
                    <div class="modal-story-date-inline">{{ story.date }}</div>
                    <div class="modal-story-title">{{ story.title }}</div>
                    <div class="modal-story-desc">{{ story.description }}</div>
                  </div>
                </div>
              </div>

              <div v-else-if="loveStoryLayout === 'teks-klasik'" class="modal-story-timeline">
                <div v-for="(story, i) in LoveStorys" :key="i" class="modal-story-item modal-story-item--text">
                  <div class="modal-story-text-header">
                    <div class="modal-story-title">{{ story.title }}</div>
                    <span class="modal-story-date-chip">{{ story.date }}</span>
                  </div>
                  <div class="modal-story-desc">{{ story.description }}</div>
                </div>
              </div>

              <div v-else-if="loveStoryLayout === 'teks-quote'" class="modal-story-timeline">
                <div v-for="(story, i) in LoveStorys" :key="i" class="modal-story-item modal-story-item--quote">
                  <div class="modal-story-quote-mark" :style="{ color: store.customColors.tombol || '#7c3aed' }">"</div>
                  <div class="modal-story-title modal-story-title--quote">{{ story.title }}</div>
                  <div class="modal-story-desc modal-story-desc--quote">{{ story.description }}</div>
                  <div class="modal-story-quote-footer">— {{ story.date }}</div>
                </div>
              </div>

              <div v-else-if="loveStoryLayout === 'teks-timeline'" class="modal-story-vtimeline">
                <div v-for="(story, i) in LoveStorys" :key="i" class="modal-story-vt-item">
                  <div class="modal-story-vt-dot" :style="{ background: store.customColors.tombol || '#7c3aed' }"></div>
                  <div v-if="i < LoveStorys.length - 1" class="modal-story-vt-line" :style="{ background: store.customColors.tombol || '#7c3aed' }"></div>
                  <div class="modal-story-vt-content">
                    <div class="modal-story-vt-date" :style="{ color: store.customColors.tombol || '#7c3aed' }">{{ story.date }}</div>
                    <div class="modal-story-title">{{ story.title }}</div>
                    <div class="modal-story-desc">{{ story.description }}</div>
                  </div>
                </div>
              </div>

              <div v-else class="modal-story-timeline">
                <div v-for="(story, i) in LoveStorys" :key="i" class="modal-story-item">
                  <div class="modal-story-date-badge">{{ story.date }}</div>
                  <img v-if="story.image_url" :src="story.image_url" alt="foto love story" class="modal-story-img" />
                  <div class="modal-story-content">
                    <div class="modal-story-title">{{ story.title }}</div>
                    <div class="modal-story-desc">{{ story.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ══ GIFT / AMPLOP DIGITAL ══ -->
        <section
          v-if="store.sectionStates.gift?.active !== false"
          id="sec-gift"
          class="inv-section"
        >
          <div class="inv-card">
            <div class="modal-custom-header" :style="{ background: store.customColors.popup || '#1a2e45' }">
              <span class="modal-custom-header-title">{{ (store.sectionContents as any).gift?.judul || "Amplop Digital" }}</span>
            </div>
            <div class="modal-body-inner">
              <p class="text-sm text-gray-500 mb-4 leading-relaxed" v-if="isVisible('gift', 'giftDesc')">
                {{ (store.sectionContents as any).gift?.desc || "Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika ingin memberikan tanda kasih, Anda dapat melalui rekening berikut." }}
              </p>
              <div class="space-y-4">
                <div v-for="(gift, i) in gifts" :key="i" class="gift-card">
                  <div class="gift-bank-card">
                    <div class="gift-bank-top">
                      <div class="gift-bank-chip">
                        <div class="gift-chip-line gift-chip-line--h gift-chip-line--top"></div>
                        <div class="gift-chip-line gift-chip-line--h gift-chip-line--bottom"></div>
                        <div class="gift-chip-line gift-chip-line--h gift-chip-line--mid-left"></div>
                        <div class="gift-chip-line gift-chip-line--h gift-chip-line--mid-right"></div>
                        <div class="gift-chip-line gift-chip-line--v gift-chip-line--left"></div>
                        <div class="gift-chip-line gift-chip-line--v gift-chip-line--right"></div>
                      </div>
                      <img v-if="gift.image_url && isVisible('gift', 'logoBank')" :src="gift.image_url" alt="logo bank" class="gift-bank-logo" />
                    </div>
                    <div class="gift-bank-name" v-if="isVisible('gift', 'namaBankRekening')">{{ gift.bank }}</div>
                    <div class="gift-bank-number" v-if="isVisible('gift', 'nomorRekening')">{{ gift.account_number }}</div>
                    <button
                      v-if="isVisible('gift', 'nomorRekening')"
                      class="gift-btn-salin"
                      :style="{ background: store.customColors.tombol || '#7c3aed' }"
                      @click="copyToClipboard(gift.account_number, i)"
                      @mouseenter="playHoverSound()"
                    >
                      {{ copiedIndex === i ? "✓ Disalin" : "Salin Rekening" }}
                    </button>
                    <div class="gift-bank-holder" v-if="isVisible('gift', 'namaRekening')">Atas Nama {{ gift.account_name }}</div>
                  </div>
                  <a
                    :href="gift.waMe ? 'https://wa.me/' + gift.waMe.replace(/\D/g, '') : '#'"
                    :target="gift.waMe ? '_blank' : '_self'"
                    class="gift-btn-konfirmasi"
                    @click="playClickSound()"
                    @mouseenter="playHoverSound()"
                    :style="{ background: store.customColors.tombol || '#7c3aed' }"
                  >
                    {{ gift.konfirmasiText }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ══ RSVP + UCAPAN TAMU ══ -->
        <section
          v-if="store.sectionStates.rsvp?.active !== false"
          id="sec-rsvp"
          class="inv-section"
        >
          <div class="inv-card">
            <div class="modal-custom-header" :style="{ background: store.customColors.popup || '#1a2e45' }">
              <span class="modal-custom-header-title">{{ rsvpConfig.judul }}</span>
            </div>
            <div class="modal-body-inner">
              <div v-if="rsvpConfig.desc || rsvpConfig.batas" class="mb-4 text-sm text-gray-500">
                <p v-if="rsvpConfig.desc">{{ rsvpConfig.desc }}</p>
                <p v-if="rsvpConfig.batas" class="mt-1">Batas konfirmasi: <strong>{{ rsvpConfig.batas }}</strong></p>
              </div>

              <div v-if="rsvpSubmitted" class="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-center text-green-700 text-sm font-medium">
                {{ rsvpConfig.btnTextAfter }}
              </div>

              <form @submit.prevent="handleRsvp" class="space-y-4">
                <UFormField v-if="rsvpConfig.showNama" :label="rsvpConfig.labelNama" class="w-full">
                  <UInput v-model="newGuest.name" :required="rsvpConfig.requiredNama" :readonly="rsvpConfig.readOnlyNama" class="w-full" :placeholder="rsvpConfig.placeholderNama" @input="playTypingSound()" @mouseenter="playHoverSound()" />
                </UFormField>

                <UFormField v-if="rsvpConfig.showGrup" :label="rsvpConfig.labelGrup" class="w-full">
                  <UInput v-model="newGuest.grup" :required="rsvpConfig.requiredGrup" :readonly="rsvpConfig.readOnlyGrup" class="w-full" :placeholder="rsvpConfig.placeholderGrup" @input="playTypingSound()" @mouseenter="playHoverSound()" />
                </UFormField>

                <UFormField v-if="rsvpConfig.showWhatsapp" :label="rsvpConfig.labelWhatsapp" class="w-full">
                  <UInput v-model="newGuest.whatsapp" type="tel" :required="rsvpConfig.requiredWhatsapp" :readonly="rsvpConfig.readOnlyWhatsapp" class="w-full" :placeholder="rsvpConfig.placeholderWhatsapp" @input="playTypingSound()" @mouseenter="playHoverSound()" />
                </UFormField>

                <UFormField v-if="rsvpConfig.showKehadiran" :label="rsvpConfig.labelKehadiran" class="w-full">
                  <select v-model="newGuest.attendance" :required="rsvpConfig.requiredKehadiran" :disabled="rsvpConfig.readOnlyKehadiran" class="rsvp-select w-full" @change="playClickSound()" @mouseenter="playHoverSound()">
                    <option value="" disabled>-- Pilih Kehadiran --</option>
                    <option v-for="opt in attendanceStatus" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                  </select>
                </UFormField>

                <UFormField v-if="rsvpConfig.showJumlah" :label="rsvpConfig.labelJumlah" class="w-full">
                  <select v-model="newGuest.jumlah" :required="rsvpConfig.requiredJumlah" :disabled="rsvpConfig.readOnlyJumlah" class="rsvp-select w-full" @change="playClickSound()" @mouseenter="playHoverSound()">
                    <option value="" disabled>-- Pilih Jumlah Tamu --</option>
                    <option v-for="n in rsvpConfig.maxTamu" :key="n" :value="String(n)">{{ n }} orang</option>
                  </select>
                </UFormField>

                <UFormField v-if="rsvpConfig.showUcapan" :label="rsvpConfig.labelUcapan" class="w-full">
                  <UTextarea v-model="newGuest.comment" class="w-full mb-4" :required="rsvpConfig.requiredUcapan" :readonly="rsvpConfig.readOnlyUcapan" :placeholder="rsvpConfig.placeholderUcapan" @input="playTypingSound()" @mouseenter="playHoverSound()" />
                </UFormField>

                <button type="submit" class="modal-custom-btn w-full" :style="{ background: store.customColors.tombol || '#7c3aed' }" @mouseenter="playHoverSound()">
                  {{ rsvpConfig.btnText }}
                </button>
              </form>

              <div class="space-y-4 mb-4 mt-4">
                <div v-for="(guest, index) in guests" :key="index">
                  <div class="bg-white text-sm border border-gray-100 text-black rounded-lg p-4 shadow-sm">
                    <div class="flex items-center flex-wrap gap-1">
                      <span class="font-medium">{{ guest.name }}</span>
                      <span v-if="guest.grup" class="px-2 text-xs rounded-full bg-blue-100 text-blue-700">{{ guest.grup }}</span>
                      <span
                        class="px-2 text-xs rounded-full ml-auto"
                        :class="{
                          'bg-green-200 text-green-800': guest.attendance === 'Hadir',
                          'bg-yellow-200 text-yellow-800': guest.attendance === 'Mungkin Hadir',
                          'bg-red-200 text-red-800': guest.attendance === 'Tidak Hadir',
                          'bg-gray-100 text-gray-600': !['Hadir', 'Tidak Hadir', 'Mungkin Hadir'].includes(guest.attendance),
                        }"
                        >{{ guest.attendance }}</span>
                    </div>
                    <div v-if="guest.jumlah" class="text-gray-400 text-xs mt-1">{{ rsvpConfig.labelJumlah }}: {{ guest.jumlah }} orang</div>
                    <div class="text-gray-500 mt-1">{{ guest.comment }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ══ CONTACT ══ -->
        <section
          v-if="store.sectionStates.contact?.active !== false"
          id="sec-contact"
          class="inv-section"
        >
          <div class="inv-card">
            <div class="modal-custom-header" :style="{ background: store.customColors.popup || '#1a2e45' }">
              <span class="modal-custom-header-title">{{ (store.sectionContents as any).contact?.judul || "Informasi Kontak" }}</span>
            </div>
            <div class="modal-body-inner">
              <div class="modal-contact-wrap">
                <div class="modal-contact-avatar-wrap" v-if="isVisible('contact', 'fotoContact')">
                  <img v-if="store.undangan.fotoContact" :src="store.undangan.fotoContact" alt="foto contact" class="modal-contact-avatar" />
                  <div v-else class="modal-contact-avatar-fallback">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.71 16.21l.21.71z" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                </div>
                <div class="modal-contact-name" v-if="isVisible('contact', 'contactNama')">
                  {{ (store.sectionContents as any).contact?.nama || store.undangan.nama1 || "Nama Kontak" }}
                </div>
                <div class="modal-contact-role" v-if="isVisible('contact', 'contactLabel')">
                  {{ (store.sectionContents as any).contact?.labelContact || "Panitia / Contact Person" }}
                </div>
                <a
                  v-if="isVisible('contact', 'contactWa')"
                  :href="(store.sectionContents as any).contact?.wa ? `https://wa.me/${((store.sectionContents as any).contact?.wa || '').replace(/\D/g, '')}` : '#'"
                  target="_blank" rel="noopener noreferrer"
                  class="modal-contact-btn"
                  @click="playClickSound()"
                  :style="{ background: store.customColors.tombol || '#7c3aed', borderColor: store.customColors.border || '#1a2e45' }"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.553 4.113 1.522 5.842L.057 23.882l6.175-1.621A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.881 9.881 0 0 1-5.031-1.378l-.361-.215-3.736.98.998-3.648-.235-.374A9.847 9.847 0 0 1 2.105 12C2.105 6.526 6.526 2.105 12 2.105c5.473 0 9.894 4.421 9.894 9.895 0 5.473-4.421 9.894-9.894 9.894z" />
                  </svg>
                  {{ (store.sectionContents as any).contact?.btnText || "Hubungi via WhatsApp" }}
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- ══ SALAM / PENUTUP ══ -->
        <section
          id="sec-penutup"
          class="inv-section inv-section--salam"
          v-if="store.sectionStates['penutup']?.active !== false"
        >
          <div class="salam-photo-wrap" v-if="salamMessage.image_url">
            <img :src="salamMessage.image_url" alt="foto pasangan" class="salam-photo" />
          </div>
          <h2 class="salam-judul">{{ salamMessage.judul }}</h2>
          <p class="salam-text">{{ salamMessage.message }}</p>
          <p class="salam-text">{{ salamMessage.penutup }}</p>
          <p class="salam-hormat">{{ salamMessage.hormat }}</p>
          <p class="salam-signature">{{ salamMessage.signature }}</p>

          <div v-if="store.musikAktif && store.undangan.musik && store.showMusikWatermark !== false" class="menu-music-section">
            <p class="menu-section-label">Lagu Pernikahan</p>
            <div class="menu-music-item">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="flex-shrink:0;opacity:0.6">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
              <span>{{ store.undangan.musik }}</span>
            </div>
          </div>

          <template v-if="(store as any).showLogoWatermark !== false">
            <div class="menu-social-section">
              <p class="menu-section-label">Hubungi &amp; Ikuti Kami</p>
              <div class="menu-social-row">
                <a :href="platformInfo.instagramUrl" target="_blank" rel="noopener noreferrer" class="menu-social-btn" @click="playClickSound()" @mouseenter="playHoverSound()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
                  </svg>
                  {{ platformInfo.instagram }}
                </a>
                <a :href="platformInfo.websiteUrl" target="_blank" rel="noopener noreferrer" class="menu-social-btn" @click="playClickSound()" @mouseenter="playHoverSound()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2c2.7 2.7 4.2 6.2 4.2 10s-1.5 7.3-4.2 10c-2.7-2.7-4.2-6.2-4.2-10S9.3 4.7 12 2z" />
                  </svg>
                  {{ platformInfo.website }}
                </a>
                <a :href="`https://wa.me/${platformInfo.whatsapp}`" target="_blank" rel="noopener noreferrer" class="menu-social-btn menu-social-btn--full" @click="playClickSound()" @mouseenter="playHoverSound()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.553 4.113 1.522 5.842L.057 23.882l6.175-1.621A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.881 9.881 0 0 1-5.031-1.378l-.361-.215-3.736.98.998-3.648-.235-.374A9.847 9.847 0 0 1 2.105 12C2.105 6.526 6.526 2.105 12 2.105c5.473 0 9.894 4.421 9.894 9.895 0 5.473-4.421 9.894-9.894 9.894z"/>
                  </svg>
                  {{ platformInfo.phoneDisplay }}
                </a>
              </div>
            </div>
            <div class="menu-brand-footer">
              <span class="menu-brand-text">Dibuat dengan</span>
              <div class="menu-brand-logo-row">
                <img src="/playmoment/logo-teal.png" alt="PlayMoment" class="menu-brand-logo" />
                <span class="menu-brand-name">PlayMoment</span>
              </div>
            </div>
          </template>
        </section>
      </div>
    </template>

    <!-- ══ OPENING COVER ══ -->
    <Transition name="cover-slide">
      <div v-if="!isOpen" class="cover-wrap">
        <div
          class="cover-bg"
          :style="
            store.undangan.fotoCouple && isVisible('opening', 'fotoCouple')
              ? { backgroundImage: `url(${store.undangan.fotoCouple})` }
              : { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }
          "
        ></div>

        <div v-if="(store.sectionContents as any).opening?.showOverlay !== false" class="cover-overlay"></div>

        <div class="cover-content">
          <div class="cover-title-area">
            <div class="cover-badge">Wedding Invitation</div>
            <div class="cover-judul" v-if="isVisible('opening', 'judul')">{{ openingData.judul }}</div>
            <div class="cover-line"><span></span><span class="cover-diamond">◆</span><span></span></div>
            <div class="cover-nama-mempelai" v-if="isVisible('opening', 'namaMempelai')">
              {{
                (store.sectionContents as any).opening?.namaMempelai ||
                (profiles[0]?.namaLengkap && profiles[1]?.namaLengkap
                  ? profiles[0].namaLengkap + " & " + profiles[1].namaLengkap
                  : "Adam & Hawa")
              }}
            </div>
          </div>

          <div class="cover-tamu" v-if="isVisible('opening', 'kepadaYth')">
            <div class="cover-kepada">{{ openingData.kepadaYth }}</div>
            <div class="cover-nama-tamu">{{ openingData.namaTamu }}</div>
          </div>

          <button
            v-if="isVisible('opening', 'openingBtnText')"
            @click="openInvitation"
            class="btn-3d btn-play"
            :style="{ background: store.customColors.tombol || '#7c3aed', borderColor: store.customColors.border || '#1a2e45' }"
          >
            {{ openingData.btnText }}
          </button>
        </div>

        <Transition name="initial-loading-fade">
          <div v-if="showInitialLoading" class="cover-pixel-loading">
            <div class="gt-heart-wrap">
              <svg class="gt-heart-svg" viewBox="30 -5 200 56" xmlns="http://www.w3.org/2000/svg">
                <filter id="blur2"><feGaussianBlur stdDeviation="1.6"></feGaussianBlur></filter>
                <g transform="translate(29.1 -127.42)">
                  <path pathLength="1" d="M-28.73 167.2c26.43 9.21 68.46-9.46 85.45-12.03 18.45-2.78 32.82 4.86 28.75 9.83-3.82 4.66-25.77-21.18-14.81-31.5 9.54-8.98 17.64 10.64 16.42 17.06-1.51-6.2 2.95-26.6 14.74-22.11 11.7 4.46-4.33 49.03-15.44 44.08-6.97-3.1 15.44-16.26 26.1-16 23.03.56 55.6 27.51 126.63 3.36" class="gt-heart-line"></path>
                </g>
                <g transform="translate(29.1 -127.42)">
                  <path pathLength="1" d="M-28.73 167.2c26.43 9.21 68.46-9.46 85.45-12.03 18.45-2.78 32.82 4.86 28.75 9.83-3.82 4.66-25.77-21.18-14.81-31.5 9.54-8.98 17.64 10.64 16.42 17.06-1.51-6.2 2.95-26.6 14.74-22.11 11.7 4.46-4.33 49.03-15.44 44.08-6.97-3.1 15.44-16.26 26.1-16 23.03.56 55.6 27.51 126.63 3.36" class="gt-heart-point" filter="url(#blur2)"></path>
                </g>
              </svg>
            </div>
          </div>
        </Transition>

        <Transition name="game-flash">
          <div v-if="isTransitioning" class="game-transition">
            <div class="gt-heart-wrap">
              <svg class="gt-heart-svg" viewBox="30 -5 200 56" xmlns="http://www.w3.org/2000/svg">
                <filter id="blur"><feGaussianBlur stdDeviation="1.6"></feGaussianBlur></filter>
                <g transform="translate(29.1 -127.42)">
                  <path pathLength="1" d="M-28.73 167.2c26.43 9.21 68.46-9.46 85.45-12.03 18.45-2.78 32.82 4.86 28.75 9.83-3.82 4.66-25.77-21.18-14.81-31.5 9.54-8.98 17.64 10.64 16.42 17.06-1.51-6.2 2.95-26.6 14.74-22.11 11.7 4.46-4.33 49.03-15.44 44.08-6.97-3.1 15.44-16.26 26.1-16 23.03.56 55.6 27.51 126.63 3.36" class="gt-heart-line"></path>
                </g>
                <g transform="translate(29.1 -127.42)">
                  <path pathLength="1" d="M-28.73 167.2c26.43 9.21 68.46-9.46 85.45-12.03 18.45-2.78 32.82 4.86 28.75 9.83-3.82 4.66-25.77-21.18-14.81-31.5 9.54-8.98 17.64 10.64 16.42 17.06-1.51-6.2 2.95-26.6 14.74-22.11 11.7 4.46-4.33 49.03-15.44 44.08-6.97-3.1 15.44-16.26 26.1-16 23.03.56 55.6 27.51 126.63 3.36" class="gt-heart-point" filter="url(#blur)"></path>
                </g>
              </svg>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
/* ── Ukuran dasar phone-sized, centered di desktop ── */
/* ── Root background desktop ── */
.invitation-root {
  position: fixed;
  inset: 0;
  background: var(--c-tombol, #5bbfb5);
}

@media (min-width: 600px) and (max-aspect-ratio: 4/3) {
  .invitation-root {
    background: var(--c-tombol, #5bbfb5);
  }
}

.drawer {
  height: min(100dvh, 100vw * 16 / 9);
  aspect-ratio: 9 / 16;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-size: cover;
  border-radius: 32px;
  overflow: hidden;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.08);
}

/* ── Tablet / iPad: isi penuh tinggi layar, lebar proporsional 9:16 ── */
@media (min-width: 600px) and (max-aspect-ratio: 4/3) {
  .drawer {
    height: 100dvh !important;
    width: calc(100dvh * 9 / 16) !important;
    max-width: 100dvw !important;
    aspect-ratio: 9 / 16 !important;
    border-radius: clamp(24px, 3dvh, 48px) !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    background-position: center center;
    background-size: cover;
  }
}

/* ── Cover wrap: ukuran IDENTIK dengan .drawer ── */
.cover-wrap {
  /* Sama persis kayak .drawer */
  height: min(100dvh, 100vw * 16 / 9);
  aspect-ratio: 9 / 16;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  overflow: hidden;
  border-radius: 32px;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.08);
}

@media (min-width: 600px) and (max-aspect-ratio: 4/3) {
  .cover-wrap {
    height: 100dvh !important;
    width: calc(100dvh * 9 / 16) !important;
    max-width: 100dvw !important;
    aspect-ratio: 9 / 16 !important;
    border-radius: clamp(24px, 3dvh, 48px) !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
  }
}

.cover-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1.05);
  animation: coverZoom 8s ease-in-out infinite alternate;
}

@keyframes coverZoom {
  from {
    transform: scale(1.05);
  }
  to {
    transform: scale(1.12);
  }
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.3) 45%,
    rgba(0, 0, 0, 0.55) 100%
  );
}

.cover-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 14%;
  padding-inline: 6%;
  gap: 16px;
}

/* Judul area atas */
.cover-title-area {
  text-align: center;
  margin-bottom: 4px;
}

.cover-badge {
  font-size: 11px;
  letter-spacing: 2px;
  color: rgba(255, 220, 150, 0.85);
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 8px;
}

.cover-judul {
  font-size: clamp(16px, 4vw, 22px);
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
  line-height: 1.2;
}

.cover-line {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  margin-top: 10px;
}
.cover-line span:not(.cover-diamond) {
  display: block;
  height: 1px;
  width: 40px;
  background: rgba(255, 220, 150, 0.5);
}
.cover-diamond {
  color: rgba(255, 220, 150, 0.8);
  font-size: 10px;
}

/* Nama mempelai di cover */
.cover-nama-mempelai {
  font-family: "Playfair Display", serif;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-top: 8px;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
  letter-spacing: 0.5px;
}

/* Nama tamu */
.cover-tamu {
  text-align: center;
}
.cover-kepada {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 1px;
  margin-bottom: 4px;
}
.cover-nama-tamu {
  font-size: clamp(17px, 4.5vw, 22px);
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
}

/* ── Transition: cover slide keluar ke atas ── */
.cover-slide-leave-active {
  transition:
    transform 0.55s cubic-bezier(0.7, 0, 0.9, 1),
    opacity 0.55s ease;
}
.cover-slide-leave-to {
  transform: translate(-50%, calc(-50% - 110vh));
  opacity: 0;
}

/* ── Game Transition Overlay ── */
.game-transition {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.96);
  overflow: hidden;
}

/* Heart line wrap */
.gt-heart-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
}

.gt-heart-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Line path */
.gt-heart-line {
  fill: none;
  stroke: #e00000;
  stroke-width: 1.5;
  stroke-linecap: butt;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: heartDash 3s linear forwards;
}

/* Glowing point */
.gt-heart-point {
  fill: none;
  stroke: #f00000;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-miterlimit: 0.1;
  stroke-dasharray: 0.0001, 0.9999;
  stroke-dashoffset: 1;
  animation: heartDash 3s linear forwards;
}

@keyframes heartDash {
  0% {
    stroke-dashoffset: 1;
  }
  80% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

/* Teks loading */
.gt-heart-text {
  font-family: "Courier New", monospace;
  font-size: clamp(13px, 3.5vw, 18px);
  font-weight: 900;
  letter-spacing: 4px;
  color: #e00000;
  text-transform: uppercase;
  animation: heartTextPulse 0.6s ease-in-out infinite alternate;
}
@keyframes heartTextPulse {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}

/* ══ COVER LOADING (sebelum buka undangan) — sama dengan game-transition ══ */
.cover-pixel-loading {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.96);
  pointer-events: none;
}

/* Transition untuk game-flash masuk/keluar */
.game-flash-enter-active {
  transition: opacity 0.05s;
}
.game-flash-leave-active {
  transition: opacity 0.4s ease;
}
.game-flash-enter-from,
.game-flash-leave-to {
  opacity: 0;
}

/* Transition untuk loading pertama (auto hilang 3 detik) */
.initial-loading-fade-leave-active {
  transition: opacity 0.6s ease;
}
.initial-loading-fade-leave-to {
  opacity: 0;
}

/* ── Btn play override ── */
.btn-play {
  letter-spacing: 1px;
  /* Gradient pseudo-3D — lighten top, darken bottom via overlay */
  position: relative;
  overflow: hidden;
}
.btn-play::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 255, 255, 0.04) 50%,
    rgba(0, 0, 0, 0.15) 100%
  );
  border-radius: inherit;
  pointer-events: none;
}

/* ── Asset & efek lainnya ── */
@keyframes zoomPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.light-on .glow {
  filter: drop-shadow(0 0 10px var(--c-efek));
}

.glow:hover {
  cursor: pointer;
  filter: drop-shadow(0 0 5px var(--c-efek)) drop-shadow(0 0 5px var(--c-efek));
}

.zoom-in-out {
  animation: zoomPulse 1.8s ease-in-out infinite;
}

.light {
  top: 5%;
}

/* ═══════════════════════════════════════════════
   CUSTOM COLOR VARIABLES — ubah di sini saja
   ─────────────────────────────────────────────
   --c-border        : warna border seluruh file
   --c-primary-text  : teks utama KHUSUS di menu panel
   --c-mempelai-text : warna nama mempelai di modal mempelai
   ═══════════════════════════════════════════════ */
:root {
  --c-border: #1a2e45;
  --c-primary-text: #1a6b5a;
  --c-mempelai-text: #7c3aed;
}

.btn-3d {
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 900;
  color: #fff;
  background: var(--c-tombol);
  border: 2.5px solid var(--c-border, #1a2e45);
  border-radius: 50px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition:
    filter 0.15s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
  text-shadow: none;

  /* Efek 3D — sama seperti modal-custom-btn */
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    0 6px 0 rgba(0, 0, 0, 0.35),
    0 8px 16px rgba(0, 0, 0, 0.25);
}

.btn-3d:active {
  transform: translateY(4px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 2px 0 rgba(0, 0, 0, 0.35),
    0 3px 6px rgba(0, 0, 0, 0.2);
}

.btn-3d:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 8px 0 rgba(0, 0, 0, 0.35),
    0 10px 20px rgba(0, 0, 0, 0.3);
}

.board-cream {
  padding: 28px 24px;
  border-radius: 18px;
  background: linear-gradient(to bottom, #fff6e5, #f5e7cf);
  border: 3px solid var(--c-border, #7a4a2e);
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.7),
    inset 0 -4px 0 rgba(122, 74, 46, 0.25),
    0 10px 0 #5c3a25,
    0 18px 30px rgba(0, 0, 0, 0.35);
  text-align: center;
}

.board-cream .sub {
  font-size: 13px;
  color: #6b4b35;
}

/* ══ MODAL RUNDOWN ══ */
.modal-rundown-wrap {
  padding: 4px 0 8px;
}
.modal-rundown-desc {
  text-align: center;
  color: #888;
  font-size: 13px;
  margin-bottom: 20px;
  font-style: italic;
}
.modal-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.modal-timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.modal-timeline-left {
  width: 56px;
  text-align: right;
  flex-shrink: 0;
  padding-top: 2px;
}
.modal-timeline-time {
  font-size: 13px;
  font-weight: 700;
  color: var(--c-tombol);
  font-variant-numeric: tabular-nums;
}
.modal-timeline-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
.modal-timeline-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--c-tombol) 80%, white),
    var(--c-tombol)
  );
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px var(--c-tombol);
  flex-shrink: 0;
  margin-top: 2px;
}
.modal-timeline-line {
  width: 2px;
  flex: 1;
  min-height: 32px;
  background: linear-gradient(
    to bottom,
    var(--c-tombol),
    color-mix(in srgb, var(--c-efek) 30%, white)
  );
  margin: 4px 0;
}
.modal-timeline-right {
  flex: 1;
  padding-bottom: 20px;
  padding-top: 0;
}
.modal-timeline-activity {
  font-size: 14px;
  font-weight: 600;
  color: var(--c-text);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--c-tombol) 5%, white),
    color-mix(in srgb, var(--c-tombol) 10%, white)
  );
  border-left: 3px solid var(--c-tombol);
  border-radius: 0 10px 10px 0;
  padding: 8px 12px;
  line-height: 1.4;
}
.modal-empty-state {
  text-align: center;
  color: #aaa;
  font-size: 13px;
  padding: 24px;
}

/* ══ MODAL CONTACT ══ */
.modal-contact-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px 8px;
  text-align: center;
}
.modal-contact-avatar-wrap {
  margin-bottom: 16px;
}
.modal-contact-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--c-tombol);
  box-shadow: 0 4px 20px color-mix(in srgb, var(--c-tombol) 25%, transparent);
}
.modal-contact-avatar-fallback {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--c-tombol),
    color-mix(in srgb, var(--c-tombol) 80%, white)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px color-mix(in srgb, var(--c-tombol) 30%, transparent);
}
.modal-contact-name {
  font-size: 20px;
  font-weight: 800;
  color: var(--c-text);
  margin-bottom: 4px;
}
.modal-contact-role {
  font-size: 12px;
  color: #888;
  margin-bottom: 24px;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.modal-contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 14px;
  font-weight: 700;
  padding: 14px 28px;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}
.modal-contact-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
}
.modal-contact-no-wa {
  font-size: 13px;
  color: #bbb;
  background: #f5f5f5;
  padding: 12px 20px;
  border-radius: 10px;
  width: 100%;
}

/* ══ MODAL LOVE STORY ══ */
.modal-story-timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px 0 8px;
}
.modal-story-item {
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  position: relative;
}
.modal-story-date-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
}
.modal-story-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}
.modal-story-content {
  padding: 12px 14px 14px;
}
.modal-story-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-text);
  margin-bottom: 4px;
}
.modal-story-desc {
  font-size: 13px;
  color: color-mix(in srgb, var(--c-text) 60%, #aaa);
  line-height: 1.5;
  font-style: italic;
}

/* ── Layout: foto-kanan / foto-kiri (row) ── */
.modal-story-item--row {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  overflow: hidden;
  min-height: 100px;
}
.modal-story-img--side {
  width: 110px;
  height: auto;
  min-height: 100px;
  flex-shrink: 0;
  object-fit: cover;
}
.modal-story-content--flex {
  flex: 1;
  padding: 12px 12px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}
.modal-story-date-inline {
  font-size: 11px;
  font-weight: 600;
  color: #aaa;
  margin-bottom: 2px;
}

/* ── Layout: teks-klasik ── */
.modal-story-item--text {
  background: #fff;
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border-left: 4px solid var(--c-tombol, #7c3aed);
}
.modal-story-text-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  gap: 8px;
}
.modal-story-date-chip {
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: var(--c-tombol, #7c3aed);
  padding: 2px 9px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Layout: teks-quote ── */
.modal-story-item--quote {
  background: #f8f6ff;
  border-radius: 16px;
  padding: 14px 18px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  text-align: center;
}
.modal-story-quote-mark {
  font-size: 52px;
  line-height: 1;
  font-family: Georgia, serif;
  margin-bottom: -8px;
  opacity: 0.5;
}
.modal-story-title--quote {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 6px;
}
.modal-story-desc--quote {
  font-size: 13px;
  line-height: 1.6;
  font-style: italic;
}
.modal-story-quote-footer {
  margin-top: 10px;
  font-size: 11px;
  color: #aaa;
  font-weight: 600;
}

/* ── Layout: teks-timeline (vertical) ── */
.modal-story-vtimeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 4px 0 8px 20px;
}
.modal-story-vt-item {
  position: relative;
  padding: 0 0 24px 22px;
}
.modal-story-vt-dot {
  position: absolute;
  left: -8px;
  top: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px var(--c-tombol, #7c3aed);
  z-index: 1;
}
.modal-story-vt-line {
  position: absolute;
  left: -2px;
  top: 18px;
  width: 2px;
  bottom: 0;
  opacity: 0.25;
}
.modal-story-vt-content {
  background: #fff;
  border-radius: 14px;
  padding: 12px 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
}
.modal-story-vt-date {
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 4px;
  letter-spacing: 0.3px;
}

/* ══ MODAL PROFILE MEMPELAI ══ */
/* ══ MODAL PROFIL MEMPELAI - REDESIGN ══ */
.mp-hero {
  margin: -16px -16px 0;
  padding: 20px 16px 16px;
  position: relative;
}
/* ── New mempelai layout ── */
.mp-new-body {
  display: block;
  padding-bottom: 16px;
}
.mp-new-body > * + * {
  margin-top: 14px;
}
.mp-new-intro {
  font-size: 13px;
  color: #64748b;
  text-align: center;
  font-style: italic;
  margin: 0 4px;
  line-height: 1.5;
}
.mp-new-quotes-wrap {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 12px 14px;
}
.mp-new-quotes-box {
  padding: 4px 2px;
}
.mp-new-quotes-text {
  font-size: 12px;
  color: #475569;
  text-align: center;
  font-style: italic;
  line-height: 1.6;
  margin: 0 0 6px;
}
.mp-new-quotes-source {
  font-size: 11px;
  color: #94a3b8;
  text-align: center;
  font-style: italic;
  margin: 0;
}
.mp-new-welcome-wrap {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 22px 16px;
}
.mp-new-welcome-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.mp-new-welcome-deco {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}
.mp-new-welcome-deco span:not(.mp-new-welcome-diamond) {
  width: 24px;
  height: 1px;
  background: #cbd5e1;
}
.mp-new-welcome-diamond {
  font-size: 10px;
  color: #94a3b8;
}
.mp-new-welcome-label {
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 6px;
}
.mp-new-welcome-judul {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}
.mp-new-welcome-tamu {
  font-size: 14px;
  font-weight: 600;
  color: #1a2e45;
  margin-bottom: 10px;
}
.mp-new-welcome-pesan {
  font-size: 12px;
  color: #475569;
  line-height: 1.6;
  max-width: 280px;
  margin: 0;
}
.mp-new-card {
  border: 1.5px solid var(--c-border, #1a2e45);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mp-new-card--bride {
  background: #ffecf2;
}
.mp-new-card--groom {
  background: #ecefff;
}
.mp-new-card-photo-wrap {
  width: 100%;
  border-bottom: 1px solid var(--c-border, #1a2e45);
  overflow: hidden;
  flex-shrink: 0;
}
.mp-new-card-photo {
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 4;
  display: block;
  object-fit: cover;
  object-position: center top;
}
.mp-new-card-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 14px 18px;
  width: 100%;
  box-sizing: border-box;
}
.mp-new-card-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #64748b;
  margin: 0;
  text-transform: uppercase;
}
.mp-new-card-name {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  color: #1a1a2e;
  margin: 0;
  line-height: 1.2;
}
.mp-new-card-bio {
  font-size: 13px;
  color: #475569;
  text-align: center;
  margin: 0;
  line-height: 1.4;
}
.mp-new-card-ig {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 999px;
  border: 1.5px solid var(--c-border, #1a2e45);
  text-decoration: none;
  color: var(--c-border, #1a2e45);
  margin-top: 2px;
}
.mp-new-card-ig--bride {
  background: #fec6c6;
}
.mp-new-card-ig--groom {
  background: #c6dcfe;
}
.mp-hero-duo {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0;
  position: relative;
}
.mp-hero-person {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}
.mp-hero-img-ring {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  background: #fff;
}
@media (min-width: 600px) and (max-aspect-ratio: 4/3) {
  .mp-hero-img-ring {
    width: 120px;
    height: 120px;
  }
  .mp-hero-label {
    font-size: 12px;
  }
  .mp-hero-amp {
    font-size: 36px;
  }
  .mp-card-name {
    font-size: 18px;
  }
  .mp-card-label {
    font-size: 11px;
  }
  .mp-card-fullname {
    font-size: 13px;
  }
  .mp-card-bio {
    font-size: 12px;
  }
  .mp-card-ig {
    font-size: 13px;
    padding: 7px 14px;
  }
  .mp-cards-row {
    gap: 14px;
    padding: 18px 6px 6px;
  }
  .mp-card {
    padding: 18px 14px;
    border-radius: 18px;
  }
}
.mp-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.mp-hero-label {
  font-size: 10px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
}
.mp-hero-amp {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  font-size: 28px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  line-height: 1;
  pointer-events: none;
}
.mp-cards-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 14px 4px 4px;
}
.mp-card {
  background: #f8fafc;
  border-radius: 14px;
  padding: 14px 10px;
  text-align: center;
  border: 1.5px solid var(--c-border, #1a2e45);
}
.mp-card-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--c-efek);
  margin-bottom: 4px;
}
.mp-card-name {
  font-size: 14px;
  font-weight: 800;
  color: var(--c-text);
  line-height: 1.3;
}
.mp-card-fullname {
  font-size: 11px;
  color: #64748b;
  margin-top: 3px;
}
.mp-card-bio {
  font-size: 10px;
  color: #94a3b8;
  margin-top: 5px;
  line-height: 1.4;
  font-style: italic;
}
.mp-card-ig {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: white;
  padding: 5px 10px;
  border-radius: 50px;
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
  margin-top: 8px;
  transition: filter 0.15s;
}
.mp-card-ig:hover {
  filter: brightness(1.1);
}

/* ══ CUSTOM MODAL HEADER ══ */
.modal-custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 0;
  min-height: 52px;
  margin: 0;
}
.modal-custom-header-title {
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.3px;
}
.modal-custom-close {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 1;
  transition: background 0.15s;
  flex-shrink: 0;
}
.modal-custom-close:hover {
  background: rgba(0, 0, 0, 0.45);
}
.modal-body-inner {
  padding: 16px;
  overflow-y: auto;
  flex: 1 1 auto;
  min-height: 0;
  -webkit-overflow-scrolling: touch;
}

/* ══ MODAL BODY TEXT COLOR ══ */
/* Apply c-text only to section headings and titles inside modal bodies */
:deep(.modal-body-text),
.modal-timeline-activity,
.modal-story-title,
.modal-contact-name,
.modal-profile-name,
.modal-profile-fullname,
.modal-timeline-time,
.mp-card-name,
.maps-venue-name,
.modal-section-item-title {
  color: var(--c-text);
}

/* ══ RSVP Native Select ══ */
.rsvp-select {
  display: block;
  width: 100%;
  padding: 9px 36px 9px 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--c-text, #1a2e45);
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231a2e45' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  border: 1.5px solid var(--c-border, #1a2e45);
  border-radius: 8px;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
}
.rsvp-select:focus {
  border-color: var(--c-tombol, #7c3aed);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}
.rsvp-select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Force modal inputs & textareas to use custom border and focus shadow */
.cmodal-box input,
.cmodal-box textarea {
  border-color: var(--c-border, #1a2e45) !important;
}
.cmodal-box input:focus,
.cmodal-box textarea:focus {
  border-color: var(--c-tombol, #7c3aed) !important;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12) !important;
}

/* ══ COUNTDOWN ══ */
.countdown-wrap {
  background: var(--c-popup, #1a2e45);
  border-radius: 14px;
  padding: 14px 10px;
  text-align: center;
}
.countdown-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
.countdown-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
}
.countdown-num {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
}
.countdown-lbl {
  font-size: 9px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}
.countdown-sep {
  font-size: 22px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.4);
  padding-bottom: 14px;
  line-height: 1;
  padding-left: 2px;
  padding-right: 2px;
}

/* ══ UNIVERSAL CUSTOM BTN ══ */
.modal-custom-btn {
  display: block;
  width: 100%;
  padding: 12px 20px;
  margin-bottom: 20px;
  border: 2px solid var(--c-border, #1a2e45);
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  /* Gradient */
  background: linear-gradient(to bottom, #9a5cff 0%, #7c3aed 55%, #6d28d9 100%);

  /* Efek 3D */
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    0 6px 0 var(--c-tombol),
    0 7px 14px rgba(0, 0, 0, 0.18);
}

.modal-custom-btn:hover {
  transform: translateY(-1px);
}

.modal-custom-btn:active {
  transform: translateY(3px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    0 1px 0 #5b21b6,
    0 3px 6px rgba(0, 0, 0, 0.18);
}

/* ══ GIFT CARD ══ */
.gift-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.gift-bank-card {
  background: linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 50%, #d8d8d8 100%);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  position: relative;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.gift-bank-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}
.gift-bank-chip {
  position: relative;
  width: 70px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(113deg, #d5ac3f 0%, #ffe088 50%, #c18c01 100%);
}
.gift-chip-line {
  position: absolute;
  background-color: #a17712;
  border-radius: 4px;
}
.gift-chip-line--h {
  height: 1px;
  left: 0;
  right: 0;
}
.gift-chip-line--v {
  width: 1px;
  top: 0;
  bottom: 0;
}
.gift-chip-line--top {
  top: 25%;
}
.gift-chip-line--bottom {
  bottom: 25%;
}
.gift-chip-line--mid-left {
  left: 0;
  right: 70%;
  top: 50%;
}
.gift-chip-line--mid-right {
  left: 70%;
  right: 0;
  top: 50%;
}
.gift-chip-line--left {
  left: 30%;
}
.gift-chip-line--right {
  right: 30%;
}
.gift-bank-logo {
  height: 50px;
  width: auto;
  max-width: 100px;
  border-radius: 10px;
  object-fit: contain;
}
.gift-bank-name {
  font-size: 13px;
  font-weight: 700;
  color: #333;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.gift-bank-number {
  font-size: 18px;
  font-weight: 700;
  color: #222;
  letter-spacing: 2px;
  font-family: monospace;
}
.gift-bank-holder {
  font-size: 12px;
  color: #555;
}
.gift-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gift-btn-salin {
  display: inline-block;
  width: fit-content;
  padding: 6px 16px;
  border-radius: 8px;
  border: none;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  transition:
    filter 0.15s,
    background 0.2s;
  margin: 6px 0 2px;
  text-align: center;
}
.gift-btn-konfirmasi {
  display: block;
  width: 100%;
  text-align: center;
  padding: 12px;
  border-radius: 50px;
  border: none;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  transition: filter 0.15s;
  margin-top: 10px;
}
.gift-btn-salin:hover,
.gift-btn-konfirmasi:hover {
  filter: brightness(1.1);
}

/* ══ MAPS REDESIGN ══ */
.maps-iframe-wrapper {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid var(--c-border, #1a2e45);
  margin-bottom: 14px;
  background: #eee;
}
.maps-iframe-wrapper iframe {
  width: 100%;
  height: 100%;
}
.maps-info-center {
  text-align: center;
  margin-bottom: 14px;
}
.maps-venue-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}
.maps-venue-address {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

/* ══ TOMBOL KANAN ATAS (Lampu + Musik + Contact) ══ */
.right-btns {
  position: absolute;
  top: 4%;
  right: 4%;
  z-index: 55;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

/* Base bulat — semua tombol kanan atas */
.side-btn {
  width: clamp(40px, 5.5dvh, 80px);
  height: clamp(40px, 5.5dvh, 80px);
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    background 0.2s,
    border-color 0.2s,
    opacity 0.2s;
  flex-shrink: 0;
  position: relative;
  overflow: visible;
}
.side-btn svg {
  width: clamp(20px, 2.8dvh, 40px);
  height: clamp(20px, 2.8dvh, 40px);
}
.side-btn:hover {
  transform: scale(1.1);
}

/* ON: background warna tombol, border custom saja — tanpa efek glow */
.side-btn--active {
  background: var(--btn-color, #7c3aed) !important;
  border: 2px solid var(--btn-border, #1a2e45) !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

@media (min-width: 600px) and (max-aspect-ratio: 4/3) {
  /* Drawer 9:16 full tinggi layar — semua UI proporsional pakai clamp(dvh) */
  .right-btns {
    gap: clamp(10px, 1.5dvh, 20px);
    top: 2.5%;
    right: 2.5%;
  }
  .hamburger-btn {
    top: 2.5%;
    left: 2.5%;
  }
  .ucapan-icon-btn {
    width: clamp(42px, 6.5dvh, 88px);
    height: clamp(42px, 6.5dvh, 88px);
  }
  .ucapan-icon-btn svg {
    width: clamp(18px, 2.8dvh, 38px);
    height: clamp(18px, 2.8dvh, 38px);
  }
  .ucapan-pill-btn {
    height: clamp(42px, 6.5dvh, 88px);
    font-size: clamp(12px, 2dvh, 24px);
    padding: 0 clamp(14px, 2.4dvh, 32px);
    border-radius: clamp(42px, 6.5dvh, 88px);
  }
  .ucapan-btns {
    bottom: 2.5%;
    left: 2.5%;
    gap: clamp(8px, 1.2dvh, 16px);
  }
  .ucapan-wrap {
    bottom: 11%;
    left: 2.5%;
    right: 2.5%;
  }
  .ucapan-avatar {
    width: clamp(34px, 5dvh, 54px);
    height: clamp(34px, 5dvh, 54px);
    font-size: clamp(14px, 2.2dvh, 22px);
  }
  .ucapan-bubble {
    padding: clamp(10px, 1.8dvh, 24px) clamp(12px, 2.2dvh, 28px);
    border-radius: clamp(14px, 2.2dvh, 26px);
    max-width: 80%;
  }
  .ucapan-nama {
    font-size: clamp(13px, 2.2dvh, 24px);
  }
  .ucapan-text {
    font-size: clamp(12px, 2dvh, 22px);
    line-height: 1.55;
  }
}

/* Modal styles moved to global <style> block below */

/* Tombol menggunakan clamp() agar proporsional di semua ukuran frame */
.modal-custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 18px;
  flex-shrink: 0;
}
.modal-custom-header-title {
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.3px;
}
.modal-custom-close {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.22);
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 1;
  transition: background 0.15s;
  flex-shrink: 0;
}
/* ══ WELCOME MODAL ══ */
.welcome-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(3px);
  box-sizing: border-box;
}
.welcome-box {
  background: #fff;
  border-radius: 20px;
  width: calc(100% - 32px);
  max-width: 340px;
  max-height: 82%;
  overflow-y: auto;
  padding: 24px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}
.welcome-box::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, var(--c-tombol), var(--c-efek));
}
.welcome-deco-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.welcome-deco-line {
  display: block;
  height: 1px;
  width: 36px;
  background: linear-gradient(to right, transparent, #ccc);
}
.welcome-deco-line:last-child {
  background: linear-gradient(to left, transparent, #ccc);
}
.welcome-deco-star {
  font-size: 12px;
  color: #bbb;
}
.welcome-icon {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
.welcome-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 6px;
}
.welcome-greeting {
  font-size: 15px;
  color: #666;
  margin-bottom: 4px;
}
.welcome-name {
  font-size: 22px;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 14px;
  word-break: break-word;
}
.welcome-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
.welcome-divider span:not(.welcome-diamond) {
  display: block;
  height: 1px;
  width: 40px;
  background: #e2e8f0;
}
.welcome-diamond {
  font-size: 9px;
  color: #ccc;
}
.welcome-pesan {
  font-size: 12px;
  color: #888;
  line-height: 1.7;
  margin-bottom: 20px;
  padding: 0 4px;
}
.welcome-btn {
  width: 100%;
  padding: 13px 20px;
  border-radius: 12px;
  border: 2px solid var(--c-border, #1a2e45);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition:
    filter 0.15s,
    transform 0.15s;
}
.welcome-btn:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}
/* Welcome pop transition */
.welcome-pop-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.welcome-pop-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.welcome-pop-enter-from {
  opacity: 0;
  transform: scale(0.88);
}
.welcome-pop-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

/* ══ NOTIFIKASI LAMPU — TOOLTIP CARD (di dalam drawer) ══ */
.light-notif-card {
  position: absolute;
  /* Sejajar dengan tombol lampu: top ~4% + setengah tinggi tombol agar arrow tepat di tengah tombol */
  top: calc(4% + clamp(20px, 2.75dvh, 40px) - 18px);
  right: calc(4% + clamp(40px, 5.5dvh, 80px) + 12px);
  z-index: 60;
  background: #fff;
  border-radius: 14px;
  padding: clamp(10px, 1.5dvh, 14px) clamp(12px, 1.8dvh, 16px)
    clamp(8px, 1.2dvh, 10px);
  max-width: clamp(140px, 26%, 200px);
  min-width: 120px;
  box-shadow:
    0 6px 24px rgba(0, 0, 0, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--c-border, #1a2e45);
  cursor: pointer;
  pointer-events: auto;
}
/* Arrow menunjuk ke KANAN — ke arah tombol lampu */
.light-notif-card::after {
  content: "";
  position: absolute;
  top: 14px;
  right: -10px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 10px solid var(--c-border, #1a2e45);
}
.light-notif-card::before {
  content: "";
  position: absolute;
  top: 16px;
  right: -7px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 8px solid #fff;
  z-index: 1;
}
.light-notif-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 6px;
}
.light-notif-icon-wrap {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.light-notif-title {
  font-size: clamp(11px, 1.6dvh, 14px);
  font-weight: 800;
  color: var(--c-text, #1a2e45);
  line-height: 1;
}
.light-notif-desc {
  font-size: clamp(10px, 1.4dvh, 12px);
  color: #444;
  line-height: 1.45;
  margin-bottom: 6px;
}
.light-notif-hint {
  font-size: clamp(9px, 1.2dvh, 10px);
  color: #aaa;
  font-style: italic;
  text-align: right;
}
.notif-fade-enter-active,
.notif-fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.notif-fade-enter-from,
.notif-fade-leave-to {
  opacity: 0;
  transform: translateX(12px);
}

/* ══ UCAPAN BUBBLE WELCOME ══ */
.ucapan-bubble--welcome {
  border-color: var(--c-border, #1a2e45);
  background: #fff;
}

/* ══ UCAPAN EMPTY STATE CARD ══ */
.ucapan-empty-card {
  position: absolute;
  bottom: 11%;
  left: 3%;
  right: 3%;
  z-index: 30;
  background: rgba(255, 255, 255, 0.95);
  border-radius: clamp(12px, 1.8dvh, 20px);
  padding: clamp(10px, 1.5dvh, 18px) clamp(12px, 1.8dvh, 22px);
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  border: 2px solid var(--c-border, #1a2e45);
  max-width: 78%;
}
.ucapan-empty-text {
  font-size: clamp(11px, 1.6dvh, 16px);
  color: #333;
  line-height: 1.5;
  margin-bottom: clamp(8px, 1.2dvh, 14px);
}
.ucapan-empty-btn {
  display: inline-block;
  padding: clamp(6px, 0.9dvh, 10px) clamp(14px, 2dvh, 22px);
  border-radius: 50px;
  border: 2px solid var(--c-border, #1a2e45);
  background: var(--c-border, #1a2e45);
  color: #fff;
  font-size: clamp(11px, 1.5dvh, 15px);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  box-shadow:
    0 5px 0 rgba(0, 0, 0, 0.35),
    0 8px 15px rgba(0, 0, 0, 0.2);
}

.ucapan-empty-btn:hover {
  transform: translateY(-2px);
}

.ucapan-empty-btn:active {
  transform: translateY(5px);
  box-shadow:
    0 0 0 rgba(0, 0, 0, 0.35),
    0 2px 5px rgba(0, 0, 0, 0.2);
}

/* ══ HAMBURGER BUTTON (pojok kiri atas) ══ */
.hamburger-btn {
  position: absolute;
  top: 4%;
  left: 4%;
  z-index: 55;
  width: clamp(40px, 5.5dvh, 80px);
  height: clamp(40px, 5.5dvh, 80px);
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s;
  flex-shrink: 0;
}
.hamburger-btn svg {
  width: clamp(20px, 2.8dvh, 40px);
  height: clamp(20px, 2.8dvh, 40px);
}
.hamburger-btn:hover {
  transform: scale(1.1);
}

/* ══ MENU PANEL - FULL OVERLAY CARD STYLE ══ */
.menu-backdrop {
  position: fixed !important;
  inset: 0 !important;
  z-index: 99998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(2px);
}
.menu-panel {
  width: 100%;
  max-width: min(420px, calc(100vw - 32px));
  max-height: min(75dvh, calc(100dvh - 80px));
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  border-radius: 20px;
  overflow: clip;
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.35);
  border: 2.5px solid var(--c-border, #1a2e45);
}
.menu-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 10px;
  flex-shrink: 0;
}
.menu-panel-title {
  font-size: 22px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.2px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}
.menu-panel-close {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 1;
  transition: background 0.15s;
  flex-shrink: 0;
}
.menu-panel-close:hover {
  background: rgba(0, 0, 0, 0.25);
}
.menu-panel-sub {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  padding: 0 20px 14px;
  flex-shrink: 0;
}
.menu-panel-body {
  overflow-y: auto;
  flex: 1;
  padding: 12px 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Footer panel — selalu visible di bawah, tidak ikut scroll */
.menu-panel-footer {
  flex-shrink: 0;
  padding: 10px 12px 12px;
  border-top: 1px solid #ebebeb;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.menu-section-label {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  text-align: center;
  margin-bottom: 6px;
}
.menu-music-section,
.menu-social-section {
  padding: 12px 14px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}
.menu-music-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  background: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  border: 1.5px solid var(--c-border, #1a2e45);
}
.menu-social-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.menu-social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #fff;
  border: 1.5px solid var(--c-border, #1a2e45);
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    transform 0.15s;
  flex: 1 1 calc(50% - 4px);
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.menu-social-btn--full {
  flex-basis: 100%;
}
.menu-social-btn:hover {
  background: #f0faf9;
  border-color: var(--c-tombol, #7ecec4);
  transform: translateY(-1px);
}
.menu-brand-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 0 4px;
  margin-top: 4px;
  border-top: 1px solid #ececec;
}
.menu-brand-text {
  font-size: 10px;
  color: #9ca3af;
  font-weight: 500;
}
.menu-brand-logo-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.menu-brand-logo {
  height: 34px;
  width: auto;
  object-fit: contain;
  opacity: 0.95;
}
.menu-brand-name {
  font-size: 17px;
  font-weight: 800;
  color: #1a2e45;
  letter-spacing: 0.2px;
}
.menu-brand-copy {
  font-size: 10px;
  color: #b0b0b0;
  font-weight: 400;
  margin-top: 2px;
  text-align: center;
}
/* Setiap kartu menu */
.menu-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border-radius: 16px;
  padding: 12px 14px;
  border: 2px solid var(--c-border, #1a2e45);
  cursor: pointer;
  text-align: left;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  transition:
    transform 0.15s,
    box-shadow 0.15s;
  width: 100%;
}
.menu-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
.menu-card-img-wrap {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-card-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
}
.menu-card-info {
  flex: 1;
  min-width: 0;
}
.menu-card-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--c-text, #1a2e45);
  margin-bottom: 3px;
  line-height: 1.2;
}
.menu-card-desc {
  font-size: 12px;
  color: #888;
  line-height: 1.4;
}
.menu-card-arrow {
  flex-shrink: 0;
  opacity: 0.6;
}
/* Menu transition */
.menu-slide-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.34, 1.1, 0.64, 1);
}
.menu-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.menu-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* ══ UCAPAN FADE TRANSITION ══ */
.ucapan-fade-enter-active {
  transition: opacity 0.4s ease;
}
.ucapan-fade-leave-active {
  transition: opacity 0.3s ease;
}
.ucapan-fade-enter-from {
  opacity: 0;
}
.ucapan-fade-leave-to {
  opacity: 0;
}

/* ══ UCAPAN CHAT BUBBLES ══ */
.ucapan-wrap {
  position: absolute;
  bottom: 11%;
  left: 3%;
  right: 3%;
  z-index: 30;
  pointer-events: none;
}
.ucapan-row {
  display: flex;
  align-items: flex-end;
  gap: clamp(6px, 1dvh, 12px);
}
.ucapan-avatar {
  flex-shrink: 0;
  width: clamp(30px, 4.4dvh, 48px);
  height: clamp(30px, 4.4dvh, 48px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(13px, 2dvh, 20px);
  font-weight: 800;
  color: #fff;
  border: 2.5px solid var(--c-border, #1a2e45);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
}
.ucapan-bubble {
  position: relative;
  background: #fff;
  border-radius: clamp(12px, 1.8dvh, 18px);
  padding: clamp(8px, 1.2dvh, 16px) clamp(12px, 1.8dvh, 22px);
  box-shadow:
    0 6px 24px rgba(0, 0, 0, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.1);
  display: inline-block;
  max-width: 72%;
  word-break: break-word;
  border: 2px solid var(--c-border, #1a2e45);
}
/* Ekor bubble menunjuk ke KIRI — ke arah avatar, ala tooltip Efek Cahaya */
.ucapan-bubble::after {
  content: "";
  position: absolute;
  bottom: clamp(10px, 1.6dvh, 16px);
  left: -10px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 10px solid var(--c-border, #1a2e45);
}
.ucapan-bubble::before {
  content: "";
  position: absolute;
  bottom: calc(clamp(10px, 1.6dvh, 16px) + 2px);
  left: -7px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 7px solid transparent;
  border-right: 8px solid #fff;
  z-index: 1;
}
.ucapan-nama {
  font-size: clamp(11px, 1.8dvh, 20px);
  font-weight: 700;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.ucapan-text {
  font-size: clamp(10px, 1.6dvh, 18px);
  color: #333;
  line-height: 1.45;
  word-break: break-word;
}

/* ══ TOMBOL UCAPAN (bawah kiri) ══ */
.ucapan-btns {
  position: absolute;
  bottom: 3%;
  left: 3%;
  z-index: 55;
  display: flex;
  align-items: center;
  gap: 6px;
}
.ucapan-icon-btn {
  width: clamp(38px, 5dvh, 70px);
  height: clamp(38px, 5dvh, 70px);
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s;
  flex-shrink: 0;
}
.ucapan-icon-btn svg {
  width: clamp(16px, 2.2dvh, 30px);
  height: clamp(16px, 2.2dvh, 30px);
}
.ucapan-icon-btn:hover {
  transform: scale(1.08);
}
.ucapan-pill-btn {
  height: clamp(38px, 5dvh, 70px);
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  padding: 0 clamp(14px, 2dvh, 26px);
  font-size: clamp(11px, 1.6dvh, 20px);
  font-weight: 700;
  letter-spacing: 0.2px;
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.15s;
}
.ucapan-pill-btn:hover {
  filter: brightness(1.1);
}

.modal-custom-close:hover {
  background: rgba(0, 0, 0, 0.42);
}
.modal-body-inner {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
  min-height: 0; /* penting! agar flex child bisa scroll */
  -webkit-overflow-scrolling: touch;
}
/* Modal transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease;
}
.modal-fade-enter-active .cmodal-box,
.modal-fade-leave-active .cmodal-box {
  transition:
    transform 0.22s cubic-bezier(0.34, 1.1, 0.64, 1),
    opacity 0.22s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .cmodal-box {
  transform: scale(0.92);
  opacity: 0;
}
.modal-fade-leave-to .cmodal-box {
  transform: scale(0.92);
  opacity: 0;
}
</style>

<!-- Global styles untuk modal yang di-Teleport ke body (tidak bisa pakai scoped) -->
<style>
.teleport-modal-root {
  /* Agar CSS vars custom color tetap jalan */
}

/* ══ MODAL BACKDROP & BOX (global, di-teleport ke body) ══ */
.cmodal-backdrop {
  position: fixed !important;
  inset: 0 !important;
  background: rgba(0, 0, 0, 0.65);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}
.cmodal-box {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  /* Lebar tidak boleh melebihi drawer — pakai min dari 420px vs lebar viewport */
  max-width: min(420px, calc(100vw - 32px));
  /* Tinggi max 85dvh — sisakan ruang agar tidak keluar drawer */
  max-height: min(75dvh, calc(100dvh - 80px));
  /* overflow clip: border-radius tetap jalan tapi tidak block scroll child */
  overflow: clip;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.35);
  border: 2.5px solid var(--c-border, #1a2e45);
}
/* Gift modal lebih tinggi */
.cmodal-box--gift {
  max-height: min(90dvh, calc(100dvh - 40px));
}
@media (max-width: 480px) {
  .cmodal-box--gift {
    max-height: min(88dvh, calc(100dvh - 40px));
  }
}
/* Header tidak boleh mengecil */
.cmodal-box .modal-custom-header {
  flex-shrink: 0;
}
/* Body: isi sisa ruang & scroll kalau konten panjang */
.cmodal-box .modal-body-inner {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
}
@media (max-width: 480px) {
  .cmodal-backdrop {
    padding: 16px;
  }
  .cmodal-box {
    /* Di HP: lebar = viewport - padding kiri kanan (32px total) */
    max-width: calc(100vw - 32px);
    /* Tinggi max 82dvh — sisakan ruang di atas & bawah agar tidak keluar drawer */
    max-height: min(72dvh, calc(100dvh - 80px));
    border-radius: 16px;
  }
}
/* Tablet / iPad: modal lebih lebar & elemen lebih besar */
@media (min-width: 600px) and (max-aspect-ratio: 4/3) {
  .cmodal-backdrop {
    padding: 32px;
  }
  .cmodal-box {
    max-width: min(620px, 90vw);
    max-height: calc(100dvh - 120px);
    border-radius: 28px;
  }
  .modal-custom-header {
    padding: 20px 24px;
  }
  .modal-custom-header-title {
    font-size: 22px;
  }
  .modal-custom-close {
    width: 36px;
    height: 36px;
    font-size: 15px;
  }
  .modal-body-inner {
    padding: 22px;
  }
  .modal-custom-btn {
    font-size: 16px;
    padding: 14px 20px;
    border-radius: 14px;
  }
}

/* Modal header & close — global */
.modal-custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 18px;
  flex-shrink: 0;
}
.modal-custom-header-title {
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.3px;
}
.modal-custom-close {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.22);
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 1;
  transition: background 0.15s;
  flex-shrink: 0;
}
.modal-custom-close:hover {
  background: rgba(0, 0, 0, 0.42);
}
.modal-body-inner {
  padding: 16px;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.modal-custom-btn {
  display: block;
  width: 100%;
  padding: 11px 16px;
  border-radius: 12px;
  border: 2px solid var(--c-border, #1a2e45);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: filter 0.15s;
}
.modal-custom-btn:hover {
  filter: brightness(1.08);
}

/* ══ WELCOME MODAL (global) ══ */
.welcome-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(3px);
  box-sizing: border-box;
}
.welcome-box {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 24px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
  border: 2.5px solid var(--c-border, #1a2e45);
}
@media (max-width: 480px) {
  .welcome-backdrop {
    padding: 16px;
  }
  .welcome-box {
    max-width: 100%;
    max-height: 88vh;
  }
}
@media (min-width: 600px) and (max-aspect-ratio: 4/3) {
  .welcome-backdrop {
    padding: 40px;
  }
  .welcome-box {
    max-width: min(520px, 88vw);
    padding: 32px 28px 28px;
    border-radius: 28px;
  }
  .welcome-name {
    font-size: 28px;
  }
  .welcome-btn {
    font-size: 16px;
    padding: 16px 24px;
    border-radius: 14px;
  }
  .welcome-icon {
    width: 72px;
    height: 72px;
  }
  .welcome-greeting {
    font-size: 17px;
  }
  .welcome-pesan {
    font-size: 14px;
  }
}

/* ══ MENU PANEL (global) ══ */
.menu-backdrop {
  position: fixed !important;
  inset: 0 !important;
  z-index: 99998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(2px);
}
.menu-panel {
  width: 100%;
  max-width: min(420px, calc(100vw - 32px));
  max-height: min(75dvh, calc(100dvh - 80px));
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  border-radius: 20px;
  overflow: clip;
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.35);
  border: 2.5px solid var(--c-border, #1a2e45);
}
@media (max-width: 480px) {
  .menu-backdrop {
    padding: 12px;
  }
  .menu-panel {
    max-width: 100%;
    max-height: min(80vh, calc(100% - 40px));
  }
}
@media (min-width: 600px) and (max-aspect-ratio: 4/3) {
  .menu-backdrop {
    padding: 24px;
  }
  .menu-panel {
    max-width: min(480px, calc(100% - 48px));
    max-height: min(80vh, calc(100% - 80px));
    border-radius: 28px;
  }
  .menu-panel-title {
    font-size: 26px;
  }
  .menu-panel-close {
    width: 38px;
    height: 38px;
    font-size: 15px;
  }
  .menu-panel-header {
    padding: 22px 24px 12px;
  }
  .menu-panel-body {
    padding: 14px 14px 20px;
    gap: 12px;
  }
  .menu-card {
    padding: 16px 18px;
    gap: 18px;
    border-radius: 20px;
  }
  .menu-card-img-wrap {
    width: 68px;
    height: 68px;
    border-radius: 14px;
  }
  .menu-card-title {
    font-size: 17px;
  }
  .menu-card-desc {
    font-size: 13px;
  }
}

/* ══════════════════════════════════════════════════════
   MODAL POPUP TRANSITION — springy bounce + blur masuk
   ══════════════════════════════════════════════════════ */

/* — Backdrop: fade + blur cepat — */
.modal-fade-enter-active {
  transition:
    opacity 0.32s ease,
    backdrop-filter 0.32s ease;
}
.modal-fade-leave-active {
  transition:
    opacity 0.22s ease,
    backdrop-filter 0.22s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* — Box masuk: spring bounce dari bawah (naik + scale) — */
.modal-fade-enter-active .cmodal-box {
  animation: modalPopIn 0.48s cubic-bezier(0.22, 1.4, 0.36, 1) both;
}
/* — Box keluar: shrink + turun + fade — */
.modal-fade-leave-active .cmodal-box {
  animation: modalPopOut 0.22s cubic-bezier(0.4, 0, 1, 1) both;
}

@keyframes modalPopIn {
  0% {
    opacity: 0;
    transform: scale(0.78) translateY(48px);
    filter: blur(6px);
  }
  55% {
    opacity: 1;
    filter: blur(0px);
  }
  75% {
    transform: scale(1.035) translateY(-6px);
  }
  88% {
    transform: scale(0.985) translateY(2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0px);
  }
}

@keyframes modalPopOut {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0px);
  }
  100% {
    opacity: 0;
    transform: scale(0.88) translateY(28px);
    filter: blur(4px);
  }
}

/* — Welcome box khusus: bounce dari bawah juga — */
.modal-fade-enter-active .welcome-box {
  animation: modalPopIn 0.48s cubic-bezier(0.22, 1.4, 0.36, 1) both;
}
.modal-fade-leave-active .welcome-box {
  animation: modalPopOut 0.22s cubic-bezier(0.4, 0, 1, 1) both;
}

/* ══ Menu slide transition — masuk dari atas dengan spring ══ */
.menu-slide-enter-active {
  transition: opacity 0.35s ease;
}
.menu-slide-leave-active {
  transition: opacity 0.22s ease;
}
.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;
}
.menu-slide-enter-active .menu-panel {
  animation: menuSlideIn 0.42s cubic-bezier(0.22, 1.35, 0.36, 1) both;
}
.menu-slide-leave-active .menu-panel {
  animation: menuSlideOut 0.2s cubic-bezier(0.4, 0, 1, 1) both;
}

@keyframes menuSlideIn {
  0% {
    opacity: 0;
    transform: translateY(-36px) scale(0.94);
    filter: blur(4px);
  }
  60% {
    opacity: 1;
    filter: blur(0px);
  }
  80% {
    transform: translateY(6px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
}

@keyframes menuSlideOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
  100% {
    opacity: 0;
    transform: translateY(-24px) scale(0.94);
    filter: blur(3px);
  }
}

/* ══ Welcome pop transition — bouncy masuk, shrink keluar ══ */
.welcome-pop-enter-active {
  transition: opacity 0.38s ease;
}
.welcome-pop-leave-active {
  transition: opacity 0.22s ease;
}
.welcome-pop-enter-from,
.welcome-pop-leave-to {
  opacity: 0;
}
.welcome-pop-enter-active .welcome-box {
  animation: welcomePopIn 0.5s cubic-bezier(0.22, 1.45, 0.36, 1) both;
}
.welcome-pop-leave-active .welcome-box {
  animation: welcomePopOut 0.22s cubic-bezier(0.4, 0, 1, 1) both;
}

@keyframes welcomePopIn {
  0% {
    opacity: 0;
    transform: scale(0.72) translateY(40px);
    filter: blur(8px);
  }
  50% {
    opacity: 1;
    filter: blur(0px);
  }
  70% {
    transform: scale(1.045) translateY(-8px);
  }
  85% {
    transform: scale(0.975) translateY(3px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0px);
  }
}

@keyframes welcomePopOut {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0px);
  }
  100% {
    opacity: 0;
    transform: scale(0.82) translateY(20px);
    filter: blur(5px);
  }
}

/* ══════════════════════════════════════════════════════════ */
/* ══ OVERRIDE: dari "phone-frame" fixed jadi scroll page biasa ══ */
/* ══════════════════════════════════════════════════════════ */
.invitation-root {
  position: relative !important;
  inset: auto !important;
  min-height: 100dvh !important;
  width: 100% !important;
  max-width: 480px !important;
  margin: 0 auto !important;
  overflow-x: hidden !important;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.15) !important;
}

/* Cover (layar sebelum undangan dibuka) + loading di dalamnya (cover-pixel-loading pakai
   inset:0 relatif ke cover-wrap) — disamain persis dengan lebar .invitation-root (480px)
   biar nggak ada mismatch ukuran antara cover/loading dengan isi undangan pas di-scroll. */
.cover-wrap {
  top: 0 !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 100% !important;
  max-width: 480px !important;
  height: 100dvh !important;
  aspect-ratio: auto !important;
  border-radius: 0 !important;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.15) !important;
}

/* Tombol & bubble fixed ke viewport secara vertikal (biar tetap keliatan pas discroll),
   tapi horizontalnya dihitung supaya nempel ke tepi FRAME HP (max-width 480px, center),
   bukan ke tepi browser. Di mobile (viewport < ~512px) otomatis balik ke tepi layar biasa
   karena hasil calc-nya jadi negatif/kecil dan max() milih 16px.
   PENTING: !important wajib di semua nilai top/left/right/bottom di sini, karena rule
   aslinya ada di <style scoped> yang punya spesifisitas lebih tinggi (atribut data-v-xxxx
   otomatis ditambah Vue), sedangkan blok override ini ada di <style> global biasa. */
.right-btns,
.hamburger-btn,
.ucapan-wrap,
.ucapan-btns,
.ucapan-empty-card {
  position: fixed !important;
}
.right-btns {
  bottom: max(16px, 3%) !important;
  top: auto !important;
  right: max(16px, calc(50vw - 240px + 16px)) !important;
}
.hamburger-btn {
  top: max(16px, 3%) !important;
  left: max(16px, calc(50vw - 240px + 16px)) !important;
}
/* Tombol +, panah, Lihat/Sembunyikan Ucapan dihapus */
.ucapan-btns {
  display: none !important;
}
/* Bubble chat "Silahkan konfirmasi kehadiran..." dihapus */
.ucapan-wrap,
.ucapan-empty-card {
  display: none !important;
}
/* Tombol WA melayang (quick-jump ke section contact) dihapus — udah ada tombol WA
   di dalam section contact-nya sendiri (.modal-contact-btn) */
.right-btns button[title="Hubungi Kami"] {
  display: none !important;
}
/* Quotes: box background dihapus juga, biar cuma teks quote-nya aja yang tampil */
.mp-new-quotes-wrap {
  background: transparent !important;
  padding: 0 !important;
}

/* Tombol close di header — nggak perlu lagi karena bukan modal, section selalu tampil */
.inv-card .modal-custom-close {
  display: none;
}
/* Header navy (judul modal) & border card dihapus — yang ditampilkan cuma isinya aja,
   bukan style popup lagi */
.inv-card .modal-custom-header {
  display: none;
}
.inv-card {
  border: none !important;
}

/* ══ SCROLL CONTAINER & SECTION CARD ══ */
/* Background dihapus dari sini — tiap section (inv-section) nanti punya bg sendiri-sendiri
   per elemen/per section, bukan satu gradient buat semua halaman */
.scroll-invitation {
  width: 100%;
}
.inv-section {
  min-height: 100dvh;
  padding: 28px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.inv-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border: 2px solid var(--c-border, #1a2e45);
}
.inv-card .modal-body-inner {
  padding: 18px 16px;
}

/* ══ SEMENTARA: bg beda-beda tiap section buat ngecek ukuran/tinggi halaman ══
   Hapus/ganti blok ini kalau desain background per-section yang asli udah siap. */
#sec-quotes { background: #fde68a; }
#sec-mempelai { background: #bfdbfe; }
#sec-acara { background: #fbcfe8; }
#sec-maps { background: #bbf7d0; }
#sec-rundown { background: #fed7aa; }
#sec-galeri { background: #ddd6fe; }
#sec-dresscode { background: #a5f3fc; }
#sec-lovestory { background: #fecaca; }
#sec-gift { background: #d9f99d; }
#sec-rsvp { background: #fde68a; }
#sec-contact { background: #bfdbfe; }
#sec-penutup { background: #fbcfe8; }


/* ══ SECTION PENUTUP / SALAM ══ */
.inv-section--salam {
  text-align: center;
  padding: 48px 24px 40px;
}
.salam-photo-wrap {
  width: 140px;
  height: 140px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--c-border, #1a2e45);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
.salam-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.salam-judul {
  font-size: 20px;
  font-weight: 800;
  color: var(--c-text, #1a2e45);
  margin-bottom: 14px;
}
.salam-text {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 10px;
}
.salam-hormat {
  font-size: 13px;
  color: #6b7280;
  margin-top: 18px;
}
.salam-signature {
  font-size: 22px;
  font-weight: 700;
  color: var(--c-tombol, #7c3aed);
  margin-top: 4px;
}


/* == MENU: dropdown list simpel, bukan modal kartu besar ==
   Backdrop cuma buat nangkep klik di luar (invisible, biar bisa nutup menu),
   panel-nya jadi list teks doang, nempel di bawah tombol hamburger. */
.menu-backdrop {
  background: transparent !important;
  backdrop-filter: none !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  padding: 0 !important;
}
.menu-panel {
  position: fixed !important;
  top: max(76px, calc(3% + 60px)) !important;
  left: max(16px, calc(50vw - 240px + 16px)) !important;
  width: min(260px, calc(100vw - 32px)) !important;
  max-width: none !important;
  max-height: none !important;
  background: #fff !important;
  border: none !important;
  border-radius: 14px !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18) !important;
}
/* Header/subtitle/tombol close dihapus - cukup klik di luar buat nutup menu */
.menu-panel-header,
.menu-panel-sub {
  display: none !important;
}
.menu-panel-body {
  padding: 8px !important;
  gap: 0 !important;
  overflow-y: visible !important;
  flex: none !important;
}
/* Tiap item jadi baris teks polos, dipisah garis tipis */
.menu-card {
  background: transparent !important;
  border: none !important;
  border-bottom: 1px solid #f0f0f0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 13px 10px !important;
}
.menu-card:last-child {
  border-bottom: none !important;
}
.menu-card:hover {
  background: #f7f7f7 !important;
  transform: none !important;
}
.menu-card-img-wrap,
.menu-card-desc,
.menu-card-arrow {
  display: none !important;
}
.menu-card-title {
  font-size: 16px !important;
  font-weight: 600 !important;
  margin-bottom: 0 !important;
}
.menu-panel-footer {
  background: transparent !important;
}
/* Blok musik + "Hubungi & Ikuti Kami" digabung lagi di halaman thanks (salam).
   Tampilan WM dibikin compact/professional biar tinggi halaman salam nggak jomplang
   sama halaman-halaman lain (yang semuanya min-height: 100dvh). */
.inv-section--salam .menu-music-section,
.inv-section--salam .menu-social-section {
  margin-top: 10px;
  padding: 8px 10px;
  text-align: left;
}
.inv-section--salam .menu-section-label {
  font-size: 9px;
  margin-bottom: 4px;
}
.inv-section--salam .menu-music-item {
  padding: 5px 8px;
  font-size: 11px;
  gap: 6px;
}
.inv-section--salam .menu-social-row {
  gap: 5px;
}
.inv-section--salam .menu-social-btn {
  padding: 6px 8px;
  font-size: 10px;
  gap: 4px;
}
.inv-section--salam .menu-brand-footer {
  align-items: center;
  padding: 8px 0 0;
  margin-top: 2px;
  gap: 4px;
}
.inv-section--salam .menu-brand-logo {
  height: 20px;
}
.inv-section--salam .menu-brand-name {
  font-size: 13px;
}
.inv-section--salam .menu-brand-text {
  font-size: 9px;
}
</style>