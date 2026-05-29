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
