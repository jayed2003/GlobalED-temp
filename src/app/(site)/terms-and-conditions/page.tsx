import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import LegalContent from "@/components/sections/LegalContent";
import { termsAndConditions } from "@/data/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/terms-and-conditions",
  title: "Terms & Conditions",
  description: "The terms that apply to GlobalEd courses and services from Global Citizen Limited.",
});

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
