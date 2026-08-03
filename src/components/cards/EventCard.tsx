import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import type { EventItem } from "@/types";
import { cn } from "@/lib/utils";

/** Event card with amber date badge (PFEC pattern). */
export default function EventCard({ event }: { event: EventItem }) {
  const date = new Date(event.date);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-GB", { month: "short" });

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-accent-500 text-primary-950">
        <span className="font-heading text-xl font-bold leading-none">{day}</span>
        <span className="text-xs font-semibold uppercase">{month}</span>
      </div>
      <div className="min-w-0">
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            event.status === "upcoming" ? "text-green-600" : "text-neutral-400",
          )}
        >
          {event.status}
        </span>
        <h3 className="mt-0.5 line-clamp-2 font-heading text-base font-semibold text-primary-900 group-hover:text-primary-700">
          {event.title}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
          <Clock size={12} aria-hidden className="shrink-0" />
          {event.time}
        </p>
        <p className="flex items-center gap-1.5 text-xs text-neutral-500">
          <MapPin size={12} aria-hidden className="shrink-0" />
          {event.venue}
        </p>
      </div>
    </Link>
  );
}
