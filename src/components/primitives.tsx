// primitives.tsx — shared presentational building blocks
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./icons";
import type { TitlePart } from "@/lib/content";

// Render a title array — strings + {em:'…'} for gold accent runs.
export function TitleParts({ parts, className = "" }: { parts: TitlePart[]; className?: string }) {
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (typeof p === "string") {
          return (
            <span key={i}>
              {i > 0 ? " " : ""}
              {p}
            </span>
          );
        }
        return (
          <em key={i}>
            {i > 0 ? " " : ""}
            {p.em}
          </em>
        );
      })}
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="h-eyebrow">
      <span className="h-rule" />
      {children}
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  link,
  href,
}: {
  eyebrow: ReactNode;
  title: TitlePart[];
  link?: ReactNode;
  href?: string;
}) {
  return (
    <div className="section-head">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="section-title display">
          <TitleParts parts={title} />
        </h2>
      </div>
      {link && href && (
        <Link className="section-link" href={href}>
          {link} <Icon.arrow width={16} height={16} />
        </Link>
      )}
    </div>
  );
}

export function PageHead({
  eyebrow,
  title,
  sub,
  breadcrumb,
  bg,
}: {
  eyebrow: ReactNode;
  title: TitlePart[];
  sub?: ReactNode;
  breadcrumb?: ReactNode;
  bg?: string;
}) {
  return (
    <div className="page-head">
      {bg && <div className="page-head-bg" style={{ backgroundImage: `url(${bg})` }} />}
      <div className="container">
        {breadcrumb && <div className="breadcrumb">{breadcrumb}</div>}
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="page-head-title display">
          <TitleParts parts={title} />
        </h1>
        {sub && <p className="page-head-sub">{sub}</p>}
      </div>
    </div>
  );
}

// Breadcrumb helper: Home / Current
export function Breadcrumb({ locale, homeLabel, current }: { locale: string; homeLabel: string; current: string }) {
  return (
    <>
      <Link href={`/${locale}`}>{homeLabel}</Link>
      <span>/</span>
      <span>{current}</span>
    </>
  );
}
