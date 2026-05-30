"use server";

import { getAdminStorage, isAdminConfigured } from "@/lib/firebase/admin";
import { getVerifiedSession } from "@/lib/firebase/session";

/**
 * Upload a project cover image via the Admin SDK (server-to-server).
 * Avoids browser → Firebase Storage CORS entirely.
 * Returns the public download URL on success.
 */
export async function uploadProjectImage(
  projectId: string,
  formData: FormData
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const session = await getVerifiedSession();
  if (!session) return { ok: false, error: "Unauthorized" };
  if (!isAdminConfigured()) return { ok: false, error: "Firebase not configured" };

  const file = formData.get("file");
  if (!file || typeof file === "string") return { ok: false, error: "No file provided" };

  const blob = file as File;
  if (!blob.type.startsWith("image/")) return { ok: false, error: "Only image files are allowed" };
  if (blob.size > 5 * 1024 * 1024) return { ok: false, error: "Image must be under 5 MB" };

  const ext = (blob.name.split(".").pop() ?? "jpg").toLowerCase();
  const path = `projects/${projectId}/${Date.now()}.${ext}`;

  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const bucket = getAdminStorage().bucket(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!
  );

  try {
    await bucket.file(path).save(buffer, {
      // contentType must be a top-level option, not nested under metadata.
      // resumable: false forces a single-request upload — resumable sessions
      // can hang on first attempt if there is any transient connectivity issue.
      contentType: blob.type,
      resumable: false,
    });
  } catch (err) {
    console.error("uploadProjectImage — GCS save error:", err);
    return { ok: false, error: "Storage upload failed. Check server logs." };
  }

  // No download token needed — Storage rules have `allow read: if true`.
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media`;
  return { ok: true, url };
}
