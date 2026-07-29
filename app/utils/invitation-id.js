/** ID numerik unik untuk URL editor (/edit-undangan/:editorId). */
export function createEditorId() {
  return `${Date.now()}${Math.floor(Math.random() * 900 + 100)}`;
}

export function isEditorId(value) {
  return /^\d{13,}$/.test(String(value || ""));
}
