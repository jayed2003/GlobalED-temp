"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminRequest } from "@/lib/admin-fetch";
import { onInvalidForm, showServerError } from "@/components/admin/form-errors";
import { FormField, Input, Textarea } from "@/components/forms/primitives";
import RepeatableFieldList from "@/components/admin/RepeatableFieldList";
import ObjectFieldArray from "@/components/admin/ObjectFieldArray";
import SeoFields from "@/components/admin/SeoFields";
import EditorActionBar from "@/components/admin/ui/EditorActionBar";
import IconPicker from "@/components/admin/ui/IconPicker";
import SectionCard from "@/components/admin/ui/SectionCard";
import { useUnsavedChangesGuard } from "@/components/admin/ui/useUnsavedChangesGuard";
import { toast } from "@/components/admin/ui/toast";
import { serviceSchema, type ServiceFormValues } from "@/lib/validation/service";
import { cn } from "@/lib/utils";

const emptyValues: ServiceFormValues = {
  slug: "",
  title: "",
  icon: "GraduationCap",
  shortDescription: "",
  description: "",
  benefits: [""],
  process: [{ step: "", description: "" }],
  status: "DRAFT",
  seoTitle: "",
  metaDescription: "",
  ogImage: "",
  ogImageAlt: "",
};

/** Add / edit a service. */
export default function ServiceForm({
  mode,
  serviceId,
  defaultValues,
  siteUrl,
}: {
  mode: "create" | "edit";
  serviceId?: string;
  defaultValues?: ServiceFormValues;
  siteUrl: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: defaultValues ?? emptyValues,
  });
  useUnsavedChangesGuard(isDirty && !saved);

  const [title, slug, shortDescription, seoTitle, metaDescription, publishState] = useWatch({
    control,
    name: ["title", "slug", "shortDescription", "seoTitle", "metaDescription", "status"],
  });

  const onSubmit = async (data: ServiceFormValues) => {
    setStatus(null);
    const result = await adminRequest(mode === "create" ? "/api/admin/services" : `/api/admin/services/${serviceId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      json: data,
    });
    if (!result.ok) return showServerError(result, setError, setStatus);
    setSaved(true);
    const live = data.status === "PUBLISHED";
    toast.success(
      live ? (mode === "create" ? "Service published" : "Changes saved") : "Saved as a draft — not on the site yet",
      live
        ? { href: `/services/${data.slug}`, linkLabel: "View on site" }
        : { href: `/api/admin/preview?path=${encodeURIComponent(`/services/${data.slug}`)}`, linkLabel: "Preview" },
    );
    router.push("/admin/services");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalidForm(setStatus))} noValidate className="space-y-5">
      <SectionCard title="Service" description="Shown on its own page, as a card on the home and services pages, and in the menu.">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="sv-title" label="Name" required error={errors.title?.message}>
            <Input id="sv-title" aria-invalid={!!errors.title} {...register("title")} />
          </FormField>
          <FormField id="sv-slug" label="Slug" required error={errors.slug?.message}>
            <Input id="sv-slug" placeholder="visa-application" aria-invalid={!!errors.slug} {...register("slug")} />
            <p className="mt-1 text-xs text-neutral-500">The web address: /services/{slug || "…"}</p>
          </FormField>
        </div>
        <Controller
          control={control}
          name="icon"
          render={({ field }) => (
            <div className="max-w-sm">
              <label htmlFor="sv-icon" className="mb-1.5 block text-sm font-medium text-primary-900">
                Icon
              </label>
              <IconPicker id="sv-icon" value={field.value} onChange={field.onChange} invalid={!!errors.icon} />
              {errors.icon && <p className="mt-1 text-xs font-medium text-red-600">{errors.icon.message}</p>}
            </div>
          )}
        />
        <FormField id="sv-short" label="Summary" required error={errors.shortDescription?.message}>
          <Textarea id="sv-short" rows={2} aria-invalid={!!errors.shortDescription} {...register("shortDescription")} />
          <p className="mt-1 text-xs text-neutral-500">One or two lines, shown on the cards and under the page title.</p>
        </FormField>
        <FormField id="sv-description" label="How we help" required error={errors.description?.message}>
          <Textarea id="sv-description" rows={5} aria-invalid={!!errors.description} {...register("description")} />
        </FormField>
      </SectionCard>

      <SectionCard title="What you get" description="The checklist beside “How we help”.">
        <Controller
          control={control}
          name="benefits"
          render={({ field }) => (
            <RepeatableFieldList
              label="Benefits"
              value={field.value}
              onChange={field.onChange}
              minItems={1}
              maxItems={12}
              error={errors.benefits?.message ?? errors.benefits?.root?.message ?? errors.benefits?.find?.((e) => e)?.message}
            />
          )}
        />
      </SectionCard>

      <SectionCard title="The process" description="The numbered steps under “How this service works”.">
        <Controller
          control={control}
          name="process"
          render={({ field }) => (
            <ObjectFieldArray
              label="Steps"
              value={field.value}
              onChange={field.onChange}
              minItems={1}
              maxItems={10}
              emptyItem={{ step: "", description: "" }}
              error={errors.process?.message ?? errors.process?.root?.message}
              renderRow={(item, update, index) => (
                <div className="grid gap-3">
                  <FormField id={`sv-step-${index}`} label="Step" required error={errors.process?.[index]?.step?.message}>
                    <Input id={`sv-step-${index}`} value={item.step} onChange={(e) => update({ step: e.target.value })} />
                  </FormField>
                  <FormField id={`sv-step-${index}-d`} label="What happens" required error={errors.process?.[index]?.description?.message}>
                    <Textarea
                      id={`sv-step-${index}-d`}
                      rows={2}
                      value={item.description}
                      onChange={(e) => update({ description: e.target.value })}
                    />
                  </FormField>
                </div>
              )}
            />
          )}
        />
      </SectionCard>

      <SectionCard title="Publishing">
        <div role="radiogroup" aria-label="Publishing" className="grid gap-3 sm:grid-cols-2">
          {(
            [
              { value: "PUBLISHED", label: "Published", hint: "On the site, in the menu and footer" },
              { value: "DRAFT", label: "Draft", hint: "Hidden from visitors; you can preview it" },
            ] as const
          ).map((o) => (
            <label
              key={o.value}
              className={cn(
                "flex cursor-pointer gap-2.5 rounded-lg border p-3 text-sm",
                publishState === o.value ? "border-primary-500 bg-primary-50" : "border-neutral-200 hover:bg-neutral-50",
              )}
            >
              <input type="radio" value={o.value} className="mt-0.5 accent-primary-700" {...register("status")} />
              <span>
                <span className="block font-medium text-primary-900">{o.label}</span>
                <span className="block text-xs text-neutral-500">{o.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Search & sharing" description="How this service's page looks in Google and when it's shared.">
        <Controller
          control={control}
          name="ogImage"
          render={({ field }) => (
            <SeoFields
              idPrefix="sv"
              siteUrl={siteUrl}
              path={`/services/${slug || "service"}`}
              title={{
                registration: register("seoTitle"),
                value: seoTitle,
                fallback: title ? `${title} | GlobalEd` : "",
                fallbackNote: "using the service name",
                error: errors.seoTitle?.message,
              }}
              description={{
                registration: register("metaDescription"),
                value: metaDescription,
                fallback: shortDescription,
                fallbackNote: "using the summary",
                error: errors.metaDescription?.message,
              }}
              ogImage={{
                value: field.value,
                onChange: field.onChange,
                error: errors.ogImage?.message,
                fallbackImage: "",
                alt: { registration: register("ogImageAlt"), error: errors.ogImageAlt?.message },
              }}
            />
          )}
        />
      </SectionCard>

      <EditorActionBar
        dirty={isDirty && !saved}
        busy={isSubmitting || saved}
        submitLabel={mode === "create" ? (publishState === "PUBLISHED" ? "Publish Service" : "Save Draft") : "Save Changes"}
        error={status?.type === "error" ? status.message : null}
      />
    </form>
  );
}
