"use client";

import { useEffect } from "react";
import { Icon } from "./icons";
import { CONTENT, IMAGES, type Locale, type Project } from "@/lib/content";

export default function ProjectModal({
  project,
  locale,
  onClose,
}: {
  project: Project;
  locale: Locale;
  onClose: () => void;
}) {
  const img = project.coverImageUrl || IMAGES.project[project.id] || IMAGES.hero;
  const ui = CONTENT.ui[locale];

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const meta = [
    { label: ui.location, val: project.location[locale] },
    { label: ui.category, val: project.category[locale] },
    { label: ui.year, val: project.year },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(12,42,30,.7)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: "var(--cream)", maxWidth: 1100, width: "100%", maxHeight: "90vh", overflow: "auto", position: "relative" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label={ui.back}
          style={{ position: "absolute", top: 16, insetInlineEnd: 16, zIndex: 2, background: "rgba(255,255,255,.92)", border: 0, width: 40, height: 40, fontSize: 20, lineHeight: 1 }}
        >
          ×
        </button>
        <div style={{ aspectRatio: "16/9", backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ padding: "clamp(28px, 4vw, 56px)" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <span className="tag-pill active">{project.category[locale]}</span>
            <span className="tag-pill">{project.year}</span>
            {project.featured && (
              <span className="tag-pill" style={{ borderColor: "var(--gold-500)", color: "var(--gold-700)" }}>
                {ui.featured}
              </span>
            )}
          </div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 400, margin: "0 0 12px", letterSpacing: "-0.01em", lineHeight: 1.05 }}>
            {project.title[locale]}
          </h2>
          <div style={{ fontSize: 15, color: "var(--ink-3)", marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Icon.pin width={16} height={16} /> {project.location[locale]}
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-2)", maxWidth: "68ch" }}>{project.desc[locale]}</p>
          <div className="modal-meta" style={{ marginTop: 36, borderTop: "1px solid var(--line)" }}>
            {meta.map((m, i) => (
              <div key={i} className="modal-meta-cell">
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>{m.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
