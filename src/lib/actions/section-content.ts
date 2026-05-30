"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isAdminConfigured } from "@/lib/firebase/admin";
import { getVerifiedSession } from "@/lib/firebase/session";
import { isEditableSection, type SectionOverride } from "@/lib/cms/section-schema";

type ActionResult = { ok: boolean; error?: string };

// Maps a section key to its public route segment (for revalidation).
const SECTION_PUBLIC_PATH: Record<string, string> = {
  about: "about",
  contact: "contact",
};

async function guard(key: string): Promise<{ uid: string } | { error: string }> {
  const session = await getVerifiedSession();
  if (!session) return { error: "Unauthorized" };
  if (!isAdminConfigured()) return { error: "Firebase not configured" };
  if (!isEditableSection(key)) return { error: "Section is not editable" };
  return { uid: session.uid };
}

/** Save work-in-progress to draftData. Does not change the public site. */
export async function saveSectionDraft(
  key: string,
  data: SectionOverride
): Promise<ActionResult> {
  const g = await guard(key);
  if ("error" in g) return { ok: false, error: g.error };

  await getAdminDb().collection("cms_sections").doc(key).set(
    {
      draftData: data,
      status: "draft",
      lastEditedBy: g.uid,
      lastEditedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  revalidatePath(`/admin/sections/${key}`);
  return { ok: true };
}

/** Publish: copy data into publishedData and revalidate the public pages. */
export async function publishSection(
  key: string,
  data: SectionOverride
): Promise<ActionResult> {
  const g = await guard(key);
  if ("error" in g) return { ok: false, error: g.error };

  await getAdminDb().collection("cms_sections").doc(key).set(
    {
      draftData: data,
      publishedData: data,
      status: "published",
      lastEditedBy: g.uid,
      lastEditedAt: FieldValue.serverTimestamp(),
      lastPublishedBy: g.uid,
      lastPublishedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  const path = SECTION_PUBLIC_PATH[key];
  if (path) {
    revalidatePath(`/en/${path}`);
    revalidatePath(`/ar/${path}`);
  }
  revalidatePath(`/admin/sections/${key}`);
  return { ok: true };
}
