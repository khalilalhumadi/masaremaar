// section-schema.ts — field definitions, defaults, and resolve helpers for the
// editable CMS sections (Phase 3). Client-safe: imports CONTENT only.
//
// An "override" is a flat record of body-text fields stored in Firestore as
// cms_sections/{key}.publishedData (live) and .draftData (work in progress).
// The decorative headlines (TitlePart[] with gold accents) stay in content.ts.

import { CONTENT, IMAGES, type Locale } from "@/lib/content";

export type EditableSectionKey =
  | "home"
  | "about"
  | "contact"
  | "services"
  | "how_we_work"
  | "company_profile";

export const EDITABLE_SECTIONS: EditableSectionKey[] = [
  "home",
  "about",
  "contact",
  "services",
  "how_we_work",
  "company_profile",
];

export function isEditableSection(key: string): key is EditableSectionKey {
  return (EDITABLE_SECTIONS as string[]).includes(key);
}

// Display titles for editable sections (includes "home", which is intentionally
// NOT part of cms-types SECTION_KEYS — Home has no freeze toggle).
export const EDITABLE_SECTION_TITLE: Record<EditableSectionKey, string> = {
  home: "Home",
  about: "About",
  contact: "Contact",
  services: "Services",
  how_we_work: "How We Work",
  company_profile: "Company Profile",
};

export type SectionOverride = Record<string, unknown>;

// Default Company Profile PDF (also the fallback used by the public page).
export const DEFAULT_PROFILE_PDF = "/uploads/Company%20Profile%205a-compressed.pdf";

// ── Form field schema ─────────────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "textarea"
  | "image"
  | "departments"
  | "service_items"
  | "how_steps"
  | "home_stats"
  | "paragraphs"
  | "why_items";

export interface SectionField {
  key: string;
  label: string;
  type: FieldType;
  dir?: "rtl";
}

export interface SectionFieldGroup {
  title: string;
  fields: SectionField[];
}

export const SECTION_FIELD_GROUPS: Record<EditableSectionKey, SectionFieldGroup[]> = {
  home: [
    {
      title: "Hero",
      fields: [
        { key: "hero_eyebrow_en", label: "Eyebrow (English)", type: "text" },
        { key: "hero_eyebrow_ar", label: "Eyebrow (Arabic)", type: "text", dir: "rtl" },
        { key: "hero_sub_en", label: "Sub text (English)", type: "textarea" },
        { key: "hero_sub_ar", label: "Sub text (Arabic)", type: "textarea", dir: "rtl" },
        { key: "hero_ctaPrimary_en", label: "Primary button (English)", type: "text" },
        { key: "hero_ctaPrimary_ar", label: "Primary button (Arabic)", type: "text", dir: "rtl" },
        { key: "hero_ctaSecondary_en", label: "Secondary button (English)", type: "text" },
        { key: "hero_ctaSecondary_ar", label: "Secondary button (Arabic)", type: "text", dir: "rtl" },
        { key: "hero_metaLabel_en", label: "Meta label (English)", type: "text" },
        { key: "hero_metaLabel_ar", label: "Meta label (Arabic)", type: "text", dir: "rtl" },
      ],
    },
    {
      title: "Images",
      fields: [
        { key: "hero_image_url", label: "Hero background image", type: "image" },
        { key: "intro_image_url", label: "Intro block image", type: "image" },
        { key: "md_image_url", label: "Managing Director photo (signature avatar)", type: "image" },
      ],
    },
    {
      title: "Stats strip",
      fields: [{ key: "stats", label: "Stats", type: "home_stats" }],
    },
    {
      title: "Intro block",
      fields: [
        { key: "intro_eyebrow_en", label: "Eyebrow (English)", type: "text" },
        { key: "intro_eyebrow_ar", label: "Eyebrow (Arabic)", type: "text", dir: "rtl" },
        { key: "intro_lede_en", label: "Lede (English)", type: "textarea" },
        { key: "intro_lede_ar", label: "Lede (Arabic)", type: "textarea", dir: "rtl" },
        { key: "intro_body", label: "Body paragraphs", type: "paragraphs" },
        { key: "intro_cta_en", label: "Link label (English)", type: "text" },
        { key: "intro_cta_ar", label: "Link label (Arabic)", type: "text", dir: "rtl" },
      ],
    },
    {
      title: "Why Masar Emaar",
      fields: [
        { key: "why_eyebrow_en", label: "Eyebrow (English)", type: "text" },
        { key: "why_eyebrow_ar", label: "Eyebrow (Arabic)", type: "text", dir: "rtl" },
        { key: "why_items", label: "Reasons", type: "why_items" },
      ],
    },
    {
      title: "Call-to-action band",
      fields: [
        { key: "cta_sub_en", label: "Sub text (English)", type: "textarea" },
        { key: "cta_sub_ar", label: "Sub text (Arabic)", type: "textarea", dir: "rtl" },
        { key: "cta_button_en", label: "Primary button (English)", type: "text" },
        { key: "cta_button_ar", label: "Primary button (Arabic)", type: "text", dir: "rtl" },
        { key: "cta_button2_en", label: "WhatsApp button (English)", type: "text" },
        { key: "cta_button2_ar", label: "WhatsApp button (Arabic)", type: "text", dir: "rtl" },
      ],
    },
  ],
  contact: [
    {
      title: "Contact details",
      fields: [
        { key: "email", label: "Email (shared)", type: "text" },
        { key: "phone", label: "Phone (shared)", type: "text" },
        { key: "address_en", label: "Address (English)", type: "text" },
        { key: "address_ar", label: "Address (Arabic)", type: "text", dir: "rtl" },
        { key: "hours_en", label: "Office hours (English)", type: "text" },
        { key: "hours_ar", label: "Office hours (Arabic)", type: "text", dir: "rtl" },
      ],
    },
  ],
  about: [
    {
      title: "Page intro",
      fields: [
        { key: "sub_en", label: "Intro (English)", type: "textarea" },
        { key: "sub_ar", label: "Intro (Arabic)", type: "textarea", dir: "rtl" },
      ],
    },
    {
      title: "Managing Director",
      fields: [
        { key: "mdName_en", label: "Name (English)", type: "text" },
        { key: "mdName_ar", label: "Name (Arabic)", type: "text", dir: "rtl" },
        { key: "mdRole_en", label: "Role (English)", type: "text" },
        { key: "mdRole_ar", label: "Role (Arabic)", type: "text", dir: "rtl" },
        { key: "mdStatement_en", label: "Statement (English)", type: "textarea" },
        { key: "mdStatement_ar", label: "Statement (Arabic)", type: "textarea", dir: "rtl" },
      ],
    },
    {
      title: "Vision & Mission",
      fields: [
        { key: "vision_en", label: "Vision (English)", type: "textarea" },
        { key: "vision_ar", label: "Vision (Arabic)", type: "textarea", dir: "rtl" },
        { key: "mission_en", label: "Mission (English)", type: "textarea" },
        { key: "mission_ar", label: "Mission (Arabic)", type: "textarea", dir: "rtl" },
      ],
    },
    {
      title: "Team",
      fields: [
        { key: "teamSub_en", label: "Team intro (English)", type: "textarea" },
        { key: "teamSub_ar", label: "Team intro (Arabic)", type: "textarea", dir: "rtl" },
        { key: "departments", label: "Departments", type: "departments" },
      ],
    },
  ],
  services: [
    {
      title: "Service items",
      fields: [{ key: "items", label: "Services", type: "service_items" }],
    },
  ],
  how_we_work: [
    {
      title: "Page intro",
      fields: [
        { key: "sub_en", label: "Intro (English)", type: "textarea" },
        { key: "sub_ar", label: "Intro (Arabic)", type: "textarea", dir: "rtl" },
      ],
    },
    {
      title: "Steps",
      fields: [{ key: "steps", label: "Steps", type: "how_steps" }],
    },
  ],
  company_profile: [
    {
      title: "Download",
      fields: [
        { key: "pdfUrl", label: "Company Profile PDF URL", type: "text" },
      ],
    },
  ],
};

export interface DepartmentRow {
  name_en: string;
  name_ar: string;
  desc_en: string;
  desc_ar: string;
}

export interface ServiceItemRow {
  id: string;
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
}

export interface HowStepRow {
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
}

export interface HomeStatRow {
  num: string;
  sup: string;
  label_en: string;
  label_ar: string;
}

export interface ParagraphRow {
  en: string;
  ar: string;
}

export interface WhyItemRow {
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
}

// ── Defaults (pre-fill the form from content.ts) ──────────────────────────────

export function defaultOverride(key: EditableSectionKey): SectionOverride {
  if (key === "home") {
    const heroEn = CONTENT.hero.en, heroAr = CONTENT.hero.ar;
    const introEn = CONTENT.intro.en, introAr = CONTENT.intro.ar;
    const whyEn = CONTENT.why.en, whyAr = CONTENT.why.ar;
    const ctaEn = CONTENT.cta.en, ctaAr = CONTENT.cta.ar;
    const stats: HomeStatRow[] = CONTENT.stats.en.map((s, i) => ({
      num: s.num,
      sup: "sup" in s ? (s.sup as string) : "",
      label_en: s.label,
      label_ar: CONTENT.stats.ar[i]?.label ?? "",
    }));
    const intro_body: ParagraphRow[] = introEn.body.map((p, i) => ({
      en: p,
      ar: introAr.body[i] ?? "",
    }));
    const why_items: WhyItemRow[] = whyEn.items.map((it, i) => ({
      title_en: it.title,
      title_ar: whyAr.items[i]?.title ?? "",
      desc_en: it.desc,
      desc_ar: whyAr.items[i]?.desc ?? "",
    }));
    return {
      hero_eyebrow_en: heroEn.eyebrow, hero_eyebrow_ar: heroAr.eyebrow,
      hero_sub_en: heroEn.sub, hero_sub_ar: heroAr.sub,
      hero_ctaPrimary_en: heroEn.ctaPrimary, hero_ctaPrimary_ar: heroAr.ctaPrimary,
      hero_ctaSecondary_en: heroEn.ctaSecondary, hero_ctaSecondary_ar: heroAr.ctaSecondary,
      hero_metaLabel_en: heroEn.metaLabel, hero_metaLabel_ar: heroAr.metaLabel,
      hero_image_url: IMAGES.hero,
      intro_image_url: IMAGES.about,
      md_image_url: IMAGES.md,
      stats,
      intro_eyebrow_en: introEn.eyebrow, intro_eyebrow_ar: introAr.eyebrow,
      intro_lede_en: introEn.lede, intro_lede_ar: introAr.lede,
      intro_body,
      intro_cta_en: introEn.cta, intro_cta_ar: introAr.cta,
      why_eyebrow_en: whyEn.eyebrow, why_eyebrow_ar: whyAr.eyebrow,
      why_items,
      cta_sub_en: ctaEn.sub, cta_sub_ar: ctaAr.sub,
      cta_button_en: ctaEn.cta, cta_button_ar: ctaAr.cta,
      cta_button2_en: ctaEn.ctaSecondary, cta_button2_ar: ctaAr.ctaSecondary,
    };
  }

  if (key === "contact") {
    return {
      email: CONTENT.contact.en.email,
      phone: CONTENT.contact.en.phone,
      address_en: CONTENT.contact.en.address,
      address_ar: CONTENT.contact.ar.address,
      hours_en: CONTENT.contact.en.hours,
      hours_ar: CONTENT.contact.ar.hours,
    };
  }

  if (key === "services") {
    const items: ServiceItemRow[] = CONTENT.services.en.items.map((it, i) => ({
      id: it.id,
      title_en: it.title,
      title_ar: CONTENT.services.ar.items[i]?.title ?? "",
      desc_en: it.desc,
      desc_ar: CONTENT.services.ar.items[i]?.desc ?? "",
    }));
    return { items };
  }

  if (key === "how_we_work") {
    const steps: HowStepRow[] = CONTENT.how.en.steps.map((st, i) => ({
      title_en: st.title,
      title_ar: CONTENT.how.ar.steps[i]?.title ?? "",
      desc_en: st.desc,
      desc_ar: CONTENT.how.ar.steps[i]?.desc ?? "",
    }));
    return {
      sub_en: CONTENT.how.en.sub,
      sub_ar: CONTENT.how.ar.sub,
      steps,
    };
  }

  if (key === "company_profile") {
    return { pdfUrl: DEFAULT_PROFILE_PDF };
  }

  // about
  const en = CONTENT.about.en;
  const ar = CONTENT.about.ar;
  const departments: DepartmentRow[] = en.departments.map((d, i) => ({
    name_en: d.name,
    name_ar: ar.departments[i]?.name ?? "",
    desc_en: d.desc,
    desc_ar: ar.departments[i]?.desc ?? "",
  }));
  return {
    sub_en: en.sub,
    sub_ar: ar.sub,
    mdName_en: en.mdName,
    mdName_ar: ar.mdName,
    mdRole_en: en.mdRole,
    mdRole_ar: ar.mdRole,
    mdStatement_en: en.mdStatement,
    mdStatement_ar: ar.mdStatement,
    vision_en: en.vision,
    vision_ar: ar.vision,
    mission_en: en.mission,
    mission_ar: ar.mission,
    teamSub_en: en.teamSub,
    teamSub_ar: ar.teamSub,
    departments,
  };
}

// ── Resolve (apply override to content.ts for a locale) ───────────────────────

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function resolveContact(locale: Locale, o: SectionOverride | null) {
  const base = CONTENT.contact[locale];
  if (!o) return base;
  return {
    ...base,
    email: str(o.email) || base.email,
    phone: str(o.phone) || base.phone,
    address: (locale === "en" ? str(o.address_en) : str(o.address_ar)) || base.address,
    hours: (locale === "en" ? str(o.hours_en) : str(o.hours_ar)) || base.hours,
  };
}

export function resolveAbout(locale: Locale, o: SectionOverride | null) {
  const base = CONTENT.about[locale];
  if (!o) return base;
  const pick = (en: string, ar: string) =>
    (locale === "en" ? str(o[en]) : str(o[ar])) || "";
  const rawDepts = Array.isArray(o.departments) ? (o.departments as DepartmentRow[]) : [];
  const departments =
    rawDepts.length > 0
      ? rawDepts.map((d) => ({
          name: (locale === "en" ? str(d.name_en) : str(d.name_ar)) || "",
          desc: (locale === "en" ? str(d.desc_en) : str(d.desc_ar)) || "",
        }))
      : base.departments;
  return {
    ...base,
    sub: pick("sub_en", "sub_ar") || base.sub,
    mdName: pick("mdName_en", "mdName_ar") || base.mdName,
    mdRole: pick("mdRole_en", "mdRole_ar") || base.mdRole,
    mdStatement: pick("mdStatement_en", "mdStatement_ar") || base.mdStatement,
    vision: pick("vision_en", "vision_ar") || base.vision,
    mission: pick("mission_en", "mission_ar") || base.mission,
    teamSub: pick("teamSub_en", "teamSub_ar") || base.teamSub,
    departments,
  };
}

export interface ResolvedServiceItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export function resolveServices(locale: Locale, o: SectionOverride | null) {
  const base = CONTENT.services[locale];
  const overrides = Array.isArray(o?.items) ? (o!.items as ServiceItemRow[]) : [];
  const byId = new Map(overrides.map((it) => [it.id, it]));
  // Always return a fresh (mutable) item array so it satisfies component props.
  const items: ResolvedServiceItem[] = base.items.map((it) => {
    const ov = byId.get(it.id);
    return {
      id: it.id,
      icon: it.icon,
      title: ov ? (locale === "en" ? str(ov.title_en) : str(ov.title_ar)) || it.title : it.title,
      desc: ov ? (locale === "en" ? str(ov.desc_en) : str(ov.desc_ar)) || it.desc : it.desc,
    };
  });
  return { ...base, items };
}

export interface ResolvedHowStep {
  title: string;
  desc: string;
}

export function resolveHow(locale: Locale, o: SectionOverride | null) {
  const base = CONTENT.how[locale];
  const rawSteps = Array.isArray(o?.steps) ? (o!.steps as HowStepRow[]) : [];
  // Always return a fresh (mutable) steps array so it satisfies component props.
  const steps: ResolvedHowStep[] = base.steps.map((st, i) => {
    const ov = rawSteps[i];
    return ov
      ? {
          title: (locale === "en" ? str(ov.title_en) : str(ov.title_ar)) || st.title,
          desc: (locale === "en" ? str(ov.desc_en) : str(ov.desc_ar)) || st.desc,
        }
      : { title: st.title, desc: st.desc };
  });
  return {
    ...base,
    sub: (locale === "en" ? str(o?.sub_en) : str(o?.sub_ar)) || base.sub,
    steps,
  };
}

/** Company Profile: returns the published PDF URL, or the bundled default. */
export function resolveProfilePdf(o: SectionOverride | null): string {
  if (!o) return DEFAULT_PROFILE_PDF;
  return str(o.pdfUrl) || DEFAULT_PROFILE_PDF;
}

// ── Home ──────────────────────────────────────────────────────────────────────

export interface ResolvedStat {
  num: string;
  sup: string;
  label: string;
}

export function resolveHome(locale: Locale, o: SectionOverride | null) {
  const baseHero = CONTENT.hero[locale];
  const baseStats = CONTENT.stats[locale];
  const baseIntro = CONTENT.intro[locale];
  const baseWhy = CONTENT.why[locale];
  const pick = (en: string, ar: string) =>
    (locale === "en" ? str(o?.[en]) : str(o?.[ar])) || "";

  const rawStats = Array.isArray(o?.stats) ? (o!.stats as HomeStatRow[]) : [];
  const stats: ResolvedStat[] =
    rawStats.length > 0
      ? rawStats.map((s) => ({
          num: str(s.num),
          sup: str(s.sup),
          label: (locale === "en" ? str(s.label_en) : str(s.label_ar)) || "",
        }))
      : baseStats.map((s) => ({
          num: s.num,
          sup: "sup" in s ? (s.sup as string) : "",
          label: s.label,
        }));

  const rawBody = Array.isArray(o?.intro_body) ? (o!.intro_body as ParagraphRow[]) : [];
  const introBody =
    rawBody.length > 0
      ? rawBody.map((p) => (locale === "en" ? str(p.en) : str(p.ar))).filter(Boolean)
      : [...baseIntro.body];

  const rawWhy = Array.isArray(o?.why_items) ? (o!.why_items as WhyItemRow[]) : [];
  const whyItems =
    rawWhy.length > 0
      ? rawWhy.map((it) => ({
          title: (locale === "en" ? str(it.title_en) : str(it.title_ar)) || "",
          desc: (locale === "en" ? str(it.desc_en) : str(it.desc_ar)) || "",
        }))
      : baseWhy.items.map((it) => ({ title: it.title, desc: it.desc }));

  return {
    hero: {
      eyebrow: pick("hero_eyebrow_en", "hero_eyebrow_ar") || baseHero.eyebrow,
      sub: pick("hero_sub_en", "hero_sub_ar") || baseHero.sub,
      ctaPrimary: pick("hero_ctaPrimary_en", "hero_ctaPrimary_ar") || baseHero.ctaPrimary,
      ctaSecondary: pick("hero_ctaSecondary_en", "hero_ctaSecondary_ar") || baseHero.ctaSecondary,
      metaLabel: pick("hero_metaLabel_en", "hero_metaLabel_ar") || baseHero.metaLabel,
    },
    images: {
      hero: str(o?.hero_image_url) || IMAGES.hero,
      intro: str(o?.intro_image_url) || IMAGES.about,
      md: str(o?.md_image_url) || IMAGES.md,
    },
    stats,
    intro: {
      eyebrow: pick("intro_eyebrow_en", "intro_eyebrow_ar") || baseIntro.eyebrow,
      lede: pick("intro_lede_en", "intro_lede_ar") || baseIntro.lede,
      body: introBody.length > 0 ? introBody : [...baseIntro.body],
      cta: pick("intro_cta_en", "intro_cta_ar") || baseIntro.cta,
    },
    why: {
      eyebrow: pick("why_eyebrow_en", "why_eyebrow_ar") || baseWhy.eyebrow,
      items: whyItems,
    },
  };
}

/** Home CTA band text override (title stays in content.ts). */
export function resolveHomeCta(locale: Locale, o: SectionOverride | null) {
  const base = CONTENT.cta[locale];
  if (!o) return { sub: base.sub, cta: base.cta, ctaSecondary: base.ctaSecondary };
  const pick = (en: string, ar: string) =>
    (locale === "en" ? str(o[en]) : str(o[ar])) || "";
  return {
    sub: pick("cta_sub_en", "cta_sub_ar") || base.sub,
    cta: pick("cta_button_en", "cta_button_ar") || base.cta,
    ctaSecondary: pick("cta_button2_en", "cta_button2_ar") || base.ctaSecondary,
  };
}
