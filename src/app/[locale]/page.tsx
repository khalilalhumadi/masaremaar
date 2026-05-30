import Link from "next/link";
import { Icon } from "@/components/icons";
import { Eyebrow, SectionHead, TitleParts } from "@/components/primitives";
import { WhySection, CTABand } from "@/components/sections";
import { CONTENT, navHref, type Locale } from "@/lib/content";
import { getPublishedSectionData } from "@/lib/data/section-content";
import { resolveHome, resolveHomeCta, resolveAbout } from "@/lib/cms/section-schema";

export const revalidate = 60;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  // Home content (hero/stats/intro/why/cta) + reuse About data for the signature.
  const [homeData, aboutData] = await Promise.all([
    getPublishedSectionData("home"),
    getPublishedSectionData("about"),
  ]);
  const home = resolveHome(locale, homeData);
  const cta = resolveHomeCta(locale, homeData);
  const about = resolveAbout(locale, aboutData);

  const h = home.hero;
  const stats = home.stats;
  const intro = home.intro;
  // Hero/intro/why decorative headlines (TitlePart[]) stay in content.ts.
  const heroTitle = CONTENT.hero[locale].title;
  const introTitle = CONTENT.intro[locale].title;

  return (
    <div className="page-enter">
      {/* Hero (full) */}
      <section className="hero hero--full">
        <div className="hero-bg" style={{ backgroundImage: `url(${home.images.hero})` }} />
        <div className="container hero-inner">
          <Eyebrow>{h.eyebrow}</Eyebrow>
          <h1 className="hero-title display">
            <TitleParts parts={heroTitle} />
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
                  {s.sup && <sup>{s.sup}</sup>}
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
          <SectionHead eyebrow={intro.eyebrow} title={introTitle} link={intro.cta} href={navHref(locale, "about")} />
          <div className="intro-block">
            <div>
              <div style={{ aspectRatio: "4/5", backgroundImage: `url(${home.images.intro})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
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
                <div style={{ width: 56, height: 56, background: "var(--green-50)", backgroundImage: `url(${home.images.md})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: "50%" }} />
                <div>
                  <div className="sig-name">{about.mdName}</div>
                  <div className="sig-role">{about.mdRole}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhySection locale={locale} eyebrow={home.why.eyebrow} items={home.why.items} />
      <CTABand locale={locale} sub={cta.sub} cta={cta.cta} ctaSecondary={cta.ctaSecondary} />
    </div>
  );
}
