"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isAdminConfigured } from "@/lib/firebase/admin";
import { getVerifiedSession } from "@/lib/firebase/session";
import { isArabicEnabled } from "@/lib/cms/locale-settings";

/** Read the current Arabic-enabled flag (for the admin dashboard). */
export async function getArabicEnabled(): Promise<boolean> {
  return isArabicEnabled();
}

/** Enable/disable the Arabic site. Admin only. Revalidates public + admin. */
export async function setArabicEnabled(
  enabled: boolean
): Promise<{ ok: boolean; error?: string }> {
  const session = await getVerifiedSession();
  if (!session) return { ok: false, error: "Unauthorized" };
  if (!isAdminConfigured()) return { ok: false, error: "Firebase not configured" };

  await getAdminDb().collection("cms_settings").doc("site").set(
    {
      arabicEnabled: enabled,
      updatedBy: session.uid,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // Revalidate every page under the locale layout (both /en and /ar) + admin.
  // Guarded so a revalidation hiccup can't make a successful write report failure
  // (pages also self-refresh within their 60s ISR window).
  try {
    revalidatePath("/[locale]", "layout");
    revalidatePath("/admin");
  } catch (err) {
    console.error("setArabicEnabled — revalidate warning:", err);
  }
  return { ok: true };
}
