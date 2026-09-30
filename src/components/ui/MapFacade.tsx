"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A Google Maps embed behind a "Show map" button. One embed pulls in ~600 KB
 * (scripts, map tiles, fonts) and runs on the phone's main thread, which cost
 * /contact most of its mobile PageSpeed score even when only the first map
 * loaded. The live map now loads when the visitor asks for it; "Open in
 * Google Maps" works without it.
 */
export default function MapFacade({
  src,
  title,
  query,
  className,
}: {
  /** The Google Maps embed URL. */
  src: string;
  /** Accessible name of the map, e.g. "Map — GlobalEd Dhanmondi branch" (the button reads "Show …"). */
  title: string;
  /** What to search for in Google Maps (name and address). */
  query: string;
  className?: string;
}) {
  const [show, setShow] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  // The button disappears when clicked, so move focus to the map itself.
  useEffect(() => {
    if (show) frame.current?.focus();
  }, [show]);

  if (show) {
    return (
      <iframe
        ref={frame}
        src={src}
        title={title}
        className={cn("border-0", className)}
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 overflow-hidden bg-primary-50 px-4 text-center",
        className,
      )}
    >
      {/* A faint street grid, so the box reads as a map. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-primary-100)_2px,transparent_2px),linear-gradient(90deg,var(--color-primary-100)_2px,transparent_2px)] [background-size:44px_44px] [background-position:-2px_-2px]"
      />
      <span aria-hidden className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary-700 text-white shadow-md">
        <MapPin size={22} />
      </span>
      <div className="relative flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={() => setShow(true)}
          aria-label={`Show ${title}`}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary-800 shadow-sm ring-1 ring-primary-200 transition hover:-translate-y-0.5 hover:bg-primary-700 hover:text-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 motion-reduce:hover:translate-y-0"
        >
          Show map
        </button>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 underline-offset-4 transition-colors hover:text-primary-900 hover:underline"
        >
          Open in Google Maps
          <ExternalLink size={14} aria-hidden />
        </a>
      </div>
    </div>
  );
}
