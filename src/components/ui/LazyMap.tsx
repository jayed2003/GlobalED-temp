"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A Google Maps embed that's only created when it scrolls near the screen.
 * Each embed pulls in ~200 KB of Google's JavaScript, and `loading="lazy"`
 * alone doesn't hold it back: browsers start lazy iframes far outside the
 * viewport, so every map on the page loaded with it.
 */
export default function LazyMap({ src, title, className }: { src: string; title: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("relative bg-neutral-100", className)}>
      {show ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="flex h-full items-center justify-center text-neutral-400" aria-hidden>
          <MapPin size={28} />
        </div>
      )}
    </div>
  );
}
