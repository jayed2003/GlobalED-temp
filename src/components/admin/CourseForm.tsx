"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-fetch";
import { showServerError } from "@/components/admin/form-errors";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { FormField, FormStatus, Input, Select, SubmitButton, Textarea } from "@/components/forms/primitives";
import RepeatableFieldList from "@/components/admin/RepeatableFieldList";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { courseSchema, type CourseFormValues } from "@/lib/validation/course";

const emptyValues: CourseFormValues = {
  slug: "",
  title: "",
  category: "ielts",
  image: "",
  overview: "",
  curriculum: [],
  duration: "",
  schedule: "",
  price: "",
  badge: "",
};

export default function CourseForm({
  mode,
  courseId,
  defaultValues,
}: {
  mode: "create" | "edit";
  courseId?: string;
  defaultValues?: CourseFormValues;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    setError,
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: defaultValues ?? emptyValues,
  });

  const onSubmit = async (data: CourseFormValues) => {
    setStatus(null);
    const result = await adminRequest(mode === "create" ? "/api/admin/courses" : `/api/admin/courses/${courseId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      json: data,
    });
    if (!result.ok) return showServerError(result, setError, setStatus);
    router.push("/admin/courses");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
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

      <SubmitButton loading={isSubmitting}>
        <Save size={18} aria-hidden />
        {mode === "create" ? "Create Course" : "Save Changes"}
      </SubmitButton>

      <FormStatus status={status?.type ?? null} message={status?.message} />
    </form>
  );
}
