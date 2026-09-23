import { z } from "zod";

/**
 * Date rules shared by the admin forms, the public booking form and the API
 * routes. Dates travel as "YYYY-MM-DD" strings (what <input type="date">
 * produces). "Today" is the calendar date in Bangladesh, not the server's
 * UTC date — otherwise the valid range would shift for 6 hours every night.
 */

export const EARLIEST_CONTENT_DATE = "2000-01-01";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Today's date in Asia/Dhaka as YYYY-MM-DD. */
export function todayInDhaka(): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Shift a YYYY-MM-DD date by whole years (Feb 29 rolls to Mar 1). */
export function addYears(isoDate: string, years: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() + years);
  return d.toISOString().slice(0, 10);
}

/**
 * True only for a real calendar date in YYYY-MM-DD form. Rejects "2026-02-31"
 * (which Date would silently roll over to March 3) and five-digit years.
 */
export function isRealDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** "2026-09-23" -> "23 Sep 2026" for messages. */
export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

interface DateRule {
  required: string;
  /** Bounds are functions so "today" is worked out at validation time. */
  min?: () => string;
  max?: () => string;
  minMessage?: (min: string) => string;
  maxMessage?: (max: string) => string;
}

/** A required YYYY-MM-DD string that is a real date within the given bounds. */
export function dateField(rule: DateRule) {
  return z
    .string()
    .trim()
    .min(1, rule.required)
    .superRefine((value, ctx) => {
      if (!isRealDate(value)) {
        ctx.addIssue({ code: "custom", message: "Enter a real date (DD/MM/YYYY)." });
        return;
      }
      const min = rule.min?.();
      if (min && value < min) {
        ctx.addIssue({ code: "custom", message: rule.minMessage?.(min) ?? `The date can't be before ${formatDate(min)}.` });
        return;
      }
      const max = rule.max?.();
      if (max && value > max) {
        ctx.addIssue({ code: "custom", message: rule.maxMessage?.(max) ?? `The date can't be after ${formatDate(max)}.` });
      }
    });
}
