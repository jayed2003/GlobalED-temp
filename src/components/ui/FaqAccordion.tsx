"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/types";
import { cn } from "@/lib/utils";

/** Accessible FAQ accordion (NWC pattern) — one item open at a time. */
export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white shadow-sm">
      {faqs.map((faq, index) => (
        <div key={faq.q}>
          <button
            type="button"
            onClick={() => setOpen(open === index ? null : index)}
            aria-expanded={open === index}
            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-primary-50"
          >
            <span className="font-medium text-primary-900">{faq.q}</span>
            <ChevronDown
              size={18}
              aria-hidden
              className={cn(
                "shrink-0 text-primary-600 transition-transform duration-200",
                open === index && "rotate-180",
              )}
            />
          </button>
          {open === index && (
            <p className="px-6 pb-5 text-sm leading-relaxed text-neutral-600">{faq.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
