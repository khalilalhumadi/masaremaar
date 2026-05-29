// TEMPORARY — delete after Firebase credentials are verified.
import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, string> = {};

  // 1. Check env vars are present (not their values)
  const vars = [
    "FIREBASE_SERVICE_ACCOUNT",
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  ];
  for (const v of vars) {
    results[v] = process.env[v] ? "set" : "MISSING";
  }

  // 2. Try Admin SDK init + list 1 auth user
  try {
    const { getAdminAuth, isAdminConfigured } = await import("@/lib/firebase/admin");
    if (!isAdminConfigured()) {
      results.adminSdk = "FIREBASE_SERVICE_ACCOUNT not set";
    } else {
      const auth = getAdminAuth();
      const list = await auth.listUsers(1);
      results.adminSdk = "OK";
      results.firebaseProjectUsers = `${list.users.length} user(s) visible`;
    }
  } catch (err: unknown) {
    results.adminSdk = `ERROR: ${err instanceof Error ? err.message : String(err)}`;
  }

  const allOk = Object.values(results).every((v) => !v.startsWith("MISSING") && !v.startsWith("ERROR"));
  return NextResponse.json({ ok: allOk, results }, { status: allOk ? 200 : 500 });
}
