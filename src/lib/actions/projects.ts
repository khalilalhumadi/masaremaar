"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isAdminConfigured } from "@/lib/firebase/admin";
import { getVerifiedSession } from "@/lib/firebase/session";
import type { CategoryKey } from "@/lib/cms-types";

export interface ProjectFormData {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  location_en: string;
  location_ar: string;
  categoryKey: CategoryKey;
  year: string;
  coverImageUrl: string;
  sortOrder: number;
  isPublished: boolean;
  isFeatured: boolean;
}

type ActionResult = { ok: boolean; error?: string };

async function verifyAdmin(): Promise<{ uid: string } | null> {
  const session = await getVerifiedSession();
  return session ?? null;
}

async function checkFreezeGate(db: FirebaseFirestore.Firestore): Promise<boolean> {
  const doc = await db.collection("cms_sections").doc("projects").get();
  return doc.exists ? Boolean(doc.data()?.isFrozen) : false;
}

/**
 * Save all project fields. If isPublished is true, checks the freeze gate first
 * and revalidates the public projects pages on success.
 */
export async function saveProject(
  projectId: string,
  data: ProjectFormData
): Promise<ActionResult> {
  const session = await verifyAdmin();
  if (!session) return { ok: false, error: "Unauthorized" };
  if (!isAdminConfigured()) return { ok: false, error: "Firebase not configured" };

  const db = getAdminDb();

  if (data.isPublished) {
    const frozen = await checkFreezeGate(db);
    if (frozen) {
      return { ok: false, error: "Projects section is frozen — unfreeze it in the dashboard before publishing." };
    }
  }

  await db.collection("cms_projects").doc(projectId).update({
    ...data,
    updatedBy: session.uid,
    updatedAt: FieldValue.serverTimestamp(),
    ...(data.isPublished ? { lastPublishedAt: FieldValue.serverTimestamp() } : {}),
  });

  if (data.isPublished) {
    revalidatePath("/en/projects");
    revalidatePath("/ar/projects");
  }
  revalidatePath("/admin/projects");

  return { ok: true };
}

/**
 * Toggle published status for a project from the list view.
 * Publishing checks the freeze gate; unpublishing always succeeds.
 */
export async function setProjectPublished(
  projectId: string,
  isPublished: boolean
): Promise<ActionResult> {
  const session = await verifyAdmin();
  if (!session) return { ok: false, error: "Unauthorized" };
  if (!isAdminConfigured()) return { ok: false, error: "Firebase not configured" };

  const db = getAdminDb();

  if (isPublished) {
    const frozen = await checkFreezeGate(db);
    if (frozen) {
      return { ok: false, error: "Projects section is frozen — unfreeze it in the dashboard first." };
    }
  }

  await db.collection("cms_projects").doc(projectId).update({
    isPublished,
    updatedBy: session.uid,
    updatedAt: FieldValue.serverTimestamp(),
    ...(isPublished ? { lastPublishedAt: FieldValue.serverTimestamp() } : {}),
  });

  revalidatePath("/en/projects");
  revalidatePath("/ar/projects");
  revalidatePath("/admin/projects");

  return { ok: true };
}
