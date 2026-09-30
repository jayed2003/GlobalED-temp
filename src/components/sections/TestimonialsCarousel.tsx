"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialCard from "@/components/cards/TestimonialCard";
import type { Testimonial } from "@/types";
import type { HeadingContent } from "@/lib/pages";

/** Space between cards (gap-6). */
const GAP = 24;
/** Most cards side by side (desktop). */
const MAX_PER_VIEW = 3;
/** Time each set of cards stays before the next rotation. */
const INTERVAL_MS = 5000;

const controlClasses =
  "flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-700 transition-colors hover:bg-primary-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500";

const mod = (a: number, n: number) => ((a % n) + n) % n;

/** Distance from one card to the next. */
function cardStep(track: HTMLElement | null) {
  const card = track?.querySelector<HTMLElement>("[data-card]");
  return card ? card.getBoundingClientRect().width + GAP : 0;
}

/**
 * Success stories carousel. Rotates by a full view (3 cards on desktop, 2 on
 * tablet) every few seconds and loops endlessly; the arrows move by a view
 * too, and the track can be swiped. Rotation pauses while hovered or focused,
 * with the pause button, off screen, on phones and with reduced motion.
 *
 * Endless loop: the track holds copies of the list side by side and stays in
 * the middle copy — whenever scrolling stops elsewhere it jumps back by whole
 * copies, which shows exactly the same cards, so the jump can't be seen.
 */
export default function TestimonialsCarousel({
  testimonials,
  heading,
}: {
  testimonials: Testimonial[];
  heading: HeadingContent;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  /** Card the current smooth scroll is heading for (null when settled). */
  const targetRef = useRef<number | null>(null);
  const count = testimonials.length;
  // Enough copies on each side of the middle one to move a full view either way.
  const middle = count > 1 ? Math.ceil((2 * MAX_PER_VIEW - 1) / count) : 0;
  const copies = 2 * middle + 1;

  const [perView, setPerView] = useState(MAX_PER_VIEW);
  const [canAutoplay, setCanAutoplay] = useState(false);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  // Bumped on every manual move, so the timer starts over.
  const [restart, setRestart] = useState(0);

  /** Jump (without animation) to the same card in the middle copy. */
  const recenter = useCallback(() => {
    const track = trackRef.current;
    const step = cardStep(track);
    if (!track || !step || count < 2) return;
    const index = Math.round(track.scrollLeft / step);
    const same = middle * count + mod(index, count);
    if (same !== index) track.scrollLeft = same * step;
  }, [count, middle]);

  const move = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      const step = cardStep(track);
      if (!track || !step) return;
      const current = targetRef.current ?? Math.round(track.scrollLeft / step);
      let target = current + direction * perView;
      // Clicked again before the last move finished and ran off the copies:
      // shift back to the middle copy first (same cards).
      if (target < 0 || target + perView > copies * count) {
        const shift = middle * count + mod(current, count) - current;
        track.scrollLeft += shift * step;
        target += shift;
      }
      targetRef.current = target;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left: target * step, behavior: reduce ? "auto" : "smooth" });
    },
    [perView, copies, count, middle],
  );

  const manualMove = (direction: 1 | -1) => {
    move(direction);
    setRestart((r) => r + 1);
  };

  /** The visitor grabbed the track (swipe, drag, trackpad): their scroll wins. */
  const userScroll = () => {
    targetRef.current = null;
    setRestart((r) => r + 1);
  };

  // Start in the middle copy; after every scroll (arrows, rotation, swipe)
  // settle back into it. Browsers without `scrollend` get a debounced scroll.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    recenter();
    const settle = () => {
      // Ignore the end of an interrupted scroll (a quick second click): wait
      // until the track reaches the card it's heading for.
      const target = targetRef.current;
      const step = cardStep(track);
      if (target !== null && Math.abs(track.scrollLeft - target * step) > step / 2) return;
      targetRef.current = null;
      recenter();
    };
    if ("onscrollend" in window) {
      track.addEventListener("scrollend", settle);
      return () => track.removeEventListener("scrollend", settle);
    }
    let timer: number | undefined;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 150);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      track.removeEventListener("scroll", onScroll);
    };
  }, [recenter]);

  // Cards per view follow the layout (1 / 2 / 3).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const step = cardStep(track);
      if (step) setPerView(Math.max(1, Math.round((track.clientWidth + GAP) / step)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Rotate only where the arrows and pause button are shown, and never with reduced motion.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 640px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCanAutoplay(wide.matches && !reduce.matches);
    update();
    wide.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  // Only while the carousel is on screen.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const rotates = count > perView;
  const autoplay = rotates && canAutoplay && inView && !held && !paused;
  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) move(1);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoplay, move, restart]);

  return (
    <section className="bg-primary-50 py-16 sm:py-24">
      <Container>
        <div
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false);
          }}
        >
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              align="left"
              eyebrow={heading.eyebrow}
              title={heading.title}
              description={heading.description}
            />
            {rotates && (
              <div className="hidden shrink-0 gap-2 sm:flex">
                <button type="button" onClick={() => manualMove(-1)} aria-label="Previous reviews" className={controlClasses}>
                  <ChevronLeft size={20} aria-hidden />
                </button>
                {/* Hidden with reduced motion, where nothing rotates. */}
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? "Play automatic rotation" : "Pause automatic rotation"}
                  title={paused ? "Play" : "Pause"}
                  className={`${controlClasses} motion-reduce:hidden`}
                >
                  {paused ? <Play size={18} aria-hidden /> : <Pause size={18} aria-hidden />}
                </button>
                <button type="button" onClick={() => manualMove(1)} aria-label="Next reviews" className={controlClasses}>
                  <ChevronRight size={20} aria-hidden />
                </button>
              </div>
            )}
          </div>

          <div
            ref={trackRef}
            onPointerDown={userScroll}
            onWheel={(e) => {
              if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) userScroll();
            }}
            className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {Array.from({ length: copies }, (_, copy) =>
              testimonials.map((testimonial, index) => (
                <div
                  key={`${copy}-${index}`}
                  data-card
                  // Screen readers get the list once; the copies are only there for looping.
                  aria-hidden={copy !== middle || undefined}
                  className="w-full shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              )),
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
