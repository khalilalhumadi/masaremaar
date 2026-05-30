// projects.ts — server-side data access for cms_projects collection.
// Falls back to content.ts if Firebase is not configured or Firestore errors.
import "server-only";

import { getAdminDb, isAdminConfigured } from "@/lib/firebase/admin";
import { CONTENT, IMAGES, type Project } from "@/lib/content";
import { type CmsProject, type CategoryKey, CATEGORY_LABELS } from "@/lib/cms-types";

const COLLECTION = "cms_projects";

function toIso(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (typeof (val as { toDate?: () => Date }).toDate === "function") {
    return (val as { toDate: () => Date }).toDate().toISOString();
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rawToCms(id: string, d: Record<string, any>): CmsProject {
  return {
    id,
    slug: d.slug ?? id,
    title_en: d.title_en ?? "",
    title_ar: d.title_ar ?? "",
    description_en: d.description_en ?? "",
    description_ar: d.description_ar ?? "",
    location_en: d.location_en ?? "",
    location_ar: d.location_ar ?? "",
    categoryKey: (d.categoryKey ?? "infrastructure") as CategoryKey,
    year: d.year ?? "",
    coverImageUrl: d.coverImageUrl ?? "",
    modalImages: d.modalImages ?? [],
    sortOrder: d.sortOrder ?? 0,
    isPublished: d.isPublished ?? false,
    isFeatured: d.isFeatured ?? false,
    draft: d.draft ?? null,
    createdAt: toIso(d.createdAt),
    updatedAt: toIso(d.updatedAt),
    updatedBy: d.updatedBy ?? null,
    lastPublishedAt: toIso(d.lastPublishedAt),
  };
}

function cmsToPublic(p: CmsProject): Project {
  const label = CATEGORY_LABELS[p.categoryKey] ?? { en: p.categoryKey, ar: p.categoryKey };
  return {
    id: p.slug,
    title: { en: p.title_en, ar: p.title_ar || p.title_en },
    location: { en: p.location_en, ar: p.location_ar || p.location_en },
    category: { en: label.en, ar: label.ar },
    year: p.year,
    featured: p.isFeatured,
    desc: { en: p.description_en, ar: p.description_ar || p.description_en },
    coverImageUrl: p.coverImageUrl || IMAGES.project[p.slug] || IMAGES.hero,
  };
}

function contentFallback(): Project[] {
  return CONTENT.projectList.map((p) => ({
    ...p,
    coverImageUrl: IMAGES.project[p.id],
  }));
}

/** Public site: published projects ordered by sortOrder. Falls back to content.ts. */
export async function getProjects(): Promise<Project[]> {
  if (!isAdminConfigured()) return contentFallback();
  try {
    const db = getAdminDb();
    const snap = await db
      .collection(COLLECTION)
      .where("isPublished", "==", true)
      .orderBy("sortOrder", "asc")
      .get();
    if (snap.empty) return contentFallback();
    return snap.docs.map((d) => cmsToPublic(rawToCms(d.id, d.data())));
  } catch (err) {
    console.error("getProjects — Firestore error, using content.ts fallback:", err);
    return contentFallback();
  }
}

/** Admin: all projects (published + unpublished) ordered by sortOrder. */
export async function getAdminProjects(): Promise<CmsProject[]> {
  if (!isAdminConfigured()) return [];
  try {
    const db = getAdminDb();
    const snap = await db
      .collection(COLLECTION)
      .orderBy("sortOrder", "asc")
      .get();
    return snap.docs.map((d) => rawToCms(d.id, d.data()));
  } catch (err) {
    console.error("getAdminProjects — Firestore error:", err);
    return [];
  }
}

/** Admin: single project by slug / doc ID. */
export async function getAdminProject(id: string): Promise<CmsProject | null> {
  if (!isAdminConfigured()) return null;
  try {
    const db = getAdminDb();
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return rawToCms(doc.id, doc.data() as Record<string, unknown>);
  } catch (err) {
    console.error("getAdminProject — Firestore error:", err);
    return null;
  }
}
