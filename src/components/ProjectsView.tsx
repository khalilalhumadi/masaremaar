"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "./sections";
import ProjectModal from "./ProjectModal";
import { CONTENT, type Locale, type Project } from "@/lib/content";

export default function ProjectsView({
  locale,
  projects,
}: {
  locale: Locale;
  projects?: Project[];
}) {
  const p = CONTENT.projects[locale];
  const allProjects = projects ?? CONTENT.projectList;
  const [filter, setFilter] = useState<string>(p.filters[0]);
  const [open, setOpen] = useState<Project | null>(null);

  const items = useMemo(() => {
    if (filter === p.filters[0]) return allProjects;
    return allProjects.filter((x) => x.category[locale] === filter);
  }, [filter, locale, p.filters, allProjects]);

  return (
    <>
      {/* Filters */}
      <section className="section-sm" style={{ paddingBlock: 32, borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {p.filters.map((f) => (
                <button key={f} className={`tag-pill ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-4)" }}>
              {items.length} {locale === "en" ? "projects" : "مشروع"}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section">
        <div className="container-wide">
          <div className="projects-strip">
            {items.map((proj, i) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                locale={locale}
                extraClass={proj.featured && i < 2 ? "featured" : ""}
                onClick={() => setOpen(proj)}
              />
            ))}
          </div>
        </div>
      </section>

      {open && <ProjectModal project={open} locale={locale} onClose={() => setOpen(null)} />}
    </>
  );
}
