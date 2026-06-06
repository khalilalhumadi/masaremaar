import { Breadcrumb, PageHead } from "@/components/primitives";
import { CTABand } from "@/components/sections";
import ProjectsView from "@/components/ProjectsView";
import { CONTENT, IMAGES, type Locale } from "@/lib/content";
import { isSectionFrozen } from "@/lib/cms/freeze";
import UnderConstruction from "@/components/UnderConstruction";
import { getProjects } from "@/lib/data/projects";
import { getPublishedSectionData } from "@/lib/data/section-content";
import { sectionBanner } from "@/lib/cms/section-schema";

export const revalidate = 60;

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  if (await isSectionFrozen("projects")) return <UnderConstruction locale={locale} />;
  const [projects, ov] = await Promise.all([
    getProjects(),
    getPublishedSectionData("projects"),
  ]);
  const p = CONTENT.projects[locale];
  const nav = CONTENT.nav[locale];
  const en = locale === "en";

  return (
    <div className="page-enter">
      <PageHead
        eyebrow={p.eyebrow}
        title={p.title}
        sub={
          en
            ? "A selection of projects delivered across infrastructure, industrial, public, residential, and transport sectors."
            : "مجموعة مختارة من المشاريع المنفّذة في قطاعات البنية التحتية والصناعة والقطاع العام والسكن والنقل."
        }
        bg={sectionBanner(ov, IMAGES.project["king-fahd"])}
        breadcrumb={<Breadcrumb locale={locale} homeLabel={nav[0].label} current={nav[3].label} />}
      />

      <ProjectsView locale={locale} projects={projects} />

      <CTABand locale={locale} />
    </div>
  );
}
