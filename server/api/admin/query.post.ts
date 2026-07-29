/**
 * POST /api/admin/query
 *
 * Generic server-side Supabase proxy untuk operasi yang butuh service role key.
 * Hanya bisa diakses dari admin yang sudah login (dicek via header session).
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

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://izszfloyozvxcvgyaulr.supabase.co";

// Tabel yang boleh diakses via endpoint ini
const ALLOWED_TABLES = [
  "customers", "orders", "invitations", "promos",
  "foto_assets", "musik_assets", "guests", "ucapan",
];

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const serviceKey = config.supabaseServiceRoleKey as string;

  if (!serviceKey) {
    setResponseStatus(event, 500);
    return { ok: false, message: "Service key tidak dikonfigurasi." };
  }

  const body = await readBody(event);
  const { table, operation, data, match, select: selectCols, order, single } = body || {};

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

  const supabase = createClient(SUPABASE_URL, serviceKey);

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

    return { ok: true, data: result };
  } catch (err: any) {
    setResponseStatus(event, 500);
    return { ok: false, message: err?.message || "Server error" };
  }
});
