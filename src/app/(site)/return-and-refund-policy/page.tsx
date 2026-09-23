import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import LegalContent from "@/components/sections/LegalContent";
import { returnAndRefundPolicy } from "@/data/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/return-and-refund-policy",
  title: "Return and Refund Policy",
  description: "When GlobalEd courses and services can be refunded, how to request a refund, and what is non-refundable.",
});

export default function ReturnAndRefundPolicyPage() {
  return (
    <>
      <PageHero
        title={returnAndRefundPolicy.title}
        description="Refunds for GlobalEd courses and services."
        breadcrumb={[{ label: returnAndRefundPolicy.title }]}
      />
      <LegalContent doc={returnAndRefundPolicy} currentHref="/return-and-refund-policy" />
    </>
  );
}
