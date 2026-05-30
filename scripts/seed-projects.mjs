/**
 * seed-projects.mjs — one-time script to seed cms_projects from content.ts data.
 *
 * Run: node --env-file=.env.local scripts/seed-projects.mjs
 *
 * Safe to run multiple times — uses set() with merge:false, so it only
 * creates documents that don't already exist (skips existing ones).
 * Add --force flag to overwrite existing documents.
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const FORCE = process.argv.includes("--force");

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf8")
);

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

// ── Category key mapping ──────────────────────────────────────────────────────

const LABEL_TO_KEY = {
  Infrastructure: "infrastructure",
  Industrial:     "industrial",
  Public:         "public",
  Residential:    "residential",
  Transport:      "transport",
};

// ── Unsplash fallback images (from content.ts IMAGES.project) ─────────────────

const UNSPLASH = {
  sadara:            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80&auto=format&fit=crop",
  shifa:             "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80&auto=format&fit=crop",
  "3j1":             "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1600&q=80&auto=format&fit=crop",
  "power-qassim":    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&q=80&auto=format&fit=crop",
  "security-abha":   "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1600&q=80&auto=format&fit=crop",
  "king-fahd":       "https://images.unsplash.com/photo-1545158539-1709190d1c1f?w=1600&q=80&auto=format&fit=crop",
  salwa:             "https://images.unsplash.com/photo-1448630360428-65456885c650?w=1600&q=80&auto=format&fit=crop",
  kku:               "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80&auto=format&fit=crop",
  kafo:              "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=1600&q=80&auto=format&fit=crop",
  mashriah:          "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1600&q=80&auto=format&fit=crop",
  "pnu-metro":       "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1600&q=80&auto=format&fit=crop",
  "aramco-haradh":   "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80&auto=format&fit=crop",
  "royal-commission":"https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=1600&q=80&auto=format&fit=crop",
};

// ── Project data (mirrors content.ts projectList) ─────────────────────────────

const PROJECTS = [
  { id: "sadara",           title_en: "Sadara Project",                title_ar: "مشروع صدارة",         location_en: "Jubail Industrial City", location_ar: "مدينة الجبيل الصناعية", category_en: "Industrial",      year: "2024", featured: true,
    desc_en: "Industrial works on one of the Kingdom's largest petrochemical complexes — covering structural, MEP and finishing scopes.",
    desc_ar: "أعمال صناعية ضمن أحد أكبر المجمعات البتروكيماوية في المملكة، شملت الأعمال الإنشائية والكهروميكانيكية والتشطيبات." },

  { id: "shifa",            title_en: "Al-Shifa Housing",              title_ar: "إسكان الشفا",          location_en: "Riyadh",                location_ar: "الرياض",                 category_en: "Residential",    year: "2023", featured: false,
    desc_en: "Residential development in south Riyadh — full structural and finishing works across multiple housing blocks.",
    desc_ar: "مشروع تطوير سكني في جنوب الرياض، شمل الأعمال الإنشائية والتشطيبات الكاملة عبر عدّة مجمّعات سكنية." },

  { id: "3j1",              title_en: "3J1 Riyadh Metro",              title_ar: "مترو الرياض 3J1",      location_en: "Riyadh",                location_ar: "الرياض",                 category_en: "Transport",      year: "2022", featured: true,
    desc_en: "Finishing works package on the Riyadh Metro — paints, gypsum board installations and architectural detailing across multiple stations.",
    desc_ar: "حزمة أعمال تشطيب ضمن مشروع مترو الرياض — دهانات وتركيب ألواح جبس وتفاصيل معمارية في عدّة محطات." },

  { id: "power-qassim",     title_en: "Qassim Power Station",          title_ar: "محطة قوى القصيم",      location_en: "Qassim Road",           location_ar: "طريق القصيم",            category_en: "Infrastructure", year: "2022", featured: false,
    desc_en: "Civil works on a regional power station along the Qassim corridor — foundations, structural concrete and access works.",
    desc_ar: "أعمال مدنية لمحطة طاقة إقليمية على محور القصيم — أساسات وخرسانات إنشائية وأعمال وصول." },

  { id: "security-abha",    title_en: "General Security Project",      title_ar: "مشروع الأمن العام",    location_en: "Abha",                  location_ar: "أبها",                   category_en: "Public",         year: "2021", featured: false,
    desc_en: "Large-scale civil works in Abha — focused on structural integrity and foundational excellence for a public security facility.",
    desc_ar: "أعمال مدنية واسعة في أبها — مركّزة على السلامة الإنشائية وجودة الأساسات لمنشأة أمنية حكومية." },

  { id: "king-fahd",        title_en: "King Fahd Causeway",            title_ar: "جسر الملك فهد",        location_en: "Eastern Province",      location_ar: "المنطقة الشرقية",        category_en: "Infrastructure", year: "2020", featured: true,
    desc_en: "Civil, MEP and finishing works on the vital King Fahd Causeway — structural construction, full MEP and modern interior finishes.",
    desc_ar: "أعمال مدنية وكهروميكانيكية وتشطيبات على جسر الملك فهد الحيوي — إنشاءات وتشطيبات داخلية حديثة." },

  { id: "salwa",            title_en: "Salwa Project",                 title_ar: "مشروع سلوى",           location_en: "Riyadh",                location_ar: "الرياض",                 category_en: "Residential",    year: "2020", featured: false,
    desc_en: "Comprehensive development covering MEP, civil and finishing — integrated coordination across multiple disciplines.",
    desc_ar: "مشروع تطوير شامل غطّى الأعمال المدنية والكهروميكانيكية والتشطيبات بتنسيق متكامل بين التخصصات." },

  { id: "kku",              title_en: "King Khalid University",        title_ar: "جامعة الملك خالد",     location_en: "Abha",                  location_ar: "أبها",                   category_en: "Public",         year: "2019", featured: false,
    desc_en: "Campus facilities works at King Khalid University in Abha — academic and support buildings.",
    desc_ar: "أعمال منشآت جامعية في جامعة الملك خالد بأبها — مبانٍ أكاديمية ومنشآت مساندة." },

  { id: "kafo",             title_en: "KAFO 409–412",                  title_ar: "مشروع KAFO 409–412",   location_en: "Saudi Arabia",          location_ar: "المملكة العربية السعودية", category_en: "Industrial",   year: "2019", featured: false,
    desc_en: "Industrial scope works across the KAFO 409–412 packages — structural and MEP coordination.",
    desc_ar: "أعمال صناعية ضمن حزم KAFO 409–412 — تنسيق إنشائي وكهروميكانيكي." },

  { id: "mashriah",         title_en: "Al-Mashriah Project",           title_ar: "مشروع المشرية",        location_en: "Saudi Arabia",          location_ar: "المملكة العربية السعودية", category_en: "Residential",  year: "2019", featured: false,
    desc_en: "Residential and mixed-use construction with full finishing scope.",
    desc_ar: "مشروع سكني ومتعدّد الاستخدامات بأعمال تشطيب كاملة." },

  { id: "pnu-metro",        title_en: "Princess Noura University Station", title_ar: "محطة جامعة الأميرة نورة", location_en: "Riyadh Metro",     location_ar: "مترو الرياض",            category_en: "Transport",      year: "2018", featured: true,
    desc_en: "Major metro station on the Riyadh Metro at Princess Noura University — civil, MEP, and architectural finishing.",
    desc_ar: "محطة مترو رئيسية في جامعة الأميرة نورة ضمن مترو الرياض — أعمال مدنية وكهروميكانيكية وتشطيبات معمارية." },

  { id: "aramco-haradh",    title_en: "Aramco Haradh Project",         title_ar: "مشروع أرامكو حرض",    location_en: "Haradh",                location_ar: "حرض",                    category_en: "Industrial",     year: "2018", featured: false,
    desc_en: "Industrial works package for Saudi Aramco at the Haradh field — civil and structural scopes.",
    desc_ar: "حزمة أعمال صناعية لأرامكو السعودية في حقل حرض — نطاق مدني وإنشائي." },

  { id: "royal-commission", title_en: "Royal Commission Project",      title_ar: "مشروع الهيئة الملكية", location_en: "Jubail / Yanbu",        location_ar: "الجبيل / ينبع",          category_en: "Public",         year: "2017", featured: false,
    desc_en: "Strategic infrastructure works under the Royal Commission for Jubail and Yanbu.",
    desc_ar: "أعمال بنية تحتية استراتيجية تحت إشراف الهيئة الملكية للجبيل وينبع." },
];

// ── Seed ──────────────────────────────────────────────────────────────────────

async function seedProjects() {
  const col = db.collection("cms_projects");
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < PROJECTS.length; i++) {
    const p = PROJECTS[i];
    const ref = col.doc(p.id);

    if (!FORCE) {
      const existing = await ref.get();
      if (existing.exists) {
        console.log(`  skip  ${p.id} (already exists — use --force to overwrite)`);
        skipped++;
        continue;
      }
    }

    await ref.set({
      slug:            p.id,
      title_en:        p.title_en,
      title_ar:        p.title_ar,
      description_en:  p.desc_en,
      description_ar:  p.desc_ar,
      location_en:     p.location_en,
      location_ar:     p.location_ar,
      categoryKey:     LABEL_TO_KEY[p.category_en],
      year:            p.year,
      coverImageUrl:   UNSPLASH[p.id] ?? "",
      modalImages:     [],
      sortOrder:       i + 1,
      isPublished:     true,
      isFeatured:      p.featured,
      draft:           null,
      createdAt:       FieldValue.serverTimestamp(),
      updatedAt:       FieldValue.serverTimestamp(),
      updatedBy:       null,
      lastPublishedAt: FieldValue.serverTimestamp(),
    });

    console.log(`  ${FORCE ? "wrote" : "create"} ${p.id}`);
    created++;
  }

  console.log(`\nDone — ${created} created, ${skipped} skipped.`);
}

seedProjects().catch(console.error).finally(() => process.exit(0));
