// UnderConstruction.tsx — shown on public pages when isFrozen = true.
// Header and footer remain visible (this replaces only the page body content).
// Bilingual: renders EN or AR copy based on locale.

import Link from "next/link";
import type { Locale } from "@/lib/content";

const COPY = {
  en: {
    eyebrow: "Coming Soon",
    title: "Under Construction",
    sub: "We're working on this section and will have it ready soon. In the meantime, feel free to explore the rest of our site or get in touch.",
    home: "Return to Home",
    contact: "Contact Us",
  },
  ar: {
    eyebrow: "قريباً",
    title: "قيد الإنشاء",
    sub: "نعمل على تحديث هذا القسم وسيكون جاهزاً قريباً. في هذه الأثناء، يمكنك تصفّح بقية الموقع أو التواصل معنا.",
    home: "العودة إلى الرئيسية",
    contact: "تواصل معنا",
  },
};

export default function UnderConstruction({
  locale,
  homeHref,
  contactHref,
}: {
  locale: Locale;
  // Override the action links (e.g. when the whole Arabic site is disabled,
  // point visitors at the English site instead of looping back to /ar).
  homeHref?: string;
  contactHref?: string;
}) {
  const t = COPY[locale];
  const homeLink = homeHref ?? `/${locale}`;
  const contactLink = contactHref ?? `/${locale}/contact`;

  return (
    <div
      style={{
        minHeight: "60vh",
        background: "var(--green-900)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(60px, 10vw, 140px) clamp(20px, 4vw, 48px)",
        textAlign: locale === "ar" ? "right" : "left",
      }}
    >
      <div style={{ maxWidth: 600, width: "100%" }}>
        {/* Eyebrow */}
        <div className="h-eyebrow" style={{ color: "var(--gold-500)", marginBottom: 24 }}>
          <span className="h-rule" style={{ background: "var(--gold-500)" }} />
          {t.eyebrow}
        </div>

        {/* Headline */}
        <h1
          className="display"
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: 1,
            margin: "0 0 28px",
            color: "#fff",
          }}
        >
          {t.title}
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.65,
            color: "rgba(255,255,255,.72)",
            margin: "0 0 40px",
            maxWidth: "52ch",
          }}
        >
          {t.sub}
        </p>

        {/* Actions */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          <Link
            href={homeLink}
            className="btn btn-gold"
          >
            {t.home}
          </Link>
          <Link
            href={contactLink}
            className="btn btn-ghost"
          >
            {t.contact}
          </Link>
        </div>
      </div>
    </div>
  );
}
