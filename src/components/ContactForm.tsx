"use client";

import { useState } from "react";
import { Icon } from "./icons";
import { CONTENT, type Locale } from "@/lib/content";
import { sendEnquiry } from "@/lib/actions/contact";

export default function ContactForm({ locale }: { locale: Locale }) {
  const c = CONTENT.contact[locale];
  const svc = CONTENT.services[locale];
  const en = locale === "en";

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSending(true);

    const fd = new FormData(e.currentTarget);
    const result = await sendEnquiry({
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      service: String(fd.get("service") || ""),
      message: String(fd.get("message") || ""),
      company: String(fd.get("company") || ""), // honeypot
    });

    setSending(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(
        en
          ? result.error
          : "تعذّر إرسال رسالتك. يرجى المحاولة مرة أخرى أو مراسلتنا مباشرة."
      );
    }
  }

  return (
    <div>
      <h3 className="display" style={{ fontSize: "clamp(28px, 3.4vw, 40px)", fontWeight: 400, margin: "0 0 28px", lineHeight: 1.1 }}>
        {c.formTitle}
      </h3>
      {submitted ? (
        <div style={{ background: "var(--green-50)", padding: 40, borderInlineStart: "3px solid var(--green-700)" }}>
          <Icon.check width={32} height={32} style={{ color: "var(--green-700)" }} />
          <h4 className="display" style={{ fontSize: 24, margin: "14px 0 8px" }}>
            {en ? "Thanks — we’ll be in touch soon." : "شكراً — سنتواصل معك قريباً."}
          </h4>
          <p style={{ margin: 0, color: "var(--ink-3)" }}>
            {en
              ? "A member of our team will respond within one business day."
              : "سيرد عليك أحد أعضاء فريقنا خلال يوم عمل واحد."}
          </p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label>{c.fields.name}</label>
              <input type="text" name="name" required />
            </div>
            <div className="field">
              <label>{c.fields.email}</label>
              <input type="email" name="email" required />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>{c.fields.phone}</label>
              <input type="tel" name="phone" />
            </div>
            <div className="field">
              <label>{c.fields.service}</label>
              <select name="service" defaultValue="">
                <option value="">—</option>
                {svc.items.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label>{c.fields.message}</label>
            <textarea name="message" required />
          </div>

          {/* Honeypot — hidden from users; bots that fill it are silently dropped. */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
            <label>
              Company
              <input type="text" name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {error && (
            <div
              role="alert"
              style={{ marginTop: 16, padding: "12px 16px", background: "#fef2f2", borderInlineStart: "3px solid #dc2626", color: "#b91c1c", fontSize: 14 }}
            >
              {error}
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <button type="submit" className="btn btn-primary" disabled={sending}>
              {sending ? (en ? "Sending…" : "جارٍ الإرسال…") : c.submit}{" "}
              {!sending && <Icon.arrow className="btn-arrow" width={16} height={16} />}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
