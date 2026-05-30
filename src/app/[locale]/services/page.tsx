import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { Breadcrumb, Eyebrow, PageHead } from "@/components/primitives";
import { CTABand, ServicesSection } from "@/components/sections";
import { CONTENT, IMAGES, navHref, type Locale } from "@/lib/content";
import { isSectionFrozen } from "@/lib/cms/freeze";
import UnderConstruction from "@/components/UnderConstruction";

export const revalidate = 60;

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  if (await isSectionFrozen("services")) return <UnderConstruction locale={locale} />;
  const svc = CONTENT.services[locale];
  const nav = CONTENT.nav[locale];
  const en = locale === "en";

  return (
    <div className="page-enter">
      <PageHead
        eyebrow={svc.eyebrow}
        title={svc.title}
        sub={
          en
            ? "Six integrated disciplines, delivered under one roof — covering every stage of the construction lifecycle."
            : "ستة تخصصات متكاملة تحت سقف واحد، تغطي كل مراحل دورة حياة الإنشاء."
        }
        bg={IMAGES.service.building}
        breadcrumb={<Breadcrumb locale={locale} homeLabel={nav[0].label} current={nav[2].label} />}
      />

      <ServicesSection locale={locale} showAll />

      {/* Detail rows */}
      <section className="section" style={{ background: "var(--cream-2)" }}>
        <div className="container">
          <Eyebrow>{en ? "Detail" : "تفاصيل"}</Eyebrow>
          <h2 className="section-title display" style={{ marginTop: 14, marginBottom: 64 }}>
            {en ? "What’s inside each service." : "ما يندرج تحت كل خدمة."}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {svc.items.map((s, i) => {
              const Glyph = Icon[s.icon as IconName] ?? Icon.building;
              return (
                <div
                  key={s.id}
                  className="svc-detail-row"
                  style={{ display: "grid", gridTemplateColumns: "120px 1fr 2fr", gap: "clamp(20px, 3vw, 48px)", padding: "32px 0", borderTop: "1px solid var(--line)", alignItems: "start" }}
                >
                  <div style={{ color: "var(--green-800)" }}>
                    <Glyph width={56} height={56} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--gold-600)", letterSpacing: "0.04em", marginBottom: 8 }}>
                      /{String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="display" style={{ fontSize: 28, fontWeight: 500, margin: 0, lineHeight: 1.15 }}>{s.title}</h3>
                  </div>
                  <div>
                    <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink-2)", margin: "0 0 16px" }}>{s.desc}</p>
                    <Link className="section-link" href={navHref(locale, "contact")}>
                      {CONTENT.ui[locale].enquireService} <Icon.arrow width={14} height={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <style>{`@media (max-width: 800px) { .svc-detail-row { grid-template-columns: 1fr !important; gap: 16px !important; } }`}</style>
        </div>
      </section>

      <CTABand locale={locale} />
    </div>
  );
}
