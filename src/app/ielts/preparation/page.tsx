import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Container from "@/components/layout/Container";
import CourseCard from "@/components/cards/CourseCard";
import { ButtonLink } from "@/components/ui/Button";
import { ielts } from "@/data/ielts";
import { courses } from "@/data/courses";

export const metadata: Metadata = {
  title: "IELTS Preparation",
  description:
    "IELTS preparation courses at GlobalEd — regular batches, executive evening classes, and an intensive master class.",
};

export default function IeltsPreparationPage() {
  const prepCourses = courses.filter((c) => ielts.preparation.courseSlugs.includes(c.slug));

  return (
    <>
      <PageHero
        title={ielts.preparation.title}
        description={ielts.preparation.body}
        breadcrumb={[{ label: "IELTS", href: "/ielts" }, { label: "IELTS Preparation" }]}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {prepCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-neutral-500">
            Not sure which course fits you?{" "}
            <ButtonLink href="/consultation" variant="outline" size="sm" className="ml-2">
              Ask a Counsellor <ArrowRight size={14} aria-hidden />
            </ButtonLink>
          </p>
        </Container>
      </section>
    </>
  );
}
