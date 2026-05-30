// locale-settings.ts — server-side read of global site locale settings.
// Currently: whether the Arabic site is enabled. Fails safe to enabled.
import "server-only";

import { isAdminConfigured, getAdminDb } from "@/lib/firebase/admin";

const SETTINGS_DOC = { collection: "cms_settings", id: "site" };

/**
 * Whether the Arabic locale is enabled.
 * Default true (Arabic on). Returns false only when explicitly disabled.
 * Fails safe to true on missing config / missing doc / any error.
 */
export async function isArabicEnabled(): Promise<boolean> {
  try {
    if (!isAdminConfigured()) return true;
    const snap = await getAdminDb()
      .collection(SETTINGS_DOC.collection)
      .doc(SETTINGS_DOC.id)
      .get();
    if (!snap.exists) return true;
    return snap.data()?.arabicEnabled === false ? false : true;
  } catch {
    return true;
  }
}
