/**
 * Notifikasi (toast) terpusat — pakai Nuxt UI useToast.
 * Toast dengan id sama akan menggantikan yang lama (tidak menumpuk),
 * jadi autosave berulang tetap hanya menampilkan satu notifikasi.
 */
export function useNotify() {
  if (import.meta.server) {
    const noop = () => {};
    return { success: noop, error: noop, info: noop, warning: noop };
  }
  const toast = useToast();
  const add = (color, icon, title, opts = {}) =>
    toast.add({
      id: opts.id || `${color}:${title}`,
      title,
      description: opts.description,
      color,
      icon,
      duration: opts.duration ?? (color === "error" ? 6000 : 3000),
    });

  return {
    success: (title, opts) => add("success", "i-lucide-circle-check", title, opts),
    error: (title, opts) => add("error", "i-lucide-circle-alert", title, opts),
    info: (title, opts) => add("info", "i-lucide-info", title, opts),
    warning: (title, opts) => add("warning", "i-lucide-triangle-alert", title, opts),
  };
}
