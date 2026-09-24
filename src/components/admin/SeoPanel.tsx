"use client";

import { useDeferredValue, useMemo } from "react";
import { Controller, useWatch, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import SeoFields, { FieldError, FieldHint, FieldLabel, seoFieldClass, statusTone } from "@/components/admin/SeoFields";
import type { BlogFormValues } from "@/lib/validation/blog";
import { analyzeReadability, analyzeSeo, effectiveSeoTitle, type CheckStatus, type Report } from "@/lib/seo-analysis";
import { cn } from "@/lib/utils";

function scoreTone(score: number): CheckStatus {
  return score >= 70 ? "good" : score >= 40 ? "ok" : "bad";
}

/**
 * The blog form's SEO section: focus keyword plus the shared SEO fields
 * (title, meta description, OG image, search preview) on the left; a live
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

          <Controller
            control={control}
            name="ogImage"
            render={({ field }) => (
              <SeoFields
                idPrefix="b"
                siteUrl={siteUrl}
                path={`/blogs/${slug || "post-slug"}`}
                title={{
                  registration: register("seoTitle"),
                  value: seoTitle,
                  fallback: effectiveSeoTitle({ seoTitle: "", title }),
                  fallbackNote: "using the post title",
                  error: errors.seoTitle?.message,
                }}
                description={{
                  registration: register("metaDescription"),
                  value: metaDescription,
                  fallback: excerpt.trim(),
                  fallbackNote: "using the excerpt",
                  error: errors.metaDescription?.message,
                }}
                ogImage={{
                  value: field.value,
                  onChange: field.onChange,
                  error: errors.ogImage?.message,
                  fallbackImage: coverImage,
                  alt: { registration: register("ogImageAlt"), error: errors.ogImageAlt?.message },
                }}
              >
                <div>
                  <FieldLabel htmlFor="b-focus-keyword">Focus keyword</FieldLabel>
                  <input
                    id="b-focus-keyword"
                    placeholder="e.g. study in the UK"
                    aria-invalid={!!errors.focusKeyword}
                    className={seoFieldClass}
                    {...register("focusKeyword")}
                  />
                  <FieldHint>The search phrase this post should rank for. The analysis checks where you use it.</FieldHint>
                  <FieldError message={errors.focusKeyword?.message} />
                </div>
              </SeoFields>
            )}
          />
        </div>

        <div className="space-y-5 lg:sticky lg:top-6 lg:col-span-2 lg:self-start">
          <ReportCard title="SEO analysis" report={seo} />
          <ReportCard title="Readability" report={readability} />
        </div>
      </div>
    </section>
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
          <span className={cn("text-2xl font-bold", status ? statusTone[status].text : "text-neutral-400")}>{score ?? "—"}</span>
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
          className={cn("h-full rounded-full transition-[width] duration-300", status ? statusTone[status].bg : "bg-neutral-300")}
          style={{ width: `${score ?? 0}%` }}
        />
      </div>
      <ul className="mt-4 space-y-2.5">
        {report.checks.map((check) => (
          <li key={check.id} className="flex gap-2.5 text-sm leading-snug text-neutral-700">
            <span aria-hidden className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", statusTone[check.status].bg)} />
            <span>
              <span className="sr-only">{statusTone[check.status].label}: </span>
              {check.message}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
