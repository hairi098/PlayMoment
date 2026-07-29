/** Prefix path yang wajib login customer */
export const CUSTOMER_PROTECTED_PREFIXES = [
  "/dashboard",
  "/undangan",
  "/invoices",
  "/bantuan",
  "/pengaturan",
  "/tutorial",
  "/tutorial-detail",
  "/atur-undangan",
  "/edit-undangan"
];

/** Halaman publik (marketing & checkout sebelum punya akun) */
export const PUBLIC_MARKETING_PREFIXES = [
  "/paket",
  "/checkout",
  "/invoice",
  "/thankyou"
];

export function isAdminRoute(path) {
  return path === "/admin" || path.startsWith("/admin/");
}

export function isCustomerProtectedRoute(path) {
  return CUSTOMER_PROTECTED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}

export function isCustomerLoggedIn(currentUser) {
  return currentUser?.role === "customer";
}

export function isAdminLoggedIn(currentUser) {
  return currentUser?.role === "admin";
}
