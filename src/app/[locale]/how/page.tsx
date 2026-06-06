import { Breadcrumb, Eyebrow, PageHead } from "@/components/primitives";
import { CTABand, HowStepsSection } from "@/components/sections";
import { CONTENT, IMAGES, type Locale } from "@/lib/content";
import { isSectionFrozen } from "@/lib/cms/freeze";
import UnderConstruction from "@/components/UnderConstruction";
import { getPublishedSectionData } from "@/lib/data/section-content";
import { resolveHow, sectionBanner } from "@/lib/cms/section-schema";

export const revalidate = 60;

export default async function HowPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  if (await isSectionFrozen("how_we_work")) return <UnderConstruction locale={locale} />;
  const ov = await getPublishedSectionData("how_we_work");
  const h = resolveHow(locale, ov);
  const nav = CONTENT.nav[locale];
  const en = locale === "en";

  return (
    <div className="page-enter">
      <PageHead
        eyebrow={h.eyebrow}
        title={h.title}
        sub={h.sub}
        bg={sectionBanner(ov, IMAGES.service.civil)}
        breadcrumb={<Breadcrumb locale={locale} homeLabel={nav[0].label} current={nav[4].label} />}
      />

      <HowStepsSection locale={locale} sub={h.sub} steps={h.steps} />

      {/* Quality principle band */}
      <section className="section why-section">
        <div className="container">
          <div className="quality-band" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "clamp(32px, 5vw, 80px)", alignItems: "center" }}>
            <div>
              <Eyebrow>{en ? "Our Principle" : "مبدؤنا"}</Eyebrow>
              <h2 className="section-title display" style={{ color: "#fff", marginTop: 14 }}>
                {en ? (
                  <>Quality &amp; customer <em>confidence</em> are our main principles.</>
                ) : (
                  <>الجودة وثقة <em>العميل</em> هي مبادئنا الأساسية.</>
                )}
              </h2>
            </div>
            <div>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,.78)", margin: 0 }}>
                {en
                  ? "At Masar Emaar Contracting Co., we are committed to delivering excellence in every project. Our focus on quality and customer satisfaction ensures we build lasting relationships and achieve exceptional results."
                  : "في شركة مسار إعمار للمقاولات، نلتزم بتقديم التميّز في كل مشروع. تركيزنا على الجودة ورضا العملاء يضمن لنا بناء علاقات دائمة وتحقيق نتائج استثنائية."}
              </p>
            </div>
          </div>
          <style>{`@media (max-width: 800px) { .quality-band { grid-template-columns: 1fr !important; } }`}</style>
        </div>
      </section>

      <CTABand locale={locale} />
    </div>
  );
}
