// section-schema.ts — field definitions, defaults, and resolve helpers for the
// editable CMS sections (Phase 3). Client-safe: imports CONTENT only.
//
// An "override" is a flat record of body-text fields stored in Firestore as
// cms_sections/{key}.publishedData (live) and .draftData (work in progress).
// The decorative headlines (TitlePart[] with gold accents) stay in content.ts.

import { CONTENT, type Locale } from "@/lib/content";

export type EditableSectionKey =
  | "about"
  | "contact"
  | "services"
  | "how_we_work"
  | "company_profile";

export const EDITABLE_SECTIONS: EditableSectionKey[] = [
  "about",
  "contact",
  "services",
  "how_we_work",
  "company_profile",
];

export function isEditableSection(key: string): key is EditableSectionKey {
  return (EDITABLE_SECTIONS as string[]).includes(key);
}

export type SectionOverride = Record<string, unknown>;

// Default Company Profile PDF (also the fallback used by the public page).
export const DEFAULT_PROFILE_PDF = "/uploads/Company%20Profile%205a-compressed.pdf";

// ── Form field schema ─────────────────────────────────────────────────────────

export type FieldType = "text" | "textarea" | "departments" | "service_items" | "how_steps";

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

// ── Defaults (pre-fill the form from content.ts) ──────────────────────────────

export function defaultOverride(key: EditableSectionKey): SectionOverride {
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
