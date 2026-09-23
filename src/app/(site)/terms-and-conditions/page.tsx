import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import LegalContent from "@/components/sections/LegalContent";
import { termsAndConditions } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply to using the GlobalEd website and our study abroad and IELTS services.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <PageHero
        title={termsAndConditions.title}
        description="The terms for using our website and services."
        breadcrumb={[{ label: termsAndConditions.title }]}
      />
      <LegalContent doc={termsAndConditions} related={{ label: "Privacy Policy", href: "/privacy-policy" }} />
    </>
  );
}
