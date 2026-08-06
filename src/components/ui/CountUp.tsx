"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  /** Numeric target the counter animates to. */
  end: number;
  prefix?: string;
  suffix?: string;
  /** Animation length in ms. */
  duration?: number;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Animated counter — counts from 0 to `end` once scrolled into view. */
export default function CountUp({
  end,
  prefix = "",
  suffix = "",
  duration = 1400,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(end);
      return;
    }

    let frame = 0;

    const animate = (start: number) => {
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        setDisplay(Math.round(easeOutCubic(progress) * end));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animate(performance.now());
          observer?.unobserve(node);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
