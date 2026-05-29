// POST  — exchange a Firebase ID token for an httpOnly session cookie
// DELETE — clear the session cookie (logout)
import { type NextRequest, NextResponse } from "next/server";
import {
  createSessionCookie,
  SESSION_COOKIE,
  SESSION_DURATION_MS,
} from "@/lib/firebase/session";
import { getAdminAuth, isAdminConfigured } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Firebase not configured — check FIREBASE_SERVICE_ACCOUNT env var" },
      { status: 503 }
    );
  }

  try {
    const { idToken } = (await req.json()) as { idToken?: string };
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "idToken is required" }, { status: 400 });
    }

    // Verify the admin custom claim BEFORE creating a session cookie.
    // Prevents non-admin Firebase users from ever getting a session.
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    if (!decoded.admin) {
      return NextResponse.json(
        { error: "This account does not have admin access. Ask an existing admin to grant access." },
        { status: 403 }
      );
    }

    const sessionCookie = await createSessionCookie(idToken);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    });
    return res;
  } catch (err: unknown) {
    console.error("Session creation failed:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
