"use client";

import Image from "next/image";
import type { UseFormRegisterReturn } from "react-hook-form";
import OgImageField from "@/components/admin/OgImageField";
import { META_MAX, META_MIN, SEO_TITLE_MAX, type CheckStatus } from "@/lib/seo-analysis";
import { cn } from "@/lib/utils";

export const seoFieldClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 aria-[invalid=true]:border-red-500";

export const statusTone = {
  good: { text: "text-emerald-600", bg: "bg-emerald-500", label: "Good" },
  ok: { text: "text-amber-600", bg: "bg-amber-400", label: "Improve" },
  bad: { text: "text-red-600", bg: "bg-red-500", label: "Problem" },
} satisfies Record<CheckStatus, { text: string; bg: string; label: string }>;

interface TextField {
  registration: UseFormRegisterReturn;
  /** Current value (watched). */
  value: string;
  /** What's used when the field is empty (e.g. "Post title | GlobalEd"). */
  fallback: string;
  /** Short note shown while empty, e.g. "using the post title". */
  fallbackNote: string;
  error?: string;
}

/**
 * How a page looks in Google and when shared: SEO title and meta description
 * (with length counters), the OG share image, and a search-result preview.
 * Every field is optional — empty ones fall back to the page's own title,
 * summary and image.
 */
export default function SeoFields({
  idPrefix,
  siteUrl,
  path,
  title,
  description,
  ogImage,
  children,
}: {
  idPrefix: string;
  siteUrl: string;
  /** Public path of the page, e.g. "/courses/ielts-regular" (for the preview). */
  path: string;
  title: TextField;
  description: TextField;
  ogImage: {
    value: string;
    onChange: (url: string) => void;
    error?: string;
    /** The image shares use when no OG image is set (cover, hero, …). */
    fallbackImage: string;
    alt: { registration: UseFormRegisterReturn; error?: string };
  };
  /** Extra fields shown first (e.g. the blog's focus keyword). */
  children?: React.ReactNode;
}) {
  const shownTitle = title.value.trim() || title.fallback;
  const shownDescription = (description.value.trim() || description.fallback).replace(/\s+/g, " ");

  return (
    <div className="space-y-6">
      {children}

      <div>
        <FieldLabel
          htmlFor={`${idPrefix}-seo-title`}
          counter={<Counter length={shownTitle.length} max={SEO_TITLE_MAX} good={(n) => n >= 30 && n <= SEO_TITLE_MAX} />}
          note={title.value.trim() ? undefined : title.fallbackNote}
        >
          SEO title
        </FieldLabel>
        <input
          id={`${idPrefix}-seo-title`}
          placeholder={title.fallback || "Title shown in search results"}
          aria-invalid={!!title.error}
          className={seoFieldClass}
          {...title.registration}
        />
        <FieldError message={title.error} />
      </div>

      <div>
        <FieldLabel
          htmlFor={`${idPrefix}-meta-description`}
          counter={<Counter length={shownDescription.length} max={META_MAX} good={(n) => n >= META_MIN && n <= META_MAX} />}
          note={description.value.trim() ? undefined : description.fallbackNote}
        >
          Meta description
        </FieldLabel>
        <textarea
          id={`${idPrefix}-meta-description`}
          rows={3}
          placeholder={description.fallback || "The summary shown under the title in search results"}
          aria-invalid={!!description.error}
          className={seoFieldClass}
          {...description.registration}
        />
        <FieldError message={description.error} />
      </div>

      <OgImageField
        value={ogImage.value}
        onChange={ogImage.onChange}
        error={ogImage.error}
        coverImage={ogImage.fallbackImage}
        alt={ogImage.alt}
        altId={`${idPrefix}-og-alt`}
      />

      <div>
        <FieldLabel as="h3">Search preview</FieldLabel>
        <SearchPreview host={new URL(siteUrl).host} path={path} title={shownTitle} description={shownDescription} />
      </div>
    </div>
  );
}

export function FieldLabel({
  htmlFor,
  as,
  counter,
  note,
  children,
}: {
  htmlFor?: string;
  as?: "h3";
  counter?: React.ReactNode;
  note?: string;
  children: React.ReactNode;
}) {
  const Tag = as ?? "label";
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <Tag {...(htmlFor ? { htmlFor } : {})} className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
        {children}
        {note && <span className="ml-2 font-normal normal-case tracking-normal text-neutral-400">({note})</span>}
      </Tag>
      {counter}
    </div>
  );
}

function Counter({ length, max, good }: { length: number; max: number; good: (n: number) => boolean }) {
  const status: CheckStatus = length === 0 ? "ok" : length > max ? "bad" : good(length) ? "good" : "ok";
  return (
    <span className={cn("text-xs tabular-nums", length === 0 ? "text-neutral-400" : statusTone[status].text)}>
      {length}/{max}
    </span>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-neutral-500">{children}</p>;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-xs font-medium text-red-600">
      {message}
    </p>
  );
}

/** A Google-style result: site name, breadcrumb URL, blue title, two-line description. */
function SearchPreview({ host, path, title, description }: { host: string; path: string; title: string; description: string }) {
  const crumbs = path.split("/").filter(Boolean);
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 font-sans shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
          <Image src="/favicon.ico" alt="" width={16} height={16} unoptimized />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="text-sm text-neutral-900">GlobalEd</p>
          <p className="truncate text-xs text-neutral-600">
            https://{host}
            {crumbs.map((c) => ` › ${c}`).join("")}
          </p>
        </div>
      </div>
      <p className="mt-2 max-w-[600px] truncate text-lg leading-snug text-[#1a0dab]">{title || "Your page title"}</p>
      <p className="mt-1 line-clamp-2 max-w-[600px] text-sm leading-relaxed text-neutral-600">
        {description || "Add a meta description — it's shown here in search results."}
      </p>
    </div>
  );
}
