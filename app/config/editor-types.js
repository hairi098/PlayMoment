// config/editor-types.js
// Tipe editor per tema:
//  - "scroll" : daftar section + form edit (Tema 1, perilaku saat ini)
//  - "page"   : canvas per halaman, teks diedit langsung (Nuxt UI Editor) ala Satu Momen
export const EDITOR_TYPE_BY_THEME = {
  "tema-1": "scroll",
  "tema-2": "page"
};

export function getEditorType(temaSlug) {
  return EDITOR_TYPE_BY_THEME[temaSlug] || "scroll";
}

export function isPageTheme(temaSlug) {
  return getEditorType(temaSlug) === "page";
}
