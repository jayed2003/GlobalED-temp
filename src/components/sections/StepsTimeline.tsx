"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import SiteIcon from "@/components/ui/SiteIcon";
import type { PageContent } from "@/lib/pages";
import { cn } from "@/lib/utils";

type Content = PageContent<"home">["howItWorks"];
type Step = Content["steps"][number];

/**
 * Where the progress line sits, as a fraction of the viewport height: the
 * rail fills down to it, and every step whose icon is above it is lit.
 */
const TRIGGER = 0.65;

/** One node on the flow chart. */
function StepNode({
  step,
  index,
  active,
  iconRef,
}: {
  step: Step;
  index: number;
  active: boolean;
  iconRef: (el: HTMLSpanElement | null) => void;
}) {
  return (
    <li className="relative flex gap-5 pb-12 last:pb-0 sm:gap-6">
      <div className="relative z-10 flex flex-none flex-col items-center">
        <span
          ref={iconRef}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 motion-reduce:transition-none sm:h-14 sm:w-14",
            active
              ? "border-primary-700 bg-primary-700 text-white shadow-md shadow-primary-700/30"
              : "border-neutral-300 bg-white text-neutral-400",
          )}
        >
          <SiteIcon name={step.icon} size={22} aria-hidden />
        </span>
      </div>
      <div
        className={cn(
          "flex-1 rounded-xl border p-5 transition-all duration-500 motion-reduce:transition-none sm:p-6",
          active
            ? "translate-y-0 border-primary-100 bg-white opacity-100 shadow-sm"
            : "translate-y-2 border-transparent bg-transparent opacity-40",
        )}
      >
        <span
          className={cn(
            "font-heading text-xs font-bold uppercase tracking-widest transition-colors duration-500",
            active ? "text-accent-800" : "text-neutral-400",
          )}
        >
          Step {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-1 font-heading text-lg font-semibold text-primary-900 sm:text-xl">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>
      </div>
    </li>
  );
}

/**
 * Home step-by-step study abroad process — a flow chart driven by the scroll
 * position, in both directions: scrolling down fills the rail and lights the
 * steps, scrolling back up empties it and dims them again.
 */
export default function StepsTimeline({ content }: { content: Content }) {
  const listRef = useRef<HTMLOListElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    const rail = railRef.current;
    const fill = fillRef.current;
    if (!list || !rail || !fill) return;

    // Reduced motion: show the whole process at once instead of animating it.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const icons = iconRefs.current.filter((el): el is HTMLSpanElement => el !== null);
      if (icons.length === 0) return;
      const centre = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      };
      const first = centre(icons[0]);
      const last = centre(icons[icons.length - 1]);

      // The rail runs from the first step's icon to the last one's.
      rail.style.top = `${first - list.getBoundingClientRect().top}px`;
      rail.style.height = `${last - first}px`;

      const line = reduced ? Number.POSITIVE_INFINITY : window.innerHeight * TRIGGER;
      const progress = last > first ? Math.min(Math.max((line - first) / (last - first), 0), 1) : 1;
      // `scale` (not `transform`), so it replaces the scale-y-0 starting state.
      fill.style.scale = `1 ${progress}`;
      setActiveCount(icons.filter((el) => centre(el) <= line).length);
    };
    // At most one measurement per frame, however fast the scroll events come.
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section className="bg-primary-50 py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow={content.eyebrow} title={content.title} description={content.description} />
        <ol ref={listRef} className="relative mx-auto mt-12 max-w-2xl">
          <div
            ref={railRef}
            className="absolute bottom-6 left-6 top-6 w-0.5 -translate-x-1/2 bg-neutral-200 sm:left-7 sm:top-7"
            aria-hidden
          >
            <div
              ref={fillRef}
              className="h-full w-full origin-top scale-y-0 bg-primary-700 transition-transform duration-150 ease-out motion-reduce:transition-none"
            />
          </div>
          {content.steps.map((step, index) => (
            <StepNode
              key={`${index}-${step.title}`}
              step={step}
              index={index}
              active={index < activeCount}
              iconRef={(el) => {
                iconRefs.current[index] = el;
              }}
            />
          ))}
        </ol>
      </Container>
    </section>
  );
}
