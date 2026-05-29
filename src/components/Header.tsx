"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./icons";
import { CONTENT, navHref, type Locale } from "@/lib/content";

export default function Header({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Current page id: second path segment, or "home"
  const segments = pathname.split("/").filter(Boolean); // e.g. ["en","about"]
  const pageId = segments[1] ?? "home";
  const isHome = pageId === "home";
  const onDark = isHome && !scrolled;

  const other: Locale = locale === "en" ? "ar" : "en";
  const altPath = "/" + [other, ...segments.slice(1)].join("/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brand = CONTENT.brand[locale];
  const ui = CONTENT.ui[locale];

  return (
    <header className={`site-header ${onDark ? "on-dark" : ""}`}>
      <div className="container-wide">
        <div className="nav-bar">
          <Link href={`/${locale}`} className="brand" aria-label={brand.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="brand-logo"
              src={onDark ? "/assets/logo-wide-white.png" : "/assets/logo-wide.png"}
              alt={brand.name}
              style={{ height: 42 }}
            />
          </Link>

          <nav className={`nav-links ${open ? "mobile-open" : ""}`}>
            {CONTENT.nav[locale].map((n) => (
              <Link
                key={n.id}
                href={navHref(locale, n.id)}
                className={`nav-link ${pageId === n.id ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="nav-right">
            <Link className="lang-switch" href={altPath} aria-label={ui.lang}>
              <Icon.globe />
              <span>{ui.lang}</span>
            </Link>
            <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
              <span />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
