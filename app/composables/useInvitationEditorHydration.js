import { useUndanganStore } from "~/stores/useUndanganStore";
import { useAccountStore } from "~/stores/useAccountStore";
import { getThemeSlugByName } from "~/config/themes";
import { isEditorId } from "~/utils/invitation-id";

// Hanya return value kalau benar-benar plain object (bukan string/array/null)
function safeObj(val) {
  return val && typeof val === "object" && !Array.isArray(val) ? val : null;
}

function applyInvitationToStore(store, invitation, { editorId, publicSlug }) {
  // ✅ Reset store dulu agar data undangan lain (dari localStorage) tidak bocor
  store.$reset();

  store.editorId = editorId;
  store.slug = publicSlug;

  if (invitation.editorData) {
    const data = invitation.editorData;
    if (data.editorId) store.editorId = data.editorId;
    if (data.slug) store.slug = data.slug;
    if (data.temaSlug) store.temaSlug = data.temaSlug;
    // Guard: hanya apply kalau nilainya object valid, bukan string corrupt
    const undangan = safeObj(data.undangan);
    if (undangan) Object.assign(store.undangan, undangan);
    const sectionContents = safeObj(data.sectionContents);
    if (sectionContents) Object.assign(store.sectionContents, sectionContents);
    const sectionStates = safeObj(data.sectionStates);
    if (sectionStates) store.sectionStates = sectionStates;
    const customColors = safeObj(data.customColors);
    if (customColors) Object.assign(store.customColors, customColors);
    const textColors = safeObj(data.textColors);
    if (textColors) Object.assign(store.textColors, textColors);
    if (Array.isArray(data.rsvpFields)) store.rsvpFields = data.rsvpFields;
    if (Array.isArray(data.daftarTamu)) store.daftarTamu = data.daftarTamu;
    // Sync semua flag boolean
    if (typeof data.undanganAktif === "boolean")
      store.undanganAktif = data.undanganAktif;
    if (typeof data.musikAktif === "boolean")
      store.musikAktif = data.musikAktif;
    if (typeof data.rsvpAktif === "boolean")
      store.rsvpAktif = data.rsvpAktif;
    if (typeof data.soundEffectAktif === "boolean")
      store.soundEffectAktif = data.soundEffectAktif;
    if (typeof data.soundTypingAktif === "boolean")
      store.soundTypingAktif = data.soundTypingAktif;
    if (typeof data.showLogoWatermark === "boolean")
      store.showLogoWatermark = data.showLogoWatermark;
    if (typeof data.showMusikWatermark === "boolean")
      store.showMusikWatermark = data.showMusikWatermark;
    return true;
  }

  // Fallback: editorData belum ada, pakai data dasar invitation
  store.undangan.judul = invitation.judul || "";
  store.undangan.domain = publicSlug;
  store.undangan.fotoCouple = invitation.foto || store.undangan.fotoCouple;
  const temaSlug = getThemeSlugByName(invitation.tema);
  if (temaSlug) {
    store.setTema(temaSlug);
    store.applyTemaColors(temaSlug);
  }
  return true;
}

/** Muat undangan untuk editor — lookup via editorId numerik. */
export async function hydrateUndanganStoreFromEditor(editorId) {
  const store = useUndanganStore();
  const accountStore = useAccountStore();
  const key = String(editorId);

  // Reset flag expired/nonaktif agar editor selalu bisa diakses
  store.undanganExpired = false;
  store.undanganAktif = true;

  let invitation = accountStore.getInvitationByEditorId(key);

  // URL lama memakai slug publik di path editor
  if (!invitation && !isEditorId(key)) {
    invitation = accountStore.getInvitationBySlug(key);
  }
  if (!invitation) return false;

  if (!invitation.editorId) {
    invitation.editorId = key;
  }

  // Jika editor_data belum ada (karena loadInvitations tidak select editor_data lagi),
  // ambil sekarang dari DB
  if (!invitation.editorData) {
    await accountStore.loadInvitationEditorData(key);
    invitation = accountStore.getInvitationByEditorId(key);
    if (!invitation) return false;
  }

  return applyInvitationToStore(store, invitation, {
    editorId: invitation.editorId,
    publicSlug: invitation.slug,
  });
}

/** Muat undangan untuk preview publik — lookup via slug domain. */
export function hydrateUndanganStoreFromPublicSlug(publicSlug) {
  const store = useUndanganStore();
  const accountStore = useAccountStore();
  const invitation = accountStore.getInvitationBySlug(String(publicSlug));
  if (!invitation) return false;

  // Reset dulu — jangan pakai nilai lama dari cache/localStorage
  store.undanganExpired = false;
  store.undanganAktif = true;

  // ── Cek 1: Akun customer expired? → undangan tidak bisa diakses
  const customer = accountStore.getCustomerForInvitation(invitation);
  if (customer && accountStore.isCustomerExpired(customer)) {
    store.undanganExpired = true;
    store.undanganAktif = false;
    return "expired";
  }
  store.undanganExpired = false;

  // ── Cek 2: Status aktif/nonaktif undangan
  const isAktif =
    invitation.editorData?.undanganAktif ?? invitation.undanganAktif ?? true; // default aktif jika field tidak ada

  if (!isAktif) return "nonaktif";

  return applyInvitationToStore(store, invitation, {
    editorId: invitation.editorId || "",
    publicSlug: invitation.slug,
  });
}
