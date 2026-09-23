import { z } from "zod";

/**
 * Alt text for an uploaded image: a short description for screen readers and
 * search engines ("Students at the UK admission day in Dhaka"), not a file
 * name. Required for content images; optional where a sensible default
 * exists (e.g. "Flag of Canada").
 */
export function imageAlt(required: boolean) {
  const base = z.string().trim().max(200, "Keep the alt text under 200 characters");
  return required ? base.min(1, "Describe the image (alt text) for visitors who can't see it") : base;
}
