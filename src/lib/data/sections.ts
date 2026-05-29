// sections.ts — Firestore data access for cms_sections collection (server-only).
// Falls back to hardcoded defaults if Firebase is not configured or Firestore errors.
import "server-only";

import { getAdminDb, isAdminConfigured } from "@/lib/firebase/admin";
import {
  type CmsSection,
  type SectionKey,
  SECTION_KEYS,
  SECTION_TITLES,
} from "@/lib/cms-types";

const COLLECTION = "cms_sections";

function buildDefaults(): CmsSection[] {
  return SECTION_KEYS.map((key) => ({
    sectionKey: key,
    title: SECTION_TITLES[key],
    isFrozen: false,
    status: "published" as const,
    lastEditedBy: null,
    lastEditedAt: null,
    lastPublishedBy: null,
    lastPublishedAt: null,
  }));
}

function toIso(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (typeof (val as { toDate?: () => Date }).toDate === "function") {
    return (val as { toDate: () => Date }).toDate().toISOString();
  }
  return null;
}

export async function getSections(): Promise<CmsSection[]> {
  if (!isAdminConfigured()) return buildDefaults();

  try {
    const db = getAdminDb();
    const snapshot = await db.collection(COLLECTION).get();

    if (snapshot.empty) {
      await seedSections();
      return buildDefaults();
    }

    const map = new Map<SectionKey, CmsSection>();
    for (const doc of snapshot.docs) {
      const d = doc.data();
      const key = doc.id as SectionKey;
      map.set(key, {
        sectionKey: key,
        title: d.title ?? SECTION_TITLES[key] ?? key,
        isFrozen: d.isFrozen ?? false,
        status: d.status ?? "published",
        lastEditedBy: d.lastEditedBy ?? null,
        lastEditedAt: toIso(d.lastEditedAt),
        lastPublishedBy: d.lastPublishedBy ?? null,
        lastPublishedAt: toIso(d.lastPublishedAt),
      });
    }

    // Return in canonical order; fill any missing key with the default
    const defaults = buildDefaults();
    return SECTION_KEYS.map(
      (key) => map.get(key) ?? defaults.find((s) => s.sectionKey === key)!
    );
  } catch (err) {
    console.error("getSections — Firestore error, using defaults:", err);
    return buildDefaults();
  }
}

// Seeds all 6 section docs on first admin login.
export async function seedSections(): Promise<void> {
  if (!isAdminConfigured()) return;
  const db = getAdminDb();
  const batch = db.batch();

  for (const key of SECTION_KEYS) {
    batch.set(db.collection(COLLECTION).doc(key), {
      sectionKey: key,
      title: SECTION_TITLES[key],
      isFrozen: false,
      status: "published",
      publishedData: null,
      draftData: null,
      lastEditedBy: null,
      lastEditedAt: null,
      lastPublishedBy: null,
      lastPublishedAt: null,
      createdAt: new Date(),
    });
  }

  await batch.commit();
}
