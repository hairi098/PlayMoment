export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'zinc'
    },
    // Notifikasi (toast) — tipis & agak transparan, warna sesuai kondisi:
    // hijau = berhasil, merah = gagal, biru = info, kuning = peringatan
    toast: {
      slots: {
        root: 'items-center gap-3 rounded-md border px-4 py-2 shadow-sm ring-0 backdrop-blur-sm',
        title: 'text-sm font-medium text-white',
        description: 'text-[13px] leading-snug text-white/90',
        icon: 'size-5',
        close: 'p-0 text-white/80 hover:bg-transparent hover:text-white',
        // garis loading di bawah: tipis & samar
        progress:
          'absolute inset-x-0 bottom-0 **:data-[slot=base]:h-px **:data-[slot=base]:bg-transparent **:data-[slot=indicator]:bg-white/30'
      },
      variants: {
        color: {
          success: { root: 'border-[#188a45]/50 bg-[#1fa956]/50', icon: 'text-white' },
          error: { root: 'border-[#dc2626]/50 bg-[#ef4444]/50', icon: 'text-white' },
          info: { root: 'border-[#2b83c7]/50 bg-[#3b9be0]/50', icon: 'text-white' },
          warning: { root: 'border-[#d97706]/50 bg-[#f59e0b]/50', icon: 'text-white' }
        }
      }
    }
  }
})
