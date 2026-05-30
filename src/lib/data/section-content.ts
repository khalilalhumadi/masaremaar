// section-content.ts — server-side read of cms_sections published content (Phase 3).
// Returns the publishedData override map for a section, or null to fall back to content.ts.
import "server-only";

import { getAdminDb, isAdminConfigured } from "@/lib/firebase/admin";
import type { SectionOverride } from "@/lib/cms/section-schema";

/**
 * Read the published content override for a section.
 * Returns null (→ caller uses content.ts defaults) when:
 *  - Firebase is not configured
 *  - the section doc or its publishedData is missing
 *  - any Firestore error occurs (never crash the public page)
 */
export async function getPublishedSectionData(
  key: string
): Promise<SectionOverride | null> {
  if (!isAdminConfigured()) return null;
  try {
    const snap = await getAdminDb().collection("cms_sections").doc(key).get();
    if (!snap.exists) return null;
    const data = snap.data();
    const published = data?.publishedData;
    if (!published || typeof published !== "object") return null;
    return published as SectionOverride;
  } catch (err) {
    console.error(`getPublishedSectionData(${key}) — Firestore error:`, err);
    return null;
  }
}
