import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import LegalContent from "@/components/sections/LegalContent";
import { termsAndConditions } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply to GlobalEd courses and services from Global Citizen Limited.",
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
      <LegalContent doc={termsAndConditions} currentHref="/terms-and-conditions" />
    </>
  );
}
