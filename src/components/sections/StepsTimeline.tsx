"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  MapPin,
  FileCheck,
  ClipboardCheck,
  Stamp,
  PlaneTakeoff,
} from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Free Counselling",
    description: "Share your goals — we assess your profile and explore your options together.",
    icon: MessageCircle,
  },
  {
    title: "Destination & University",
    description: "Shortlist the right country, course, and university for your budget and ambitions.",
    icon: MapPin,
  },
  {
    title: "Application & Offer",
    description: "We prepare and submit flawless applications, then follow up until your offer arrives.",
    icon: FileCheck,
  },
  {
    title: "Documentation",
    description: "Every document double-checked against the exact embassy checklist.",
    icon: ClipboardCheck,
  },
  {
    title: "Visa Application",
    description: "Mock interviews and precise filing — the reason behind our strong visa success rate.",
    icon: Stamp,
  },
  {
    title: "Pre-Departure & Beyond",
    description: "Briefings, accommodation, airport pickup, and support after you land.",
    icon: PlaneTakeoff,
  },
];

/** One node on the flow chart — activates itself as it scrolls into view. */
function StepNode({
  step,
  index,
  onActivate,
}: {
  step: (typeof steps)[number];
  index: number;
  onActivate: (index: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [active, setActive] = useState(false);
  const Icon = step.icon;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const f = requestAnimationFrame(() => {
        setActive(true);
        onActivate(index);
      });
      return () => cancelAnimationFrame(f);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          onActivate(index);
        }
      },
      { threshold: 0.5, rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <li ref={ref} className="relative flex gap-5 pb-12 last:pb-0 sm:gap-6">
      <div className="relative z-10 flex flex-none flex-col items-center">
        <span
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 sm:h-14 sm:w-14",
            active
              ? "border-primary-700 bg-primary-700 text-white shadow-md shadow-primary-700/30"
              : "border-neutral-300 bg-white text-neutral-400",
          )}
        >
          <Icon size={22} aria-hidden />
        </span>
      </div>
      <div
        className={cn(
          "flex-1 rounded-xl border p-5 transition-all duration-500 sm:p-6",
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

/** Home step-by-step study abroad process — scroll-driven interactive flow chart. */
export default function StepsTimeline() {
  const railRef = useRef<HTMLDivElement>(null);
  const [furthestActive, setFurthestActive] = useState(-1);

  const handleActivate = (index: number) => {
    setFurthestActive((prev) => Math.max(prev, index));
  };

  const fillPercent =
    furthestActive < 0 ? 0 : ((furthestActive + 1) / steps.length) * 100;

  return (
    <section className="bg-primary-50 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title="Your Step-by-Step Study Abroad Process"
          description="A clear, proven path from your first meeting with us to your first day abroad. Scroll to follow the journey."
        />
        <ol className="relative mx-auto mt-12 max-w-2xl">
          <div
            ref={railRef}
            className="absolute left-6 top-0 h-full w-0.5 bg-neutral-200 sm:left-7"
            aria-hidden
          >
            <div
              className="w-full bg-primary-700 transition-[height] duration-500 ease-out"
              style={{ height: `${fillPercent}%` }}
            />
          </div>
          {steps.map((step, index) => (
            <StepNode key={step.title} step={step} index={index} onActivate={handleActivate} />
          ))}
        </ol>
      </Container>
    </section>
  );
}
