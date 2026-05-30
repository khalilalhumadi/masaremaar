import { Breadcrumb, Eyebrow, PageHead, TitleParts } from "@/components/primitives";
import { CTABand } from "@/components/sections";
import { CONTENT, type Locale } from "@/lib/content";
import { isSectionFrozen } from "@/lib/cms/freeze";
import UnderConstruction from "@/components/UnderConstruction";
import { getPublishedSectionData } from "@/lib/data/section-content";
import { resolveAbout } from "@/lib/cms/section-schema";

export const revalidate = 60;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  if (await isSectionFrozen("about")) return <UnderConstruction locale={locale} />;
  const a = resolveAbout(locale, await getPublishedSectionData("about"));
  const nav = CONTENT.nav[locale];
  const en = locale === "en";

  return (
    <div className="page-enter">
      <PageHead
        eyebrow={a.eyebrow}
        title={a.title}
        sub={a.sub}
        bg={a.images.header}
        breadcrumb={<Breadcrumb locale={locale} homeLabel={nav[0].label} current={nav[1].label} />}
      />

      {/* MD statement */}
      <section className="section">
        <div className="container">
          <div className="intro-block" style={{ gridTemplateColumns: "5fr 7fr" }}>
            <div>
              <div style={{ aspectRatio: "3/4", backgroundImage: `url(${a.images.md})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, background: "linear-gradient(180deg, transparent, rgba(12,42,30,.85))", color: "#fff" }}>
                  <div className="sig-name" style={{ color: "#fff" }}>{a.mdName}</div>
                  <div className="sig-role" style={{ color: "rgba(255,255,255,.7)" }}>{a.mdRole}</div>
                </div>
              </div>
            </div>
            <div className="intro-block-body">
              <Eyebrow>{a.mdEyebrow}</Eyebrow>
              <h2 className="section-title display" style={{ marginTop: 14, fontSize: "clamp(28px, 3.4vw, 44px)" }}>
                “<TitleParts parts={a.title} />”
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.75, color: "var(--ink-2)", marginTop: 24 }}>{a.mdStatement}</p>
              <div className="signature" style={{ marginTop: 32 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--green-800)" }}>
                  {en ? "K. Al-Humadi" : "خ. الحمادي"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section" style={{ background: "var(--cream-2)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 4vw, 64px)" }} className="vm-grid">
            <div style={{ padding: "40px 0", borderTop: "1px solid var(--line)" }}>
              <Eyebrow>{a.visionTitle}</Eyebrow>
              <h3 className="display" style={{ fontSize: "clamp(28px, 3.4vw, 42px)", fontWeight: 400, lineHeight: 1.1, margin: "14px 0 20px" }}>
                {en ? (
                  <>A trusted leader, transforming <em style={{ color: "var(--gold-600)" }}>landscapes</em> and communities.</>
                ) : (
                  <>قائد موثوق، يُحوّل <em style={{ color: "var(--gold-600)" }}>الفضاءات</em> والمجتمعات.</>
                )}
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)", margin: 0 }}>{a.vision}</p>
            </div>
            <div style={{ padding: "40px 0", borderTop: "1px solid var(--line)" }}>
              <Eyebrow>{a.missionTitle}</Eyebrow>
              <h3 className="display" style={{ fontSize: "clamp(28px, 3.4vw, 42px)", fontWeight: 400, lineHeight: 1.1, margin: "14px 0 20px" }}>
                {en ? (
                  <>Innovative, reliable, sustainable — <em style={{ color: "var(--gold-600)" }}>every project</em>.</>
                ) : (
                  <>ابتكار وموثوقية واستدامة — <em style={{ color: "var(--gold-600)" }}>في كل مشروع</em>.</>
                )}
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)", margin: 0 }}>{a.mission}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team / departments */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <Eyebrow>{nav[1].label}</Eyebrow>
              <h2 className="section-title display">{a.teamTitle}</h2>
            </div>
          </div>
          <p style={{ maxWidth: "64ch", marginTop: -36, marginBottom: 56, color: "var(--ink-3)", fontSize: 18, lineHeight: 1.6 }}>{a.teamSub}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 0, border: "1px solid var(--line)" }}>
            {a.departments.map((d, i) => (
              <div
                key={i}
                style={{
                  padding: "28px 24px",
                  borderInlineStart: i > 0 ? "1px solid var(--line)" : "0",
                  borderTop: i >= 4 ? "1px solid var(--line)" : "0",
                  background: i === 0 ? "var(--green-900)" : "#fff",
                  color: i === 0 ? "#fff" : "inherit",
                }}
              >
                <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: i === 0 ? "var(--gold-400)" : "var(--gold-600)", letterSpacing: "0.04em", marginBottom: 12 }}>
                  /{String(i + 1).padStart(2, "0")}
                </div>
                <h4 className="display" style={{ fontSize: 22, fontWeight: 500, margin: "0 0 8px", lineHeight: 1.2 }}>{d.name}</h4>
                <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, color: i === 0 ? "rgba(255,255,255,.7)" : "var(--ink-3)" }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand locale={locale} />
    </div>
  );
}
