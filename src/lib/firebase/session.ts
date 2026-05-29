// session.ts — Firebase session cookie helpers (server-only).
// Creates and verifies httpOnly session cookies backed by Firebase Auth.
// Used by: API /api/auth/session, admin layout, server actions.
import "server-only";

import { cookies } from "next/headers";
import { getAdminAuth, isAdminConfigured } from "./admin";

export const SESSION_COOKIE = "__session";
export const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export async function createSessionCookie(idToken: string): Promise<string> {
  return getAdminAuth().createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION_MS,
  });
}

// Returns the decoded token if the session is valid and the user has the
// admin custom claim. Returns null for any other case (missing, expired,
// revoked, or non-admin).
export async function getVerifiedSession() {
  if (!isAdminConfigured()) return null;

  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    if (!decoded.admin) return null;
    return decoded;
  } catch {
    return null;
  }
}
