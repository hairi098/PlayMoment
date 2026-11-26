// Helper: jalankan operasi DB via server route (/api/admin/query).
// - Mengirim token sesi di header Authorization.
// - Payload boleh berisi `notify` (teks sukses) dan `notifyId` (id toast, opsional).
// - Kegagalan pada operasi tulis (insert/update/delete) selalu menampilkan notifikasi error.
import { useAccountStore } from "~/stores/useAccountStore";

function describeFailure(err, serverMessage) {
  const status = err?.statusCode || err?.response?.status;
  const offline = typeof navigator !== "undefined" && navigator.onLine === false;
  if (offline || (!status && !serverMessage)) {
    return {
      title: "Tidak bisa terhubung ke server",
      description: "Periksa koneksi internet. Perubahan belum tersimpan.",
    };
  }
  if (status === 401) {
    return {
      title: "Sesi login berakhir",
      description: "Silakan login ulang. Perubahan belum tersimpan.",
    };
  }
  if (status === 403) {
    return { title: "Akses ditolak", description: "Kamu tidak punya izin untuk aksi ini." };
  }
  if (status === 429) {
    return { title: "Terlalu banyak permintaan", description: "Coba lagi sebentar lagi." };
  }
  return {
    title: "Gagal menyimpan ke database",
    description: serverMessage || err?.data?.message || err?.message || "Coba lagi.",
  };
}

export async function adminQuery(payload) {
  const { notify: successMsg, notifyId, ...body } = payload;
  const isWrite = !!body.operation && body.operation !== "select";
  const notify = import.meta.client ? useNotify() : null;
  const token = useAccountStore().currentUser?.sessionToken;

  const fail = (err, serverMessage) => {
    if (isWrite && notify) {
      const { title, description } = describeFailure(err, serverMessage);
      notify.error(title, { description, id: notifyId });
    }
  };

  let result;
  try {
    result = await $fetch("/api/admin/query", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body,
    });
  } catch (err) {
    fail(err);
    throw err;
  }

  if (!result.ok) {
    fail(null, result.message || "Admin query gagal");
    throw new Error(result.message || "Admin query gagal");
  }

  if (successMsg && notify) notify.success(successMsg, { id: notifyId });
  return result.data;
}
