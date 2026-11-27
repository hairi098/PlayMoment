// composables/usePageEditor.js
// Data halaman disimpan di store.sectionContents.pages
// -> otomatis ikut snapshot/autosave Supabase yang sudah ada (tanpa ubah snapshot).
import { computed } from "vue";
import { useUndanganStore } from "~/stores/useUndanganStore";
import { buildDefaultPages, blankPage, newPageId, newTextElement, newImageElement } from "~/utils/page-defaults";

export function usePageEditor() {
  const store = useUndanganStore();

  const pages = computed(() => store.sectionContents.pages?.items ?? []);

  function ensurePages() {
    const items = store.sectionContents.pages?.items;
    // format lama / kosong → isi default
    if (Array.isArray(items) && items.length && items.every((p) => Array.isArray(p.elements))) return;
    store.sectionContents.pages = { items: buildDefaultPages(store.undangan) };
  }

  function _items() {
    ensurePages();
    return store.sectionContents.pages.items;
  }

  // ── halaman ──
  function addPage(afterIndex = null) {
    const items = _items();
    const at = afterIndex === null ? items.length : afterIndex + 1;
    items.splice(at, 0, blankPage(`Halaman ${items.length + 1}`));
    return at;
  }
  function duplicatePage(index) {
    const items = _items();
    const src = items[index];
    if (!src) return index;
    const copy = JSON.parse(JSON.stringify(src));
    copy.id = newPageId();
    copy.name = `${src.name} (salinan)`;
    copy.elements.forEach((e) => { e.id = newTextElement().id; });
    items.splice(index + 1, 0, copy);
    return index + 1;
  }
  function removePage(index) {
    const items = _items();
    if (items.length <= 1) return index;
    items.splice(index, 1);
    return Math.min(index, items.length - 1);
  }
  function movePage(index, dir) {
    const items = _items();
    const to = index + dir;
    if (to < 0 || to >= items.length) return index;
    const [p] = items.splice(index, 1);
    items.splice(to, 0, p);
    return to;
  }
  function renamePage(index, name) {
    const p = _items()[index];
    if (p) p.name = name;
  }
  function setPageBg(index, patch) {
    const p = _items()[index];
    if (p) p.bg = { ...p.bg, ...patch };
  }
  function setPagePanel(index, patch) {
    const p = _items()[index];
    if (p) p.panel = { shape: "none", color: "#ffffff", ...(p.panel || {}), ...patch };
  }
  function setPageVisible(index, visible) {
    const p = _items()[index];
    if (p) p.visible = !!visible;
  }
  // pindahkan halaman dari posisi `from` ke `to` (drag & drop)
  function reorderPage(from, to) {
    const items = _items();
    if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return from;
    const [p] = items.splice(from, 1);
    items.splice(to, 0, p);
    return to;
  }

  // ── elemen ──
  function addElement(pageIndex) {
    const p = _items()[pageIndex];
    if (!p) return null;
    const el = newTextElement({ mt: 12 });
    p.elements.push(el);
    return el.id;
  }
  function addImage(pageIndex) {
    const p = _items()[pageIndex];
    if (!p) return null;
    const el = newImageElement({ mt: 12 });
    p.elements.push(el);
    return el.id;
  }
  function updateElement(pageIndex, id, patch) {
    const el = _items()[pageIndex]?.elements.find((e) => e.id === id);
    if (el) Object.assign(el, patch);
  }
  function removeElement(pageIndex, id) {
    const p = _items()[pageIndex];
    if (!p) return;
    p.elements = p.elements.filter((e) => e.id !== id);
  }
  function moveElement(pageIndex, id, dir) {
    const els = _items()[pageIndex]?.elements;
    if (!els) return;
    const i = els.findIndex((e) => e.id === id);
    const to = i + dir;
    if (i < 0 || to < 0 || to >= els.length) return;
    const [e] = els.splice(i, 1);
    els.splice(to, 0, e);
  }

  return {
    pages, ensurePages,
    addPage, duplicatePage, removePage, movePage, renamePage, setPageBg,
    setPagePanel, setPageVisible, reorderPage,
    addElement, addImage, updateElement, removeElement, moveElement
  };
}
