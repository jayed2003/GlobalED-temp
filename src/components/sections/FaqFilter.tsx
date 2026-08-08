"use client";

import { useMemo, useState } from "react";
import type { Faq, FaqCategory } from "@/types";
import { cn } from "@/lib/utils";
import FaqAccordion from "@/components/ui/FaqAccordion";

type FilterValue = FaqCategory | "all";

const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "study-abroad", label: "Study Abroad" },
  { value: "ielts", label: "IELTS" },
];

/** Category-filterable FAQ list for the FAQs page. */
export default function FaqFilter({ faqs }: { faqs: Faq[] }) {
  const [active, setActive] = useState<FilterValue>("all");

  const filtered = useMemo(
    () => (active === "all" ? faqs : faqs.filter((faq) => faq.category === active)),
    [faqs, active],
  );

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter FAQs by category">
        {filters.map((filter) => {
          const isActive = active === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActive(filter.value)}
              aria-pressed={isActive}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-semibold transition-colors duration-200",
                isActive
                  ? "border-primary-700 bg-primary-700 text-white shadow-sm"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-primary-200 hover:text-primary-700",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {filtered.length > 0 ? (
          <FaqAccordion key={active} faqs={filtered} />
        ) : (
          <p className="py-12 text-center text-sm text-neutral-500">
            No questions in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
