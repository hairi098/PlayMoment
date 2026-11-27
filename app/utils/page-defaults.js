// utils/page-defaults.js
// Model tema tipe "page": tiap halaman punya daftar elemen teks yang diklik lalu diedit lewat modal.
// Token {{nama_tamu}} diganti saat ditampilkan ke tamu.

export const PAGE_STAGE = { width: 360, height: 640 };

export const PAGE_FONTS = [
  { label: "Great Vibes", value: "'Great Vibes', cursive" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Lato", value: "'Lato', sans-serif" },
  { label: "Nunito", value: "'Nunito', sans-serif" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Marcellus", value: "'Marcellus', serif" }
];

export const IMAGE_SHAPES = [
  { label: "Oval", value: "oval" },
  { label: "Lengkung (arch)", value: "arch" },
  { label: "Lingkaran", value: "circle" },
  { label: "Kotak", value: "rect" }
];

// Hanya http(s) yang boleh dipakai sebagai sumber gambar (cegah javascript:/data: aneh)
export function safeUrl(u) {
  const v = String(u ?? "").trim();
  if (!/^https?:\/\//i.test(v)) return "";
  return v.replace(/["'()\\\s]/g, (c) => encodeURIComponent(c));
}

export const PAGE_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:wght@400;600;700&family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&family=Nunito:wght@400;600;700&family=Poppins:wght@300;400;600&family=Marcellus&display=swap";

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
    ...patch
  };
}

export function newImageElement(patch = {}) {
  return {
    id: uid("el"),
    type: "image",
    src: "",
    shape: "oval",
    w: 190,
    h: 250,
    frame: "ornate", // "ornate" (bingkai emas CSS) | "none"
    frameUrl: "", // opsional: PNG bingkai ornamen sendiri (menimpa bingkai CSS)
    mt: 0,
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
    panel: { shape: "none", color: "#ffffff" },
    elements: [newTextElement({ size: 18 })]
  };
}

export function buildDefaultPages(u = {}) {
  const n1 = u.nama1 || "Mempelai Wanita";
  const n2 = u.nama2 || "Mempelai Pria";
  const dark = "#2b2620";
  const accent = "#8a6d3b";
  const script = PAGE_FONTS[0].value;
  const serif = PAGE_FONTS[6].value; // Marcellus
  const T = (text, o = {}) => newTextElement({ text, font: serif, color: dark, ...o });
  const page = (name, bg, panelColor, elements) => ({
    id: newPageId(),
    name,
    visible: true,
    bg: { color: bg, image: "" },
    panel: panelColor ? { shape: "arch", color: panelColor } : { shape: "none", color: "#ffffff" },
    elements
  });
  const BG = "#e4e1d8";
  const PANEL = "#ecebe4";

  return [
    page("Opening", BG, PANEL, [
      newImageElement({ mt: 8 }),
      T("THE WEDDING OF", { size: 13, color: accent, mt: 18 }),
      T(`${n1} & ${n2}`, { font: script, size: 40, mt: 10 }),
      T("Kepada Yth;", { size: 13, mt: 22 }),
      T("{{nama_tamu}}", { size: 22, bold: true })
    ]),
    page("Quotes", BG, PANEL, [
      newImageElement({ mt: 8 }),
      T(
        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
        { size: 13.5, mt: 18 }
      ),
      T("Surah Ar-Rum : 21", { size: 17, mt: 14 })
    ]),
    page("Mempelai", BG, PANEL, [
      T(n1, { font: script, size: 38, color: accent }),
      T("Putri dari Bapak ... & Ibu ...", { size: 13 }),
      T("&", { size: 26, mt: 16 }),
      T(n2, { font: script, size: 38, color: accent, mt: 16 }),
      T("Putra dari Bapak ... & Ibu ...", { size: 13 })
    ]),
    page("Acara", BG, PANEL, [
      T("AKAD NIKAH", { size: 22, color: accent }),
      T(u.tanggalAkad || "Hari, 00 Bulan 0000", { size: 14, mt: 4 }),
      T(u.waktuAkad || "00.00 WIB - Selesai", { size: 14 }),
      T(u.lokasiAkad || "Nama Lokasi", { size: 14 }),
      T("RESEPSI", { size: 22, color: accent, mt: 26 }),
      T(u.tanggalResepsi || "Hari, 00 Bulan 0000", { size: 14, mt: 4 }),
      T(u.waktuResepsi || "00.00 WIB - Selesai", { size: 14 }),
      T(u.lokasiResepsi || "Nama Lokasi", { size: 14 })
    ]),
    page("Penutup", BG, PANEL, [
      T("Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.", { size: 14 }),
      T("Hormat kami,", { size: 13, mt: 24 }),
      T(`${n1} & ${n2}`, { font: script, size: 36, color: accent, mt: 6 })
    ])
  ];
}

// Ganti token {{nama_tamu}} (teks biasa, tidak pernah jadi HTML)
export function applyTokens(text, vars = {}) {
  return String(text ?? "").replace(/\{\{\s*(\w+)\s*\}\}/g, (m, key) => {
    const v = vars[key];
    if (v !== undefined && v !== "") return String(v);
    return key === "nama_tamu" ? "Nama Tamu" : "";
  });
}
