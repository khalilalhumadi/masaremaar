// section-schema.ts — field definitions, defaults, and resolve helpers for the
// editable CMS sections (Phase 3). Client-safe: imports CONTENT only.
//
// An "override" is a flat record of body-text fields stored in Firestore as
// cms_sections/{key}.publishedData (live) and .draftData (work in progress).
// The decorative headlines (TitlePart[] with gold accents) stay in content.ts.

import { CONTENT, type Locale } from "@/lib/content";

export type EditableSectionKey = "about" | "contact";

export const EDITABLE_SECTIONS: EditableSectionKey[] = ["about", "contact"];

export function isEditableSection(key: string): key is EditableSectionKey {
  return (EDITABLE_SECTIONS as string[]).includes(key);
}

export type SectionOverride = Record<string, unknown>;

// ── Form field schema ─────────────────────────────────────────────────────────

export type FieldType = "text" | "textarea" | "departments";

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
};

export interface DepartmentRow {
  name_en: string;
  name_ar: string;
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
