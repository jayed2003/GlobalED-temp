import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import ConsultationForm from "@/components/forms/ConsultationForm";
import Container from "@/components/layout/Container";
import { getBranchNames, getSiteSettings } from "@/lib/content/settings";
import { getAllCourses } from "@/lib/content/courses";
import { getAllDestinations } from "@/lib/content/destinations";
import { editablePageMetadata, getPage } from "@/lib/content/pages";

export async function generateMetadata(): Promise<Metadata> {
  return editablePageMetadata("consultation", await getPage("consultation"));
}

export default async function ConsultationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const page = await getPage("consultation");
  const params = await searchParams;
  const courseSlug = typeof params.course === "string" ? params.course : undefined;
  const destinationSlug = typeof params.destination === "string" ? params.destination : undefined;
  const [courses, destinations, site, branches] = await Promise.all([
    getAllCourses(),
    getAllDestinations(),
    getSiteSettings(),
    getBranchNames(),
  ]);

  return (
    <>
      <PageHero
        title={page.hero.title}
        description={page.hero.description}
        breadcrumb={[{ label: "Free Consultation" }]}
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-5">
          {/* Trust sidebar */}
          <aside className="lg:col-span-2">
            <div className="rounded-2xl bg-primary-700 p-8 text-white">
              <ShieldCheck size={36} aria-hidden className="text-accent-400" />
              <h2 className="mt-4 font-heading text-2xl font-bold">{page.trust.title}</h2>
              <ul className="mt-6 space-y-4">
                {page.trust.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-primary-100">
                    <CheckCircle2 size={17} aria-hidden className="mt-0.5 shrink-0 text-accent-400" />
                    {point}
                  </li>
                ))}
              </ul>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-primary-600 pt-6">
                {[
                  { value: site.stats.studentsPlaced, label: "Students Placed" },
                  { value: site.stats.visaSuccessRate, label: "Visa Success" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-xs text-primary-200">{stat.label}</dt>
                    <dd className="font-heading text-2xl font-bold text-accent-400">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-heading text-xl font-bold text-primary-900">
                Registration Form
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Takes less than a minute to complete.
              </p>
              <div className="mt-6">
                <ConsultationForm
                  defaultCourse={courseSlug}
                  defaultDestination={destinationSlug}
                  courses={courses}
                  destinations={destinations}
                  branches={branches}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
