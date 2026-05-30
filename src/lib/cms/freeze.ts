// freeze.ts — server-side freeze check via Firebase Admin SDK.
// Returns true when a CMS section is frozen (public page shows Under Construction).
// Fails safe: returns false (show real content) on any error or missing config.

import "server-only";
import { isAdminConfigured, getAdminDb } from "@/lib/firebase/admin";

/**
 * Check whether a CMS section is frozen.
 * Frozen   → public page shows Under Construction.
 * Unfrozen → public page shows normal content.
 *
 * Safe defaults:
 *  - No FIREBASE_SERVICE_ACCOUNT → false (show content)
 *  - Firestore doc missing       → false (show content)
 *  - Any network / SDK error     → false (show content, never crash)
 */
export async function isSectionFrozen(sectionKey: string): Promise<boolean> {
  try {
    if (!isAdminConfigured()) return false;
    const db = getAdminDb();
    const snap = await db.collection("cms_sections").doc(sectionKey).get();
    if (!snap.exists) return false;
    return snap.data()?.isFrozen === true;
  } catch {
    return false;
  }
}
