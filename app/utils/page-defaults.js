// utils/page-defaults.js
import { SOFT_ROMANCE_URLS } from "~/config/soft-romance-assets";
// Model tema tipe "page": tiap halaman punya daftar elemen teks yang diklik lalu diedit lewat modal.
// Token {{nama_tamu}} diganti saat ditampilkan ke tamu.

// Naikkan angka ini kalau tampilan default tema berubah → editor membangun ulang halaman default SEKALI
// untuk data lama yang belum bernomor versi (perubahan manual di data lama akan hilang). Set ke 0 untuk mematikan.
export const PAGES_VERSION = 3;

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

export const ENTRANCES = [
  { label: "Tanpa", value: "" },
  { label: "Naik (fade up)", value: "fadeInUp" },
  { label: "Turun (fade down)", value: "fadeInDown" },
  { label: "Dari kiri", value: "fadeInLeft" },
  { label: "Dari kanan", value: "fadeInRight" },
  { label: "Zoom in", value: "zoomIn" }
];
export const LOOPS = [
  { label: "Diam", value: "" },
  { label: "Goyang kiri", value: "wave-left" },
  { label: "Goyang kanan", value: "wave-right" },
  { label: "Melayang", value: "float" },
  { label: "Terbang melintas", value: "fly" }
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
export const SOFT_DECOR = [
  { file: "corner-tl-big.png", h: "left", v: "top", x: -5, y: -10, w: 55, loop: "wave-right", anim: "fadeInLeft", delay: 2 },
  { file: "corner-tl-small.png", h: "left", v: "top", x: -2, y: 13, w: 35, loop: "wave-right", anim: "fadeInLeft", delay: 2.5 },
  { file: "corner-tr-big.png", h: "right", v: "top", x: -5, y: -10, w: 55, loop: "wave-left", anim: "fadeInRight", delay: 2 },
  { file: "corner-tr-small.png", h: "right", v: "top", x: -2, y: 13, w: 35, loop: "wave-left", anim: "fadeInRight", delay: 2.5 },
  { file: "center-flower.png", h: "center", v: "bottom", x: 0, y: 25, w: 30, anim: "fadeInUp", delay: 1.5 },
  { file: "side-l-mid.png", h: "left", v: "bottom", x: -5, y: 30, w: 50, loop: "wave-left", anim: "fadeInLeft", delay: 2 },
  { file: "side-r-mid.png", h: "right", v: "bottom", x: -5, y: 30, w: 50, loop: "wave-right", anim: "fadeInRight", delay: 2 },
  { file: "flyer.png", h: "left", v: "top", x: 0, y: 70, w: 30, loop: "fly" },
  { file: "bottom-l-2.png", h: "left", v: "bottom", x: -5, y: 9, w: 50, loop: "wave-left", anim: "fadeInUp", delay: 1.5 },
  { file: "bottom-r-2.png", h: "right", v: "bottom", x: -5, y: 9, w: 50, loop: "wave-right", anim: "fadeInUp", delay: 1.5 },
  { file: "bottom-l-1.png", h: "left", v: "bottom", x: -10, y: -1.5, w: 50, loop: "wave-left", anim: "fadeInUp", delay: 1 },
  { file: "bottom-r-1.png", h: "right", v: "bottom", x: -10, y: -1.5, w: 50, loop: "wave-right", anim: "fadeInUp", delay: 1 },
  { file: "bottom-l-3.png", h: "left", v: "bottom", x: 12, y: -1.5, w: 35, loop: "wave-left", anim: "fadeInUp", delay: 0.5 },
  { file: "bottom-r-3.png", h: "right", v: "bottom", x: 12, y: -1.5, w: 35, loop: "wave-right", anim: "fadeInUp", delay: 0.5 },
  { file: "bottom-center.png", h: "center", v: "bottom", x: 0, y: -1, w: 35, anim: "fadeInUp", delay: 2.5 }
];
export const softDecorLayers = () =>
  SOFT_DECOR.map(({ file, ...o }) => newLayerElement({ src: themeAsset(file), front: true, ...o }));

// Halaman bawaan tema: SEMUA isi terhubung ke data undangan lewat token ({{nama1}}, {{tanggalAkad}}, dst.)
// dan slot foto terikat ke field data (bind). User cukup mengganti data, tidak mendesain.
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

  return [
    page("Opening", [
      T("{{weddingSub|The Wedding Of}}", { size: 14, anim: "fadeInDown", delay: 0.3 }),
      N("{{nama1}}", { size: 58, mt: 14, anim: "fadeInLeft", delay: 0.5 }),
      T("{{weddingAmpersand|&}}", { font: script, size: 24, color: accent, anim: "zoomIn", delay: 0.7 }),
      N("{{nama2}}", { size: 58, anim: "fadeInRight", delay: 0.9 }),
      T("{{kepadaYth|Kepada Yth;\nBapak/Ibu/Saudara/i}}", { size: 14, mt: 28, anim: "fadeInUp", delay: 1.2 }),
      T("{{nama_tamu}}", { size: 16, bold: true, color: accent, mt: 4, anim: "fadeInUp", delay: 1.3 }),
      newButtonElement({ label: "{{openingBtnText|Open Invitation}}", action: "next", bg: accent, mt: 18, anim: "fadeInUp", delay: 1.5 })
    ], themeAsset(THEME_FILES.bgCover)),

    page("Quotes", [
      PHOTO("fotoCouple", { w: 190, h: 250, frame: "ornate" }),
      T("{{quotesText}}", { size: 13.5, mt: 18 }),
      T("{{quotesSource}}", { size: 17, mt: 14 })
    ]),

    page("Mempelai", [
      PHOTO("fotoBride"),
      N("{{brideFull}}", { size: 30, mt: 12 }),
      T("{{brideOrangTua}}", { size: 13, mt: 4 }),
      T("{{weddingAmpersand|&}}", { font: script, size: 26, color: accent, mt: 10 }),
      PHOTO("fotoGroom", { mt: 8 }),
      N("{{groomFull}}", { size: 30, mt: 12 }),
      T("{{groomOrangTua}}", { size: 13, mt: 4 })
    ]),

    page("Acara", [
      N("Akad Nikah", { size: 30 }),
      T("{{tanggalAkad}}", { size: 14, mt: 6 }),
      T("{{waktuAkad}}", { size: 14 }),
      T("{{lokasiAkad}}", { size: 14, bold: true, mt: 4 }),
      T("{{alamatAkad}}", { size: 13 }),
      BTN("Lihat Lokasi", "mapsAkad"),
      N("Resepsi", { size: 30, mt: 28 }),
      T("{{tanggalResepsi}}", { size: 14, mt: 6 }),
      T("{{waktuResepsi}}", { size: 14 }),
      T("{{lokasiResepsi}}", { size: 14, bold: true, mt: 4 }),
      T("{{alamatResepsi}}", { size: 13 }),
      BTN("Lihat Lokasi", "mapsResepsi")
    ]),

    page("Penutup", [
      T("{{penutupDesc}}", { size: 14 }),
      T("{{penutupHormat|Hormat kami,}}", { size: 13, mt: 24 }),
      N("{{nama1}} {{penutupAmpersand|&}} {{nama2}}", { size: 36, mt: 6 })
    ])
  ];
}

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
