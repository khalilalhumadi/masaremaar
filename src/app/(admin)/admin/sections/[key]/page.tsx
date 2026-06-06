"use client";

import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { getClientAuth, getClientDb } from "@/lib/firebase/client";
import { saveSectionDraft, publishSection } from "@/lib/actions/section-content";
import ImageUploadField from "@/components/admin/ImageUploadField";
import {
  SECTION_FIELD_GROUPS,
  EDITABLE_SECTION_TITLE,
  defaultOverride,
  isEditableSection,
  type EditableSectionKey,
  type SectionField,
  type SectionOverride,
  type DepartmentRow,
  type ServiceItemRow,
  type HowStepRow,
  type HomeStatRow,
  type ParagraphRow,
  type WhyItemRow,
} from "@/lib/cms/section-schema";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 14,
  color: "#111827",
  background: "#fff",
  boxSizing: "border-box",
};

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: SectionField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#374151", marginBottom: 6 }}>
        {field.label}
      </label>
      {field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          dir={field.dir}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir={field.dir}
          style={inputStyle}
        />
      )}
    </div>
  );
}

function DepartmentsEditor({
  rows,
  onChange,
}: {
  rows: DepartmentRow[];
  onChange: (rows: DepartmentRow[]) => void;
}) {
  function update(i: number, patch: Partial<DepartmentRow>) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function remove(i: number) {
    onChange(rows.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...rows, { name_en: "", name_ar: "", desc_en: "", desc_ar: "" }]);
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#374151", marginBottom: 10 }}>
        Departments
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "#fafafa" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>#{i + 1}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                style={{ fontSize: 12, color: "#dc2626", background: "none", border: 0, cursor: "pointer" }}
              >
                Remove
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input type="text" placeholder="Name (English)" value={r.name_en} onChange={(e) => update(i, { name_en: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="الاسم (Arabic)" dir="rtl" value={r.name_ar} onChange={(e) => update(i, { name_ar: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Description (English)" value={r.desc_en} onChange={(e) => update(i, { desc_en: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="الوصف (Arabic)" dir="rtl" value={r.desc_ar} onChange={(e) => update(i, { desc_ar: e.target.value })} style={inputStyle} />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        style={{ marginTop: 12, fontSize: 13, color: "var(--green-700, #15803d)", background: "none", border: "1px dashed #d1d5db", borderRadius: 6, padding: "8px 14px", cursor: "pointer", width: "100%" }}
      >
        + Add department
      </button>
    </div>
  );
}

// Fixed-list editor for the 6 service items (ids/icons are structural — no add/remove).
function ServiceItemsEditor({
  rows,
  onChange,
}: {
  rows: ServiceItemRow[];
  onChange: (rows: ServiceItemRow[]) => void;
}) {
  function update(i: number, patch: Partial<ServiceItemRow>) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {rows.map((r, i) => (
        <div key={r.id ?? i} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "#fafafa" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 10 }}>
            #{i + 1} · <span style={{ color: "#9ca3af" }}>{r.id}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input type="text" placeholder="Title (English)" value={r.title_en} onChange={(e) => update(i, { title_en: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="العنوان (Arabic)" dir="rtl" value={r.title_ar} onChange={(e) => update(i, { title_ar: e.target.value })} style={inputStyle} />
            <textarea placeholder="Description (English)" rows={2} value={r.desc_en} onChange={(e) => update(i, { desc_en: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
            <textarea placeholder="الوصف (Arabic)" dir="rtl" rows={2} value={r.desc_ar} onChange={(e) => update(i, { desc_ar: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Fixed-list editor for the 4 process steps.
function HowStepsEditor({
  rows,
  onChange,
}: {
  rows: HowStepRow[];
  onChange: (rows: HowStepRow[]) => void;
}) {
  function update(i: number, patch: Partial<HowStepRow>) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "#fafafa" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 10 }}>
            Step {String(i + 1).padStart(2, "0")}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input type="text" placeholder="Title (English)" value={r.title_en} onChange={(e) => update(i, { title_en: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="العنوان (Arabic)" dir="rtl" value={r.title_ar} onChange={(e) => update(i, { title_ar: e.target.value })} style={inputStyle} />
            <textarea placeholder="Description (English)" rows={2} value={r.desc_en} onChange={(e) => update(i, { desc_en: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
            <textarea placeholder="الوصف (Arabic)" dir="rtl" rows={2} value={r.desc_ar} onChange={(e) => update(i, { desc_ar: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Fixed-list editor for the home stats strip (num/sup shared, label bilingual).
function HomeStatsEditor({
  rows,
  onChange,
}: {
  rows: HomeStatRow[];
  onChange: (rows: HomeStatRow[]) => void;
}) {
  function update(i: number, patch: Partial<HomeStatRow>) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "#fafafa" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 10 }}>Stat #{i + 1}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input type="text" placeholder="Number (e.g. 2017)" value={r.num} onChange={(e) => update(i, { num: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="Superscript (e.g. +)" value={r.sup} onChange={(e) => update(i, { sup: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="Label (English)" value={r.label_en} onChange={(e) => update(i, { label_en: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="التسمية (Arabic)" dir="rtl" value={r.label_ar} onChange={(e) => update(i, { label_ar: e.target.value })} style={inputStyle} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Repeatable paragraphs editor (EN + AR kept parallel; add/remove).
function ParagraphsEditor({
  rows,
  onChange,
}: {
  rows: ParagraphRow[];
  onChange: (rows: ParagraphRow[]) => void;
}) {
  function update(i: number, patch: Partial<ParagraphRow>) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function remove(i: number) {
    onChange(rows.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...rows, { en: "", ar: "" }]);
  }
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#374151", marginBottom: 10 }}>
        Body paragraphs
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "#fafafa" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>¶ {i + 1}</span>
              <button type="button" onClick={() => remove(i)} style={{ fontSize: 12, color: "#dc2626", background: "none", border: 0, cursor: "pointer" }}>
                Remove
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <textarea placeholder="Paragraph (English)" rows={3} value={r.en} onChange={(e) => update(i, { en: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
              <textarea placeholder="فقرة (Arabic)" dir="rtl" rows={3} value={r.ar} onChange={(e) => update(i, { ar: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} style={{ marginTop: 12, fontSize: 13, color: "var(--green-700, #15803d)", background: "none", border: "1px dashed #d1d5db", borderRadius: 6, padding: "8px 14px", cursor: "pointer", width: "100%" }}>
        + Add paragraph
      </button>
    </div>
  );
}

// Fixed-list editor for the 6 "Why" reasons (title + desc, bilingual).
function WhyItemsEditor({
  rows,
  onChange,
}: {
  rows: WhyItemRow[];
  onChange: (rows: WhyItemRow[]) => void;
}) {
  function update(i: number, patch: Partial<WhyItemRow>) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "#fafafa" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 10 }}>Reason #{i + 1}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input type="text" placeholder="Title (English)" value={r.title_en} onChange={(e) => update(i, { title_en: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="العنوان (Arabic)" dir="rtl" value={r.title_ar} onChange={(e) => update(i, { title_ar: e.target.value })} style={inputStyle} />
            <textarea placeholder="Description (English)" rows={2} value={r.desc_en} onChange={(e) => update(i, { desc_en: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
            <textarea placeholder="الوصف (Arabic)" dir="rtl" rows={2} value={r.desc_ar} onChange={(e) => update(i, { desc_ar: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SectionEditPage() {
  const router = useRouter();
  const params = useParams();
  const key = params.key as string;
  const editable = isEditableSection(key);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SectionOverride>({});
  const [isFrozen, setIsFrozen] = useState(false);
  const [busy, setBusy] = useState<"save" | "publish" | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const loadSection = useCallback(async () => {
    if (!editable) {
      setLoading(false);
      return;
    }
    try {
      const db = getClientDb();
      const snap = await getDoc(doc(db, "cms_sections", key));
      const fallback = defaultOverride(key as EditableSectionKey);
      if (snap.exists()) {
        const d = snap.data();
        setIsFrozen(Boolean(d.isFrozen));
        // Prefer draftData (work in progress), then publishedData, then content.ts defaults.
        const stored = (d.draftData ?? d.publishedData) as SectionOverride | undefined;
        setData(stored && Object.keys(stored).length ? stored : fallback);
      } else {
        setData(fallback);
      }
    } catch (err) {
      console.error(err);
      setMessage({ kind: "err", text: "Could not load section content from Firestore." });
    } finally {
      setLoading(false);
    }
  }, [key, editable]);

  useEffect(() => {
    const auth = getClientAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      setUserEmail(user.email);
      loadSection();
    });
    return () => unsub();
  }, [router, loadSection]);

  async function handleLogout() {
    await signOut(getClientAuth());
    await fetch("/api/auth/session", { method: "DELETE" });
    router.replace("/admin/login");
  }

  function setField(fieldKey: string, value: unknown) {
    setData((prev) => ({ ...prev, [fieldKey]: value }));
  }

  async function handleSave(mode: "save" | "publish") {
    setBusy(mode);
    setMessage(null);
    const action = mode === "publish" ? publishSection : saveSectionDraft;
    const result = await action(key, data);
    if (!result.ok) {
      setMessage({ kind: "err", text: result.error ?? "Failed." });
    } else {
      setMessage({
        kind: "ok",
        text: mode === "publish" ? "Published — live within 60 seconds." : "Draft saved.",
      });
      setTimeout(() => setMessage(null), 4000);
    }
    setBusy(null);
  }

  const title = editable ? EDITABLE_SECTION_TITLE[key as EditableSectionKey] : key;

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
          <Link href="/admin/projects">Projects</Link>
          <Link href="/admin/sections/home" className={key === "home" ? "active" : undefined}>Home</Link>
          <Link href="/admin/sections/about" className={key === "about" ? "active" : undefined}>About</Link>
          <Link href="/admin/sections/contact" className={key === "contact" ? "active" : undefined}>Contact</Link>
          <Link href="/admin/sections/services" className={key === "services" ? "active" : undefined}>Services</Link>
          <Link href="/admin/sections/how_we_work" className={key === "how_we_work" ? "active" : undefined}>How We Work</Link>
          <Link href="/admin/sections/company_profile" className={key === "company_profile" ? "active" : undefined}>Company Profile</Link>
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
            <Link href="/admin/dashboard" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>
              ← Sections
            </Link>
            <h1 style={{ margin: 0 }}>Edit {title}</h1>
          </div>
          <span style={{ fontSize: 13, color: "#5a5e57" }}>{userEmail}</span>
        </div>

        <div className="admin-body">
          {!editable ? (
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "20px 24px", fontSize: 14, color: "#92400e", maxWidth: 640 }}>
              <strong>“{key}”</strong> does not have a content editor yet. Editable sections: About, Contact.
              The others can still be frozen/unfrozen from{" "}
              <Link href="/admin/dashboard" style={{ color: "#15803d" }}>Section Control</Link>.
            </div>
          ) : loading ? (
            <p style={{ fontSize: 14, color: "#5a5e57" }}>Loading…</p>
          ) : (
            <>
              {isFrozen && (
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 6, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#92400e", maxWidth: 720 }}>
                  🔒 This section is currently <strong>frozen</strong> — the public page shows an Under Construction screen.
                  You can still edit and publish; changes appear once you unfreeze it in{" "}
                  <Link href="/admin/dashboard" style={{ color: "#15803d" }}>Section Control</Link>.
                </div>
              )}

              {message && (
                <div style={{
                  borderRadius: 6, padding: "12px 16px", marginBottom: 20, fontSize: 14, maxWidth: 720,
                  background: message.kind === "ok" ? "#f0fdf4" : "#fef2f2",
                  border: `1px solid ${message.kind === "ok" ? "#86efac" : "#fca5a5"}`,
                  color: message.kind === "ok" ? "#16a34a" : "#dc2626",
                }}>
                  {message.text}
                </div>
              )}

              <div style={{ maxWidth: 720 }}>
                {SECTION_FIELD_GROUPS[key as EditableSectionKey].map((group) => (
                  <div key={group.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 24, marginBottom: 20 }}>
                    <h2 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 600 }}>{group.title}</h2>
                    {group.fields.map((field) => {
                      if (field.type === "image") {
                        return (
                          <ImageUploadField
                            key={field.key}
                            label={field.label}
                            sectionKey={key}
                            value={typeof data[field.key] === "string" ? (data[field.key] as string) : ""}
                            onChange={(url) => setField(field.key, url)}
                          />
                        );
                      }
                      if (field.type === "departments") {
                        return (
                          <DepartmentsEditor
                            key={field.key}
                            rows={Array.isArray(data.departments) ? (data.departments as DepartmentRow[]) : []}
                            onChange={(rows) => setField("departments", rows)}
                          />
                        );
                      }
                      if (field.type === "service_items") {
                        return (
                          <ServiceItemsEditor
                            key={field.key}
                            rows={Array.isArray(data.items) ? (data.items as ServiceItemRow[]) : []}
                            onChange={(rows) => setField("items", rows)}
                          />
                        );
                      }
                      if (field.type === "how_steps") {
                        return (
                          <HowStepsEditor
                            key={field.key}
                            rows={Array.isArray(data.steps) ? (data.steps as HowStepRow[]) : []}
                            onChange={(rows) => setField("steps", rows)}
                          />
                        );
                      }
                      if (field.type === "home_stats") {
                        return (
                          <HomeStatsEditor
                            key={field.key}
                            rows={Array.isArray(data.stats) ? (data.stats as HomeStatRow[]) : []}
                            onChange={(rows) => setField("stats", rows)}
                          />
                        );
                      }
                      if (field.type === "paragraphs") {
                        return (
                          <ParagraphsEditor
                            key={field.key}
                            rows={Array.isArray(data[field.key]) ? (data[field.key] as ParagraphRow[]) : []}
                            onChange={(rows) => setField(field.key, rows)}
                          />
                        );
                      }
                      if (field.type === "why_items") {
                        return (
                          <WhyItemsEditor
                            key={field.key}
                            rows={Array.isArray(data.why_items) ? (data.why_items as WhyItemRow[]) : []}
                            onChange={(rows) => setField("why_items", rows)}
                          />
                        );
                      }
                      return (
                        <FieldInput
                          key={field.key}
                          field={field}
                          value={typeof data[field.key] === "string" ? (data[field.key] as string) : ""}
                          onChange={(v) => setField(field.key, v)}
                        />
                      );
                    })}
                  </div>
                ))}

                {/* Actions */}
                <div style={{ display: "flex", gap: 12, position: "sticky", bottom: 0, background: "linear-gradient(transparent, #f4f5f2 40%)", padding: "16px 0" }}>
                  <button
                    onClick={() => handleSave("save")}
                    disabled={busy !== null}
                    style={{ padding: "12px 24px", background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: busy ? "wait" : "pointer" }}
                  >
                    {busy === "save" ? "Saving…" : "Save draft"}
                  </button>
                  <button
                    onClick={() => handleSave("publish")}
                    disabled={busy !== null}
                    style={{ padding: "12px 28px", background: "var(--green-700, #15803d)", color: "#fff", border: 0, borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}
                  >
                    {busy === "publish" ? "Publishing…" : "Publish"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
