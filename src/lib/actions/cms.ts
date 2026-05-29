"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isAdminConfigured } from "@/lib/firebase/admin";
import { getVerifiedSession } from "@/lib/firebase/session";
import type { SectionKey } from "@/lib/cms-types";

export async function toggleFreeze(
  sectionKey: SectionKey
): Promise<{ ok: boolean; error?: string }> {
  // Re-verify session in every action — never trust client state alone.
  const session = await getVerifiedSession();
  if (!session) return { ok: false, error: "Unauthorized" };
  if (!isAdminConfigured()) return { ok: false, error: "Firebase not configured" };

  const db = getAdminDb();
  const ref = db.collection("cms_sections").doc(sectionKey);
  const doc = await ref.get();
  if (!doc.exists) return { ok: false, error: "Section not found" };

  await ref.update({
    isFrozen: !doc.data()!.isFrozen,
    lastEditedBy: session.uid,
    lastEditedAt: FieldValue.serverTimestamp(),
  });

  revalidatePath("/admin");
  return { ok: true };
}
