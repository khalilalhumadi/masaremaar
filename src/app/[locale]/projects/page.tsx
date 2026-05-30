import { Breadcrumb, PageHead } from "@/components/primitives";
import { CTABand } from "@/components/sections";
import ProjectsView from "@/components/ProjectsView";
import { CONTENT, IMAGES, type Locale } from "@/lib/content";
import { isSectionFrozen } from "@/lib/cms/freeze";
import UnderConstruction from "@/components/UnderConstruction";
import { getProjects } from "@/lib/data/projects";

export const revalidate = 60;

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  if (await isSectionFrozen("projects")) return <UnderConstruction locale={locale} />;
  const [projects, p, nav] = await Promise.all([
    getProjects(),
    Promise.resolve(CONTENT.projects[locale]),
    Promise.resolve(CONTENT.nav[locale]),
  ]);
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
        bg={IMAGES.project["king-fahd"]}
        breadcrumb={<Breadcrumb locale={locale} homeLabel={nav[0].label} current={nav[3].label} />}
      />

      <ProjectsView locale={locale} projects={projects} />

      <CTABand locale={locale} />
    </div>
  );
}
