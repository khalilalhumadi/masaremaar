"use client";

import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getClientAuth } from "@/lib/firebase/client";
import { setProjectPublished } from "@/lib/actions/projects";
import { CATEGORY_LABELS } from "@/lib/cms-types";
import type { CmsProject } from "@/lib/cms-types";

// Client-side Firestore imports for reading project list
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function AdminProjectsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [projects, setProjects] = useState<CmsProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const db = getClientDb();
      const q = query(collection(db, "cms_projects"), orderBy("sortOrder", "asc"));
      const snap = await getDocs(q);
      const list: CmsProject[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          slug: data.slug ?? d.id,
          title_en: data.title_en ?? "",
          title_ar: data.title_ar ?? "",
          description_en: data.description_en ?? "",
          description_ar: data.description_ar ?? "",
          location_en: data.location_en ?? "",
          location_ar: data.location_ar ?? "",
          categoryKey: data.categoryKey ?? "infrastructure",
          year: data.year ?? "",
          coverImageUrl: data.coverImageUrl ?? "",
          modalImages: data.modalImages ?? [],
          sortOrder: data.sortOrder ?? 0,
          isPublished: data.isPublished ?? false,
          isFeatured: data.isFeatured ?? false,
          draft: data.draft ?? null,
          createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
          updatedBy: data.updatedBy ?? null,
          lastPublishedAt: data.lastPublishedAt?.toDate?.()?.toISOString() ?? null,
        };
      });
      setProjects(list);
    } catch (err) {
      console.error(err);
      setError("Could not load projects from Firestore.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const auth = getClientAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      setUserEmail(user.email);
      fetchProjects();
    });
    return () => unsub();
  }, [router, fetchProjects]);

  async function handleLogout() {
    await signOut(getClientAuth());
    await fetch("/api/auth/session", { method: "DELETE" });
    router.replace("/admin/login");
  }

  async function handleTogglePublished(proj: CmsProject) {
    setTogglingId(proj.id);
    setError(null);
    const next = !proj.isPublished;
    const result = await setProjectPublished(proj.id, next);
    if (!result.ok) {
      setError(result.error ?? "Failed to update");
    } else {
      // Optimistic update + re-fetch
      setProjects((prev) =>
        prev.map((p) => (p.id === proj.id ? { ...p, isPublished: next } : p))
      );
    }
    setTogglingId(null);
  }

  const publishedCount = projects.filter((p) => p.isPublished).length;

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
          <Link href="/admin/dashboard">Section Control</Link>
          <Link href="/admin/projects" className="active">Projects</Link>
          <Link href="/admin/sections/about">About</Link>
          <Link href="/admin/sections/contact">Contact</Link>
          <div className="admin-nav-section" style={{ marginTop: 16 }}>Site</div>
          <a href="/en" target="_blank" rel="noopener">View live site ↗</a>
          <div className="admin-nav-section" style={{ marginTop: 16 }}>Account</div>
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ color: "rgba(255,255,255,.5)" }}>
            Sign out
          </a>
        </nav>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <h1>Projects</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {!loading && (
              <span className="admin-pill published">{publishedCount} published</span>
            )}
            <span style={{ fontSize: 13, color: "#5a5e57" }}>{userEmail}</span>
          </div>
        </div>

        <div className="admin-body">
          <p style={{ margin: "0 0 24px", fontSize: 14, color: "#5a5e57", maxWidth: 640 }}>
            Edit project details, images, and visibility. Publishing respects the
            Projects freeze status set in{" "}
            <Link href="/admin/dashboard" style={{ color: "var(--green-700)" }}>Section Control</Link>.
          </p>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 6, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#dc2626" }}>
              {error}
            </div>
          )}

          {loading ? (
            <p style={{ fontSize: 14, color: "#5a5e57" }}>Loading projects…</p>
          ) : projects.length === 0 ? (
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "32px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 16px" }}>
                No projects found. Run the seed script to populate Firestore from <code>content.ts</code>:
              </p>
              <code style={{ fontSize: 13, background: "#f3f4f6", padding: "8px 12px", borderRadius: 4, display: "inline-block" }}>
                node --env-file=.env.local scripts/seed-projects.mjs
              </code>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                    <th style={{ padding: "10px 12px", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>#</th>
                    <th style={{ padding: "10px 12px", fontWeight: 600, color: "#374151" }}>Project</th>
                    <th style={{ padding: "10px 12px", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Category</th>
                    <th style={{ padding: "10px 12px", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Year</th>
                    <th style={{ padding: "10px 12px", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Updated</th>
                    <th style={{ padding: "10px 12px", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Status</th>
                    <th style={{ padding: "10px 12px", fontWeight: 600, color: "#374151" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((proj) => (
                    <tr key={proj.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px 12px", color: "#9ca3af" }}>{proj.sortOrder}</td>
                      <td style={{ padding: "12px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {proj.coverImageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={proj.coverImageUrl}
                              alt=""
                              style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 4, flexShrink: 0 }}
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: 500, color: "#111827" }}>{proj.title_en}</div>
                            {proj.title_ar && (
                              <div style={{ fontSize: 12, color: "#6b7280", direction: "rtl" }}>{proj.title_ar}</div>
                            )}
                            {proj.isFeatured && (
                              <span style={{ fontSize: 11, background: "#fef3c7", color: "#d97706", padding: "1px 6px", borderRadius: 3, marginTop: 2, display: "inline-block" }}>
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 12px", color: "#6b7280" }}>
                        {CATEGORY_LABELS[proj.categoryKey]?.en ?? proj.categoryKey}
                      </td>
                      <td style={{ padding: "12px 12px", color: "#6b7280" }}>{proj.year}</td>
                      <td style={{ padding: "12px 12px", color: "#9ca3af", whiteSpace: "nowrap" }}>
                        {formatDate(proj.updatedAt)}
                      </td>
                      <td style={{ padding: "12px 12px" }}>
                        <button
                          onClick={() => handleTogglePublished(proj)}
                          disabled={togglingId === proj.id}
                          style={{
                            padding: "4px 10px",
                            fontSize: 12,
                            borderRadius: 4,
                            border: "1px solid",
                            cursor: togglingId === proj.id ? "wait" : "pointer",
                            borderColor: proj.isPublished ? "#16a34a" : "#d1d5db",
                            background: proj.isPublished ? "#dcfce7" : "#f9fafb",
                            color: proj.isPublished ? "#15803d" : "#6b7280",
                            fontWeight: 500,
                          }}
                        >
                          {togglingId === proj.id ? "…" : proj.isPublished ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td style={{ padding: "12px 12px", textAlign: "right" }}>
                        <Link
                          href={`/admin/projects/${proj.id}`}
                          style={{ fontSize: 13, color: "var(--green-700)", fontWeight: 500, textDecoration: "none" }}
                        >
                          Edit →
                        </Link>
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
