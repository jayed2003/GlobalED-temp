import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/layout/Container";
import { getServiceBySlug, getServiceLinks } from "@/lib/content/services";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getServiceLinks()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  // The admin's SEO fields, when set, replace the title / summary.
  return pageMetadata({
    path: `/services/${service.slug}`,
    title: service.seoTitle ? { absolute: service.seoTitle } : service.title,
    description: service.metaDescription || service.shortDescription,
    image: service.ogImage || null,
    imageAlt: service.ogImageAlt || null,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        title={service.title}
        description={service.shortDescription}
        breadcrumb={[{ label: "Services", href: "/services" }, { label: service.title }]}
      />

      {/* Description + benefits */}
      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary-900">
              How We Help
            </h2>
            <p className="mt-4 leading-relaxed text-neutral-600">{service.description}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-primary-50 p-6 sm:p-8">
            <h3 className="font-heading text-lg font-bold text-primary-900">
              What You Get
            </h3>
            <ul className="mt-4 space-y-3">
              {service.benefits.map((benefit, index) => (
                <li key={index} className="flex gap-2.5 text-sm leading-relaxed text-neutral-700">
                  <CheckCircle2 size={17} aria-hidden className="mt-0.5 shrink-0 text-green-600" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="bg-primary-50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="The Process" title={`How ${service.title} Works`} />
          <ol className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
            {service.process.map((step, index) => (
              <li
                key={index}
                className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-700 font-heading font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-heading text-base font-semibold text-primary-900">
                  {step.step}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
