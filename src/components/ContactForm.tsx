"use client";

import { useState } from "react";
import { Icon } from "./icons";
import { CONTENT, type Locale } from "@/lib/content";

export default function ContactForm({ locale }: { locale: Locale }) {
  const c = CONTENT.contact[locale];
  const svc = CONTENT.services[locale];
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <h3 className="display" style={{ fontSize: "clamp(28px, 3.4vw, 40px)", fontWeight: 400, margin: "0 0 28px", lineHeight: 1.1 }}>
        {c.formTitle}
      </h3>
      {submitted ? (
        <div style={{ background: "var(--green-50)", padding: 40, borderInlineStart: "3px solid var(--green-700)" }}>
          <Icon.check width={32} height={32} style={{ color: "var(--green-700)" }} />
          <h4 className="display" style={{ fontSize: 24, margin: "14px 0 8px" }}>
            {locale === "en" ? "Thanks — we’ll be in touch soon." : "شكراً — سنتواصل معك قريباً."}
          </h4>
          <p style={{ margin: 0, color: "var(--ink-3)" }}>
            {locale === "en"
              ? "A member of our team will respond within one business day."
              : "سيرد عليك أحد أعضاء فريقنا خلال يوم عمل واحد."}
          </p>
        </div>
      ) : (
        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className="field-row">
            <div className="field">
              <label>{c.fields.name}</label>
              <input type="text" required />
            </div>
            <div className="field">
              <label>{c.fields.email}</label>
              <input type="email" required />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>{c.fields.phone}</label>
              <input type="tel" />
            </div>
            <div className="field">
              <label>{c.fields.service}</label>
              <select defaultValue="">
                <option value="">—</option>
                {svc.items.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label>{c.fields.message}</label>
            <textarea required />
          </div>
          <div style={{ marginTop: 20 }}>
            <button type="submit" className="btn btn-primary">
              {c.submit} <Icon.arrow className="btn-arrow" width={16} height={16} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
