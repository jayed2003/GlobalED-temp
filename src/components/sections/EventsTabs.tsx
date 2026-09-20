"use client";

import { useState } from "react";
import EventCard from "@/components/cards/EventCard";
import type { EventItem } from "@/types";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "upcoming", label: "Upcoming Events" },
  { key: "previous", label: "Previous Events" },
] as const;

/** Events listing with Upcoming / Previous tabs. */
export default function EventsTabs({ events }: { events: EventItem[] }) {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("upcoming");

  const visible = events
    .filter((event) => event.status === active)
    .sort((a, b) =>
      active === "upcoming"
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date),
    );

  return (
    <div>
      <div
        className="mx-auto flex w-fit rounded-full border border-neutral-200 bg-white p-1"
        role="tablist"
        aria-label="Filter events"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active === tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-medium transition-colors",
              active === tab.key
                ? "bg-primary-700 text-white"
                : "text-neutral-600 hover:text-primary-700",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          {visible.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-neutral-500">
          No {active} events right now — check back soon.
        </p>
      )}
    </div>
  );
}
