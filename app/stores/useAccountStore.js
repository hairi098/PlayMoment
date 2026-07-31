// stores/useAccountStore.js
// Versi Supabase — menggantikan versi localStorage
import { defineStore } from "pinia";
import { supabase } from "../lib/supabase";
import { createEditorId } from "~/utils/invitation-id";
import { getDefaultMaxUndangan } from "~/utils/customer-quota";
import {
  ADMIN_USERS,
  DEFAULT_CUSTOMER_PASSWORD,
  normalizeEmail,
} from "~/utils/auth-credentials";
import { formatRupiahNumber, getPackageDays } from "~/config/paket";
import { calculatePromoDiscount } from "~/utils/promo";

/**
 * Helper: jalankan operasi DB via server route (pakai service key).
 * Dipakai untuk semua operasi yang butuh bypass RLS:
 * insert/update/delete pada customers, orders, invitations, promos.
 */
async function adminQuery(payload) {
  const result = await $fetch("/api/admin/query", {
    method: "POST",
    body: payload,
  });
  if (!result.ok) {
    throw new Error(result.message || "Admin query gagal");
  }
  return result.data;
}

const palette = [
  "#7ecec4",
  "#f6ad55",
  "#b794f4",
  "#68d391",
  "#fc8181",
  "#4299e1",
];
const resolveDays = (paket) => getPackageDays(paket);

export const useAccountStore = defineStore("account", {
  state: () => ({
    currentUser: null,
    customers: [],
    orders: [],
    invitations: [],
    promos: [],
    _loaded: false,
  }),

  getters: {
    activeCustomers: (state) =>
      state.customers.filter((c) => c.status === "aktif"),
    defaultCustomer: (state) =>
      state.customers.find((c) => c.status === "aktif") ??
      state.customers[0] ??
      null,
    pendingOrders: (state) =>
      state.orders.filter(
        (o) => o.status === "menunggu_konfirmasi" || o.status === "pending",
      ),
    ordersAwaitingConfirmation: (state) =>
      state.orders.filter((o) => o.status === "menunggu_konfirmasi"),

    invitationCountByCustomer: (state) => (customerOrRef) => {
      if (!customerOrRef) return 0;
      const id =
        typeof customerOrRef === "object" ? customerOrRef.id : customerOrRef;
      const email =
        typeof customerOrRef === "object" ? customerOrRef.email : null;
      if (id)
        return state.invitations.filter(
          (i) => String(i.customerId) === String(id),
        ).length;
      if (email)
        return state.invitations.filter((i) => i.email === email).length;
      return 0;
    },

    customerInvitations: (state) => {
      if (state.currentUser?.role !== "customer") return [];
      const customerId = state.currentUser?.id;
      if (customerId)
        return state.invitations.filter(
          (i) => String(i.customerId) === String(customerId),
        );
      return state.invitations.filter(
        (i) => i.email === state.currentUser?.email,
      );
    },

    getCustomerById: (state) => (id) =>
      state.customers.find((c) => c.id === id) ?? null,
    getCustomerByEmail: (state) => (email) => {
      const key = normalizeEmail(email);
      return (
        state.customers.find((c) => normalizeEmail(c.email) === key) ?? null
      );
    },
    getOrderByInvoiceCode: (state) => (code) =>
      state.orders.find(
        (o) =>
          String(o.invoiceCode || "").toUpperCase() ===
          String(code || "").toUpperCase(),
      ) ?? null,
    getPromoByCode: (state) => (code) => {
      const key = String(code || "")
        .trim()
        .toUpperCase();
      return state.promos.find((p) => p.code === key && p.active) ?? null;
    },
    customerOrders: (state) => (customerRef) => {
      if (!customerRef) return [];
      const id = typeof customerRef === "object" ? customerRef.id : customerRef;
      const email =
        typeof customerRef === "object"
          ? normalizeEmail(customerRef.email || "")
          : "";
      return state.orders.filter((o) => {
        if (id && String(o.customerId) === String(id)) return true;
        if (email && normalizeEmail(o.email) === email) return true;
        return false;
      });
    },
    customerInvitationQuota: (state) => (customerOrRef) => {
      if (!customerOrRef)
        return { used: 0, max: 0, remaining: 0, canCreate: false };
      const id =
        typeof customerOrRef === "object" ? customerOrRef.id : customerOrRef;
      let customer =
        typeof customerOrRef === "object"
          ? customerOrRef
          : (state.customers.find((c) => c.id === id) ?? null);
      // Fallback ke currentUser kalau customers array belum di-load
      if (!customer && state.currentUser?.id === id) {
        customer = state.currentUser;
      }
      if (!customer) return { used: 0, max: 0, remaining: 0, canCreate: false };
      const max = customer.maxUndangan ?? getDefaultMaxUndangan(customer.paket);
      const used = state.invitations.filter(
        (i) => String(i.customerId) === String(customer.id),
      ).length;
      const remaining = Math.max(0, max - used);
      return {
        used,
        max,
        remaining,
        canCreate: customer.status === "aktif" && remaining > 0,
      };
    },
  },

  actions: {
    // ── LOAD SEMUA DATA DARI SUPABASE ──────────────────────────
    async loadAll(force = false) {
      if (this._loaded && !force) return;
      await Promise.all([
        this.loadCustomers(),
        this.loadOrders(),
        this.loadInvitations(),
        this.loadPromos(),
      ]);
      this._loaded = true;

      // Validasi session: kalau customer yang login sudah dihapus dari DB → logout
      const user = this.currentUser;
      if (user?.role === "customer" && user?.email) {
        try {
          // Verifikasi via server API agar tidak bypass RLS
          const res = await $fetch("/api/auth/verify-session", {
            method: "POST",
            body: { email: user.email },
          }).catch(() => null);
          if (res && res.exists === false) {
            this.currentUser = null;
            if (import.meta.client) {
              await navigateTo("/login");
            }
          }
        } catch {
          // Network error — biarkan session tetap ada
        }
      }
    },

    async loadCustomers() {
      try {
        const data = await adminQuery({
          table: "customers",
          operation: "select",
          select: "*",
          order: { column: "id", ascending: true },
        });
        this.customers = (data || []).map(mapCustomer);
      } catch (err) {
        console.error("loadCustomers:", err);
      }
    },

    async loadOrders() {
      try {
        const data = await adminQuery({
          table: "orders",
          operation: "select",
          select: "*",
          order: { column: "created_at", ascending: false },
        });
        this.orders = (data || []).map(mapOrder);
      } catch (err) {
        console.error("loadOrders:", err);
      }
    },

    async loadInvitations() {
      const currentUser = this.currentUser;
      const isAdmin = currentUser?.role === "admin";
      const isCustomer = currentUser?.role === "customer";

      let query = supabase
        .from("invitations")
        // Jangan select editor_data di sini — terlalu besar & mengandung daftarTamu
        // editor_data hanya diambil saat dibutuhkan via loadInvitationEditorData()
        .select("id, editor_id, customer_id, customer_name, email, judul, slug, paket, tanggal_acara, tema, tema_slug, status, views, link, foto, theme_color, thumb_bg, thumb_color, monogram, undangan_aktif, musik_aktif, rsvp_aktif, sound_effect_aktif, sound_typing_aktif, show_logo_watermark, show_musik_watermark, template_pesan_kirim, created_at, updated_at")
        .order("created_at", { ascending: false });

      // Customer hanya bisa load undangan milik sendiri
      if (isCustomer && currentUser?.id) {
        query = query.eq("customer_id", currentUser.id);
      } else if (!isAdmin) {
        // Bukan admin dan bukan customer yang login → tidak load apa-apa
        // (preview publik pakai loadPublicInvitationBySlug yang terpisah)
        // JANGAN reset this.invitations — bisa hapus data yang sudah di-load via loadPublicInvitationBySlug
        return;
      }

      const { data, error } = await query;
      if (error) {
        console.error("loadInvitations:", error);
        return;
      }
      this.invitations = data.map(mapInvitation);
    },

    // Ambil editor_data untuk satu undangan — dipanggil saat editor/preview butuh data lengkap
    async loadInvitationEditorData(editorId) {
      const { data, error } = await supabase
        .from("invitations")
        .select("id, editor_id, slug, editor_data")
        .eq("editor_id", String(editorId))
        .single();
      if (error || !data) return null;
      // Merge editor_data ke invitation yang sudah ada di store
      const inv = this.invitations.find((i) => String(i.editorId) === String(editorId));
      if (inv) {
        inv.editorData = data.editor_data;
      }
      return data.editor_data;
    },

    // Ambil satu undangan by slug untuk preview publik — tanpa perlu login
    async loadPublicInvitationBySlug(slug) {
      try {
        // Pakai server API route agar tidak terhalang RLS policy anon
        const data = await $fetch(`/api/public/invitation/${encodeURIComponent(String(slug))}`);
        if (!data) return null;
        const inv = mapInvitation(data);
        inv.editorData = data.editor_data;
        // Upsert ke invitations array (untuk dipakai hydration)
        const idx = this.invitations.findIndex((i) => i.slug === slug);
        if (idx !== -1) {
          this.invitations[idx] = { ...this.invitations[idx], ...inv };
        } else {
          this.invitations.push(inv);
        }
        return inv;
      } catch (err) {
        console.error("loadPublicInvitationBySlug:", err);
        return null;
      }
    },

    async loadPromos() {
      try {
        // Admin perlu baca semua promo (aktif dan nonaktif) → pakai adminQuery
        // Anon hanya bisa baca promo aktif via RLS policy
        const isAdmin = this.currentUser?.role === "admin";
        if (isAdmin) {
          const data = await adminQuery({
            table: "promos",
            operation: "select",
            select: "*",
            order: { column: "id", ascending: true },
          });
          this.promos = (data || []).map(mapPromo);
        } else {
          const { data, error } = await supabase
            .from("promos")
            .select("*")
            .order("id");
          if (!error) this.promos = (data || []).map(mapPromo);
        }
      } catch (err) {
        console.error("loadPromos:", err);
      }
    },

    // ── AUTH ────────────────────────────────────────────────────
    setCurrentUser(user) {
      this.currentUser = user;
    },
    logout() {
      this.currentUser = null;
    },

    async authenticate(email, password) {
      const key = normalizeEmail(email);

      // Gunakan server API route agar credentials tidak dicek dari client
      // (menghindari query langsung ke Supabase dengan anon key)
      try {
        const result = await $fetch("/api/auth/login", {
          method: "POST",
          body: { email: key, password },
        });
        if (!result.success) {
          return { success: false, message: result.message };
        }
        return {
          success: true,
          token: `mock-token-${result.user.role}-${Date.now()}`,
          user: result.user,
        };
      } catch (err) {
        // Fallback ke client-side check jika server route belum tersedia
        // (misal saat development tanpa service key)
        console.warn("Server auth gagal, fallback ke client-side:", err);
      }

      // ── Fallback client-side (development only — tanpa service key) ──
      // Kalau server route gagal karena service key belum diset,
      // hanya izinkan admin login (hardcoded), customer tidak bisa login
      const admin = ADMIN_USERS.find(
        (u) => normalizeEmail(u.email) === key && u.password === password,
      );
      if (admin) {
        const { password: _pw, ...user } = admin;
        return {
          success: true,
          token: `mock-token-admin-${Date.now()}`,
          user: { ...user, loginAt: new Date().toISOString() },
        };
      }

      // Customer login tidak bisa fallback ke client-side karena customers table
      // sudah di-lock oleh RLS — kembalikan error yang jelas
      return {
        success: false,
        message: "Server autentikasi tidak tersedia. Hubungi admin.",
      };
    },

    // ── CUSTOMERS ───────────────────────────────────────────────
    async addCustomer(payload) {
      const days = resolveDays(payload.paket);
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + days);
      const maxUndangan =
        payload.maxUndangan ?? getDefaultMaxUndangan(payload.paket);

      const row = {
        nama: payload.nama,
        email: normalizeEmail(payload.email),
        password: payload.password?.trim() || DEFAULT_CUSTOMER_PASSWORD,
        hp: payload.hp || "-",
        paket: payload.paket,
        max_undangan: maxUndangan,
        status: payload.status || "aktif",
        color: palette[this.customers.length % palette.length],
        expiry_date: expiry.toISOString(),
        tgl_daftar: new Date().toISOString(),
      };

      try {
        const data = await adminQuery({ table: "customers", operation: "insert", data: row, single: true });
        const customer = mapCustomer(data);
        this.customers.push(customer);
        return customer;
      } catch (err) {
        console.error("addCustomer:", err);
        return null;
      }
    },

    async updateCustomer(id, patch) {
      const target = this.customers.find((c) => c.id === id);
      if (!target) return;

      const row = {};
      if (patch.nama !== undefined) row.nama = patch.nama;
      if (patch.email !== undefined) row.email = normalizeEmail(patch.email);
      if (patch.password !== undefined) row.password = patch.password;
      if (patch.hp !== undefined) row.hp = patch.hp;
      if (patch.paket !== undefined) {
        row.paket = patch.paket;
        // Hanya hitung expiry dari paket kalau expiryDate tidak di-pass manual
        if (patch.expiryDate === undefined) {
          const days = resolveDays(patch.paket);
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + days);
          row.expiry_date = expiry.toISOString();
        }
      }
      if (patch.maxUndangan !== undefined) row.max_undangan = patch.maxUndangan;
      if (patch.status !== undefined) row.status = patch.status;
      if (patch.expiryDate !== undefined) row.expiry_date = patch.expiryDate;

      try {
        await adminQuery({ table: "customers", operation: "update", data: row, match: { id } });
        Object.assign(target, patch);
      } catch (err) {
        console.error("updateCustomer:", err);
      }
    },

    async deleteCustomer(id) {
      try {
        await adminQuery({ table: "customers", operation: "delete", match: { id } });
        this.customers = this.customers.filter((c) => c.id !== id);
      } catch (err) {
        console.error("deleteCustomer:", err);
      }
    },

    // ── ORDERS ──────────────────────────────────────────────────
    async addOrder(payload) {
      const row = {
        id: payload.id || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        invoice_code: payload.invoiceCode,
        customer_id: payload.customerId ?? null,
        nama: payload.nama,
        email: normalizeEmail(payload.email),
        hp: payload.hp || "-",
        paket: payload.paket,
        harga: payload.harga,
        diskon: payload.diskon ?? 0,
        kode_unik: payload.kodeUnik ?? 0,
        total: payload.total,
        tanggal: payload.tanggal || new Date().toISOString(),
        status: payload.status || "menunggu_konfirmasi",
        max_undangan:
          payload.maxUndangan ?? getDefaultMaxUndangan(payload.paket),
        catatan: payload.catatan || "",
        catatan_admin: payload.catatanAdmin || "",
        pembayaran_dikonfirmasi: payload.pembayaranDikonfirmasi ?? false,
        login_password: payload.loginPassword || DEFAULT_CUSTOMER_PASSWORD,
      };

      try {
        const data = await adminQuery({ table: "orders", operation: "insert", data: row, single: true });
        const order = mapOrder(data);
        this.orders.unshift(order);
        return order;
      } catch (err) {
        console.error("addOrder:", err);
        return null;
      }
    },

    async updateOrder(id, patch) {
      const target = this.orders.find((o) => o.id === id);
      if (!target) return;

      const row = {};
      if (patch.status !== undefined) row.status = patch.status;
      if (patch.catatanAdmin !== undefined)
        row.catatan_admin = patch.catatanAdmin;
      if (patch.pembayaranDikonfirmasi !== undefined)
        row.pembayaran_dikonfirmasi = patch.pembayaranDikonfirmasi;
      if (patch.confirmedAt !== undefined) row.confirmed_at = patch.confirmedAt;
      if (patch.customerId !== undefined) row.customer_id = patch.customerId;
      if (patch.email !== undefined) row.email = normalizeEmail(patch.email);

      try {
        await adminQuery({ table: "orders", operation: "update", data: row, match: { id } });
        Object.assign(target, patch);
      } catch (err) {
        console.error("updateOrder:", err);
      }
    },

    async deleteOrder(id) {
      try {
        await adminQuery({ table: "orders", operation: "delete", match: { id } });
        this.orders = this.orders.filter((o) => o.id !== id);
      } catch (err) {
        console.error("deleteOrder:", err);
      }
    },

    async confirmOrder(orderId, { maxUndangan, catatanAdmin, password }) {
      const order = this.orders.find((o) => o.id === orderId);
      if (!order) return { ok: false, message: "Pesanan tidak ditemukan." };

      let customer = this.getCustomerByEmail(order.email);
      const loginPassword = password || order.loginPassword || DEFAULT_CUSTOMER_PASSWORD;

      // Hitung expiry: perpanjang dari tanggal expiry lama (kalau belum expired) atau dari sekarang
      const days = resolveDays(order.paket);
      const baseDate = customer?.expiryDate && new Date(customer.expiryDate) > new Date()
        ? new Date(customer.expiryDate)  // masih aktif → perpanjang dari expiry lama
        : new Date();                    // sudah expired / baru → mulai dari sekarang
      baseDate.setDate(baseDate.getDate() + days);
      const newExpiryDate = baseDate.toISOString();

      if (!customer) {
        customer = await this.addCustomer({
          nama: order.nama,
          email: order.email,
          password: loginPassword,
          hp: order.hp,
          paket: order.paket,
          maxUndangan: maxUndangan ?? 1,
          status: "aktif",
        });
        if (!customer) {
          return { ok: false, message: "Gagal membuat akun customer." };
        }
        // Override expiry yang baru dihitung addCustomer dengan expiry kita
        await adminQuery({ table: "customers", operation: "update", data: { expiry_date: newExpiryDate }, match: { id: customer.id } });
        customer.expiryDate = newExpiryDate;
      } else {
        await this.updateCustomer(customer.id, {
          status: "aktif",
          paket: order.paket,
          maxUndangan: maxUndangan ?? customer.maxUndangan ?? 1,
          password: loginPassword,
          expiryDate: newExpiryDate, // set manual agar tidak override dari paket saja
        });
      }

      const patch = {
        status: "dikonfirmasi",
        pembayaranDikonfirmasi: true,
        confirmedAt: new Date().toISOString(),
        catatanAdmin: catatanAdmin || "Dikonfirmasi oleh admin",
        customerId: customer.id,
      };

      await this.updateOrder(orderId, patch);

      return { ok: true, order, loginPassword };
    },

    async rejectOrder(orderId, alasan) {
      const order = this.orders.find((o) => o.id === orderId);
      if (!order) return { ok: false, message: "Pesanan tidak ditemukan." };

      const patch = {
        status: "batal",
        catatanAdmin: alasan || "Dibatalkan oleh admin",
      };

      await this.updateOrder(orderId, patch);
      return { ok: true, order };
    },

    async submitPublicRsvp(editorId, rsvpData) {
      let invitation = this.getInvitationByEditorId(editorId);
      if (!invitation) {
        await this.loadInvitations();
        invitation = this.getInvitationByEditorId(editorId);
      }
      if (!invitation) return { ok: false, message: "Undangan tidak ditemukan." };

      const snapshot = invitation.editorData || {};
      if (!snapshot.daftarTamu) snapshot.daftarTamu = [];

      const nameKey = String(rsvpData.name || "").trim().toLowerCase();
      let index = snapshot.daftarTamu.findIndex(
        (t) => String(t.nama || "").trim().toLowerCase() === nameKey
      );

      const isHadir = rsvpData.attendance === "Hadir" || rsvpData.attendance === 1 || rsvpData.attendance === true || String(rsvpData.attendance).toLowerCase() === "hadir";
      const tamuRecord = {
        nama: rsvpData.name,
        whatsapp: rsvpData.phone || rsvpData.whatsapp || "",
        hadir: isHadir,
        jumlah: parseInt(rsvpData.jumlah) || 1,
        ucapan: rsvpData.comment || rsvpData.ucapan || "",
      };

      if (index !== -1) {
        snapshot.daftarTamu[index] = {
          ...snapshot.daftarTamu[index],
          ...tamuRecord,
        };
      } else {
        tamuRecord.id = Date.now();
        snapshot.daftarTamu.push(tamuRecord);
      }

      const patch = {
        editor_data: snapshot,
      };

      const { error } = await supabase
        .from("invitations")
        .update(patch)
        .eq("editor_id", editorId);

      if (error) {
        console.error("submitPublicRsvp error:", error);
        return { ok: false, message: error.message };
      }

      invitation.editorData = snapshot;
      this.invitations = this.invitations.map(i => i.editorId === editorId ? { ...i, editorData: snapshot } : i);

      const store = useUndanganStore();
      if (String(store.editorId) === String(editorId)) {
        store.daftarTamu = snapshot.daftarTamu;
      }

      return { ok: true, rsvpData, daftarTamu: snapshot.daftarTamu };
    },

    // ── PROMOS ──────────────────────────────────────────────────
    validatePromo(kode, subtotal) {
      if (!kode || !String(kode).trim()) return { ok: false, message: "Masukkan kode promo." };
      const promo = this.getPromoByCode(String(kode).trim());
      if (!promo) return { ok: false, message: "Kode promo tidak ditemukan atau tidak aktif." };
      if (promo.minBelanja && subtotal < promo.minBelanja) {
        return { ok: false, message: `Minimum belanja Rp ${formatRupiahNumber(promo.minBelanja)} untuk kode ini.` };
      }
      const diskon = calculatePromoDiscount(promo, subtotal);
      if (!diskon || diskon <= 0) return { ok: false, message: "Promo tidak berlaku untuk transaksi ini." };
      return {
        ok: true,
        diskon,
        promoKode: promo.code,
        promoLabel: promo.label || promo.code,
      };
    },
    async addPromo(payload) {
      const row = toDbPromo(payload);
      try {
        const data = await adminQuery({ table: "promos", operation: "insert", data: row, single: true });
        const promo = mapPromo(data);
        this.promos.push(promo);
        return promo;
      } catch (err) {
        console.error("addPromo:", err);
        return null;
      }
    },

    async updatePromo(id, patch) {
      const target = this.promos.find((p) => p.id === id);
      if (!target) return;
      const row = toDbPromo({ ...target, ...patch });
      try {
        await adminQuery({ table: "promos", operation: "update", data: row, match: { id } });
        Object.assign(target, patch);
      } catch (err) {
        console.error("updatePromo:", err);
      }
    },

    async deletePromo(id) {
      try {
        await adminQuery({ table: "promos", operation: "delete", match: { id } });
        this.promos = this.promos.filter((p) => p.id !== id);
      } catch (err) {
        console.error("deletePromo:", err);
      }
    },

    // ── INVITATIONS ─────────────────────────────────────────────
    getInvitationByEditorId(editorId) {
      return this.invitations.find((i) => i.editorId === editorId) ?? null;
    },

    getInvitationBySlug(slug) {
      return this.invitations.find((i) => i.slug === slug) ?? null;
    },

    getCustomerForInvitation(invitation) {
      if (!invitation) return null;
      const customerId = invitation.customerId;
      if (customerId) {
        const c = this.customers.find((c) => String(c.id) === String(customerId));
        if (c) return c;
      }
      if (invitation.email) {
        const key = normalizeEmail(invitation.email);
        const c = this.customers.find((c) => normalizeEmail(c.email) === key);
        if (c) return c;
      }
      return null;
    },

    isCustomerExpired(customer) {
      if (!customer || !customer.expiryDate) return false;
      return new Date(customer.expiryDate) < new Date();
    },

    async addInvitation(payload) {
      // Load customers kalau belum ada
      if (this.customers.length === 0) {
        await this.loadCustomers();
      }

      let customer = this.getCustomerById(payload.customerId);

      // Fallback: cari by currentUser.id
      if (!customer && this.currentUser?.id) {
        customer = this.getCustomerById(this.currentUser.id);
      }

      // Fallback terakhir: pakai currentUser langsung (customers mungkin belum di-load)
      if (!customer && this.currentUser?.role === "customer") {
        customer = this.currentUser;
      }

      if (!customer) {
        console.error("addInvitation: customer tidak ditemukan untuk id:", payload.customerId);
        return null;
      }

      // Load invitations kalau belum ada supaya quota counting akurat
      if (this.invitations.length === 0) {
        await this.loadInvitations();
      }

      // Cek kuota sebelum insert
      const quota = this.customerInvitationQuota(customer);
      if (!quota.canCreate) {
        console.error("addInvitation: kuota habis atau akun tidak aktif. quota:", quota);
        return null;
      }

      const editorId = payload.editorId || createEditorId();

      const row = {
        id: payload.id || `INV-${editorId}`,
        editor_id: editorId,
        customer_id: payload.customerId,
        customer_name: customer.nama,
        email: normalizeEmail(customer.email),
        judul: payload.judul || "The Wedding Of",
        slug: payload.slug || editorId,
        paket: customer.paket,
        tanggal_acara: payload.tanggalAcara || null,
        tema: payload.tema || "Tema 1",
        tema_slug: payload.temaSlug || "tema-1",
        status: payload.status || "aktif",
        tamu: 0,
        ucapan: 0,
        link: payload.link || `playmoment.id/${editorId}`,
        views: 0,
        foto: payload.foto || null,
        undangan_aktif: payload.undanganAktif ?? true,
        musik_aktif: payload.musikAktif ?? true,
        rsvp_aktif: payload.rsvpAktif ?? true,
        theme_color:
          payload.themeColor ??
          "linear-gradient(135deg, #2a9d8f 0%, #52b8ac 100%)",
        thumb_bg: payload.thumbBg ?? "#2a9d8f",
        thumb_color: payload.thumbColor ?? "#fff",
        monogram:
          payload.monogram ??
          customer.nama
            .split(" ")
            .map((x) => x[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        editor_data: payload.editorData ?? {},
      };

      try {
        const data = await adminQuery({ table: "invitations", operation: "insert", data: row, single: true });
        const invitation = mapInvitation(data);
        this.invitations.unshift(invitation);
        return invitation;
      } catch (err) {
        console.error("addInvitation:", err);
        return null;
      }
    },

    async updateInvitation(id, patch) {
      const target = this.invitations.find((i) => i.id === id);
      if (!target) return;
      const row = toDbInvitationPatch(patch);
      try {
        await adminQuery({ table: "invitations", operation: "update", data: row, match: { id } });
        Object.assign(target, patch);
      } catch (err) {
        console.error("updateInvitation:", err);
      }
    },

    async deleteInvitation(id) {
      try {
        await adminQuery({ table: "invitations", operation: "delete", match: { id } });
        this.invitations = this.invitations.filter((i) => i.id !== id);
      } catch (err) {
        console.error("deleteInvitation:", err);
      }
    },

    async saveEditorSnapshot(editorId, snapshot) {
      let invitation = this.getInvitationByEditorId(editorId);
      // Jika belum loaded (misal akses langsung via URL), load dulu dari DB
      if (!invitation) {
        await this.loadInvitations();
        invitation = this.getInvitationByEditorId(editorId);
      }
      if (!invitation) {
        console.warn(
          "saveEditorSnapshot: invitation not found for editorId:",
          editorId,
        );
        return;
      }

      const fotoCouple = snapshot?.undangan?.fotoCouple;

      // Tentukan status kolom berdasarkan undanganAktif
      // - undanganAktif = true  → 'aktif'
      // - undanganAktif = false → 'nonaktif'
      // Ini agar status badge di halaman /undangan (customer) sinkron dengan toggle editor
      const undanganAktifVal =
        typeof snapshot?.undanganAktif === "boolean"
          ? snapshot.undanganAktif
          : invitation.undanganAktif ?? true;
      const derivedStatus = undanganAktifVal ? "aktif" : "nonaktif";

      // Sync semua kolom dedicated agar tabel tidak stale
      const patch = {
        editor_data: snapshot,
        judul: snapshot?.undangan?.judul || invitation.judul,
        foto:
          fotoCouple && !fotoCouple.startsWith("/assets")
            ? fotoCouple
            : invitation.foto,
        // Status sinkron dengan toggle undanganAktif
        status: derivedStatus,
        // Kolom boolean status — selalu sync dari snapshot
        undangan_aktif: undanganAktifVal,
        musik_aktif:
          typeof snapshot?.musikAktif === "boolean"
            ? snapshot.musikAktif
            : invitation.musikAktif ?? true,
        rsvp_aktif:
          typeof snapshot?.rsvpAktif === "boolean"
            ? snapshot.rsvpAktif
            : invitation.rsvpAktif ?? true,
        sound_effect_aktif:
          typeof snapshot?.soundEffectAktif === "boolean"
            ? snapshot.soundEffectAktif
            : invitation.soundEffectAktif ?? false,
        sound_typing_aktif:
          typeof snapshot?.soundTypingAktif === "boolean"
            ? snapshot.soundTypingAktif
            : invitation.soundTypingAktif ?? false,
        // Watermark logo PlayMoment + sosmed (admin only, tapi tetap disinkron dari snapshot)
        show_logo_watermark:
          typeof snapshot?.showLogoWatermark === "boolean"
            ? snapshot.showLogoWatermark
            : invitation.showLogoWatermark ?? true,
        // Watermark nama musik
        show_musik_watermark:
          typeof snapshot?.showMusikWatermark === "boolean"
            ? snapshot.showMusikWatermark
            : invitation.showMusikWatermark ?? true,
        // Tema
        tema_slug: snapshot?.temaSlug || invitation.temaSlug || "tema-1",
        // Tanggal acara dari data undangan
        tanggal_acara:
          snapshot?.undangan?.tanggalAkad || invitation.tanggalAcara || null,
      };

      if (snapshot?.slug) patch.slug = snapshot.slug;
      if (snapshot?.undangan?.domain) {
        patch.link = snapshot.undangan.domain.includes("/")
          ? snapshot.undangan.domain.replace(/^https?:\/\//, "")
          : `playmoment.id/${snapshot.undangan.domain}`;
      }

      try {
        await adminQuery({
          table: "invitations",
          operation: "update",
          data: patch,
          match: { editor_id: editorId },
        });
      } catch (err) {
        console.error("saveEditorSnapshot:", err);
        return;
      }
      // Sync in-memory store juga 
      Object.assign(invitation, {
        editorData: snapshot,
        judul: patch.judul,
        foto: patch.foto,
        status: patch.status,
        slug: patch.slug ?? invitation.slug,
        link: patch.link ?? invitation.link,
        undanganAktif: patch.undangan_aktif,
        musikAktif: patch.musik_aktif,
        rsvpAktif: patch.rsvp_aktif,
        soundEffectAktif: patch.sound_effect_aktif,
        soundTypingAktif: patch.sound_typing_aktif,
        showLogoWatermark: patch.show_logo_watermark,
        showMusikWatermark: patch.show_musik_watermark,
        temaSlug: patch.tema_slug,
        tanggalAcara: patch.tanggal_acara,
      });
    },

    // ── HELPERS TAMBAHAN ────────────────────────────────────────
    async linkOrderToCustomerByInvoice(invoiceCode, customerId) {
      const order = this.getOrderByInvoiceCode(invoiceCode);
      if (!order) return { ok: false, message: "Kode invoice tidak ditemukan." };
      const customer = this.getCustomerById(customerId);
      if (!customer) return { ok: false, message: "Customer tidak ditemukan." };
      try {
        await adminQuery({
          table: "orders",
          operation: "update",
          data: { customer_id: customerId, email: normalizeEmail(customer.email) },
          match: { id: order.id },
        });
        order.customerId = customerId;
        order.email = normalizeEmail(customer.email);
        return { ok: true, order };
      } catch (err) {
        return { ok: false, message: err.message };
      }
    },

    async updateOrderFromInvoice(invoiceCode, patch) {
      const order = this.getOrderByInvoiceCode(invoiceCode);
      if (!order) return null;
      try {
        await adminQuery({ table: "orders", operation: "update", data: patch, match: { id: order.id } });
        Object.assign(order, patch);
        return order;
      } catch (err) {
        console.error("updateOrderFromInvoice:", err);
        return null;
      }
    },
  },

  persist: {
    key: "account-store",
    storage: typeof window !== "undefined" ? window.localStorage : null,
    paths: ["currentUser"],
  },
});

// ── MAPPER: database row → store object ─────────────────────────
function mapCustomer(row) {
  return {
    id: row.id,
    nama: row.nama,
    email: row.email,
    password: row.password,
    hp: row.hp,
    paket: row.paket,
    maxUndangan: row.max_undangan,
    status: row.status,
    color: row.color,
    expiryDate: row.expiry_date,
    tglDaftar: row.tgl_daftar,
  };
}

function mapOrder(row) {
  return {
    id: row.id,
    invoiceCode: row.invoice_code,
    customerId: row.customer_id,
    nama: row.nama,
    email: row.email,
    hp: row.hp,
    paket: row.paket,
    harga: row.harga,
    diskon: row.diskon,
    kodeUnik: row.kode_unik,
    total: row.total,
    tanggal: row.tanggal,
    status: row.status,
    maxUndangan: row.max_undangan,
    catatan: row.catatan,
    catatanAdmin: row.catatan_admin,
    pembayaranDikonfirmasi: row.pembayaran_dikonfirmasi,
    confirmedAt: row.confirmed_at,
    loginPassword: row.login_password,
  };
}

function mapInvitation(row) {
  return {
    id: row.id,
    editorId: row.editor_id,
    customerId: row.customer_id,
    customer: row.customer_name,
    email: row.email,
    judul: row.judul,
    slug: row.slug,
    paket: row.paket,
    tanggalAcara: row.tanggal_acara,
    tema: row.tema,
    temaSlug: row.tema_slug,
    status: row.status,
    tamu: row.tamu ?? 0,
    ucapan: row.ucapan ?? 0,
    link: row.link,
    views: row.views,
    foto: row.foto,
    themeColor: row.theme_color,
    thumbBg: row.thumb_bg,
    thumbColor: row.thumb_color,
    monogram: row.monogram,
    editorData: row.editor_data,
    undanganAktif: row.undangan_aktif ?? true,
    musikAktif: row.musik_aktif ?? true,
    rsvpAktif: row.rsvp_aktif ?? true,
    soundEffectAktif: row.sound_effect_aktif ?? false,
    soundTypingAktif: row.sound_typing_aktif ?? false,
    showLogoWatermark: row.show_logo_watermark ?? true,
    showMusikWatermark: row.show_musik_watermark ?? true,
  };
}

function mapPromo(row) {
  return {
    id: row.id,
    code: row.code,
    label: row.label,
    type: row.type,
    value: row.value,
    minBelanja: row.min_belanja,
    maxDiskon: row.max_diskon,
    active: row.active,
  };
}

function toDbPromo(p) {
  return {
    id: p.id,
    code: p.code,
    label: p.label,
    type: p.type,
    value: p.value,
    min_belanja: p.minBelanja,
    max_diskon: p.maxDiskon,
    active: p.active,
  };
}

function toDbInvitationPatch(patch) {
  const map = {
    editorId: "editor_id",
    customerId: "customer_id",
    customer: "customer_name",
    tanggalAcara: "tanggal_acara",
    temaSlug: "tema_slug",
    themeColor: "theme_color",
    thumbBg: "thumb_bg",
    thumbColor: "thumb_color",
    editorData: "editor_data",
    undanganAktif: "undangan_aktif",
    musikAktif: "musik_aktif",
    rsvpAktif: "rsvp_aktif",
  };
  const row = {};
  for (const [k, v] of Object.entries(patch)) {
    row[map[k] ?? k] = v;
  }
  return row;
}