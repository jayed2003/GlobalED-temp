"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import SectionCard from "./SectionCard";

/**
 * The "Publishing" card of a content editor: Published (on the site) or
 * Draft (hidden from visitors, viewable with Preview).
 */
export default function PublishStatusCard({
  registration,
  value,
  publishedHint,
}: {
  registration: UseFormRegisterReturn;
  value: "DRAFT" | "PUBLISHED" | undefined;
  /** Where a published item shows up, e.g. "On the site, in the menu and footer". */
  publishedHint: string;
}) {
  const options = [
    { value: "PUBLISHED", label: "Published", hint: publishedHint },
    { value: "DRAFT", label: "Draft", hint: "Hidden from visitors; you can preview it" },
  ] as const;

  return (
    <SectionCard title="Publishing">
      <div role="radiogroup" aria-label="Publishing" className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "flex cursor-pointer gap-2.5 rounded-lg border p-3 text-sm",
              value === o.value ? "border-primary-500 bg-primary-50" : "border-neutral-200 hover:bg-neutral-50",
            )}
          >
            <input type="radio" value={o.value} className="mt-0.5 accent-primary-700" {...registration} />
            <span>
              <span className="block font-medium text-primary-900">{o.label}</span>
              <span className="block text-xs text-neutral-500">{o.hint}</span>
            </span>
          </label>
        ))}
      </div>
    </SectionCard>
  );
}
