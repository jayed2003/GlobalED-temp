import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Banknote, CalendarDays, CheckCircle2, Clock } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";
import CtaBanner from "@/components/sections/CtaBanner";
import CourseCard from "@/components/cards/CourseCard";
import SectionHeading from "@/components/ui/SectionHeading";
import JsonLd from "@/components/ui/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { getCourseSlugs, getCourseBySlug, getCoursesByCategory } from "@/lib/content/courses";
import { courseCategoryLabels } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

export async function generateStaticParams() {
  const slugs = await getCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return pageMetadata({
    path: `/courses/${course.slug}`,
    title: course.title,
    description: course.overview,
    image: course.image,
    imageAlt: course.imageAlt,
  });
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const sameCategory = await getCoursesByCategory(course.category);
  const related = sameCategory.filter((c) => c.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: course.title,
          description: course.overview,
          provider: {
            "@type": "EducationalOrganization",
            name: "GlobalEd",
            sameAs: SITE_URL,
          },
        }}
      />

      {/* Hero */}
      <section className="bg-primary-950 py-14 sm:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Breadcrumb
              items={[{ label: "Courses", href: "/courses" }, { label: course.title }]}
            />
            <span className="mt-5 inline-block rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-primary-950">
              {courseCategoryLabels[course.category]}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-primary-100">{course.overview}</p>
            <div className="mt-8">
              <ButtonLink
                href={`/consultation?course=${course.slug}`}
                size="lg"
              >
                Enroll Now <ArrowRight size={18} aria-hidden />
              </ButtonLink>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
            <Image
              src={course.image}
              alt={course.imageAlt ?? course.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Container>
      </section>

      {/* Curriculum + info */}
      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-primary-900">
              What You Will Learn
            </h2>
            <ul className="mt-6 space-y-3">
              {course.curriculum.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-700 shadow-sm"
                >
                  <CheckCircle2 size={18} aria-hidden className="mt-0.5 shrink-0 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <aside className="space-y-4">
            <div className="hidden lg:block lg:h-10" aria-hidden />
            <div className="rounded-xl border border-neutral-200 bg-primary-50 p-6">
              <h3 className="font-heading text-lg font-bold text-primary-900">Course Details</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <Clock size={18} aria-hidden className="text-primary-600" />
                  <div>
                    <p className="text-neutral-500">Duration</p>
                    <p className="font-semibold text-primary-900">{course.duration}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <CalendarDays size={18} aria-hidden className="text-primary-600" />
                  <div>
                    <p className="text-neutral-500">Schedule</p>
                    <p className="font-semibold text-primary-900">{course.schedule}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Banknote size={18} aria-hidden className="text-primary-600" />
                  <div>
                    <p className="text-neutral-500">Course Fee</p>
                    <p className="font-semibold text-primary-900">{course.price}</p>
                  </div>
                </li>
              </ul>
              <ButtonLink
                href={`/consultation?course=${course.slug}`}
                className="mt-6 w-full"
              >
                Book a Seat
              </ButtonLink>
            </div>
          </aside>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-primary-50 py-16 sm:py-20">
          <Container>
            <SectionHeading title="You May Also Like" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
