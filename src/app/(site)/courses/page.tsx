import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import CoursesFilter from "@/components/sections/CoursesFilter";
import Container from "@/components/layout/Container";
import { getAllCourses } from "@/lib/content/courses";
import { editablePageMetadata, getPage } from "@/lib/content/pages";

export async function generateMetadata(): Promise<Metadata> {
  return editablePageMetadata("courses", await getPage("courses"));
}

export default async function CoursesPage() {
  const page = await getPage("courses");
  const courses = await getAllCourses();
  return (
    <>
      <PageHero
        title={page.hero.title}
        description={page.hero.description}
        breadcrumb={[{ label: "Courses" }]}
      />
      <section className="py-16 sm:py-20">
        <Container>
          <CoursesFilter courses={courses} />
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
