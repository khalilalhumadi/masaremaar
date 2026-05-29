# Masar Emaar — Website

Marketing website for **Masar Emaar Contracting Co.**, a Saudi contracting and
civil-engineering firm based in Al Olaya, Riyadh. Built with Next.js (App
Router) + TypeScript, fully bilingual (English / Arabic) with right-to-left
support, and exported as a static site.

## Tech stack

- **Next.js 16** (App Router) — exported as a static site (`output: "export"`)
- **TypeScript**
- **next/font** — self-hosted Archivo, Manrope, Cairo & IBM Plex Sans Arabic
- Plain CSS design system in [`src/app/globals.css`](src/app/globals.css)
  (custom properties: green/gold brand palette, editorial display type)

## Internationalization

Locale-prefixed routes under `app/[locale]`, statically rendered for each
language:

- `/en` … English (LTR)
- `/ar` … Arabic (RTL)

`<html lang dir>` is set per locale at build time, so there is no layout shift.
The header includes an EN ⇄ AR switch that maps to the equivalent path. `/`
redirects to `/en` via a static `public/index.html`.

## Pages

Home, About, Services, Projects (with filterable gallery + detail modal), How We
Work, Company Profile (PDF download), and Contact (enquiry form).

## Project structure

```
src/
  app/
    layout.tsx            # root pass-through
    [locale]/
      layout.tsx          # <html lang/dir>, fonts, Header/Footer, metadata
      page.tsx            # Home
      about|services|projects|how|profile|contact/page.tsx
    globals.css           # design system (ported from the prototype)
  components/             # Header, Footer, sections, icons, forms, modal
  lib/content.ts          # all bilingual copy + image manifest (CMS-ready)
public/
  assets/                 # logos
  uploads/                # company profile PDF
```

All site copy lives in [`src/lib/content.ts`](src/lib/content.ts) so it can be
wired to a CMS later without touching components.

> The original HTML/CSS/JS design prototype is kept in `design-reference/`
> (git-ignored) for reference.

## Develop

```bash
npm install
npm run dev          # http://localhost:3000  (redirects to /en)
```

## Build & preview the static export

```bash
npm run build        # outputs to ./out
npx serve out        # preview the static site
```

The contents of `out/` can be deployed to any static host (Vercel, Netlify,
GitHub Pages, S3/CloudFront, etc.).
