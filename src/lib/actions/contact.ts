"use server";

import { Resend } from "resend";

// Where enquiries are delivered. Overridable via env without code change.
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "info@masaremaar.com";
// Sender. Must be on a domain verified in Resend for delivery to external
// inboxes. Defaults to the masaremaar.com domain (verify it in Resend).
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "Masar Emaar Website <noreply@masaremaar.com>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EnquiryInput {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  company?: string; // honeypot — must stay empty
}

export type EnquiryResult = { ok: true } | { ok: false; error: string };

export async function sendEnquiry(input: EnquiryInput): Promise<EnquiryResult> {
  // Honeypot: real users never fill this hidden field. Pretend success to bots.
  if (input.company && input.company.trim() !== "") {
    return { ok: true };
  }

  const name = (input.name || "").trim();
  const email = (input.email || "").trim();
  const phone = (input.phone || "").trim();
  const service = (input.service || "").trim();
  const message = (input.message || "").trim();

  // Server-side validation (never trust the client).
  if (!name) return { ok: false, error: "Name is required." };
  if (!email || !EMAIL_RE.test(email)) return { ok: false, error: "A valid email is required." };
  if (!message) return { ok: false, error: "Message is required." };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("sendEnquiry: RESEND_API_KEY is not set");
    return { ok: false, error: "Email service is not configured. Please email us directly." };
  }

  const resend = new Resend(apiKey);

  const lines = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone || "—"}`,
    `Service: ${service || "—"}`,
    "",
    "Message:",
    message,
  ];
  const text = lines.join("\n");

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;line-height:1.6">
      <h2 style="margin:0 0 16px">New enquiry from Masaremaar website</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        <tr><td style="padding:4px 16px 4px 0;color:#666">Name</td><td style="padding:4px 0"><strong>${esc(name)}</strong></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666">Email</td><td style="padding:4px 0">${esc(email)}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666">Phone</td><td style="padding:4px 0">${esc(phone || "—")}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666">Service</td><td style="padding:4px 0">${esc(service || "—")}</td></tr>
      </table>
      <p style="margin:16px 0 6px;color:#666">Message</p>
      <p style="margin:0;white-space:pre-wrap">${esc(message)}</p>
    </div>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: "New enquiry from Masaremaar website",
      text,
      html,
    });

    if (error) {
      console.error("sendEnquiry: Resend error:", error);
      return { ok: false, error: "Could not send your message. Please try again or email us directly." };
    }
    return { ok: true };
  } catch (err) {
    console.error("sendEnquiry: unexpected error:", err);
    return { ok: false, error: "Could not send your message. Please try again or email us directly." };
  }
}
