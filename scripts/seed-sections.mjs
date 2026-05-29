// seed-sections.mjs — seeds the 6 cms_sections docs in Firestore.
// Run with: node --env-file=.env.local scripts/seed-sections.mjs
//
// Requires FIREBASE_SERVICE_ACCOUNT (base64 service account JSON) in .env.local.
// Safe to run multiple times — skips any doc that already exists.

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const SA_B64 = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!SA_B64) {
  console.error("✗  FIREBASE_SERVICE_ACCOUNT is not set in .env.local.");
  console.error("   Generate a service account key, base64-encode it, and add it to .env.local.");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert(JSON.parse(Buffer.from(SA_B64, "base64").toString("utf8"))) });
}

const db = getFirestore();

const SECTIONS = [
  { key: "about",           title: "About" },
  { key: "services",        title: "Services" },
  { key: "projects",        title: "Projects" },
  { key: "how_we_work",     title: "How We Work" },
  { key: "company_profile", title: "Company Profile" },
  { key: "contact",         title: "Contact" },
];

async function seed() {
  console.log("Seeding cms_sections…\n");
  for (const { key, title } of SECTIONS) {
    const ref = db.collection("cms_sections").doc(key);
    const snap = await ref.get();
    if (snap.exists) {
      console.log(`  ⊘  ${key} — already exists, skipping`);
      continue;
    }
    await ref.set({
      sectionKey: key,
      title,
      isFrozen: false,
      status: "published",
      publishedData: null,
      draftData: null,
      lastEditedBy: "seed-script",
      lastEditedAt: FieldValue.serverTimestamp(),
      lastPublishedBy: null,
      lastPublishedAt: null,
    });
    console.log(`  ✓  ${key} — seeded`);
  }
  console.log("\nDone.");
}

seed().catch((err) => { console.error(err); process.exit(1); });
