"use client";

import { useDeferredValue, useMemo } from "react";
import Image from "next/image";
import { Controller, useWatch, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import OgImageField from "@/components/admin/OgImageField";
import type { BlogFormValues } from "@/lib/validation/blog";
import {
  analyzeReadability,
  analyzeSeo,
  effectiveMetaDescription,
  effectiveSeoTitle,
  META_MAX,
  META_MIN,
  SEO_TITLE_MAX,
  type CheckStatus,
  type Report,
} from "@/lib/seo-analysis";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 aria-[invalid=true]:border-red-500";

const tone = {
  good: { text: "text-emerald-600", bg: "bg-emerald-500", label: "Good" },
  ok: { text: "text-amber-600", bg: "bg-amber-400", label: "Improve" },
  bad: { text: "text-red-600", bg: "bg-red-500", label: "Problem" },
} satisfies Record<CheckStatus, { text: string; bg: string; label: string }>;

function scoreTone(score: number): CheckStatus {
  return score >= 70 ? "good" : score >= 40 ? "ok" : "bad";
}

/**
 * The blog form's SEO section: focus keyword, SEO title, meta description,
 * OG (social share) image and a search-result preview on the left; a live
 * SEO and readability report on the right, updated as the admin types.
 */
export default function SeoPanel({
  control,
  register,
  errors,
  siteUrl,
}: {
  control: Control<BlogFormValues>;
  register: UseFormRegister<BlogFormValues>;
  errors: FieldErrors<BlogFormValues>;
  siteUrl: string;
}) {
  const [focusKeyword, title, seoTitle, metaDescription, excerpt, slug, content, coverImage, coverImageAlt, ogImage, ogImageAlt] =
    useWatch({
      control,
      name: [
        "focusKeyword",
        "title",
        "seoTitle",
        "metaDescription",
        "excerpt",
        "slug",
        "content",
        "coverImage",
        "coverImageAlt",
        "ogImage",
        "ogImageAlt",
      ],
    });
  const siteHost = new URL(siteUrl).host;

  const input = { focusKeyword, title, seoTitle, metaDescription, excerpt, slug, content, coverImage, coverImageAlt, ogImage, ogImageAlt, siteHost };
  // The report re-runs in a low-priority render, so typing stays smooth on long posts.
  const deferred = useDeferredValue(input);
  const seo = useMemo(() => analyzeSeo(deferred), [deferred]);
  const readability = useMemo(() => analyzeReadability(deferred.content), [deferred.content]);

  const shownTitle = effectiveSeoTitle(input);
  const shownDescription = effectiveMetaDescription(input);

  return (
    <section aria-labelledby="seo-heading" className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="min-w-0 space-y-6 lg:col-span-3">
          <div>
            <h2 id="seo-heading" className="font-heading text-lg font-bold text-primary-900">
              SEO
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              How this post looks in Google and when it&apos;s shared. Empty fields use the post&apos;s title, excerpt and
              cover image.
            </p>
          </div>

          <div>
            <FieldLabel htmlFor="b-focus-keyword">Focus keyword</FieldLabel>
            <input
              id="b-focus-keyword"
              placeholder="e.g. study in the UK"
              aria-invalid={!!errors.focusKeyword}
              className={fieldClass}
              {...register("focusKeyword")}
            />
            <Hint>The search phrase this post should rank for. The analysis checks where you use it.</Hint>
            <FieldError message={errors.focusKeyword?.message} />
          </div>

          <div>
            <FieldLabel
              htmlFor="b-seo-title"
              counter={<Counter length={shownTitle.length} max={SEO_TITLE_MAX} good={(n) => n >= 30 && n <= SEO_TITLE_MAX} />}
              note={seoTitle.trim() ? undefined : "using the post title"}
            >
              SEO title
            </FieldLabel>
            <input
              id="b-seo-title"
              placeholder={effectiveSeoTitle({ seoTitle: "", title }) || "Title shown in search results"}
              aria-invalid={!!errors.seoTitle}
              className={fieldClass}
              {...register("seoTitle")}
            />
            <FieldError message={errors.seoTitle?.message} />
          </div>

          <div>
            <FieldLabel
              htmlFor="b-meta-description"
              counter={<Counter length={shownDescription.length} max={META_MAX} good={(n) => n >= META_MIN && n <= META_MAX} />}
              note={metaDescription.trim() ? undefined : "using the excerpt"}
            >
              Meta description
            </FieldLabel>
            <textarea
              id="b-meta-description"
              rows={3}
              placeholder={excerpt.trim() || "The summary shown under the title in search results"}
              aria-invalid={!!errors.metaDescription}
              className={fieldClass}
              {...register("metaDescription")}
            />
            <FieldError message={errors.metaDescription?.message} />
          </div>

          <Controller
            control={control}
            name="ogImage"
            render={({ field }) => (
              <OgImageField
                value={field.value}
                onChange={field.onChange}
                error={errors.ogImage?.message}
                coverImage={coverImage}
                alt={{ registration: register("ogImageAlt"), error: errors.ogImageAlt?.message }}
              />
            )}
          />

          <div>
            <FieldLabel as="h3">Search preview</FieldLabel>
            <SearchPreview host={siteHost} slug={slug} title={shownTitle} description={shownDescription} />
          </div>
        </div>

        <div className="space-y-5 lg:sticky lg:top-6 lg:col-span-2 lg:self-start">
          <ReportCard title="SEO analysis" report={seo} />
          <ReportCard title="Readability" report={readability} />
        </div>
      </div>
    </section>
  );
}

function FieldLabel({
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
    <span className={cn("text-xs tabular-nums", length === 0 ? "text-neutral-400" : tone[status].text)}>
      {length}/{max}
    </span>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-neutral-500">{children}</p>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-xs font-medium text-red-600">
      {message}
    </p>
  );
}

/** A Google-style result: site name, breadcrumb URL, blue title, two-line description. */
function SearchPreview({ host, slug, title, description }: { host: string; slug: string; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 font-sans shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
          <Image src="/favicon.ico" alt="" width={16} height={16} unoptimized />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="text-sm text-neutral-900">GlobalEd</p>
          <p className="truncate text-xs text-neutral-600">
            https://{host} › blogs › {slug || "post-slug"}
          </p>
        </div>
      </div>
      <p className="mt-2 max-w-[600px] truncate text-lg leading-snug text-[#1a0dab]">
        {title || "Your post title"}
      </p>
      <p className="mt-1 line-clamp-2 max-w-[600px] text-sm leading-relaxed text-neutral-600">
        {description || "Add a meta description or an excerpt — it's shown here in search results."}
      </p>
    </div>
  );
}

function ReportCard({ title, report }: { title: string; report: Report }) {
  const score = report.score;
  const status = score === null ? null : scoreTone(score);
  return (
    <section aria-label={title} className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-heading font-bold text-primary-900">{title}</h3>
        <p className="tabular-nums">
          <span className={cn("text-2xl font-bold", status ? tone[status].text : "text-neutral-400")}>{score ?? "—"}</span>
          <span className="text-sm text-neutral-400">/100</span>
        </p>
      </div>
      <div
        role="progressbar"
        aria-label={`${title} score`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score ?? undefined}
        aria-valuetext={score === null ? "Not scored" : `${score} out of 100`}
        className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200"
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-300", status ? tone[status].bg : "bg-neutral-300")}
          style={{ width: `${score ?? 0}%` }}
        />
      </div>
      <ul className="mt-4 space-y-2.5">
        {report.checks.map((check) => (
          <li key={check.id} className="flex gap-2.5 text-sm leading-snug text-neutral-700">
            <span aria-hidden className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", tone[check.status].bg)} />
            <span>
              <span className="sr-only">{tone[check.status].label}: </span>
              {check.message}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
