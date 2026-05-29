// sections.ts — client-side Firestore CRUD for cms_sections
// Used by the admin dashboard to read and toggle section freeze state.
// Switches to Admin SDK (server-side) in Phase 2+ when service account is available.

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";

export type SectionStatus = "draft" | "published";

export interface CmsSection {
  sectionKey: string;
  title: string;
  isFrozen: boolean;
  status: SectionStatus;
  publishedData: Record<string, unknown> | null;
  draftData: Record<string, unknown> | null;
  lastEditedBy: string | null;
  lastEditedAt: Date | null;
  lastPublishedBy: string | null;
  lastPublishedAt: Date | null;
}

export const SECTION_KEYS = [
  "about",
  "services",
  "projects",
  "how_we_work",
  "company_profile",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

const SECTION_TITLES: Record<SectionKey, string> = {
  about: "About",
  services: "Services",
  projects: "Projects",
  how_we_work: "How We Work",
  company_profile: "Company Profile",
  contact: "Contact",
};

function defaultSection(key: SectionKey): Omit<CmsSection, "lastEditedAt" | "lastPublishedAt"> & {
  lastEditedAt: null;
  lastPublishedAt: null;
} {
  return {
    sectionKey: key,
    title: SECTION_TITLES[key],
    isFrozen: false,
    status: "published",
    publishedData: null,
    draftData: null,
    lastEditedBy: null,
    lastEditedAt: null,
    lastPublishedBy: null,
    lastPublishedAt: null,
  };
}

function fromFirestore(data: Record<string, unknown>): CmsSection {
  return {
    sectionKey: data.sectionKey as string,
    title: (data.title as string) || "",
    isFrozen: Boolean(data.isFrozen),
    status: (data.status as SectionStatus) || "published",
    publishedData: (data.publishedData as Record<string, unknown>) || null,
    draftData: (data.draftData as Record<string, unknown>) || null,
    lastEditedBy: (data.lastEditedBy as string) || null,
    lastEditedAt: data.lastEditedAt instanceof Timestamp ? data.lastEditedAt.toDate() : null,
    lastPublishedBy: (data.lastPublishedBy as string) || null,
    lastPublishedAt:
      data.lastPublishedAt instanceof Timestamp ? data.lastPublishedAt.toDate() : null,
  };
}

/**
 * Load all 6 CMS sections from Firestore.
 * If a section document doesn't exist yet, seeds it with safe defaults.
 */
export async function getAllSections(userEmail: string): Promise<CmsSection[]> {
  const db = getClientDb();
  const results: CmsSection[] = [];

  for (const key of SECTION_KEYS) {
    const ref = doc(db, "cms_sections", key);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const defaults = defaultSection(key);
      await setDoc(ref, {
        ...defaults,
        lastEditedBy: userEmail,
        lastEditedAt: serverTimestamp(),
      });
      results.push({ ...defaults });
    } else {
      results.push(fromFirestore(snap.data() as Record<string, unknown>));
    }
  }

  return results;
}

/**
 * Toggle the isFrozen flag for a section.
 * Records who made the change and when.
 */
export async function toggleFreeze(
  sectionKey: SectionKey,
  frozen: boolean,
  userEmail: string
): Promise<void> {
  const db = getClientDb();
  await updateDoc(doc(db, "cms_sections", sectionKey), {
    isFrozen: frozen,
    lastEditedBy: userEmail,
    lastEditedAt: serverTimestamp(),
  });
}
