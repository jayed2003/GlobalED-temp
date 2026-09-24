"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Toggle from "./Toggle";

/**
 * A titled, collapsible group of fields in an editor. For page sections it
 * can carry a "Shown / Hidden on site" switch; a hidden section's fields stay
 * editable but are dimmed.
 */
export default function SectionCard({
  title,
  description,
  defaultOpen = true,
  visibility,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  visibility?: { shown: boolean; onChange: (shown: boolean) => void };
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  const hidden = visibility ? !visibility.shown : false;

  return (
    <section className="rounded-xl border border-neutral-200 bg-white">
      <div className="flex items-start gap-3 px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={bodyId}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
        >
          <ChevronDown
            size={18}
            aria-hidden
            className={cn("mt-1 shrink-0 text-neutral-400 transition-transform", !open && "-rotate-90")}
          />
          <span className="min-w-0">
            <span className="block font-heading text-base font-bold text-primary-900">{title}</span>
            {description && <span className="mt-0.5 block text-xs text-neutral-500">{description}</span>}
          </span>
        </button>
        {visibility && (
          <Toggle
            checked={visibility.shown}
            onChange={visibility.onChange}
            label={`Show the ${title} section on the site`}
            onLabel="Shown on site"
            offLabel="Hidden"
          />
        )}
      </div>
      <div id={bodyId} hidden={!open} className={cn("space-y-5 border-t border-neutral-100 px-5 py-5 sm:px-6", hidden && "opacity-60")}>
        {hidden && (
          <p className="rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
            This section is hidden — visitors won&apos;t see it. You can still edit it.
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
