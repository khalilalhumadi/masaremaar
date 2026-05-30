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

  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!bucketName) {
    return { ok: false, error: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set." };
  }

  const bucket = getAdminStorage().bucket(bucketName);

  try {
    await bucket.file(path).save(buffer, {
      // contentType must be a top-level option, not nested under metadata.
      // resumable: false forces a single-request upload — resumable sessions
      // can hang on first attempt if there is any transient connectivity issue.
      contentType: blob.type,
      resumable: false,
    });
  } catch (err) {
    const code = (err as { code?: number }).code ?? "?";
    const msg  = (err as { message?: string }).message ?? String(err);
    console.error(`uploadProjectImage — GCS save error (bucket: ${bucketName}):`, err);
    return {
      ok: false,
      error: `Upload failed [GCS ${code}]: ${msg} (bucket: ${bucketName})`,
    };
  }

  // No download token needed — Storage rules have `allow read: if true`.
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media`;
  return { ok: true, url };
}

/**
 * Upload a section image (e.g. Home hero/intro) via the Admin SDK.
 * Stored under sections/<sectionKey>/<timestamp>.<ext>. Same guards as
 * uploadProjectImage. Storage rules grant public read on sections/**.
 */
export async function uploadSectionImage(
  sectionKey: string,
  formData: FormData
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const session = await getVerifiedSession();
  if (!session) return { ok: false, error: "Unauthorized" };
  if (!isAdminConfigured()) return { ok: false, error: "Firebase not configured" };

  // Allow only a safe key segment in the storage path.
  if (!/^[a-z0-9_]+$/.test(sectionKey)) {
    return { ok: false, error: "Invalid section key" };
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") return { ok: false, error: "No file provided" };

  const blob = file as File;
  if (!blob.type.startsWith("image/")) return { ok: false, error: "Only image files are allowed" };
  if (blob.size > 5 * 1024 * 1024) return { ok: false, error: "Image must be under 5 MB" };

  const ext = (blob.name.split(".").pop() ?? "jpg").toLowerCase();
  const path = `sections/${sectionKey}/${Date.now()}.${ext}`;

  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!bucketName) {
    return { ok: false, error: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set." };
  }

  const bucket = getAdminStorage().bucket(bucketName);

  try {
    await bucket.file(path).save(buffer, {
      contentType: blob.type,
      resumable: false,
    });
  } catch (err) {
    const code = (err as { code?: number }).code ?? "?";
    const msg = (err as { message?: string }).message ?? String(err);
    console.error(`uploadSectionImage — GCS save error (bucket: ${bucketName}):`, err);
    return { ok: false, error: `Upload failed [GCS ${code}]: ${msg} (bucket: ${bucketName})` };
  }

  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media`;
  return { ok: true, url };
}
