import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  Banknote,
  CheckCircle2,
  GraduationCap,
  Home,
  ShieldCheck,
} from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";
import CtaBanner from "@/components/sections/CtaBanner";
import DestinationCard from "@/components/cards/DestinationCard";
import FaqAccordion from "@/components/ui/FaqAccordion";
import JsonLd from "@/components/ui/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import { getAllDestinations, getDestinationSlugs, getDestinationBySlug } from "@/lib/content/destinations";
import { recordMetadata } from "@/lib/seo";
import { isOriginalUpload } from "@/lib/images";

export async function generateStaticParams() {
  const slugs = await getDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return {};
  return recordMetadata(destination, {
    path: `/destinations/${destination.slug}`,
    title: `Study in ${destination.name}`,
    description: `${destination.tagline} Admissions, costs, scholarships, and visa guidance for Bangladeshi students with GlobalEd.`,
    image: destination.heroImage,
    imageAlt: destination.heroImageAlt,
  });
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const allDestinations = await getAllDestinations();
  const related = allDestinations.filter((d) => d.slug !== slug).slice(0, 4);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: destination.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }}
      />

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-primary-950">
        <div className="absolute inset-0">
          <Image
            src={destination.heroImage}
            unoptimized={isOriginalUpload(destination.heroImage)}
            alt={destination.heroImageAlt ?? `Study in ${destination.name}`}
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/60 to-primary-950/30" aria-hidden />
        </div>
        <Container className="relative py-16 sm:py-24">
          <Breadcrumb
            items={[{ label: "Destinations", href: "/destinations" }, { label: destination.name }]}
          />
          <h1 className="mt-5 font-heading text-4xl font-bold text-white sm:text-5xl">
            Study in {destination.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-100">{destination.tagline}</p>
        </Container>
      </section>

      {/* Overview + Why study here */}
      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary-900 sm:text-3xl">
              Overview
            </h2>
            <p className="mt-4 leading-relaxed text-neutral-600">{destination.overview}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-primary-50 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-primary-900">
              <ShieldCheck size={22} aria-hidden className="text-primary-700" />
              Why Study in {destination.name}?
            </h2>
            <ul className="mt-4 space-y-3">
              {destination.whyStudyHere.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-neutral-700">
                  <CheckCircle2 size={17} aria-hidden className="mt-0.5 shrink-0 text-green-600" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Universities + costs */}
      <section className="bg-primary-50 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Universities & Costs"
            title={`Popular Universities in ${destination.name}`}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destination.popularUniversities.map((university) => (
              <div
                key={university.name}
                className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <GraduationCap size={22} aria-hidden className="mt-0.5 shrink-0 text-primary-700" />
                <div>
                  <p className="font-medium text-primary-900">{university.name}</p>
                  <p className="text-sm text-neutral-500">{university.city}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-xl bg-primary-700 p-6 text-white">
              <Banknote size={32} aria-hidden className="shrink-0 text-accent-400" />
              <div>
                <p className="text-sm text-primary-100">Average Tuition Fees</p>
                <p className="font-heading text-xl font-bold">{destination.tuitionRange}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-primary-800 p-6 text-white">
              <Home size={32} aria-hidden className="shrink-0 text-accent-400" />
              <div>
                <p className="text-sm text-primary-100">Estimated Living Cost</p>
                <p className="font-heading text-xl font-bold">{destination.livingCost}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Scholarships + Visa */}
      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-primary-900">
              <Award size={24} aria-hidden className="text-accent-600" />
              Scholarships
            </h2>
            <ul className="mt-5 space-y-3">
              {destination.scholarships.map((scholarship) => (
                <li
                  key={scholarship}
                  className="flex gap-2.5 rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-700 shadow-sm"
                >
                  <CheckCircle2 size={17} aria-hidden className="mt-0.5 shrink-0 text-accent-600" />
                  {scholarship}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-primary-900">
              <ShieldCheck size={24} aria-hidden className="text-primary-700" />
              Visa Information
            </h2>
            <ul className="mt-5 space-y-3">
              {destination.visaInfo.map((info) => (
                <li
                  key={info}
                  className="flex gap-2.5 rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-700 shadow-sm"
                >
                  <CheckCircle2 size={17} aria-hidden className="mt-0.5 shrink-0 text-primary-600" />
                  {info}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <section className="bg-primary-50 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="FAQs"
            title={`Studying in ${destination.name} — Your Questions`}
          />
          <div className="mt-10">
            <FaqAccordion faqs={destination.faqs} />
          </div>
        </Container>
      </section>

      {/* Related destinations */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <SectionHeading align="left" title="Explore Other Destinations" />
            <Link
              href="/destinations"
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-primary-700 hover:underline sm:inline-flex"
            >
              View all <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
