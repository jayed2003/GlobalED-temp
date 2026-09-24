"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-fetch";
import EditorActionBar from "@/components/admin/ui/EditorActionBar";
import PublishStatusCard from "@/components/admin/ui/PublishStatusCard";
import SectionCard from "@/components/admin/ui/SectionCard";
import { previewHref } from "@/components/admin/ui/PreviewLink";
import { useUnsavedChangesGuard } from "@/components/admin/ui/useUnsavedChangesGuard";
import { toast } from "@/components/admin/ui/toast";
import { onInvalidForm, showServerError } from "@/components/admin/form-errors";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, Input, Textarea } from "@/components/forms/primitives";
import RepeatableFieldList from "@/components/admin/RepeatableFieldList";
import ObjectFieldArray from "@/components/admin/ObjectFieldArray";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SeoFields from "@/components/admin/SeoFields";
import { destinationSchema, type DestinationFormValues } from "@/lib/validation/destination";

const emptyValues: DestinationFormValues = {
  slug: "",
  name: "",
  tagline: "",
  heroImage: "",
  heroImageAlt: "",
  flagImage: "",
  flagImageAlt: "",
  overview: "",
  whyStudyHere: [],
  tuitionRange: "",
  livingCost: "",
  scholarships: [],
  visaInfo: [],
  popularUniversities: [],
  faqs: [],
  publishStatus: "DRAFT",
  seoTitle: "",
  metaDescription: "",
  ogImage: "",
  ogImageAlt: "",
};

export default function DestinationForm({
  mode,
  destinationId,
  defaultValues,
  siteUrl,
}: {
  mode: "create" | "edit";
  destinationId?: string;
  defaultValues?: DestinationFormValues;
  /** Public site URL for the search preview. */
  siteUrl: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  // Stays true after a successful save so the button can't be clicked again
  // while the page navigates away (prevents duplicate records).
  const [saved, setSaved] = useState(false);

  const {
    setError,
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationSchema),
    defaultValues: defaultValues ?? emptyValues,
  });
  const [name, slug, tagline, heroImage, seoTitle, metaDescription, publishStatus] = useWatch({
    control,
    name: ["name", "slug", "tagline", "heroImage", "seoTitle", "metaDescription", "publishStatus"],
  });

  useUnsavedChangesGuard(isDirty && !saved);

  const onSubmit = async (data: DestinationFormValues) => {
    setStatus(null);
    const result = await adminRequest(mode === "create" ? "/api/admin/destinations" : `/api/admin/destinations/${destinationId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      json: data,
    });
    if (!result.ok) return showServerError(result, setError, setStatus);
    setSaved(true);
    const live = data.publishStatus === "PUBLISHED";
    toast.success(
      live ? (mode === "create" ? "Destination published" : "Changes saved") : "Saved as a draft — not on the site yet",
      live
        ? { href: `/destinations/${data.slug}`, linkLabel: "View on site" }
        : { href: previewHref(`/destinations/${data.slug}`), linkLabel: "Preview" },
    );
    router.push("/admin/destinations");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalidForm(setStatus))} noValidate className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="d-slug" label="Slug" required error={errors.slug?.message}>
          <Input id="d-slug" placeholder="uk" {...register("slug")} />
        </FormField>
        <FormField id="d-name" label="Country Name" required error={errors.name?.message}>
          <Input id="d-name" placeholder="United Kingdom" {...register("name")} />
        </FormField>
      </div>

      <FormField id="d-tagline" label="Tagline" required error={errors.tagline?.message}>
        <Input id="d-tagline" {...register("tagline")} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          control={control}
          name="heroImage"
          render={({ field }) => (
            <ImageUploadField
              label="Hero Image"
              value={field.value}
              onChange={field.onChange}
              error={errors.heroImage?.message}
              alt={{
                id: "d-hero-alt",
                registration: register("heroImageAlt"),
                error: errors.heroImageAlt?.message,
                required: true,
                placeholder: "e.g. Big Ben and the Houses of Parliament, London",
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="flagImage"
          render={({ field }) => (
            <ImageUploadField
              label="Flag Image"
              value={field.value}
              onChange={field.onChange}
              error={errors.flagImage?.message}
              alt={{
                id: "d-flag-alt",
                registration: register("flagImageAlt"),
                error: errors.flagImageAlt?.message,
                required: false,
                placeholder: "Leave empty for \"Flag of {country}\"",
              }}
            />
          )}
        />
      </div>

      <FormField id="d-overview" label="Overview" required error={errors.overview?.message}>
        <Textarea id="d-overview" rows={5} {...register("overview")} />
      </FormField>

      <Controller
        control={control}
        name="whyStudyHere"
        render={({ field }) => (
          <RepeatableFieldList
            label="Why Study Here"
            value={field.value}
            onChange={field.onChange}
            error={errors.whyStudyHere?.message as string | undefined}
          />
        )}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="d-tuition" label="Tuition Range" required error={errors.tuitionRange?.message}>
          <Input id="d-tuition" placeholder="£12,000 – £25,000 / year" {...register("tuitionRange")} />
        </FormField>
        <FormField id="d-living" label="Living Cost" required error={errors.livingCost?.message}>
          <Input id="d-living" placeholder="£900 – £1,400 / month" {...register("livingCost")} />
        </FormField>
      </div>

      <Controller
        control={control}
        name="popularUniversities"
        render={({ field }) => (
          <ObjectFieldArray
            label="Popular Universities"
            value={field.value}
            onChange={field.onChange}
            emptyItem={{ name: "", city: "" }}
            error={errors.popularUniversities?.message as string | undefined}
            renderRow={(item, update) => (
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder="University name"
                  value={item.name}
                  onChange={(e) => update({ name: e.target.value })}
                />
                <Input placeholder="City" value={item.city} onChange={(e) => update({ city: e.target.value })} />
              </div>
            )}
          />
        )}
      />

      <Controller
        control={control}
        name="scholarships"
        render={({ field }) => (
          <RepeatableFieldList
            label="Scholarships"
            value={field.value}
            onChange={field.onChange}
            error={errors.scholarships?.message as string | undefined}
          />
        )}
      />

      <Controller
        control={control}
        name="visaInfo"
        render={({ field }) => (
          <RepeatableFieldList
            label="Visa Information"
            value={field.value}
            onChange={field.onChange}
            error={errors.visaInfo?.message as string | undefined}
          />
        )}
      />

      <Controller
        control={control}
        name="faqs"
        render={({ field }) => (
          <ObjectFieldArray
            label="FAQs"
            value={field.value}
            onChange={field.onChange}
            emptyItem={{ q: "", a: "" }}
            error={errors.faqs?.message as string | undefined}
            renderRow={(item, update) => (
              <div className="space-y-2">
                <Input placeholder="Question" value={item.q} onChange={(e) => update({ q: e.target.value })} />
                <Textarea
                  placeholder="Answer"
                  rows={2}
                  value={item.a}
                  onChange={(e) => update({ a: e.target.value })}
                />
              </div>
            )}
          />
        )}
      />

      <PublishStatusCard
        registration={register("publishStatus")}
        value={publishStatus}
        publishedHint="On the destinations page, the menu and the booking form"
      />

      <SectionCard title="Search & sharing" description="How this destination's page looks in Google and when it's shared.">
        <Controller
          control={control}
          name="ogImage"
          render={({ field }) => (
            <SeoFields
              idPrefix="d"
              siteUrl={siteUrl}
              path={`/destinations/${slug || "country"}`}
              title={{
                registration: register("seoTitle"),
                value: seoTitle,
                fallback: name ? `Study in ${name} | GlobalEd` : "",
                fallbackNote: "using the country name",
                error: errors.seoTitle?.message,
              }}
              description={{
                registration: register("metaDescription"),
                value: metaDescription,
                fallback: tagline
                  ? `${tagline} Admissions, costs, scholarships, and visa guidance for Bangladeshi students with GlobalEd.`
                  : "",
                fallbackNote: "using the tagline",
                error: errors.metaDescription?.message,
              }}
              ogImage={{
                value: field.value,
                onChange: field.onChange,
                error: errors.ogImage?.message,
                fallbackImage: heroImage,
                fallbackName: "the hero image",
                alt: { registration: register("ogImageAlt"), error: errors.ogImageAlt?.message },
              }}
            />
          )}
        />
      </SectionCard>

      <EditorActionBar
        dirty={isDirty && !saved}
        busy={isSubmitting || saved}
        submitLabel={mode === "create" ? (publishStatus === "PUBLISHED" ? "Publish Destination" : "Save Draft") : "Save Changes"}
        error={status?.type === "error" ? status.message : null}
      />
    </form>
  );
}
