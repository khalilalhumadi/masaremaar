import Link from "next/link";
import { Icon } from "@/components/icons";
import { Eyebrow, SectionHead, TitleParts } from "@/components/primitives";
import {
  ServicesSection,
  FeaturedProjectsSection,
  WhySection,
  HowStepsSection,
  CTABand,
} from "@/components/sections";
import { CONTENT, IMAGES, navHref, type Locale } from "@/lib/content";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  const h = CONTENT.hero[locale];
  const stats = CONTENT.stats[locale];
  const intro = CONTENT.intro[locale];
  const about = CONTENT.about[locale];

  return (
    <div className="page-enter">
      {/* Hero (full) */}
      <section className="hero hero--full">
        <div className="hero-bg" style={{ backgroundImage: `url(${IMAGES.hero})` }} />
        <div className="container hero-inner">
          <Eyebrow>{h.eyebrow}</Eyebrow>
          <h1 className="hero-title display">
            <TitleParts parts={h.title} />
          </h1>
          <p className="hero-sub">{h.sub}</p>
          <div className="hero-actions">
            <Link className="btn btn-gold" href={navHref(locale, "projects")}>
              {h.ctaPrimary} <Icon.arrow className="btn-arrow" width={16} height={16} />
            </Link>
            <Link className="btn btn-ghost" href={navHref(locale, "contact")}>
              {h.ctaSecondary}
            </Link>
          </div>
        </div>
        <div className="hero-meta">
          <div className="hero-meta-num">
            09<sup style={{ fontSize: ".4em", color: "var(--gold-400)" }}>+</sup>
          </div>
          <div>{h.metaLabel}</div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="section-sm">
        <div className="container-wide">
          <div className="stats-strip">
            {stats.map((s, i) => (
              <div className="stat" key={i}>
                <div className="stat-num">
                  {s.num}
                  {"sup" in s && s.sup && <sup>{s.sup}</sup>}
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro block */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={intro.eyebrow} title={intro.title} link={intro.cta} href={navHref(locale, "about")} />
          <div className="intro-block">
            <div>
              <div style={{ aspectRatio: "4/5", backgroundImage: `url(${IMAGES.about})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(12,42,30,0) 60%, rgba(12,42,30,.55) 100%)" }} />
                <div style={{ position: "absolute", bottom: 24, insetInlineStart: 24, color: "#fff", fontFamily: "var(--font-display)", fontSize: 56, lineHeight: 1, letterSpacing: "-0.02em" }}>
                  Est. <em style={{ color: "var(--gold-400)", fontStyle: "italic" }}>2017</em>
                </div>
              </div>
            </div>
            <div className="intro-block-body">
              <p className="lede">{intro.lede}</p>
              {intro.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <div className="signature">
                <div style={{ width: 56, height: 56, background: "var(--green-50)", backgroundImage: `url(${IMAGES.md})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: "50%" }} />
                <div>
                  <div className="sig-name">{about.mdName}</div>
                  <div className="sig-role">{about.mdRole}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection locale={locale} />
      <FeaturedProjectsSection locale={locale} />
      <WhySection locale={locale} />
      <HowStepsSection locale={locale} preview />
      <CTABand locale={locale} />
    </div>
  );
}
