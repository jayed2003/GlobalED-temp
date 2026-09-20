import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Container from "@/components/layout/Container";
import CourseCard from "@/components/cards/CourseCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { getIeltsContent } from "@/lib/content/ielts";
import { getAllCourses } from "@/lib/content/courses";

export const metadata: Metadata = {
  title: "IELTS Preparation",
  description:
    "IELTS preparation at GlobalEd — a skill-by-skill program plus Essential, Advanced, and Premium packages to match your goals.",
};

export default async function IeltsPreparationPage() {
  const [ielts, courses] = await Promise.all([getIeltsContent(), getAllCourses()]);
  const prepCourses = ielts.preparation.courseSlugs
    .map((slug) => courses.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  return (
    <>
      <PageHero
        title={ielts.preparation.title}
        description={ielts.preparation.body}
        breadcrumb={[{ label: "IELTS", href: "/ielts" }, { label: "IELTS Preparation" }]}
        bannerImage="/images/hero/ielts-preparation-road.jpg"
        bannerAlt="Your road to a high IELTS band score in six steps: head start your training, get equipped with unique tips and tricks by experts, practise with authentic Cambridge materials, be a part of the IELTS Master Class, eleventh hour tips and strategies, and achieve a high band score for IELTS"
        bannerWidth={2048}
        bannerHeight={1155}
        bannerUniformHeight
        bannerFadeLeft={12}
        bannerFadeY={5}
        bannerClearText
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ielts.preparation.skillAreas.map((area) => (
              <div
                key={area.skill}
                className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-heading text-base font-semibold text-primary-900">
                  {area.skill}
                </h3>
                <ul className="mt-3 space-y-2">
                  {area.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-sm leading-relaxed text-neutral-600"
                    >
                      <CheckCircle2
                        size={16}
                        aria-hidden
                        className="mt-0.5 shrink-0 text-green-600"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-primary-50 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Stay on Track"
            title={ielts.progressTracker.title}
            description={ielts.progressTracker.body}
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="font-heading text-base font-semibold text-primary-900">
                What We Track
              </h3>
              <ul className="mt-4 space-y-3">
                {ielts.progressTracker.trackItems.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-700 shadow-sm"
                  >
                    <CheckCircle2 size={17} aria-hidden className="mt-0.5 shrink-0 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-primary-900">Benefits</h3>
              <ul className="mt-4 space-y-3">
                {ielts.progressTracker.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex gap-2.5 rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-700 shadow-sm"
                  >
                    <CheckCircle2 size={17} aria-hidden className="mt-0.5 shrink-0 text-primary-600" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {prepCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-neutral-500">
            Not sure which package fits you?{" "}
            <ButtonLink href="/consultation" variant="outline" size="sm" className="ml-2">
              Ask a Counsellor <ArrowRight size={14} aria-hidden />
            </ButtonLink>
          </p>
        </Container>
      </section>
    </>
  );
}
