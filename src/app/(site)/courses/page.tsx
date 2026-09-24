import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import CoursesFilter, { COURSE_FILTERS, type CourseFilter } from "@/components/sections/CoursesFilter";
import Container from "@/components/layout/Container";
import { getAllCourses } from "@/lib/content/courses";
import { editablePageMetadata, getPage } from "@/lib/content/pages";
import { paginate, parsePage } from "@/lib/pagination";
import { pagedMetadata } from "@/lib/seo";

const PER_PAGE = 9;

type SearchParams = Promise<{ page?: string | string[]; category?: string | string[] }>;

/** The ?category value: missing → all courses, an unknown category → null. */
function parseFilter(value: string | string[] | undefined): CourseFilter | null {
  if (value === undefined || value === "") return "all";
  return COURSE_FILTERS.find((f) => f.key === value)?.key ?? null;
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams;
  const meta = editablePageMetadata("courses", await getPage("courses"));
  // Category views point search engines at the full list; its page 2+ get their own title and URL.
  return parseFilter(params.category) === "all" ? pagedMetadata(meta, parsePage(params.page) ?? 1, "/courses") : meta;
}

export default async function CoursesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filter = parseFilter(params.category);
  const requested = parsePage(params.page);
  if (!filter || requested === null) notFound();

  const [page, courses] = await Promise.all([getPage("courses"), getAllCourses()]);
  const visible = filter === "all" ? courses : courses.filter((c) => c.category === filter);
  const { items, totalPages } = paginate(visible, requested, PER_PAGE);
  if (requested > totalPages) notFound();

  return (
    <>
      <PageHero
        title={page.hero.title}
        description={page.hero.description}
        breadcrumb={[{ label: "Courses" }]}
      />
      <section id="all-courses" className="scroll-mt-12 py-16 sm:py-20">
        <Container>
          <CoursesFilter courses={items} active={filter} page={requested} totalPages={totalPages} />
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
