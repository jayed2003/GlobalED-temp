import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import LegalContent from "@/components/sections/LegalContent";
import { privacyPolicy } from "@/data/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/privacy-policy",
  title: "Privacy Policy",
  description: "How Global Citizen Limited / GlobalEd collects, uses, shares and protects your personal information.",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        title={privacyPolicy.title}
        description="What we collect, why, and the choices you have."
        breadcrumb={[{ label: privacyPolicy.title }]}
      />
      <LegalContent doc={privacyPolicy} currentHref="/privacy-policy" />
    </>
  );
}
