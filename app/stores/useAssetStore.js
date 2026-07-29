// stores/useAssetStore.js
// Store untuk manajemen upload foto asset & musik di admin dashboard
import { defineStore } from "pinia";
import { supabase } from "../lib/supabase";

const KATEGORI_FOTO = ["background", "couple", "galeri", "dekorasi", "lainnya"];

// ── Sesuaikan dengan nama bucket Supabase kamu ──
const BUCKET_FOTO = "foto-assets";
const BUCKET_MUSIK = "musik-assets";

// Helper: operasi DB via server route (pakai service key, bypass RLS)
async function adminQuery(payload) {
  const result = await $fetch("/api/admin/query", {
    method: "POST",
    body: payload,
  });
  if (!result.ok) throw new Error(result.message || "Admin query gagal");
  return result.data;
}

export const useAssetStore = defineStore("asset", {
  state: () => ({
    fotoAsset: [],
    musikAsset: [],
    _nextFotoId: 100,
    _nextMusikId: 100,
  }),

  getters: {
    fotoByKategori: (state) => (kategori) => {
      if (!kategori) return state.fotoAsset;
      return state.fotoAsset.filter((f) => f.kategori === kategori);
    },
    kategoriList: () => KATEGORI_FOTO,
    totalFoto: (state) => state.fotoAsset.length,
    totalMusik: (state) => state.musikAsset.length,
  },

  actions: {
    // ── LOAD ALL ASSETS FROM DATABASE ──────────────────────────
    async loadAssets() {
      // Load Foto Assets
      const { data: fotoData, error: fotoError } = await supabase
        .from("foto_assets")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (fotoError) {
        console.error("loadAssets foto error:", fotoError);
      } else if (fotoData) {
        this.fotoAsset = fotoData.map((f) => ({
          id: f.id,
          nama: f.nama,
          kategori: f.kategori,
          url: f.url,
          storagePath: f.storage_path || null,
          ukuran: f.ukuran || "-",
          tipe: f.tipe || "image/jpeg",
          uploadedAt: f.uploaded_at
            ? new Date(f.uploaded_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-",
          deskripsi: f.deskripsi || "",
        }));
      }

      // Load Musik Assets
      const { data: musikData, error: musikError } = await supabase
        .from("musik_assets")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (musikError) {
        console.error("loadAssets musik error:", musikError);
      } else if (musikData) {
        this.musikAsset = musikData.map((m) => ({
          id: m.id,
          nama: m.nama,
          artis: m.artis || "-",
          url: m.url,
          storagePath: m.storage_path || null,
          ukuran: m.ukuran || "-",
          durasi: m.durasi || "-",
          tipe: m.tipe || "audio/mp3",
          uploadedAt: m.uploaded_at
            ? new Date(m.uploaded_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-",
          deskripsi: m.deskripsi || "",
        }));
      }
    },

    // ── UPLOAD KE SUPABASE STORAGE ──────────────
    async uploadFotoToStorage(file) {
      const ext = file.name.split(".").pop();
      const path = `foto/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from(BUCKET_FOTO)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET_FOTO).getPublicUrl(path);
      return { publicUrl: data.publicUrl, path };
    },

    async uploadMusikToStorage(file) {
      const ext = file.name.split(".").pop();
      const path = `musik/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from(BUCKET_MUSIK)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET_MUSIK).getPublicUrl(path);
      return { publicUrl: data.publicUrl, path };
    },

    // ── FOTO ASSET ──────────────────────────────
    async addFotoAsset(payload) {
      const id = `FA-${String(Math.floor(100 + Math.random() * 900))}`;
      const asset = {
        id,
        nama: payload.nama?.trim() || "Asset Foto",
        kategori: payload.kategori || "lainnya",
        url: payload.url,
        storage_path: payload._path || null,
        ukuran: payload.ukuran || "-",
        tipe: payload.tipe || "image/jpeg",
        uploaded_at: new Date().toISOString(),
        deskripsi: payload.deskripsi?.trim() || "",
      };

      try {
        await adminQuery({ table: "foto_assets", operation: "insert", data: asset });
      } catch (err) {
        console.error("addFotoAsset error:", err);
        throw err;
      }

      const mapped = {
        id: asset.id,
        nama: asset.nama,
        kategori: asset.kategori,
        url: asset.url,
        storagePath: asset.storage_path,
        ukuran: asset.ukuran,
        tipe: asset.tipe,
        uploadedAt: new Date(asset.uploaded_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        deskripsi: asset.deskripsi,
      };
      this.fotoAsset.unshift(mapped);
      return mapped;
    },

    async updateFotoAsset(id, patch) {
      const dbPatch = {
        nama: patch.nama,
        kategori: patch.kategori,
        deskripsi: patch.deskripsi,
      };

      try {
        await adminQuery({ table: "foto_assets", operation: "update", data: dbPatch, match: { id } });
        const target = this.fotoAsset.find((f) => f.id === id);
        if (target) Object.assign(target, patch);
        return { ok: true };
      } catch (err) {
        console.error("updateFotoAsset error:", err);
        return { ok: false, message: err.message };
      }
    },

    async deleteFotoAsset(id) {
      // Hapus dari storage dulu kalau ada path-nya
      const target = this.fotoAsset.find((f) => f.id === id);
      if (target?.storagePath) {
        await supabase.storage.from(BUCKET_FOTO).remove([target.storagePath]);
      }
      try {
        await adminQuery({ table: "foto_assets", operation: "delete", match: { id } });
        this.fotoAsset = this.fotoAsset.filter((f) => f.id !== id);
      } catch (err) {
        console.error("deleteFotoAsset error:", err);
      }
    },

    // ── MUSIK ASSET ─────────────────────────────
    async addMusikAsset(payload) {
      const id = `MU-${String(Math.floor(100 + Math.random() * 900))}`;
      const asset = {
        id,
        nama: payload.nama?.trim() || "Lagu Baru",
        artis: payload.artis?.trim() || "-",
        url: payload.url,
        storage_path: payload._path || null,
        ukuran: payload.ukuran || "-",
        durasi: payload.durasi || "-",
        tipe: payload.tipe || "audio/mp3",
        uploaded_at: new Date().toISOString(),
        deskripsi: payload.deskripsi?.trim() || "",
      };

      try {
        await adminQuery({ table: "musik_assets", operation: "insert", data: asset });
      } catch (err) {
        console.error("addMusikAsset error:", err);
        throw err;
      }

      const mapped = {
        id: asset.id,
        nama: asset.nama,
        artis: asset.artis,
        url: asset.url,
        storagePath: asset.storage_path,
        ukuran: asset.ukuran,
        durasi: asset.durasi,
        tipe: asset.tipe,
        uploadedAt: new Date(asset.uploaded_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        deskripsi: asset.deskripsi,
      };
      this.musikAsset.unshift(mapped);
      return mapped;
    },

    async updateMusikAsset(id, patch) {
      const dbPatch = {
        nama: patch.nama,
        artis: patch.artis,
        deskripsi: patch.deskripsi,
      };
      try {
        await adminQuery({ table: "musik_assets", operation: "update", data: dbPatch, match: { id } });
        const target = this.musikAsset.find((m) => m.id === id);
        if (target) Object.assign(target, patch);
        return { ok: true };
      } catch (err) {
        console.error("updateMusikAsset error:", err);
        return { ok: false, message: err.message };
      }
    },

    async deleteMusikAsset(id) {
      const target = this.musikAsset.find((m) => m.id === id);
      if (target?.storagePath) {
        await supabase.storage.from(BUCKET_MUSIK).remove([target.storagePath]);
      }
      try {
        await adminQuery({ table: "musik_assets", operation: "delete", match: { id } });
        this.musikAsset = this.musikAsset.filter((m) => m.id !== id);
      } catch (err) {
        console.error("deleteMusikAsset error:", err);
      }
    },
  },
});