import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, BookOpenCheck, CheckCircle2 } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";
import CtaBanner from "@/components/sections/CtaBanner";
import CourseCard from "@/components/cards/CourseCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import IeltsBookingForm from "@/components/forms/IeltsBookingForm";
import { ielts } from "@/data/ielts";
import { courses } from "@/data/courses";

export const metadata: Metadata = {
  title: "IELTS with GlobalEd",
  description:
    "What is IELTS, why prepare with GlobalEd, our IELTS preparation courses, and IELTS test booking for students in Bangladesh.",
};

export default function IeltsPage() {
  const prepCourses = courses.filter((c) => ielts.preparation.courseSlugs.includes(c.slug));

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-14 sm:py-20">
        <Container>
          <Breadcrumb items={[{ label: "IELTS" }]} />
          <h1 className="mt-5 max-w-3xl font-heading text-4xl font-bold text-white sm:text-5xl">
            IELTS with GlobalEd
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-primary-100">
            Bangladesh&apos;s trusted IELTS preparation center — expert
            instructors, real mock tests, and official test booking support.
          </p>
          <div className="mt-8">
            <ButtonLink href="#book-test" size="lg">
              <BookOpenCheck size={18} aria-hidden />
              Book an IELTS Test
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* What is IELTS */}
      <section id="what-is-ielts" className="scroll-mt-24 py-16 sm:py-20">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="The Test" title={ielts.whatIsIelts.title} />
            <p className="mt-5 leading-relaxed text-neutral-600">{ielts.whatIsIelts.body}</p>
          </div>
          <ul className="space-y-3">
            {ielts.whatIsIelts.points.map((point) => (
              <li
                key={point}
                className="flex gap-3 rounded-lg border border-neutral-200 bg-white p-4 text-sm leading-relaxed text-neutral-700 shadow-sm"
              >
                <CheckCircle2 size={18} aria-hidden className="mt-0.5 shrink-0 text-green-600" />
                {point}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Why GlobalEd */}
      <section id="why-globaled" className="scroll-mt-24 bg-primary-50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Why Us" title={ielts.whyGlobaled.title} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ielts.whyGlobaled.usps.map((usp) => (
              <div
                key={usp.title}
                className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <BadgeCheck size={28} aria-hidden className="text-accent-600" />
                <h3 className="mt-3 font-heading text-base font-semibold text-primary-900">
                  {usp.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{usp.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Preparation */}
      <section id="preparation" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Prepare"
            title={ielts.preparation.title}
            description={ielts.preparation.body}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Book a test */}
      <section id="book-test" className="scroll-mt-24 bg-primary-50 py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Book Now"
              title="Book an IELTS Test"
              description="Fill in the form and our IELTS team will confirm your seat, course placement, or official test booking — usually within 24 hours."
            />
            <ul className="mt-6 space-y-3 text-sm text-neutral-600">
              {[
                "Free level assessment before placement",
                "Official test registration handled by our team",
                "Same-day confirmation on working days",
              ].map((point) => (
                <li key={point} className="flex gap-2.5">
                  <CheckCircle2 size={17} aria-hidden className="mt-0.5 shrink-0 text-green-600" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <IeltsBookingForm />
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
