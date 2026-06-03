import { NextResponse } from "next/server";
import { sendEnquiry } from "@/lib/email/sendEnquiry";

// nodemailer needs Node APIs (net/tls) — not available in the Edge runtime.
export const runtime = "nodejs";
// Always run on request; never cache this endpoint.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const result = await sendEnquiry({
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    phone: String(body.phone ?? ""),
    service: String(body.service ?? ""),
    message: String(body.message ?? ""),
    company: String(body.company ?? ""), // honeypot
  });

  // Always return the result as JSON; client reads `ok`.
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
