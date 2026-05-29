# Masaremaar CMS — Architecture Plan

**Status:** Approved 2026-05-30  
**Site:** https://masaremaar.vercel.app/en/  
**Repo:** github.com/dmesasms/masaremaar  

---

## Decisions (approved)

| # | Decision | Answer |
|---|---|---|
| 1 | Remove `output: "export"` | ✅ Yes — run on Vercel's Next.js runtime |
| 2 | Auth method | Email/password first; Google sign-in later |
| 3 | Bilingual publish rule | English required; Arabic optional, falls back to English |
| 4 | Category filtering | Internal `categoryKey` enum; same visible labels |
| 5 | Modal images | Single image for Phase 2; `modalImages[]` stored for future |

---

## Infrastructure

```
Public site (Vercel, Next.js runtime — not static export)
   └─ Server Components fetch published content via Firebase Admin SDK
        └─ ISR revalidation on publish (revalidatePath)
        └─ Static fallback to content.ts if Firestore empty/unavailable

Admin CMS  /admin  (same Next.js app, route group)
   └─ Firebase Auth (client SDK) — email/password login
   └─ Server Actions verify admin custom claim (Admin SDK)
        └─ Freeze check inside Firestore transaction on every write
   └─ Image uploads → Firebase Storage (admin-only write, public read)

GoDaddy       — DNS / domain only. No hosting. No users.
Vercel        — Host. Free Hobby plan during development.
Firebase      — Auth, Firestore, Storage. Start on Spark free plan.
```

---

## Data model

### `cms_sections/{sectionKey}` — section-level freeze & publish gate

One document per section key: `about`, `services`, `projects`,
`how_we_work`, `company_profile`, `contact`.

```
sectionKey:       string          // e.g. "projects"
title:            string          // admin display label
isFrozen:         boolean         // master edit gate
status:           "draft" | "published"
publishedData:    map | null      // live content (non-Projects sections)
draftData:        map | null      // work in progress
lastEditedBy:     string (uid)
lastEditedAt:     timestamp
lastPublishedBy:  string (uid)
lastPublishedAt:  timestamp
```

> For the **Projects** section, `publishedData/draftData` are unused (content lives
> in `cms_projects`). The doc is still created so the freeze switch works uniformly.

---

### `cms_projects/{projectId}` — per-project content

```
slug:             string          // stable id matching current content.ts key
title_en:         string
title_ar:         string          // optional; falls back to title_en if empty
description_en:   string
description_ar:   string          // optional; falls back to description_en
location_en:      string
location_ar:      string
categoryKey:      "infrastructure" | "industrial" | "public"
                  | "residential" | "transport"
year:             string          // e.g. "2024"
coverImageUrl:    string          // Firebase Storage URL or Unsplash fallback
modalImages:      string[]        // stored now; gallery UI is a future phase
sortOrder:        number          // ascending; used to order the public grid
isPublished:      boolean
isFeatured:       boolean
draft:            map | null      // per-project draft overlay; null = no unpublished edits
createdAt:        timestamp
updatedAt:        timestamp
updatedBy:        string (uid)
lastPublishedAt:  timestamp
```

**Category key → label mapping** (kept in code, not Firestore):

| Key | English | Arabic |
|---|---|---|
| `infrastructure` | Infrastructure | البنية التحتية |
| `industrial` | Industrial | الصناعة |
| `public` | Public | القطاع العام |
| `residential` | Residential | السكنية |
| `transport` | Transport | النقل |

---

## Publish flow (Projects)

1. Admin edits a project → writes to `draft` sub-field.
2. Admin clicks **Publish** → Server Action:
   a. Re-reads `cms_sections/projects.isFrozen` in a transaction.  
   b. If frozen → reject with error, no write.  
   c. If unfrozen → copy `draft` to top-level fields, set `lastPublishedAt`.  
   d. Call `revalidatePath("/[locale]/projects")` for `en` and `ar`.  
3. Public site fetches on next request — shows updated content (≤ a few seconds).

---

## Firebase security rules plan

### Firestore

```
// All cms_* collections: no direct client access.
// Only the server's Admin SDK (service account) reads/writes.
match /cms_sections/{doc}  { allow read, write: if false; }
match /cms_projects/{doc}  { allow read, write: if false; }
```

This is intentionally strict. All access goes through Server Actions that
use the Admin SDK (which bypasses rules). Rules are defense-in-depth.

### Storage (`gs://…/projects/{projectId}/…`)

```
match /projects/{projectId}/{fileName} {
  allow read: if true;                           // public: images shown on site
  allow write: if request.auth != null
    && request.auth.token.admin == true          // admin custom claim
    && request.resource.contentType.matches('image/.*')
    && request.resource.size < 5 * 1024 * 1024; // max 5 MB per image
  allow delete: if request.auth != null
    && request.auth.token.admin == true;
}
```

---

## Admin access

- **Route:** `/admin` (Next.js route group `(admin)`)
- **Auth:** Firebase email/password. Admin identity = custom claim `admin: true`
  set via a one-time server script (Admin SDK). No self-serve signup.
- **Middleware guard:** `src/middleware.ts` — rejects unauthenticated requests
  to `/admin/*` before any page renders.
- **Server-side re-check:** every Server Action verifies the admin claim
  independently (never trust client state alone).
- **Secret handling:** Firebase service-account JSON stored as Vercel
  environment variable `FIREBASE_SERVICE_ACCOUNT` (base64). Never committed.

---

## Environment variables

```
# Server-only (Vercel environment variables — never in repo)
FIREBASE_SERVICE_ACCOUNT=<base64-encoded service account JSON>

# Public (safe to expose — Firebase client config)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Phases

### Phase 0 — Foundation switch *(approved — current focus)*
- [ ] Remove `output: "export"` and `trailingSlash: true` from `next.config.ts`
- [ ] Install `firebase` (client) and `firebase-admin` (server) packages
- [ ] `src/lib/firebase/client.ts` — client SDK singleton
- [ ] `src/lib/firebase/admin.ts` — Admin SDK singleton (reads env var)
- [ ] `.env.local.example` — document all required env vars (no real values)
- [ ] Verify Vercel build still passes (no visual change)
- [ ] Commit + push → auto-deploy to Vercel

### Phase 1 — CMS shell + auth + freeze dashboard *(next, pending approval)*
- `/admin` route group with layout
- Firebase Auth login page (email/password)
- Middleware guard for `/admin/*`
- Admin claim grant script
- `cms_sections` seeded for all 6 sections
- Freeze/Unfreeze dashboard UI (toggles + status metadata)

### Phase 2 — Projects CMS *(pending approval)*
- Seed `cms_projects` from `content.ts` (13 existing projects)
- `getProjects()` data-access layer — reads Firestore, falls back to `content.ts`
- Update `ProjectsView` / `ProjectCard` / `ProjectModal` to accept props
- Switch category filtering to `categoryKey` enum
- Admin project list + edit form (title/desc/location/year/category/cover image/sort/visibility)
- Image upload → Firebase Storage
- Draft → Publish flow with revalidation
- Freeze gate enforced in UI + Server Action

### Phase 3 — Remaining sections *(future)*
- About, Services, How We Work, Company Profile, Contact
- Section-specific edit forms using `draftData/publishedData`
- Same freeze pattern

### Optional (later)
- Google sign-in for admin
- Multi-image modal gallery
- Draft preview mode (Next.js Draft Mode)
- Add-new-projects from CMS

---

## Risks & edge cases

| Risk | Mitigation |
|---|---|
| Static export removal changes deploy behavior | Vercel fully supports Next.js runtime; visual output identical |
| Service-account secret leaked | Never in repo; Vercel env only; strict Firestore rules as backstop |
| Admin claim bootstrap chicken-and-egg | One-time script documented in this plan; run before any admin UI |
| Category migration breaks AR filters | Seed script maps existing localized strings to `categoryKey` |
| Freeze race condition (stale tab) | Transactional re-check of `isFrozen` inside every Server Action |
| Firestore/Firebase down | `content.ts` static fallback; public site never breaks |
| Both EN+AR required later | Publish guard: today require EN only; add AR validation in Phase 3 |
| `next/image` with external URLs | Needs `images.domains` config; add when switching from Unsplash |
| Modal `modalImages[]` display | Stored in model now; gallery UI is explicitly deferred |
