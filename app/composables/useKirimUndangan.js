import { ref, computed } from "vue";
import { useUndanganStore } from "~/stores/useUndanganStore";

const DEFAULT_TEMPLATE = `Kepada Yth.
Bapak/Ibu/Saudara/i
*{nama_tamu}*
_di tempat_

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, untuk menghadiri acara Resepsi Pernikahan Kami

Info lebih lengkap klik link dibawah ini
{link_undangan}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Kami yang berbahagia
*Kedua Keluarga Mempelai*

\`Mohon maaf perihal undangan hanya dibagikan melalui pesan ini.\``;

export function useKirimUndangan() {
  const store = useUndanganStore();

  const namaTamu = ref("");
  const searchTamu = ref("");
  const filterStatus = ref("semua");
  const copied = ref(false);
  const toastMsg = ref("");
  const selectedIds = ref([]);
  const tamuModalOpen = ref(false);
  const templateModalOpen = ref(false);
  const tamuForm = ref({});
  const editingTamuId = ref(null); // null = tambah baru, id = mode edit
  const importInput = ref(null);

  const TAMU_EXCLUDED_KEYS = ["kehadiran", "jumlah", "ucapan"];

  const tamuFormFields = computed(() =>
    (store.rsvpFields || []).filter(
      (f) => f.active !== false && !TAMU_EXCLUDED_KEYS.includes(f.key),
    ),
  );

  const publicSlug = computed(() => {
    const raw = (store.undangan?.domain || store.slug || "").trim();
    return raw.replace(/^https?:\/\/[^/]+\//, "").replace(/^\//, "");
  });

  const templatePesan = computed({
    get() {
      return (
        store.undangan.templatePesanKirim?.trim() || DEFAULT_TEMPLATE
      );
    },
    set(val) {
      store.undangan.templatePesanKirim = val;
    },
  });

  function linkForGuest(nama) {
    const slug = publicSlug.value || "undangan";
    const label = String(nama || "").trim();
    if (!label) return `https://playmoment.id/${slug}`;
    return `https://playmoment.id/${slug}?to=${encodeURIComponent(label)}`;
  }

  const undanganLink = computed(() => linkForGuest(namaTamu.value));

  const templatePreview = computed(() => {
    const tamu = namaTamu.value || "{nama_tamu}";
    const link = undanganLink.value;
    return templatePesan.value
      .replace(/\{nama_tamu\}/g, tamu)
      .replace(/\{link_undangan\}/g, link)
      .replace(/\*(.+?)\*/g, "<strong>$1</strong>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
  });

  function buildMessageForGuest(tamu) {
    const nama = tamu?.nama || namaTamu.value || "Tamu Undangan";
    const link = linkForGuest(nama);
    // Jangan strip format WhatsApp (*bold*, _italic_, `monospace`) — biarkan apa adanya
    return templatePesan.value
      .replace(/\{nama_tamu\}/g, nama)
      .replace(/\{link_undangan\}/g, link);
  }

  const tamuBelum = computed(
    () =>
      (store.daftarTamu || []).filter((t) => t.hadir === null || t.hadir === undefined)
        .length,
  );

  const filteredTamu = computed(() => {
    let list = store.daftarTamu || [];
    if (searchTamu.value) {
      const q = searchTamu.value.toLowerCase();
      list = list.filter(
        (t) =>
          t.nama.toLowerCase().includes(q) ||
          (t.whatsapp || "").includes(q),
      );
    }
    if (filterStatus.value === "hadir") {
      list = list.filter((t) => t.hadir === true);
    } else if (filterStatus.value === "tidak") {
      list = list.filter((t) => t.hadir === false);
    } else if (filterStatus.value === "belum") {
      list = list.filter((t) => t.hadir === null || t.hadir === undefined);
    }
    return list;
  });

  const allFilteredSelected = computed(() => {
    if (!filteredTamu.value.length) return false;
    return filteredTamu.value.every((t) => selectedIds.value.includes(t.id));
  });

  function showToast(msg) {
    toastMsg.value = msg;
    setTimeout(() => {
      toastMsg.value = "";
    }, 2800);
  }

  async function copyLink() {
    // Copy pesan lengkap (template + link), bukan hanya link saja
    const pesan = buildMessageForGuest({ nama: namaTamu.value });
    try {
      await navigator.clipboard.writeText(pesan);
      copied.value = true;
      showToast("Pesan & link disalin ke clipboard");
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    } catch {
      showToast("Gagal menyalin pesan");
    }
  }

  async function shareUndangan() {
    const pesan = buildMessageForGuest({ nama: namaTamu.value });
    const url = `https://wa.me/?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function syncPublicSlugFromDomain() {
    store.slug = publicSlug.value;
  }

  function ensureTamuList() {
    if (!store.daftarTamu) store.daftarTamu = [];
  }

  function resetTamuForm() {
    const initial = {};
    tamuFormFields.value.forEach((field) => {
      initial[field.key] = field.defaultValue ?? "";
    });
    tamuForm.value = initial;
  }

  function openTamuModal() {
    resetTamuForm();
    editingTamuId.value = null;
    tamuModalOpen.value = true;
  }

  function openEditTamu(tamu) {
    // Isi form dengan data tamu yang ada
    const form = {};
    tamuFormFields.value.forEach((field) => {
      form[field.key] = tamu[field.key] ?? field.defaultValue ?? "";
    });
    // Pastikan nama selalu ada
    form.nama = tamu.nama ?? "";
    tamuForm.value = form;
    editingTamuId.value = tamu.id;
    tamuModalOpen.value = true;
  }

  function salinLinkTamu(tamu) {
    // Copy pesan lengkap dengan nama tamu spesifik
    const pesan = buildMessageForGuest(tamu);
    navigator.clipboard.writeText(pesan).then(() => {
      showToast(`Pesan untuk "${tamu.nama}" disalin`);
    }).catch(() => {
      showToast("Gagal menyalin pesan");
    });
  }

  function closeTamuModal() {
    tamuModalOpen.value = false;
  }

  function openTemplateModal() {
    templateModalOpen.value = true;
  }

  function closeTemplateModal() {
    templateModalOpen.value = false;
  }

  function validateTamuForm() {
    for (const field of tamuFormFields.value) {
      const val = String(tamuForm.value[field.key] ?? "").trim();
      if (field.required && !val) {
        showToast(`${field.label} wajib diisi`);
        return false;
      }
    }
    const nama = String(tamuForm.value.nama ?? "").trim();
    if (!nama) {
      showToast("Nama tamu wajib diisi");
      return false;
    }
    return true;
  }

  function buildTamuRecordFromForm() {
    const nama = String(tamuForm.value.nama ?? "").trim();
    const record = {
      id: Date.now(),
      nama,
      hadir: null,
      jumlah: null,
    };
    tamuFormFields.value.forEach((field) => {
      if (field.key === "nama") return;
      const raw = tamuForm.value[field.key];
      if (field.key === "whatsapp") {
        record.whatsapp = String(raw ?? "").replace(/\D/g, "");
        return;
      }
      record[field.key] = String(raw ?? "").trim();
    });
    return record;
  }

  function submitTamuForm() {
    if (!validateTamuForm()) return;
    ensureTamuList();
    if (editingTamuId.value) {
      // Mode edit — update record yang ada
      const idx = store.daftarTamu.findIndex((t) => t.id === editingTamuId.value);
      if (idx !== -1) {
        const updated = { ...store.daftarTamu[idx] };
        tamuFormFields.value.forEach((field) => {
          const raw = tamuForm.value[field.key];
          if (field.key === "whatsapp") {
            updated.whatsapp = String(raw ?? "").replace(/\D/g, "");
          } else if (field.key !== "nama") {
            updated[field.key] = String(raw ?? "").trim();
          }
        });
        updated.nama = String(tamuForm.value.nama ?? "").trim();
        store.daftarTamu[idx] = updated;
        showToast(`Tamu "${updated.nama}" diperbarui`);
      }
      editingTamuId.value = null;
    } else {
      const record = buildTamuRecordFromForm();
      store.daftarTamu.push(record);
      showToast(`Tamu "${record.nama}" ditambahkan`);
    }
    closeTamuModal();
  }

  function saveTemplateModal() {
    closeTemplateModal();
    showToast("Template pesan disimpan");
  }

  function hapusTamu(id) {
    store.daftarTamu = (store.daftarTamu || []).filter((t) => t.id !== id);
    selectedIds.value = selectedIds.value.filter((x) => x !== id);
  }

  function hapusTerpilih() {
    if (!selectedIds.value.length) {
      showToast("Pilih tamu terlebih dahulu");
      return;
    }
    if (!confirm(`Hapus ${selectedIds.value.length} tamu terpilih?`)) return;
    const set = new Set(selectedIds.value);
    store.daftarTamu = (store.daftarTamu || []).filter((t) => !set.has(t.id));
    selectedIds.value = [];
    showToast("Tamu terpilih dihapus");
  }

  function toggleSelect(id) {
    if (selectedIds.value.includes(id)) {
      selectedIds.value = selectedIds.value.filter((x) => x !== id);
    } else {
      selectedIds.value = [...selectedIds.value, id];
    }
  }

  function toggleSelectAll() {
    if (allFilteredSelected.value) {
      const ids = new Set(filteredTamu.value.map((t) => t.id));
      selectedIds.value = selectedIds.value.filter((id) => !ids.has(id));
    } else {
      const merged = new Set([
        ...selectedIds.value,
        ...filteredTamu.value.map((t) => t.id),
      ]);
      selectedIds.value = [...merged];
    }
  }

  function normalizeWa(num) {
    let n = String(num || "").replace(/\D/g, "");
    if (n.startsWith("0")) n = `62${n.slice(1)}`;
    if (!n.startsWith("62") && n.length >= 9) n = `62${n}`;
    return n;
  }

  function openWhatsApp(tamu) {
    const text = encodeURIComponent(buildMessageForGuest(tamu));
    const phone = normalizeWa(tamu.whatsapp);
    const url = phone
      ? `https://wa.me/${phone}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function kirimKeTerpilih() {
    const list = (store.daftarTamu || []).filter((t) =>
      selectedIds.value.includes(t.id),
    );
    if (!list.length) {
      showToast("Pilih minimal satu tamu");
      return;
    }
    list.forEach((tamu, i) => {
      setTimeout(() => openWhatsApp(tamu), i * 400);
    });
    showToast(`Membuka WhatsApp untuk ${list.length} tamu`);
  }

  function kirimKeSatu(tamu) {
    openWhatsApp(tamu);
  }

  function triggerImport() {
    importInput.value?.click();
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const isXlsx = /\.xlsx?$/i.test(file.name);

    if (isXlsx) {
      // Baca file Excel dengan SheetJS
      import("xlsx").then(({ read, utils }) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = new Uint8Array(ev.target.result);
            const workbook = read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            // Konversi ke array of objects
            const rows = utils.sheet_to_json(sheet, { defval: "" });
            if (!rows.length) { showToast("File kosong"); return; }
            ensureTamuList();
            let added = 0;
            rows.forEach((row, idx) => {
              // Coba berbagai nama kolom: nama/Nama/NAME, whatsapp/no/No/phone
              const nama = String(
                row.nama || row.Nama || row.NAMA || row.name || row.Name || ""
              ).trim();
              // Skip kalau nama adalah header itu sendiri
              if (!nama || /^(nama|name)$/i.test(nama)) return;
              const wa = String(
                row.whatsapp || row.Whatsapp || row.WhatsApp || row.no || row.No ||
                row.phone || row.Phone || row.nomor || row.Nomor || ""
              ).replace(/\D/g, "");
              store.daftarTamu.push({
                id: Date.now() + idx,
                nama,
                whatsapp: wa,
                hadir: null,
                jumlah: null,
              });
              added++;
            });
            showToast(`${added} tamu diimpor dari Excel`);
          } catch (err) {
            showToast("Gagal membaca file Excel");
            console.error(err);
          }
        };
        reader.readAsArrayBuffer(file);
      }).catch(() => showToast("Gagal memuat library Excel"));
      return;
    }

    // CSV / TXT
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result || "");
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (!lines.length) { showToast("File kosong"); return; }

      ensureTamuList();
      let added = 0;
      // Skip header row — deteksi kalau baris pertama adalah header (tidak ada angka di kolom kedua)
      const firstParts = lines[0].split(/[,;\t]/).map((p) => p.trim().toLowerCase());
      const isHeader = firstParts[0] === "nama" || firstParts[0] === "name" || firstParts[0] === "no" || firstParts[0] === "no.";
      const startIdx = isHeader ? 1 : 0;
      lines.slice(startIdx).forEach((line, idx) => {
        const parts = line.split(/[,;\t]/).map((p) => p.trim());
        const nama = parts[0];
        if (!nama) return;
        const whatsapp = (parts[1] || "").replace(/\D/g, "");
        store.daftarTamu.push({
          id: Date.now() + idx,
          nama,
          whatsapp,
          hadir: null,
          jumlah: null,
        });
        added++;
      });
      showToast(`${added} tamu diimpor`);
    };
    reader.readAsText(file);
  }

  function resetTemplate() {
    templatePesan.value = DEFAULT_TEMPLATE;
    showToast("Template dikembalikan ke default");
  }

  function statusLabel(tamu) {
    if (tamu.hadir === true) return "Hadir";
    if (tamu.hadir === false) return "Tidak Hadir";
    return "Belum konfirmasi";
  }

  function statusClass(tamu) {
    if (tamu.hadir === true) return "hadir";
    if (tamu.hadir === false) return "tidak";
    return "belum";
  }

  return {
    store,
    namaTamu,
    searchTamu,
    filterStatus,
    copied,
    toastMsg,
    selectedIds,
    tamuModalOpen,
    templateModalOpen,
    tamuForm,
    tamuFormFields,
    importInput,
    publicSlug,
    undanganLink,
    templatePesan,
    templatePreview,
    filteredTamu,
    tamuBelum,
    allFilteredSelected,
    copyLink,
    shareUndangan,
    syncPublicSlugFromDomain,
    openTamuModal,
    closeTamuModal,
    openEditTamu,
    salinLinkTamu,
    submitTamuForm,
    openTemplateModal,
    closeTemplateModal,
    saveTemplateModal,
    hapusTamu,
    hapusTerpilih,
    toggleSelect,
    toggleSelectAll,
    kirimKeTerpilih,
    kirimKeSatu,
    triggerImport,
    handleImportFile,
    resetTemplate,
    statusLabel,
    statusClass,
    buildMessageForGuest,
  };
}
