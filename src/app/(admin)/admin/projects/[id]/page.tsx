"use client";

import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { getClientAuth, getClientDb, getClientStorage } from "@/lib/firebase/client";
import { saveProject } from "@/lib/actions/projects";
import { CATEGORY_KEYS, CATEGORY_LABELS } from "@/lib/cms-types";
import type { CmsProject, CategoryKey } from "@/lib/cms-types";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151", marginBottom: 6 }}>
      {children}
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  textarea,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  dir?: "rtl";
}) {
  const shared: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 14,
    color: "#111827",
    background: "#fff",
    boxSizing: "border-box",
    direction: dir,
  };
  return (
    <div style={{ marginBottom: 18 }}>
      <Label>{label}{required && <span style={{ color: "#ef4444" }}> *</span>}</Label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          style={{ ...shared, resize: "vertical" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={shared}
        />
      )}
    </div>
  );
}

export default function ProjectEditPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [project, setProject] = useState<CmsProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form fields
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [locationEn, setLocationEn] = useState("");
  const [locationAr, setLocationAr] = useState("");
  const [categoryKey, setCategoryKey] = useState<CategoryKey>("infrastructure");
  const [year, setYear] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState("");

  // Image upload
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function populateForm(p: CmsProject) {
    setTitleEn(p.title_en);
    setTitleAr(p.title_ar);
    setDescEn(p.description_en);
    setDescAr(p.description_ar);
    setLocationEn(p.location_en);
    setLocationAr(p.location_ar);
    setCategoryKey(p.categoryKey);
    setYear(p.year);
    setSortOrder(p.sortOrder);
    setIsPublished(p.isPublished);
    setIsFeatured(p.isFeatured);
    setCoverImageUrl(p.coverImageUrl);
  }

  useEffect(() => {
    const auth = getClientAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      setUserEmail(user.email);

      // Fetch project from Firestore (client SDK — admin rules allow this)
      try {
        const db = getClientDb();
        const snap = await getDoc(doc(db, "cms_projects", projectId));
        if (!snap.exists()) {
          router.replace("/admin/projects");
          return;
        }
        const data = snap.data();
        const p: CmsProject = {
          id: snap.id,
          slug: data.slug ?? snap.id,
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
          sortOrder: data.sortOrder ?? 1,
          isPublished: data.isPublished ?? false,
          isFeatured: data.isFeatured ?? false,
          draft: data.draft ?? null,
          createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
          updatedBy: data.updatedBy ?? null,
          lastPublishedAt: data.lastPublishedAt?.toDate?.()?.toISOString() ?? null,
        };
        setProject(p);
        populateForm(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, projectId]);

  async function handleLogout() {
    await signOut(getClientAuth());
    await fetch("/api/auth/session", { method: "DELETE" });
    router.replace("/admin/login");
  }

  async function handleSave() {
    if (!titleEn.trim()) {
      setSaveError("Title (English) is required.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const result = await saveProject(projectId, {
      title_en: titleEn.trim(),
      title_ar: titleAr.trim(),
      description_en: descEn.trim(),
      description_ar: descAr.trim(),
      location_en: locationEn.trim(),
      location_ar: locationAr.trim(),
      categoryKey,
      year: year.trim(),
      coverImageUrl: coverImageUrl.trim(),
      sortOrder: Number(sortOrder),
      isPublished,
      isFeatured,
    });

    if (!result.ok) {
      setSaveError(result.error ?? "Save failed.");
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5 MB.");
      return;
    }

    setUploadError(null);
    setUploadProgress(0);

    // Force token refresh so the admin custom claim is always current.
    // Without this, a token issued before the claim was set would be rejected.
    try {
      const currentUser = getClientAuth().currentUser;
      if (currentUser) await currentUser.getIdToken(true);
    } catch {
      // Non-fatal — proceed with existing token
    }

    const storage = getClientStorage();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `projects/${projectId}/${Date.now()}.${ext}`;
    const ref = storageRef(storage, path);
    const task = uploadBytesResumable(ref, file, { contentType: file.type });

    task.on(
      "state_changed",
      (snap) => {
        const pct = snap.totalBytes > 0
          ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          : 0;
        setUploadProgress(pct);
      },
      (err) => {
        console.error("Storage upload error:", err.code, err.message);
        let msg: string;
        switch (err.code) {
          case "storage/unauthorized":
            msg = "Upload rejected — your session may lack the admin claim. Sign out and back in, then retry.";
            break;
          case "storage/canceled":
            msg = "Upload was cancelled.";
            break;
          case "storage/quota-exceeded":
            msg = "Storage quota exceeded.";
            break;
          default:
            msg = `Upload failed (${err.code}) — ${err.message}`;
        }
        setUploadError(msg);
        setUploadProgress(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        setCoverImageUrl(url);
        setUploadProgress(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    );
  }

  if (loading) {
    return (
      <div className="admin-shell">
        <aside className="admin-side">
          <div className="admin-side-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-wide-white.png" alt="Masar Emaar" style={{ height: 36, marginBottom: 12 }} />
            <small>CMS Admin</small>
          </div>
        </aside>
        <div className="admin-main">
          <div className="admin-topbar"><h1>Edit Project</h1></div>
          <div className="admin-body"><p style={{ fontSize: 14, color: "#5a5e57" }}>Loading…</p></div>
        </div>
      </div>
    );
  }

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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/admin/projects" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>
              ← Projects
            </Link>
            <h1 style={{ margin: 0 }}>{project?.title_en ?? projectId}</h1>
          </div>
          <span style={{ fontSize: 13, color: "#5a5e57" }}>{userEmail}</span>
        </div>

        <div className="admin-body">
          {saveError && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 6, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#dc2626" }}>
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 6, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#16a34a" }}>
              Saved successfully.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>
            {/* Left — text fields */}
            <div>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 24, marginBottom: 24 }}>
                <h2 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600 }}>Content</h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="Title (English)" value={titleEn} onChange={setTitleEn} required />
                  <Field label="Title (Arabic)" value={titleAr} onChange={setTitleAr} dir="rtl" placeholder="اختياري" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="Description (English)" value={descEn} onChange={setDescEn} textarea required />
                  <Field label="Description (Arabic)" value={descAr} onChange={setDescAr} textarea dir="rtl" placeholder="اختياري" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="Location (English)" value={locationEn} onChange={setLocationEn} required />
                  <Field label="Location (Arabic)" value={locationAr} onChange={setLocationAr} dir="rtl" placeholder="اختياري" />
                </div>
              </div>
            </div>

            {/* Right — meta + image */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Meta */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 24 }}>
                <h2 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600 }}>Details</h2>

                <div style={{ marginBottom: 18 }}>
                  <Label>Category<span style={{ color: "#ef4444" }}> *</span></Label>
                  <select
                    value={categoryKey}
                    onChange={(e) => setCategoryKey(e.target.value as CategoryKey)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, background: "#fff" }}
                  >
                    {CATEGORY_KEYS.map((k) => (
                      <option key={k} value={k}>{CATEGORY_LABELS[k].en}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ marginBottom: 18 }}>
                    <Label>Year</Label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2024"
                      style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <Label>Sort Order</Label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                      min={1}
                      style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 4 }}>
                  {[
                    { label: "Published (visible on public site)", checked: isPublished, onChange: setIsPublished },
                    { label: "Featured",                           checked: isFeatured,  onChange: setIsFeatured },
                  ].map(({ label, checked, onChange }) => (
                    <label key={label} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onChange(e.target.checked)}
                        style={{ width: 16, height: 16, cursor: "pointer" }}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Cover Image */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 24 }}>
                <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600 }}>Cover Image</h2>

                {coverImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverImageUrl}
                    alt="Cover preview"
                    style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 6, marginBottom: 16 }}
                  />
                )}

                <div style={{ marginBottom: 12 }}>
                  <Label>Image URL</Label>
                  <input
                    type="text"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://..."
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <Label>Upload new image (max 5 MB)</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploadProgress !== null}
                    style={{ fontSize: 13, width: "100%" }}
                  />
                  {uploadProgress !== null && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${uploadProgress}%`, background: "var(--green-700)", transition: "width 0.2s" }} />
                      </div>
                      <p style={{ fontSize: 12, color: "#6b7280", margin: "4px 0 0" }}>{uploadProgress}%</p>
                    </div>
                  )}
                  {uploadError && (
                    <p style={{ fontSize: 12, color: "#dc2626", margin: "6px 0 0" }}>{uploadError}</p>
                  )}
                </div>
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving || uploadProgress !== null}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  background: "var(--green-700, #15803d)",
                  color: "#fff",
                  border: 0,
                  borderRadius: 6,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: saving ? "wait" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
