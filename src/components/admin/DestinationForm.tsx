"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-fetch";
import { showServerError } from "@/components/admin/form-errors";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { FormField, FormStatus, Input, SubmitButton, Textarea } from "@/components/forms/primitives";
import RepeatableFieldList from "@/components/admin/RepeatableFieldList";
import ObjectFieldArray from "@/components/admin/ObjectFieldArray";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { destinationSchema, type DestinationFormValues } from "@/lib/validation/destination";

const emptyValues: DestinationFormValues = {
  slug: "",
  name: "",
  tagline: "",
  heroImage: "",
  flagImage: "",
  overview: "",
  whyStudyHere: [],
  tuitionRange: "",
  livingCost: "",
  scholarships: [],
  visaInfo: [],
  popularUniversities: [],
  faqs: [],
};

export default function DestinationForm({
  mode,
  destinationId,
  defaultValues,
}: {
  mode: "create" | "edit";
  destinationId?: string;
  defaultValues?: DestinationFormValues;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    setError,
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationSchema),
    defaultValues: defaultValues ?? emptyValues,
  });

  const onSubmit = async (data: DestinationFormValues) => {
    setStatus(null);
    const result = await adminRequest(mode === "create" ? "/api/admin/destinations" : `/api/admin/destinations/${destinationId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      json: data,
    });
    if (!result.ok) return showServerError(result, setError, setStatus);
    router.push("/admin/destinations");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
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

      <SubmitButton loading={isSubmitting}>
        <Save size={18} aria-hidden />
        {mode === "create" ? "Create Destination" : "Save Changes"}
      </SubmitButton>

      <FormStatus status={status?.type ?? null} message={status?.message} />
    </form>
  );
}
