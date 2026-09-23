import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import CoursesFilter from "@/components/sections/CoursesFilter";
import Container from "@/components/layout/Container";
import { getAllCourses } from "@/lib/content/courses";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/courses",
  title: "Our Courses",
  description:
    "IELTS Regular, Executive, and Master Class courses, Spoken English, One-to-One coaching, Language Club, and Japanese Language at GlobalEd Bangladesh.",
});

export default async function CoursesPage() {
  const courses = await getAllCourses();
  return (
    <>
      <PageHero
        title="Our Courses"
        description="IELTS preparation in three formats, plus Spoken English, personal coaching, and Japanese — taught by certified instructors in small batches."
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
