import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import LegalContent from "@/components/sections/LegalContent";
import { returnAndRefundPolicy } from "@/data/legal";

export const metadata: Metadata = {
  title: "Return and Refund Policy",
  description: "When GlobalEd courses and services can be refunded, how to request a refund, and what is non-refundable.",
  alternates: { canonical: "/return-and-refund-policy" },
};

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
