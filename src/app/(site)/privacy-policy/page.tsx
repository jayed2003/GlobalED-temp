import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import LegalContent from "@/components/sections/LegalContent";
import { privacyPolicy } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GlobalEd collects, uses and protects the personal information you share through our website.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        title={privacyPolicy.title}
        description="What we collect, why, and the choices you have."
        breadcrumb={[{ label: privacyPolicy.title }]}
      />
      <LegalContent doc={privacyPolicy} related={{ label: "Terms & Conditions", href: "/terms-and-conditions" }} />
    </>
  );
}
