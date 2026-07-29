// config/themes.js
// Konfigurasi tema untuk undangan digital
// Setiap tema punya: colors, assets, sections, dan slideStyle unik

// ── ICON SVG HELPERS ────────────────────────────────────────────────────────
const ICONS = {
  home: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  calendar:
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  quote:
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
  person:
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
  clock:
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  image:
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
  chat: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  phone:
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  gift: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>',
  heart:
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
};

function makeSections(c) {
  return [
    { key: "opening", name: "Opening", color: c.primary, iconSvg: ICONS.home },
    {
      key: "wedding",
      name: "Save The Date",
      color: c.secondary,
      iconSvg: ICONS.calendar,
    },
    {
      key: "quotes",
      name: "Quotes / Ayat",
      color: c.accent,
      iconSvg: ICONS.quote,
    },
    {
      key: "bride",
      name: "Pengantin Wanita",
      color: c.bride,
      iconSvg: ICONS.person,
    },
    {
      key: "groom",
      name: "Pengantin Pria",
      color: c.groom,
      iconSvg: ICONS.person,
    },
    {
      key: "acara",
      name: "Detail Acara",
      color: c.primary,
      iconSvg: ICONS.clock,
    },
    {
      key: "galeri",
      name: "Galeri Foto",
      color: c.accent,
      iconSvg: ICONS.image,
    },
    {
      key: "ucapan",
      name: "Ucapan & Doa",
      color: c.secondary,
      iconSvg: ICONS.chat,
    },
    { key: "rsvp", name: "RSVP", color: c.groom, iconSvg: ICONS.phone },
    { key: "gift", name: "Wedding Gift", color: c.accent, iconSvg: ICONS.gift },
    { key: "penutup", name: "Penutup", color: c.primary, iconSvg: ICONS.heart },
  ];
}

// ── THEME CONFIG ─────────────────────────────────────────────────────────────
export const themeConfig = {
  // ══════════════════════════════════════════════════════
  // TEMA 1 — Elegant Rose
  // Karakter: oval card, warna terra cotta/salmon, romantis
  // Font: Great Vibes (signature) + Lato (body)
  // ══════════════════════════════════════════════════════
  "tema-1": {
    name: "Elegant Rose",
    label: "Elegant Rose",

    // ── filter metadata ───────────────────────────────────────────────────
    style: "Elegan",          // cocok dengan daftar styles di tema.vue
    color: "Merah Muda",      // cocok dengan daftar colors di tema.vue

    // ── card display ──────────────────────────────────────────────────────
    price: "199.000",
    oldPrice: "250.000",
    cardBg: "linear-gradient(160deg,#fff8f5,#c8956c)",
    thumbnails: [
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
    ],

    colors: {
      primary: "#964832",
      secondary: "#c8956c",
      accent: "#7c6a55",
      bride: "#d4a0b0",
      groom: "#7a9bbf",
      bg: "#fff8f5",
      card: "#fffaf7",
      text: "#3d2b1f",
    },

    assets: { bg: "", tl: "", tr: "", bl: "", br: "", bm: "" },

    // slideStyle dipakai di _slug_.vue untuk menentukan tampilan preview
    slideStyle: {
      cardShape: "oval", // 'oval' | 'rect' | 'sharp'
      fontSignature: "'Great Vibes', cursive",
      fontBody: "'Lato', sans-serif",
      cardRadius: "32px",
      ornamentTop: "✦ The Wedding Of ✦",
      ornamentDiv: "— ✿ —",
      btnRadius: "50px",
      btnPadding: "8px 24px",
      // warna spesifik section
      cardBg: "rgba(255,250,247,0.96)",
      cardBorder: "1px solid rgba(150,72,50,0.15)",
      cardShadow: "0 8px 40px rgba(150,72,50,0.12)",
      // label untuk sub-text dekoratif
      subLabel: "— Bersama dalam Cinta —",
    },

    sections: makeSections({
      primary: "#964832",
      secondary: "#c8956c",
      accent: "#7c6a55",
      bride: "#d4a0b0",
      groom: "#7a9bbf",
    }),
  },

  // ══════════════════════════════════════════════════════
  // TEMA 2 — Sage Garden
  // Karakter: rect card, hijau sage/alam, segar & minimalis
  // Font: Cormorant Garamond (signature) + Nunito (body)
  // ══════════════════════════════════════════════════════
  "tema-2": {
    name: "Sage Garden",
    label: "Sage Garden",

    // ── filter metadata ───────────────────────────────────────────────────
    style: "Minimalis",
    color: "Hijau",

    // ── card display ──────────────────────────────────────────────────────
    price: "199.000",
    oldPrice: "250.000",
    cardBg: "linear-gradient(160deg,#f2f7f4,#7aaa8e)",
    thumbnails: [
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
    ],

    colors: {
      primary: "#3d6b56",
      secondary: "#7aaa8e",
      accent: "#556b55",
      bride: "#a8c4b0",
      groom: "#6a8fbf",
      bg: "#f2f7f4",
      card: "#fafcfa",
      text: "#1e3329",
    },

    assets: { bg: "", tl: "", tr: "", bl: "", br: "", bm: "" },

    slideStyle: {
      cardShape: "rect",
      fontSignature: "'Cormorant Garamond', serif",
      fontBody: "'Nunito', sans-serif",
      cardRadius: "12px",
      ornamentTop: "🌿 Sebuah Undangan Pernikahan 🌿",
      ornamentDiv: "· · ·",
      btnRadius: "8px",
      btnPadding: "8px 20px",
      cardBg: "rgba(250,252,250,0.97)",
      cardBorder: "1px solid rgba(61,107,86,0.18)",
      cardShadow: "0 6px 32px rgba(61,107,86,0.10)",
      subLabel: "— Dengan Penuh Syukur —",
    },

    sections: makeSections({
      primary: "#3d6b56",
      secondary: "#7aaa8e",
      accent: "#556b55",
      bride: "#a8c4b0",
      groom: "#6a8fbf",
    }),
  },

  // ══════════════════════════════════════════════════════
  // TEMA 3 — Royal Navy
  // Karakter: sharp/rect card, navy & gold, mewah & formal
  // Font: Playfair Display (signature) + Raleway (body)
  // ══════════════════════════════════════════════════════
  "tema-3": {
    name: "Royal Navy",
    label: "Royal Navy",

    // ── filter metadata ───────────────────────────────────────────────────
    style: "Modern",
    color: "Biru",

    // ── card display ──────────────────────────────────────────────────────
    price: "199.000",
    oldPrice: "250.000",
    cardBg: "linear-gradient(160deg,#f0f3f9,#4a6fa5)",
    thumbnails: [
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
    ],

    colors: {
      primary: "#1a2e5a",
      secondary: "#4a6fa5",
      accent: "#c4a44a",
      bride: "#8aaac8",
      groom: "#4a6fa5",
      bg: "#f0f3f9",
      card: "#ffffff",
      text: "#0d1b36",
    },

    assets: { bg: "", tl: "", tr: "", bl: "", br: "", bm: "" },

    slideStyle: {
      cardShape: "sharp",
      fontSignature: "'Playfair Display', serif",
      fontBody: "'Raleway', sans-serif",
      cardRadius: "4px",
      ornamentTop: "— WEDDING INVITATION —",
      ornamentDiv: "✦ ✦ ✦",
      btnRadius: "2px",
      btnPadding: "9px 22px",
      cardBg: "rgba(255,255,255,0.98)",
      cardBorder: "1.5px solid rgba(196,164,74,0.45)",
      cardShadow: "0 4px 24px rgba(26,46,90,0.13)",
      subLabel: "— Together in His Blessing —",
    },

    sections: makeSections({
      primary: "#1a2e5a",
      secondary: "#4a6fa5",
      accent: "#c4a44a",
      bride: "#8aaac8",
      groom: "#4a6fa5",
    }),
  },

  "tema-4": {
    name: "Angkasa",
    label: "Angkasa",

    // ── filter metadata ───────────────────────────────────────────────────
    style: "Modern",
    color: "Biru",

    // ── card display ──────────────────────────────────────────────────────
    price: "199.000",
    oldPrice: "250.000",
    cardBg: "linear-gradient(160deg,#f0f3f9,#4a6fa5)",
    thumbnails: [
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
      "https://assets.vitopia.co/templates/cKsigTq7WAn89dP5c9qd7keZ0xBRNAwpmio3qsZh.webp",
    ],

    colors: {
      primary: "#1a2e5a",
      secondary: "#4a6fa5",
      accent: "#c4a44a",
      bride: "#8aaac8",
      groom: "#4a6fa5",
      bg: "#f0f3f9",
      card: "#ffffff",
      text: "#0d1b36",
    },

    assets: { bg: "", tl: "", tr: "", bl: "", br: "", bm: "" },

    slideStyle: {
      cardShape: "sharp",
      fontSignature: "'Playfair Display', serif",
      fontBody: "'Raleway', sans-serif",
      cardRadius: "4px",
      ornamentTop: "— WEDDING INVITATION —",
      ornamentDiv: "✦ ✦ ✦",
      btnRadius: "2px",
      btnPadding: "9px 22px",
      cardBg: "rgba(255,255,255,0.98)",
      cardBorder: "1.5px solid rgba(196,164,74,0.45)",
      cardShadow: "0 4px 24px rgba(26,46,90,0.13)",
      subLabel: "— Together in His Blessing —",
    },

    sections: makeSections({
      primary: "#1a2e5a",
      secondary: "#4a6fa5",
      accent: "#c4a44a",
      bride: "#8aaac8",
      groom: "#4a6fa5",
    }),
  },
};

// ── HELPERS ──────────────────────────────────────────────────────────────────

export function getThemeSlugByName(nameOrSlug) {
  if (themeConfig[nameOrSlug]) return nameOrSlug;
  const found = Object.entries(themeConfig).find(
    ([, cfg]) =>
      cfg.name.toLowerCase() === String(nameOrSlug).toLowerCase() ||
      cfg.label.toLowerCase() === String(nameOrSlug).toLowerCase(),
  );
  return found ? found[0] : "tema-1";
}

export function getSectionsForTheme(temaSlug) {
  return (themeConfig[temaSlug] ?? themeConfig["tema-1"]).sections;
}

export function getAssetsForTheme(temaSlug) {
  return (themeConfig[temaSlug] ?? themeConfig["tema-1"]).assets;
}

export function getColorsForTheme(temaSlug) {
  return (themeConfig[temaSlug] ?? themeConfig["tema-1"]).colors;
}

export function getSlideStyleForTheme(temaSlug) {
  return (themeConfig[temaSlug] ?? themeConfig["tema-1"]).slideStyle;
}

export function getAllThemes() {
  return Object.entries(themeConfig).map(([slug, cfg]) => ({
    slug,
    name: cfg.name,
    label: cfg.label,
    price: cfg.price ?? "199.000",
    oldPrice: cfg.oldPrice ?? null,
    cardBg: cfg.cardBg ?? "#f9f9f9",
    thumbnails: cfg.thumbnails ?? ["", "", ""],
    colors: cfg.colors,
    slideStyle: cfg.slideStyle,
    // ── field filter — dipakai filteredThemes di tema.vue ──
    style: cfg.style ?? "Modern",
    color: cfg.color ?? "Semua Warna",
  }));
}

/**
 * CSS variables lengkap dari tema — taruh di :style root element
 * Ini yang dipakai store.themeCssVars dan halaman edit untuk menentukan warna
 */
export function getThemeCssVars(temaSlug) {
  const c = getColorsForTheme(temaSlug);
  const s = getSlideStyleForTheme(temaSlug);
  return {
    // color tokens
    "--inv-a": c.primary,
    "--inv-s": c.secondary,
    "--inv-acc": c.accent,
    "--inv-bride": c.bride,
    "--inv-groom": c.groom,
    "--inv-bg": c.bg,
    "--inv-card": c.card,
    "--inv-text": c.text,
    // typography
    "--inv-font-sig": s.fontSignature,
    "--inv-font-body": s.fontBody,
    // shape
    "--inv-radius": s.cardRadius,
    "--inv-btn-radius": s.btnRadius,
    "--inv-btn-padding": s.btnPadding,
    // card visual
    "--inv-card-bg": s.cardBg,
    "--inv-card-border": s.cardBorder,
    "--inv-card-shadow": s.cardShadow,
  };
}