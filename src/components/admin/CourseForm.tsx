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
import { FormField, Input, Select, Textarea } from "@/components/forms/primitives";
import RepeatableFieldList from "@/components/admin/RepeatableFieldList";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SeoFields from "@/components/admin/SeoFields";
import { courseSchema, type CourseFormValues } from "@/lib/validation/course";

const emptyValues: CourseFormValues = {
  slug: "",
  title: "",
  category: "ielts",
  image: "",
  imageAlt: "",
  overview: "",
  curriculum: [],
  duration: "",
  schedule: "",
  price: "",
  badge: "",
  publishStatus: "DRAFT",
  seoTitle: "",
  metaDescription: "",
  ogImage: "",
  ogImageAlt: "",
};

export default function CourseForm({
  mode,
  courseId,
  defaultValues,
  siteUrl,
}: {
  mode: "create" | "edit";
  courseId?: string;
  defaultValues?: CourseFormValues;
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
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: defaultValues ?? emptyValues,
  });
  const [title, slug, overview, image, seoTitle, metaDescription, publishStatus] = useWatch({
    control,
    name: ["title", "slug", "overview", "image", "seoTitle", "metaDescription", "publishStatus"],
  });

  useUnsavedChangesGuard(isDirty && !saved);

  const onSubmit = async (data: CourseFormValues) => {
    setStatus(null);
    const result = await adminRequest(mode === "create" ? "/api/admin/courses" : `/api/admin/courses/${courseId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      json: data,
    });
    if (!result.ok) return showServerError(result, setError, setStatus);
    setSaved(true);
    const live = data.publishStatus === "PUBLISHED";
    toast.success(
      live ? (mode === "create" ? "Course published" : "Changes saved") : "Saved as a draft — not on the site yet",
      live
        ? { href: `/courses/${data.slug}`, linkLabel: "View on site" }
        : { href: previewHref(`/courses/${data.slug}`), linkLabel: "Preview" },
    );
    router.push("/admin/courses");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalidForm(setStatus))} noValidate className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="c-slug" label="Slug" required error={errors.slug?.message}>
          <Input id="c-slug" placeholder="ielts-regular" {...register("slug")} />
        </FormField>
        <FormField id="c-title" label="Course Name" required error={errors.title?.message}>
          <Input id="c-title" placeholder="IELTS Essential Package" {...register("title")} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="c-category" label="Category" required error={errors.category?.message}>
          <Select id="c-category" {...register("category")}>
            <option value="ielts">IELTS</option>
            <option value="english">English</option>
            <option value="other-languages">Other Languages</option>
          </Select>
        </FormField>
        <FormField id="c-badge" label="Badge (optional)" error={errors.badge?.message}>
          <Input id="c-badge" placeholder="Popular" {...register("badge")} />
        </FormField>
      </div>

      <Controller
        control={control}
        name="image"
        render={({ field }) => (
          <ImageUploadField
            label="Course Image"
            value={field.value}
            onChange={field.onChange}
            error={errors.image?.message}
            alt={{
              id: "c-image-alt",
              registration: register("imageAlt"),
              error: errors.imageAlt?.message,
              required: true,
              placeholder: "e.g. IELTS students in a GlobalEd classroom",
            }}
          />
        )}
      />

      <FormField id="c-overview" label="Brief Overview" required error={errors.overview?.message}>
        <Textarea id="c-overview" rows={4} {...register("overview")} />
      </FormField>

      <Controller
        control={control}
        name="curriculum"
        render={({ field }) => (
          <RepeatableFieldList
            label="What You Will Learn"
            value={field.value}
            onChange={field.onChange}
            error={errors.curriculum?.message as string | undefined}
          />
        )}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField id="c-duration" label="Duration" required error={errors.duration?.message}>
          <Input id="c-duration" placeholder="6 weeks" {...register("duration")} />
        </FormField>
        <FormField id="c-schedule" label="Schedule" required error={errors.schedule?.message}>
          <Input id="c-schedule" placeholder="Sat–Thu, evening batch" {...register("schedule")} />
        </FormField>
        <FormField id="c-price" label="Course Fee" required error={errors.price?.message}>
          <Input id="c-price" placeholder="BDT 10,000" {...register("price")} />
        </FormField>
      </div>

      <PublishStatusCard
        registration={register("publishStatus")}
        value={publishStatus}
        publishedHint="On the courses page, the menu and the booking form"
      />

      <SectionCard title="Search & sharing" description="How this course's page looks in Google and when it's shared.">
        <Controller
          control={control}
          name="ogImage"
          render={({ field }) => (
            <SeoFields
              idPrefix="c"
              siteUrl={siteUrl}
              path={`/courses/${slug || "course"}`}
              title={{
                registration: register("seoTitle"),
                value: seoTitle,
                fallback: title ? `${title} | GlobalEd` : "",
                fallbackNote: "using the course name",
                error: errors.seoTitle?.message,
              }}
              description={{
                registration: register("metaDescription"),
                value: metaDescription,
                fallback: overview,
                fallbackNote: "using the overview",
                error: errors.metaDescription?.message,
              }}
              ogImage={{
                value: field.value,
                onChange: field.onChange,
                error: errors.ogImage?.message,
                fallbackImage: image,
                fallbackName: "the course image",
                alt: { registration: register("ogImageAlt"), error: errors.ogImageAlt?.message },
              }}
            />
          )}
        />
      </SectionCard>

      <EditorActionBar
        dirty={isDirty && !saved}
        busy={isSubmitting || saved}
        submitLabel={mode === "create" ? (publishStatus === "PUBLISHED" ? "Publish Course" : "Save Draft") : "Save Changes"}
        error={status?.type === "error" ? status.message : null}
      />
    </form>
  );
}
