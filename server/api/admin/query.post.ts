/**
 * POST /api/admin/query
 *
 * Generic server-side Supabase proxy untuk operasi yang butuh service role key.
 * Wajib kirim header `Authorization: Bearer <token>` dari /api/auth/login.
 * Hak akses per peran (lihat authorize() di bawah):
 *   - admin     : semua tabel & operasi di ALLOWED_TABLES
 *   - customer  : hanya data miliknya sendiri (filter dipaksa di server)
 *   - tanpa login: hanya membuat order baru (checkout publik) dan membaca promo
 *
 * Request body:
 * {
 *   table: string,
 *   operation: 'select' | 'insert' | 'update' | 'delete' | 'upsert',
 *   data?: object,           // untuk insert/update/upsert
 *   match?: object,          // untuk where clause: { id: 1 }
 *   select?: string,         // kolom yang diselect, default '*'
 *   order?: { column: string, ascending?: boolean },
 *   single?: boolean,
 * }
 */

// Tabel yang boleh diakses via endpoint ini
const ALLOWED_TABLES = [
  "customers", "orders", "invitations", "promos",
  "foto_assets", "musik_assets", "guests", "ucapan",
];


const isPlain = (v: unknown) =>
  v === null || ["string", "number", "boolean"].includes(typeof v);
const isObj = (v: unknown) =>
  v !== null && typeof v === "object" && !Array.isArray(v);

type Verdict =
  | { ok: true; data: any; match: any }
  | { ok: false; status: number; message: string };

const deny = (status: number, message: string): Verdict => ({
  ok: false,
  status,
  message,
});

// Kolom yang tidak boleh bocor ke non-admin
const SECRET_COLUMNS: Record<string, string[]> = {
  customers: ["password"],
  orders: ["login_password"],
};

function authorize(
  session: SessionPayload | null,
  req: { table: string; operation: string; data: any; match: any; select?: string },
): Verdict {
  const { table, operation } = req;
  let { data, match } = req;

  if (match != null && (!isObj(match) || !Object.values(match).every(isPlain))) {
    return deny(400, "Parameter match tidak valid.");
  }
  if (data != null && !isObj(data)) {
    return deny(400, "Parameter data tidak valid.");
  }

  // ── Admin: akses penuh ──
  if (session?.role === "admin") return { ok: true, data, match };

  // Non-admin: kolom select dibatasi ke karakter aman
  if (req.select && !/^[\w\s,*]+$/.test(req.select)) {
    return deny(400, "Parameter select tidak valid.");
  }

  // ── Tanpa login ──
  if (!session) {
    if (table === "promos" && operation === "select") {
      return { ok: true, data, match };
    }
    if (table === "orders" && operation === "insert" && data) {
      // Checkout publik: order selalu masuk sebagai "menunggu konfirmasi"
      return {
        ok: true,
        match,
        data: {
          ...data,
          status: "menunggu_konfirmasi",
          pembayaran_dikonfirmasi: false,
          customer_id: null,
          catatan_admin: "",
          confirmed_at: null,
        },
      };
    }
    return deny(401, "Login diperlukan.");
  }

  // ── Customer: hanya data miliknya ──
  const ownerCol: Record<string, string> = {
    customers: "id",
    orders: "customer_id",
    invitations: "customer_id",
  };

  if (table === "promos" && operation === "select") {
    return { ok: true, data, match };
  }
  if (!(table in ownerCol)) return deny(403, "Akses ditolak.");
  const col = ownerCol[table];

  if (operation === "select") {
    return { ok: true, data, match: { ...(match || {}), [col]: session.id } };
  }

  if (table === "invitations") {
    if (operation === "insert" && data) {
      return { ok: true, match, data: { ...data, customer_id: session.id } };
    }
    if (operation === "update" && data && match && Object.keys(match).length) {
      const { customer_id: _c, ...safe } = data;
      return { ok: true, data: safe, match: { ...match, customer_id: session.id } };
    }
    if (operation === "delete" && match && Object.keys(match).length) {
      return { ok: true, data, match: { ...match, customer_id: session.id } };
    }
  }

  if (table === "orders" && operation === "insert" && data) {
    return {
      ok: true,
      match,
      data: {
        ...data,
        status: "menunggu_konfirmasi",
        pembayaran_dikonfirmasi: false,
        customer_id: session.id,
        catatan_admin: "",
        confirmed_at: null,
      },
    };
  }

  return deny(403, "Akses ditolak.");
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const serviceKey = config.supabaseServiceRoleKey as string;

  if (!serviceKey) {
    setResponseStatus(event, 500);
    return { ok: false, message: "Service key tidak dikonfigurasi." };
  }

  const body = await readBody(event);
  let { table, operation, data, match, select: selectCols, order, single } = body || {};

  // Validasi tabel
  if (!table || !ALLOWED_TABLES.includes(table)) {
    setResponseStatus(event, 400);
    return { ok: false, message: `Tabel tidak diizinkan: ${table}` };
  }

  // Validasi operasi
  const allowedOps = ["select", "insert", "update", "delete", "upsert"];
  if (!operation || !allowedOps.includes(operation)) {
    setResponseStatus(event, 400);
    return { ok: false, message: `Operasi tidak valid: ${operation}` };
  }

  // Otorisasi: tentukan siapa yang boleh melakukan apa
  const session = getSession(event);
  const verdict = authorize(session, { table, operation, data, match, select: selectCols });
  if (!verdict.ok) {
    setResponseStatus(event, verdict.status);
    return { ok: false, message: verdict.message };
  }
  data = verdict.data;
  match = verdict.match;

  const supabase = createSupabaseAdmin(serviceKey);

  try {
    let query: any;

    if (operation === "select") {
      query = supabase.from(table).select(selectCols || "*");
      if (match) {
        for (const [key, val] of Object.entries(match)) {
          query = query.eq(key, val);
        }
      }
      if (order) {
        query = query.order(order.column, { ascending: order.ascending ?? false });
      }
      if (single) {
        query = query.single();
      }
    } else if (operation === "insert") {
      query = supabase.from(table).insert(data).select();
      if (single) query = query.single();
    } else if (operation === "update") {
      query = supabase.from(table).update(data);
      if (match) {
        for (const [key, val] of Object.entries(match)) {
          query = query.eq(key, val);
        }
      }
      query = query.select();
      if (single) query = query.single();
    } else if (operation === "upsert") {
      query = supabase.from(table).upsert(data).select();
      if (single) query = query.single();
    } else if (operation === "delete") {
      query = supabase.from(table).delete();
      if (match) {
        for (const [key, val] of Object.entries(match)) {
          query = query.eq(key, val);
        }
      }
    }

    const { data: result, error } = await query;

    if (error) {
      setResponseStatus(event, 500);
      return { ok: false, message: error.message, error };
    }

    // Jangan bocorkan kolom password ke non-admin
    let out = result;
    if (session?.role !== "admin" && SECRET_COLUMNS[table]) {
      const strip = (row: any) => {
        if (!row || typeof row !== "object") return row;
        const copy = { ...row };
        for (const c of SECRET_COLUMNS[table]) delete copy[c];
        return copy;
      };
      out = Array.isArray(result) ? result.map(strip) : strip(result);
    }

    return { ok: true, data: out };
  } catch (err: any) {
    setResponseStatus(event, 500);
    return { ok: false, message: err?.message || "Server error" };
  }
});
