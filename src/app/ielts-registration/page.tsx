import type { Metadata } from "next";
import { BadgeCheck, CheckCircle2 } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import IeltsBookingForm from "@/components/forms/IeltsBookingForm";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "IELTS Registration",
  description:
    "Register for your IELTS test or preparation course with GlobalEd — Bangladesh's trusted IELTS center.",
};

const trustPoints = [
  "Free level assessment before placement",
  "Official test registration handled by our team",
  "Same-day confirmation on working days",
  "Real mock tests with expert instructors",
];

export default function IeltsRegistrationPage() {
  return (
    <>
      <PageHero
        title="IELTS Registration"
        description="Book your IELTS test or preparation course — our team confirms your seat within 24 hours."
        breadcrumb={[{ label: "IELTS Registration" }]}
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-5">
          {/* Trust sidebar */}
          <aside className="lg:col-span-2">
            <div className="rounded-2xl bg-primary-700 p-8 text-white">
              <BadgeCheck size={36} aria-hidden className="text-accent-400" />
              <h2 className="mt-4 font-heading text-2xl font-bold">
                Bangladesh&apos;s Trusted IELTS Center
              </h2>
              <ul className="mt-6 space-y-4">
                {trustPoints.map((point) => (
                  <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-primary-100">
                    <CheckCircle2 size={17} aria-hidden className="mt-0.5 shrink-0 text-accent-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-heading text-xl font-bold text-primary-900">
                Booking Form
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Takes less than a minute to complete.
              </p>
              <div className="mt-6">
                <IeltsBookingForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
