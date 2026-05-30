// sections.tsx — reusable content sections shared across pages
import Link from "next/link";
import { Icon, type IconName } from "./icons";
import { Eyebrow, SectionHead, TitleParts } from "./primitives";
import { CONTENT, IMAGES, navHref, type Locale, type Project } from "@/lib/content";

// ─────────────────────────────────────────────────────────────
// Services (shared between home preview and services page)
// ─────────────────────────────────────────────────────────────
export function ServicesSection({
  locale,
  showAll = false,
  items,
}: {
  locale: Locale;
  showAll?: boolean;
  // Optional CMS override; when omitted, content.ts defaults are used (home page).
  items?: { id: string; icon: string; title: string; desc: string }[];
}) {
  const svc = CONTENT.services[locale];
  const serviceItems = items ?? svc.items;

  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHead
          eyebrow={svc.eyebrow}
          title={svc.title}
          link={!showAll ? svc.cta : undefined}
          href={!showAll ? navHref(locale, "services") : undefined}
        />
        <div className="services-grid card">
          {serviceItems.map((s, i) => {
            const Glyph = Icon[s.icon as IconName] ?? Icon.building;
            return (
              <Link key={s.id} className="service-card" href={navHref(locale, "services")}>
                <div className="service-num">/{String(i + 1).padStart(2, "0")}</div>
                <div className="service-icon">
                  <Glyph width={42} height={42} />
                </div>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
                <span className="service-arrow">→</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Project card — presentational; links (home) or opens modal (projects)
// ─────────────────────────────────────────────────────────────
export function ProjectCard({
  project,
  locale,
  extraClass = "",
  href,
  onClick,
}: {
  project: Project;
  locale: Locale;
  extraClass?: string;
  href?: string;
  onClick?: () => void;
}) {
  const img = project.coverImageUrl || IMAGES.project[project.id] || IMAGES.hero;
  const inner = (
    <>
      <div className="project-img">
        <div className="project-img-inner" style={{ backgroundImage: `url(${img})` }} />
      </div>
      <div className="project-overlay">
        <div className="project-eyebrow">
          {project.category[locale]} · {project.year}
        </div>
        <h3 className="project-title">{project.title[locale]}</h3>
        <div className="project-location">
          <Icon.pin width={14} height={14} /> {project.location[locale]}
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link className={`project-card ${extraClass}`} href={href}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={`project-card ${extraClass}`} onClick={onClick} style={{ textAlign: "start", border: 0, background: "none", padding: 0, width: "100%" }}>
      {inner}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Featured projects (home) — featured first, up to 7
// ─────────────────────────────────────────────────────────────
export function FeaturedProjectsSection({ locale }: { locale: Locale }) {
  const p = CONTENT.projects[locale];
  const featured = CONTENT.projectList.filter((x) => x.featured);
  const rest = CONTENT.projectList.filter((x) => !x.featured);
  const items = [...featured, ...rest].slice(0, 7);

  return (
    <section className="section" style={{ background: "var(--cream)" }}>
      <div className="container-wide">
        <SectionHead eyebrow={p.eyebrow} title={p.title} link={p.cta} href={navHref(locale, "projects")} />
        <div className="projects-strip">
          {items.map((proj, i) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              locale={locale}
              extraClass={proj.featured && i < 2 ? "featured" : ""}
              href={navHref(locale, "projects")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Why choose
// ─────────────────────────────────────────────────────────────
export function WhySection({ locale }: { locale: Locale }) {
  const w = CONTENT.why[locale];
  return (
    <section className="section why-section">
      <div className="container">
        <div style={{ maxWidth: 720 }}>
          <Eyebrow>{w.eyebrow}</Eyebrow>
          <h2 className="section-title display" style={{ color: "#fff", marginTop: 14 }}>
            <TitleParts parts={w.title} />
          </h2>
        </div>
        <div className="why-grid">
          {w.items.map((it, i) => (
            <div className="why-item" key={i}>
              <div className="why-num">
                {String(i + 1).padStart(2, "0")} / {String(w.items.length).padStart(2, "0")}
              </div>
              <h3 className="why-title">{it.title}</h3>
              <p className="why-desc">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// How we work (preview on home, full on /how)
// ─────────────────────────────────────────────────────────────
export function HowStepsSection({
  locale,
  preview = false,
  sub,
  steps,
}: {
  locale: Locale;
  preview?: boolean;
  // Optional CMS overrides; when omitted, content.ts defaults are used (home page).
  sub?: string;
  steps?: { title: string; desc: string }[];
}) {
  const h = CONTENT.how[locale];
  const stepItems = steps ?? h.steps;
  const subText = sub ?? h.sub;
  return (
    <section className="section" style={{ background: "#fff" }}>
      <div className="container">
        <SectionHead
          eyebrow={h.eyebrow}
          title={h.title}
          link={preview ? CONTENT.ui[locale].readMore : undefined}
          href={preview ? navHref(locale, "how") : undefined}
        />
        {!preview && (
          <p style={{ maxWidth: "64ch", marginTop: -36, marginBottom: 56, color: "var(--ink-3)", fontSize: 18, lineHeight: 1.6 }}>
            {subText}
          </p>
        )}
        <div className="steps-grid">
          {stepItems.map((s, i) => (
            <div className="step" key={i}>
              <div className="step-num">
                {String(i + 1).padStart(2, "0")}
                <small>STEP</small>
              </div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// CTA band
// ─────────────────────────────────────────────────────────────
export function CTABand({ locale }: { locale: Locale }) {
  const c = CONTENT.cta[locale];
  return (
    <section className="cta-band">
      <div className="container">
        <h2 className="cta-title display">
          <TitleParts parts={c.title} />
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
          <p style={{ margin: 0, fontSize: 17, maxWidth: "36ch", color: "rgba(12,42,30,.78)" }}>{c.sub}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn btn-primary" href={navHref(locale, "contact")}>
              {c.cta} <Icon.arrow className="btn-arrow" width={16} height={16} />
            </Link>
            <a
              className="btn btn-outline"
              href="https://wa.me/966538134516"
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: "transparent", borderColor: "var(--green-900)", color: "var(--green-900)" }}
            >
              <Icon.whatsapp width={16} height={16} /> {c.ctaSecondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
