import Link from "next/link";
import { Icon } from "@/components/icons";
import { Breadcrumb, PageHead } from "@/components/primitives";
import { CTABand } from "@/components/sections";
import { CONTENT, IMAGES, navHref, type Locale, type TitlePart } from "@/lib/content";

const PROFILE_PDF = "/uploads/Company%20Profile%205a-compressed.pdf";

const PREVIEWS: { en: string; ar: string }[] = [
  { en: "Cover", ar: "الغلاف" },
  { en: "The Company", ar: "الشركة" },
  { en: "MD Statement", ar: "كلمة المدير" },
  { en: "Our Team", ar: "فريقنا" },
  { en: "Overview", ar: "نظرة عامة" },
  { en: "Services", ar: "الخدمات" },
  { en: "How We Work", ar: "منهجية العمل" },
  { en: "Projects", ar: "المشاريع" },
  { en: "Contact", ar: "تواصل" },
];

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const nav = CONTENT.nav[locale];
  const ui = CONTENT.ui[locale];
  const en = locale === "en";

  const title: TitlePart[] = [
    en ? "Read our full" : "اقرأ",
    { em: en ? "company profile." : "ملف الشركة كاملاً." },
  ];

  return (
    <div className="page-enter">
      <PageHead
        eyebrow={en ? "Company Profile" : "ملف الشركة"}
        title={title}
        sub={
          en
            ? "18 pages — vision, services, methodology, and a curated selection of projects."
            : "18 صفحة — الرؤية والخدمات والمنهجية ومجموعة مختارة من المشاريع."
        }
        bg={IMAGES.hero}
        breadcrumb={<Breadcrumb locale={locale} homeLabel={nav[0].label} current={nav[5].label} />}
      />

      <section className="section">
        <div className="container">
          <div style={{ display: "flex", gap: 16, marginBottom: 56, flexWrap: "wrap" }}>
            <a className="btn btn-primary" href={PROFILE_PDF} target="_blank" rel="noopener noreferrer">
              <Icon.download width={16} height={16} /> {ui.downloadProfile}
            </a>
            <Link className="btn btn-outline" href={navHref(locale, "contact")}>
              {en ? "Request a printed copy" : "اطلب نسخة مطبوعة"} <Icon.arrow className="btn-arrow" width={16} height={16} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>
            {PREVIEWS.map((p, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "3/4",
                  background: i === 0 ? "var(--green-900)" : "#fff",
                  border: "1px solid var(--line)",
                  padding: 24,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  color: i === 0 ? "#fff" : "var(--ink)",
                  overflow: "hidden",
                }}
              >
                {i === 0 && (
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent, var(--green-900)), url(${IMAGES.hero}) center/cover` }} />
                )}
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: i === 0 ? "var(--gold-400)" : "var(--gold-600)", fontWeight: 600 }}>
                    Page /{String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div className="display" style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.1 }}>{p[locale]}</div>
                  <div style={{ fontSize: 11, color: i === 0 ? "rgba(255,255,255,.55)" : "var(--ink-4)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 6 }}>2026</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand locale={locale} />
    </div>
  );
}
