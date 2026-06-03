"use server";

import nodemailer from "nodemailer";

// All SMTP config is server-only (never NEXT_PUBLIC) so credentials never
// reach the browser. Configured for GoDaddy / Microsoft 365 SMTP.
const SMTP_HOST = process.env.SMTP_HOST || "smtp.office365.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || "587");
const SMTP_SECURE = (process.env.SMTP_SECURE || "false").toLowerCase() === "true";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "info@masaremaar.com";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || SMTP_USER || "info@masaremaar.com";

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

  if (!SMTP_USER || !SMTP_PASSWORD) {
    console.error("sendEnquiry: SMTP_USER / SMTP_PASSWORD are not set");
    return { ok: false, error: "Email service is not configured. Please email us directly." };
  }

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

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE, // false for port 587 (STARTTLS), true for 465
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    // Don't let a slow/blocked SMTP handshake hang the Server Action.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: "New enquiry from Masaremaar website",
      text,
      html,
    });
    return { ok: true };
  } catch (err) {
    console.error("sendEnquiry: SMTP send error:", err);
    return { ok: false, error: "Could not send your message. Please try again or email us directly." };
  }
}
