// cms-types.ts — shared TypeScript types for the CMS layer.
// Dates are stored as ISO strings so these types are safely serializable
// across the server/client component boundary.

export type SectionKey =
  | "about"
  | "services"
  | "projects"
  | "how_we_work"
  | "company_profile"
  | "contact";

export const SECTION_KEYS: SectionKey[] = [
  "about",
  "services",
  "projects",
  "how_we_work",
  "company_profile",
  "contact",
];

export const SECTION_TITLES: Record<SectionKey, string> = {
  about: "About",
  services: "Services",
  projects: "Projects",
  how_we_work: "How We Work",
  company_profile: "Company Profile",
  contact: "Contact",
};

export interface CmsSection {
  sectionKey: SectionKey;
  title: string;
  isFrozen: boolean;
  status: "draft" | "published";
  // ISO strings — safe to pass to client components
  lastEditedBy: string | null;
  lastEditedAt: string | null;
  lastPublishedBy: string | null;
  lastPublishedAt: string | null;
}

// ── Projects ─────────────────────────────────────────────────────────────────

export type CategoryKey =
  | "infrastructure"
  | "industrial"
  | "public"
  | "residential"
  | "transport";

export const CATEGORY_KEYS: CategoryKey[] = [
  "infrastructure",
  "industrial",
  "public",
  "residential",
  "transport",
];

export const CATEGORY_LABELS: Record<CategoryKey, { en: string; ar: string }> = {
  infrastructure: { en: "Infrastructure", ar: "البنية التحتية" },
  industrial:     { en: "Industrial",     ar: "الصناعة" },
  public:         { en: "Public",         ar: "القطاع العام" },
  residential:    { en: "Residential",    ar: "السكنية" },
  transport:      { en: "Transport",      ar: "النقل" },
};

// Maps an English category label (from content.ts) to its CategoryKey.
export const LABEL_TO_CATEGORY_KEY: Record<string, CategoryKey> = {
  Infrastructure: "infrastructure",
  Industrial:     "industrial",
  Public:         "public",
  Residential:    "residential",
  Transport:      "transport",
};

export interface CmsProject {
  id: string;            // Firestore doc ID = slug
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  location_en: string;
  location_ar: string;
  categoryKey: CategoryKey;
  year: string;
  coverImageUrl: string;
  modalImages: string[];
  sortOrder: number;
  isPublished: boolean;
  isFeatured: boolean;
  draft: Record<string, unknown> | null;
  createdAt: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
  lastPublishedAt: string | null;
}
