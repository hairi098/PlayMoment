// utils/page-defaults.js
import { SOFT_ROMANCE_URLS } from "~/config/soft-romance-assets";
// Model tema tipe "page": tiap halaman punya daftar elemen teks yang diklik lalu diedit lewat modal.
// Token {{nama_tamu}} diganti saat ditampilkan ke tamu.

// Naikkan angka ini kalau tampilan default tema berubah → editor membangun ulang halaman default SEKALI
// untuk data lama yang belum bernomor versi (perubahan manual di data lama akan hilang). Set ke 0 untuk mematikan.
export const PAGES_VERSION = 6;

export const PAGE_STAGE = { width: 360, height: 640 };

export const PAGE_FONTS = [
  { label: "Great Vibes", value: "'Great Vibes', cursive" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Lato", value: "'Lato', sans-serif" },
  { label: "Nunito", value: "'Nunito', sans-serif" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Marcellus", value: "'Marcellus', serif" },
  { label: "Work Sans", value: "'Work Sans', sans-serif" }
];

export const IMAGE_SHAPES = [
  { label: "Oval", value: "oval" },
  { label: "Lengkung (arch)", value: "arch" },
  { label: "Lingkaran", value: "circle" },
  { label: "Kotak", value: "rect" }
];

// Sumber gambar yang diizinkan: http(s) atau path situs sendiri (mis. /themes/soft-romance/x.png).
// Selain itu (javascript:, data:, //host) ditolak.
export function safeUrl(u) {
  const v = String(u ?? "").trim();
  const ok = /^https?:\/\//i.test(v) || /^\/(?!\/)[\w\-./%]+$/.test(v);
  if (!ok) return "";
  return v.replace(/["'()\\\s]/g, (c) => encodeURIComponent(c));
}

// ── Animasi memakai animate.css (https://animate.style) ──
// `value` = nama animasi animate.css TANPA awalan "animate__" (mis. "fadeInUp" → class animate__fadeInUp).
// Mau tambah animasi? Cukup tambahkan satu baris di ENTRANCES / LOOPS dengan nama dari animate.style — tidak perlu CSS lagi.
// Cara pasang: link CDN di bawah dimuat otomatis lewat useHead (TemaPage & PageEditor). Kalau mau lewat npm:
//   npm i animate.css  →  nuxt.config: css: ["animate.css/animate.min.css"]  lalu kosongkan ANIMATE_CSS_URL.
export const ANIMATE_CSS_URL = ""; // kosong = animate.css sudah dimuat lewat nuxt.config (css: ["animate.css/animate.min.css"]). Isi URL CDN (cdnjs .../animate.css/4.1.1/animate.min.css) kalau tidak pakai npm.
export const ANIM_NAME = /^[A-Za-z]{2,32}$/; // hanya huruf → aman dipasang sebagai nama class

export const ENTRANCES = [
  { label: "Tanpa", value: "" },
  { label: "Fade in", value: "fadeIn" },
  { label: "Naik (fade up)", value: "fadeInUp" },
  { label: "Turun (fade down)", value: "fadeInDown" },
  { label: "Dari kiri", value: "fadeInLeft" },
  { label: "Dari kanan", value: "fadeInRight" },
  { label: "Dari sudut kiri atas", value: "fadeInTopLeft" },
  { label: "Dari sudut kanan atas", value: "fadeInTopRight" },
  { label: "Zoom in", value: "zoomIn" },
  { label: "Zoom dari bawah", value: "zoomInUp" },
  { label: "Geser naik", value: "slideInUp" },
  { label: "Geser dari kiri", value: "slideInLeft" },
  { label: "Geser dari kanan", value: "slideInRight" },
  { label: "Memantul masuk", value: "bounceIn" },
  { label: "Memantul dari bawah", value: "bounceInUp" },
  { label: "Balik horizontal", value: "flipInX" },
  { label: "Balik vertikal", value: "flipInY" },
  { label: "Berputar masuk", value: "rotateIn" },
  { label: "Back in (naik)", value: "backInUp" },
  { label: "Light speed", value: "lightSpeedInRight" },
  { label: "Jack in the box", value: "jackInTheBox" },
  { label: "Roll in", value: "rollIn" }
];
// Gerak berulang. Empat pertama gerakan khusus tema (CSS sendiri), sisanya animate.css (infinite).
export const CUSTOM_LOOPS = ["wave-left", "wave-right", "float", "fly"];
export const LOOPS = [
  { label: "Diam", value: "" },
  { label: "Goyang kiri", value: "wave-left" },
  { label: "Goyang kanan", value: "wave-right" },
  { label: "Melayang", value: "float" },
  { label: "Terbang melintas", value: "fly" },
  { label: "Berdenyut (pulse)", value: "pulse" },
  { label: "Berayun (swing)", value: "swing" },
  { label: "Detak jantung", value: "heartBeat" },
  { label: "Memantul (bounce)", value: "bounce" },
  { label: "Tada", value: "tada" },
  { label: "Wobble", value: "wobble" }
];
export const BTN_ACTIONS = [
  { label: "Buka halaman berikutnya", value: "next" },
  { label: "Buka link (Maps, dll)", value: "link" },
  { label: "Chat WhatsApp", value: "wa" }
];

// "#rrggbb" + alpha(0..1) -> rgba()
export function hexA(hex, a = 1) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
  if (!m) return hex || "transparent";
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${Math.min(1, Math.max(0, a))})`;
}

// Tujuan tombol: hanya http(s) atau nomor WhatsApp (angka). url bisa terikat ke data undangan (bindUrl).
export function buttonHref(el, data = {}) {
  const raw = el?.bindUrl ? data?.[el.bindUrl] : el?.url;
  if (el?.action === "link") return safeUrl(raw);
  if (el?.action === "wa") {
    const num = String(raw ?? "").replace(/\D/g, "").replace(/^0/, "62");
    return num ? `https://wa.me/${num}` : "";
  }
  return "";
}

export const PAGE_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:wght@400;600;700&family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&family=Nunito:wght@400;600;700&family=Poppins:wght@300;400;600&family=Marcellus&family=Work+Sans:wght@400;500;600&display=swap";

let _n = 0;
function uid(prefix) {
  _n += 1;
  const rand =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${_n}_${rand}`;
}
export const newPageId = () => uid("pg");

export function newTextElement(patch = {}) {
  return {
    id: uid("el"),
    type: "text",
    text: "Ketik teks di sini",
    font: PAGE_FONTS[3].value,
    size: 16,
    color: "#3d2b1f",
    bold: false,
    italic: false,
    align: "center",
    mt: 0,
    anim: "",
    delay: 0,
    ...patch
  };
}

export function newImageElement(patch = {}) {
  return {
    id: uid("el"),
    type: "image",
    src: "",
    bind: "", // nama field data undangan (mis. fotoCouple) → foto diambil dari data itu
    shape: "oval",
    w: 190,
    h: 250,
    frame: "ornate", // "ornate" (bingkai emas CSS) | "none"
    frameUrl: "", // opsional: PNG bingkai ornamen (dipilih dari Media)
    mt: 0,
    anim: "",
    delay: 0,
    ...patch
  };
}

export function newButtonElement(patch = {}) {
  return {
    id: uid("el"),
    type: "button",
    label: "Open Invitation",
    action: "next", // next | link | wa
    url: "",
    bindUrl: "", // nama field data (mis. mapsAkad) → tujuan link diambil dari data itu
    font: PAGE_FONTS[3].value,
    size: 14,
    color: "#ffffff",
    bg: "#96483e",
    mt: 16,
    anim: "",
    delay: 0,
    ...patch
  };
}

// Form RSVP (kolom, label, opsi kehadiran diambil dari store.rsvpFields; data tersimpan ke daftar tamu undangan).
export function newRsvpElement(patch = {}) {
  return {
    id: uid("el"),
    type: "rsvp",
    label: "Kirim RSVP",
    doneText: "Terima kasih! Konfirmasi Anda sudah kami terima.",
    showWishes: true, // tampilkan daftar ucapan tamu di bawah form
    font: PAGE_FONTS[7].value,
    color: "#4a3a3a",
    bg: "#b76b78",
    mt: 14,
    anim: "",
    delay: 0,
    ...patch
  };
}

// Dekorasi: gambar bebas (bunga, ornamen) diposisikan dengan persen dari halaman.
// h: left|center|right, v: top|bottom → x/y = jarak dari sisi itu (boleh negatif).
export function newLayerElement(patch = {}) {
  return {
    id: uid("el"),
    type: "layer",
    src: "",
    h: "left",
    v: "top",
    x: 0,
    y: 0,
    w: 50,
    rot: 0,
    flip: false,
    front: true,
    anim: "",
    loop: "",
    delay: 0,
    ...patch
  };
}

// panel = kartu di belakang konten (mis. lengkung/arch seperti Satu Momen)
export function blankPage(name = "Halaman Baru") {
  return {
    id: newPageId(),
    name,
    visible: true,
    bg: { color: "#fffaf7", image: "" },
    panel: { shape: "none", color: "#ffffff", alpha: 1, border: "", borderW: 2 },
    elements: [newTextElement({ size: 18 })]
  };
}

// ── Aset desain tema (bunga, ornamen): taruh file di  public/themes/soft-romance/
// Daftar nama file ada di public/themes/soft-romance/_DAFTAR-FILE.txt. Belum diupload = otomatis tidak tampil.
export const THEME_DIR = "/themes/soft-romance";
// Link (config/soft-romance-assets.js) kalau ada, kalau kosong → file lokal di public/themes/soft-romance/
export const themeAsset = (file) => SOFT_ROMANCE_URLS[file] || `${THEME_DIR}/${file}`;
export const THEME_FILES = {
  bgCover: "bg-cover.png",
  bgPage: "bg-page.png"
};
// h/v = sisi acuan, x/y = jarak (% halaman), w = lebar (% halaman)
// Disamakan dengan desain referensi: animasi masuk 3 dtk (animate__slower), delay bertingkat, bunga bawah miring 5°,
// goyangan tiap bunga beda durasi (loopDur). dur = durasi animasi masuk (detik), loopDur = durasi satu goyangan.
export const SOFT_DECOR = [
  { file: "corner-tl-big.png", h: "left", v: "top", x: -5, y: -10, w: 55, loop: "wave-right", anim: "fadeInTopLeft", delay: 4, dur: 3 },
  { file: "corner-tl-small.png", h: "left", v: "top", x: -2, y: 13, w: 35, loop: "wave-right", anim: "fadeInTopLeft", delay: 5, dur: 3 },
  { file: "corner-tr-big.png", h: "right", v: "top", x: -5, y: -10, w: 55, loop: "wave-left", anim: "fadeInTopRight", delay: 4, dur: 3 },
  { file: "corner-tr-small.png", h: "right", v: "top", x: -2, y: 13, w: 35, loop: "wave-left", anim: "fadeInTopRight", delay: 5, dur: 3 },
  { file: "center-flower.png", h: "center", v: "bottom", x: 0, y: 25, w: 30 }, // referensi: tanpa animasi masuk
  { file: "side-l-mid.png", h: "left", v: "bottom", x: -5, y: 30, w: 50, rot: 5, loop: "wave-left", loopDur: 2.5, anim: "fadeInLeft", delay: 4, dur: 3 },
  { file: "side-r-mid.png", h: "right", v: "bottom", x: -5, y: 30, w: 50, rot: 5, loop: "wave-right", loopDur: 2.5, anim: "fadeInRight", delay: 4, dur: 3 },
  { file: "flyer.png", h: "left", v: "top", x: 0, y: 70, w: 30, loop: "fly" },
  { file: "bottom-l-2.png", h: "left", v: "bottom", x: -5, y: 9, w: 50, rot: 5, loop: "wave-left", loopDur: 2.1, anim: "fadeInUp", delay: 3, dur: 3 },
  { file: "bottom-r-2.png", h: "right", v: "bottom", x: -5, y: 9, w: 50, rot: 5, loop: "wave-right", loopDur: 2.1, anim: "fadeInUp", delay: 3, dur: 3 },
  { file: "bottom-l-1.png", h: "left", v: "bottom", x: -10, y: -1.5, w: 50, rot: 5, loop: "wave-left", loopDur: 1.8, anim: "fadeInUp", delay: 2, dur: 3 },
  { file: "bottom-r-1.png", h: "right", v: "bottom", x: -10, y: -1.5, w: 50, rot: 5, loop: "wave-right", loopDur: 1.8, anim: "fadeInUp", delay: 2, dur: 3 },
  { file: "bottom-l-3.png", h: "left", v: "bottom", x: 12, y: -1.5, w: 35, rot: 5, loop: "wave-left", loopDur: 2.5, anim: "fadeInUp", delay: 1, dur: 3 },
  { file: "bottom-r-3.png", h: "right", v: "bottom", x: 12, y: -1.5, w: 35, rot: 5, loop: "wave-right", loopDur: 2.5, anim: "fadeInUp", delay: 1, dur: 3 },
  { file: "bottom-center.png", h: "center", v: "bottom", x: 0, y: -1, w: 35, anim: "fadeInUp", delay: 5, dur: 3 }
];
export const softDecorLayers = () =>
  SOFT_DECOR.map(({ file, ...o }) => newLayerElement({ src: themeAsset(file), front: true, ...o }));

// ── Teks default tema: SETIAP teks berdiri sendiri (tidak terhubung ke data undangan / teks lain).
// Langsung terisi contoh yang rapi, tinggal diklik lalu diganti. Hanya {{nama_tamu}} yang tetap token,
// karena itu nama tamu dari link (?to=Nama) — bukan teks yang diketik pemilik undangan.
export const DEFAULT_TEXT = {
  weddingSub: "The Wedding Of",
  nama1: "Anindya",
  nama2: "Raka",
  weddingAmpersand: "&",
  kepadaYth: "Kepada Yth;\nBapak/Ibu/Saudara/i",
  openingBtnText: "Open Invitation",
  quotesText: "Dan kini, dua hati yang berbeda memilih untuk berjalan bersama dalam satu tujuan, saling menggenggam di setiap suka dan duka.",
  quotesSource: "Kisah Kami",
  brideFull: "Anindya Putri Maharani",
  brideOrangTua: "Putri dari Bapak Hendra Wijaya\n& Ibu Sri Lestari",
  groomFull: "Raka Aditya Pratama",
  groomOrangTua: "Putra dari Bapak Bambang Santoso\n& Ibu Dewi Anggraini",
  tanggalAkad: "Sabtu, 19 Desember 2026",
  waktuAkad: "08.00 WIB - Selesai",
  lokasiAkad: "Gedung Serbaguna Mawar",
  alamatAkad: "Jl. Melati No. 12, Kelurahan Mawar, Kota Contoh",
  tanggalResepsi: "Sabtu, 19 Desember 2026",
  waktuResepsi: "11.00 WIB - 14.00 WIB",
  lokasiResepsi: "Gedung Serbaguna Mawar",
  alamatResepsi: "Jl. Melati No. 12, Kelurahan Mawar, Kota Contoh",
  penutupDesc: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.",
  penutupHormat: "Hormat kami,",
  penutupAmpersand: "&"
};

// Lepas semua token {{field}} (kecuali {{nama_tamu}}) dari halaman yang sudah ada menjadi teks biasa.
// Isinya diambil dari data undangan kalau sudah pernah diisi, kalau kosong pakai teks default.
// Tata letak & dekorasi tidak disentuh. Aman dipanggil berulang (tidak ada token → tidak berubah).
export function unlinkTokens(pages, data = {}) {
  const re = /\{\{\s*(\w+)\s*(?:\|([^}]*))?\}\}/g;
  const swap = (txt) =>
    String(txt ?? "").replace(re, (m, key, fallback) => {
      if (key === "nama_tamu") return m;
      const v = data?.[key];
      if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
      if (DEFAULT_TEXT[key] !== undefined) return DEFAULT_TEXT[key];
      return fallback !== undefined ? fallback : "";
    });
  (pages || []).forEach((pg) =>
    (pg.elements || []).forEach((el) => {
      if (el.type === "text") el.text = swap(el.text);
      else if (el.type === "button") el.label = swap(el.label);
    })
  );
  return pages;
}

// Halaman bawaan tema: setiap teks berdiri sendiri dan langsung terisi contoh (lihat DEFAULT_TEXT) —
// tidak ada teks yang terhubung ke teks lain. Hanya slot foto yang terikat ke field data (bind) dan
// {{nama_tamu}} (nama tamu dari link).
export function buildDefaultPages() {
  const dark = "#4a3a3a";
  const accent = "#b76b78";
  const script = PAGE_FONTS[0].value; // Great Vibes (untuk "&")
  const display = PAGE_FONTS[1].value; // Cormorant Garamond (nama mempelai)
  const sans = PAGE_FONTS[7].value; // Work Sans (teks umum)
  const T = (text, o = {}) => newTextElement({ text, font: sans, color: dark, ...o });
  const N = (text, o = {}) => T(text, { font: display, size: 40, color: accent, ...o });
  const page = (name, elements, bgImage = themeAsset(THEME_FILES.bgPage), panel = {}) => ({
    id: newPageId(),
    name,
    visible: true,
    bg: { color: "#efe6d8", image: bgImage },
    panel: { shape: "arch", color: "#fff1db", alpha: 0.3, border: accent, borderW: 1.5, ...panel },
    elements: [...elements, ...softDecorLayers()]
  });
  const PHOTO = (bind, o = {}) => newImageElement({ bind, shape: "oval", w: 170, h: 220, frame: "none", ...o });
  const BTN = (label, bindUrl, o = {}) => newButtonElement({ label, action: "link", bindUrl, bg: accent, mt: 14, ...o });

  const D = DEFAULT_TEXT;
  return [
    page("Opening", [
      T(D.weddingSub, { size: 14.4, anim: "fadeInDown", delay: 1.5, dur: 3 }),
      N(D.nama1, { size: 60, mt: 14, anim: "fadeInLeft", delay: 1.5, dur: 3 }),
      T(D.weddingAmpersand, { font: script, size: 24, color: accent, anim: "zoomIn", delay: 1.5, dur: 3 }),
      N(D.nama2, { size: 60, anim: "fadeInRight", delay: 1.5, dur: 3 }),
      T(D.kepadaYth, { size: 14, mt: 28, anim: "zoomIn", delay: 2, dur: 3 }),
      T("{{nama_tamu}}", { size: 16, bold: true, color: accent, mt: 4, anim: "zoomIn", delay: 2, dur: 3 }),
      newButtonElement({ label: D.openingBtnText, action: "next", bg: accent, mt: 18, anim: "fadeInUp", delay: 2, dur: 2 })
    ], themeAsset(THEME_FILES.bgCover)),

    page("Quotes", [
      PHOTO("fotoCouple", { w: 190, h: 250, frame: "ornate" }),
      T(D.quotesText, { size: 13.5, mt: 18 }),
      T(D.quotesSource, { size: 17, mt: 14 })
    ]),

    page("Mempelai", [
      PHOTO("fotoBride"),
      N(D.brideFull, { size: 30, mt: 12 }),
      T(D.brideOrangTua, { size: 13, mt: 4 }),
      T(D.weddingAmpersand, { font: script, size: 26, color: accent, mt: 10 }),
      PHOTO("fotoGroom", { mt: 8 }),
      N(D.groomFull, { size: 30, mt: 12 }),
      T(D.groomOrangTua, { size: 13, mt: 4 })
    ]),

    page("Acara", [
      N("Akad Nikah", { size: 30 }),
      T(D.tanggalAkad, { size: 14, mt: 6 }),
      T(D.waktuAkad, { size: 14 }),
      T(D.lokasiAkad, { size: 14, bold: true, mt: 4 }),
      T(D.alamatAkad, { size: 13 }),
      BTN("Lihat Lokasi", "mapsAkad"),
      N("Resepsi", { size: 30, mt: 28 }),
      T(D.tanggalResepsi, { size: 14, mt: 6 }),
      T(D.waktuResepsi, { size: 14 }),
      T(D.lokasiResepsi, { size: 14, bold: true, mt: 4 }),
      T(D.alamatResepsi, { size: 13 }),
      BTN("Lihat Lokasi", "mapsResepsi")
    ]),

    page("RSVP", [
      N("Konfirmasi Kehadiran", { size: 32, anim: "fadeInUp" }),
      T("Mohon konfirmasi kehadiran Anda untuk membantu persiapan kami.", { size: 13.5, mt: 8 }),
      newRsvpElement({ bg: accent, color: dark, mt: 14, anim: "fadeInUp", delay: 0.3 })
    ]),

    page("Penutup", [
      T(D.penutupDesc, { size: 14 }),
      T(D.penutupHormat, { size: 13, mt: 24 }),
      N(`${D.nama1} ${D.penutupAmpersand} ${D.nama2}`, { size: 36, mt: 6 })
    ])
  ];
}

// Samakan animasi undangan lama dengan SOFT_DECOR & halaman Opening bawaan (posisi/teks/foto yang sudah diedit tidak diubah).
export function refreshAnimations(pages) {
  const fresh = buildDefaultPages();
  const pick = (el, src) => ({ anim: src.anim || "", delay: src.delay || 0, dur: src.dur || 1 });
  (pages || []).forEach((pg) =>
    (pg.elements || []).forEach((el) => {
      if (el.type !== "layer") return;
      const d = SOFT_DECOR.find((x) => themeAsset(x.file) === el.src);
      if (d) Object.assign(el, { ...pick(el, d), loop: d.loop || "", loopDur: d.loopDur || 0, rot: d.rot || 0 });
    })
  );
  const cur = pages?.[0];
  if (cur?.name === "Opening") {
    const a = cur.elements.filter((e) => e.type !== "layer");
    const b = fresh[0].elements.filter((e) => e.type !== "layer");
    if (a.length === b.length) a.forEach((el, i) => { if (el.type === b[i].type) Object.assign(el, pick(el, b[i])); });
  }
  return pages;
}

// Halaman RSVP saja (dipakai untuk menambahkan RSVP ke undangan lama yang belum punya).
export const buildRsvpPage = () => buildDefaultPages().find((p) => p.name === "RSVP");

// Ganti token {{field}} / {{field|teks cadangan}} dengan data undangan (teks biasa, tidak pernah jadi HTML).
// Contoh: {{nama1}}, {{weddingSub|The Wedding Of}}, {{nama_tamu}}
export function applyTokens(text, vars = {}) {
  return String(text ?? "").replace(/\{\{\s*(\w+)\s*(?:\|([^}]*))?\}\}/g, (m, key, fallback) => {
    const v = vars[key];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
    if (fallback !== undefined) return fallback;
    return key === "nama_tamu" ? "Nama Tamu" : "";
  });
}
// Kalau teks HANYA satu token ({{nama1}}), kembalikan nama field-nya → bisa diedit langsung ke data undangan.
export function tokenKey(text) {
  const m = /^\s*\{\{\s*(\w+)\s*(?:\|[^}]*)?\}\}\s*$/.exec(String(text ?? ""));
  return m ? m[1] : "";
}
export const hasToken = (text) => /\{\{\s*\w+/.test(String(text ?? ""));
