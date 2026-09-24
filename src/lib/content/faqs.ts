import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { Faq, FaqCategory } from "@/types";
import type { FaqCategory as FaqCategoryEnum } from "@/generated/prisma/client";

const categorySlug: Record<FaqCategoryEnum, FaqCategory> = {
  GENERAL: "general",
  STUDY_ABROAD: "study-abroad",
  IELTS: "ielts",
};

const getShownFaqs = unstable_cache(
  async () =>
    prisma.faq.findMany({
      where: { shown: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { question: true, answer: true, category: true, showOnServices: true },
    }),
  ["faqs-shown"],
  { tags: ["faqs"] },
);

/** Every question on the FAQs page (Admin → FAQs), in order. */
export async function getFaqs(): Promise<Faq[]> {
  return (await getShownFaqs()).map((f) => ({ q: f.question, a: f.answer, category: categorySlug[f.category] }));
}

/** The questions marked "Also show on the Services page". */
export async function getServiceFaqs(): Promise<Faq[]> {
  return (await getShownFaqs())
    .filter((f) => f.showOnServices)
    .map((f) => ({ q: f.question, a: f.answer, category: categorySlug[f.category] }));
}
