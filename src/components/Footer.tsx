import Link from "next/link";
import { CONTENT, navHref, type Locale } from "@/lib/content";

export default function Footer({ locale }: { locale: Locale }) {
  const brand = CONTENT.brand[locale];
  const f = CONTENT.footer[locale];

  return (
    <footer className="site-footer">
      <div className="container-wide">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <Link href={`/${locale}`} className="brand" style={{ marginBottom: 20 }} aria-label={brand.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="brand-logo" src="/assets/logo-wide-white.png" alt={brand.name} style={{ height: 56 }} />
            </Link>
            <p>{f.tagline}</p>
          </div>
          {f.sections.map((s, i) => (
            <div className="footer-col" key={i}>
              <h4>{s.title}</h4>
              <ul>
                {s.links.map((l, j) => (
                  <li key={j}>
                    {"id" in l && l.id ? (
                      <Link href={navHref(locale, l.id)}>{l.label}</Link>
                    ) : (
                      <span>{l.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>{f.legal}</span>
          <span>{f.crLine}</span>
        </div>
      </div>
    </footer>
  );
}
