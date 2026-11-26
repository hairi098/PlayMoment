/**
 * Cek apakah email / nomor WhatsApp sudah terdaftar di tabel customers.
 * Nomor di database bisa tersimpan dengan format berbeda (+62…, 62…, 0…),
 * jadi semua variannya dicek.
 */
export function normalizePhoneDigits(raw: unknown): string {
  return String(raw || "")
    .replace(/\D/g, "")
    .replace(/^62/, "")
    .replace(/^0+/, "");
}

const escapeLike = (v: string) => v.replace(/[\\%_]/g, (c) => `\\${c}`);

export async function findDuplicates(
  supabase: any,
  { email, digits }: { email?: string; digits?: string },
): Promise<{ emailTaken: boolean; hpTaken: boolean }> {
  let emailTaken = false;
  let hpTaken = false;

  if (email) {
    const { data, error } = await supabase
      .from("customers")
      .select("id")
      .ilike("email", escapeLike(email))
      .limit(1);
    if (error) throw new Error(error.message);
    emailTaken = !!data?.length;
  }

  if (digits) {
    const variants = [`+62${digits}`, `62${digits}`, `0${digits}`, digits];
    const { data, error } = await supabase
      .from("customers")
      .select("id")
      .in("hp", variants)
      .limit(1);
    if (error) throw new Error(error.message);
    hpTaken = !!data?.length;
  }

  return { emailTaken, hpTaken };
}
