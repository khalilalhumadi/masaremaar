// middleware.ts — fast edge check for /admin/* routes.
// Only verifies cookie EXISTENCE (Admin SDK cannot run on the edge).
// Full session verification (admin claim + revocation check) happens in
// src/app/admin/(protected)/layout.tsx via Firebase Admin SDK.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("__session");

  // Already authenticated → redirect away from login page
  if (session && pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Not authenticated → redirect to login
  if (!session && pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
