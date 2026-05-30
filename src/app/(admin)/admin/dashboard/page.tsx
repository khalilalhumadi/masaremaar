"use client";

import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getClientAuth } from "@/lib/firebase/client";
import {
  getAllSections,
  toggleFreeze,
  type CmsSection,
  type SectionKey,
} from "@/lib/cms/sections";
import { isEditableSection } from "@/lib/cms/section-schema";
import { getArabicEnabled, setArabicEnabled } from "@/lib/actions/locale-settings";

// Section descriptions shown in the dashboard
const SECTION_DESCRIPTIONS: Record<string, string> = {
  about: "Company background, vision, mission, MD statement, and team.",
  services: "The six service disciplines and their descriptions.",
  projects: "Project cards, categories, images, and modal content.",
  how_we_work: "The four-step process and quality principle band.",
  company_profile: "PDF download page and page preview cards.",
  contact: "Contact details and the enquiry form.",
};

function formatDate(d: Date | null) {
  if (!d) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function FreezeToggle({
  section,
  onToggle,
  disabled,
}: {
  section: CmsSection;
  onToggle: (key: SectionKey, frozen: boolean) => Promise<void>;
  disabled: boolean;
}) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    await onToggle(section.sectionKey as SectionKey, section.isFrozen);
    setBusy(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || busy}
      className={`admin-btn${section.isFrozen ? " ghost" : ""}`}
      style={{
        fontSize: 12,
        padding: "7px 16px",
        opacity: disabled || busy ? 0.5 : 1,
        cursor: disabled || busy ? "not-allowed" : "pointer",
        background: section.isFrozen ? "transparent" : "var(--green-800)",
        border: section.isFrozen ? "1px solid var(--gold-600)" : "1px solid transparent",
        color: section.isFrozen ? "var(--gold-700)" : "#fff",
      }}
    >
      {busy ? "…" : section.isFrozen ? "🔓 Unfreeze" : "🔒 Freeze"}
    </button>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sections, setSections] = useState<CmsSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anyBusy, setAnyBusy] = useState(false);
  const [arabicEnabled, setArabicEnabledState] = useState<boolean | null>(null);
  const [arabicBusy, setArabicBusy] = useState(false);

  useEffect(() => {
    const auth = getClientAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user?.email) {
        router.push("/admin/login");
        return;
      }
      setUserEmail(user.email);
      try {
        const [data, arabic] = await Promise.all([
          getAllSections(user.email),
          getArabicEnabled(),
        ]);
        setSections(data);
        setArabicEnabledState(arabic);
      } catch (err) {
        console.error(err);
        setError(
          "Could not load sections. Make sure Firestore rules are deployed — see firestore.rules in the repo."
        );
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [router]);

  async function handleToggleArabic() {
    if (arabicEnabled === null) return;
    setArabicBusy(true);
    const next = !arabicEnabled;
    const result = await setArabicEnabled(next);
    if (result.ok) {
      setArabicEnabledState(next);
    } else {
      setError(result.error ?? "Failed to update Arabic site setting.");
    }
    setArabicBusy(false);
  }

  const handleToggle = useCallback(
    async (key: SectionKey, currentFrozen: boolean) => {
      if (!userEmail) return;
      setAnyBusy(true);
      const nowFrozen = !currentFrozen;
      try {
        await toggleFreeze(key, nowFrozen, userEmail);
        setSections((prev) =>
          prev.map((s) =>
            s.sectionKey === key
              ? { ...s, isFrozen: nowFrozen, lastEditedBy: userEmail, lastEditedAt: new Date() }
              : s
          )
        );
      } catch {
        setError(`Failed to update "${key}". Check Firestore rules.`);
      } finally {
        setAnyBusy(false);
      }
    },
    [userEmail]
  );

  async function handleLogout() {
    const auth = getClientAuth();
    await signOut(auth);
    // Clear the httpOnly __session cookie server-side (JS cannot clear httpOnly cookies).
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/admin/login");
  }

  const frozenCount = sections.filter((s) => s.isFrozen).length;

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-side">
        <div className="admin-side-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-wide-white.png" alt="Masar Emaar" style={{ height: 36, marginBottom: 12 }} />
          <small>CMS Admin</small>
        </div>
        <nav className="admin-nav">
          <div className="admin-nav-section">Content</div>
          <Link href="/admin/dashboard" className="active">Section Control</Link>
          <Link href="/admin/projects">Projects</Link>
          <Link href="/admin/sections/home">Home</Link>
          <Link href="/admin/sections/about">About</Link>
          <Link href="/admin/sections/contact">Contact</Link>
          <Link href="/admin/sections/services">Services</Link>
          <Link href="/admin/sections/how_we_work">How We Work</Link>
          <Link href="/admin/sections/company_profile">Company Profile</Link>
          <div className="admin-nav-section" style={{ marginTop: 16 }}>Site</div>
          <a href="/en" target="_blank" rel="noopener">View live site ↗</a>
          <div className="admin-nav-section" style={{ marginTop: 16 }}>Account</div>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
            style={{ color: "rgba(255,255,255,.5)" }}
          >
            Sign out
          </a>
        </nav>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <h1>Section Control</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {frozenCount > 0 && (
              <span className="admin-pill draft">{frozenCount} frozen</span>
            )}
            <span style={{ fontSize: 13, color: "#5a5e57" }}>{userEmail}</span>
          </div>
        </div>

        <div className="admin-body">
          {/* Intro */}
          <p style={{ margin: "0 0 32px", fontSize: 14, color: "#5a5e57", maxWidth: 640 }}>
            <strong>🔒 Frozen</strong> — public visitors see an <em>Under Construction</em> page
            instead of the real content. Use this to hide a section while it is being prepared.{" "}
            <strong>🔓 Unfrozen</strong> — the real content is visible to all visitors.
            Changes take effect within 60 seconds.
          </p>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: 24, padding: "14px 20px",
              background: "#fff3d6", border: "1px solid #e9c46a",
              fontSize: 13, color: "#8a6a2e",
              borderInlineStart: "3px solid #c9a158",
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ padding: 48, textAlign: "center", color: "#8a8e87", fontSize: 14 }}>
              Loading sections…
            </div>
          )}

          {/* Site settings — Arabic locale toggle */}
          {!loading && arabicEnabled !== null && (
            <div
              style={{
                marginBottom: 32, padding: "18px 22px",
                background: "#fff", border: "1px solid #eaece6", borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Arabic site (العربية)</div>
                <div style={{ fontSize: 12.5, color: "#8a8e87", maxWidth: 560 }}>
                  {arabicEnabled
                    ? "Arabic is live. The language switch is visible and /ar pages show real content."
                    : "Arabic is switched off. The language button is hidden and all /ar pages show Under Construction."}
                </div>
              </div>
              <button
                onClick={handleToggleArabic}
                disabled={arabicBusy}
                className={`admin-btn${arabicEnabled ? "" : " ghost"}`}
                style={{
                  fontSize: 12, padding: "8px 18px", whiteSpace: "nowrap",
                  opacity: arabicBusy ? 0.5 : 1, cursor: arabicBusy ? "not-allowed" : "pointer",
                  background: arabicEnabled ? "var(--green-800)" : "transparent",
                  border: arabicEnabled ? "1px solid transparent" : "1px solid var(--gold-600)",
                  color: arabicEnabled ? "#fff" : "var(--gold-700)",
                }}
              >
                {arabicBusy ? "…" : arabicEnabled ? "🌐 Switch OFF Arabic" : "🌐 Switch ON Arabic"}
              </button>
            </div>
          )}

          {/* Sections table */}
          {!loading && sections.length > 0 && (
            <div className="admin-section">
              <div className="admin-section-head">
                <h3>All sections</h3>
                <span style={{ fontSize: 12, color: "#8a8e87" }}>{sections.length} sections</span>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Section</th>
                    <th>Status</th>
                    <th>Last edited</th>
                    <th>Last published</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map((s) => (
                    <tr key={s.sectionKey}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{s.title}</div>
                        <div style={{ fontSize: 12, color: "#8a8e87" }}>
                          {SECTION_DESCRIPTIONS[s.sectionKey]}
                        </div>
                      </td>
                      <td>
                        {s.isFrozen ? (
                          <span className="admin-pill draft">🔒 Frozen</span>
                        ) : (
                          <span className="admin-pill pub">🔓 Unfrozen</span>
                        )}
                      </td>
                      <td style={{ fontSize: 13 }}>
                        <div>{formatDate(s.lastEditedAt)}</div>
                        {s.lastEditedBy && (
                          <div style={{ color: "#8a8e87", fontSize: 12, marginTop: 2 }}>
                            {s.lastEditedBy}
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: 13 }}>
                        <div>{formatDate(s.lastPublishedAt)}</div>
                        {s.lastPublishedBy && (
                          <div style={{ color: "#8a8e87", fontSize: 12, marginTop: 2 }}>
                            {s.lastPublishedBy}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <FreezeToggle
                            section={s}
                            onToggle={handleToggle}
                            disabled={anyBusy}
                          />
                          {s.sectionKey === "projects" ? (
                            <Link href="/admin/projects" style={{ fontSize: 13, color: "var(--green-700)", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>
                              Edit →
                            </Link>
                          ) : isEditableSection(s.sectionKey) ? (
                            <Link href={`/admin/sections/${s.sectionKey}`} style={{ fontSize: 13, color: "var(--green-700)", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>
                              Edit →
                            </Link>
                          ) : (
                            <span style={{ fontSize: 12, color: "#c0c3bd", whiteSpace: "nowrap" }}>Freeze only</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
