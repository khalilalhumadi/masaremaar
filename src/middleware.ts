// middleware.ts — protects /admin/* routes
// Checks for the admin-session cookie set by the login page.
// Real security is enforced by Firestore rules (Firebase Auth required).
// Server-side token verification upgrades to Admin SDK when service account is added.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Login page is always accessible
  if (pathname === "/admin/login") return NextResponse.next();

  // Check session cookie (set by login page after successful Firebase Auth)
  const session = request.cookies.get("admin-session")?.value;
  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
