"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-fetch";
import EditorActionBar from "@/components/admin/ui/EditorActionBar";
import { useUnsavedChangesGuard } from "@/components/admin/ui/useUnsavedChangesGuard";
import { toast } from "@/components/admin/ui/toast";
import { onInvalidForm, showServerError } from "@/components/admin/form-errors";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, Input } from "@/components/forms/primitives";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/validation/testimonial";

export default function TestimonialForm({
  mode,
  testimonialId,
  defaultValues,
  takenOrders,
}: {
  mode: "create" | "edit";
  testimonialId?: string;
  defaultValues: TestimonialFormValues;
  /** Display orders already used by other reviews. */
  takenOrders: { order: number; name: string }[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  // Stays true after a successful save so the button can't be clicked again
  // while the page navigates away (prevents duplicate records).
  const [saved, setSaved] = useState(false);

  // Every number from 0 up to one past the highest used, plus this review's own current value.
  const ownOrder = defaultValues.sortOrder;
  const takenByOrder = new Map(takenOrders.map((t) => [t.order, t.name]));
  const maxOrder = Math.max(ownOrder, ...takenOrders.map((t) => t.order), -1) + 1;
  const orderOptions = Array.from({ length: maxOrder + 1 }, (_, order) => ({
    order,
    takenBy: takenByOrder.get(order) ?? null,
  }));

  const {
    setError,
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues,
  });

  useUnsavedChangesGuard(isDirty && !saved);

  const onSubmit = async (data: TestimonialFormValues) => {
    setStatus(null);
    const result = await adminRequest(mode === "create" ? "/api/admin/testimonials" : `/api/admin/testimonials/${testimonialId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      json: data,
    });
    if (!result.ok) return showServerError(result, setError, setStatus);
    setSaved(true);
    toast.success(mode === "create" ? "Review created" : "Changes saved");
    router.push("/admin/testimonials");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalidForm(setStatus))} noValidate className="space-y-6">
      <Controller
        control={control}
        name="reviewImage"
        render={({ field }) => (
          <ImageUploadField
            label="Review Image"
            value={field.value}
            onChange={field.onChange}
            error={errors.reviewImage?.message}
            alt={{
              id: "t-review-alt",
              registration: register("reviewImageAlt"),
              error: errors.reviewImageAlt?.message,
              required: true,
              placeholder: "e.g. Screenshot of Tanvir's Google review",
            }}
          />
        )}
      />

      <p className="-mt-3 text-xs text-neutral-500">
        Use a landscape (16:9) image — it fills the card exactly. Other shapes get cropped to fit.
      </p>

      <FormField id="t-name" label="Student Name" required error={errors.studentName?.message}>
        <Input id="t-name" {...register("studentName")} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="t-university" label="University" required error={errors.university?.message}>
          <Input id="t-university" placeholder="University of Manchester" {...register("university")} />
        </FormField>
        <FormField id="t-country" label="Country (optional)" error={errors.country?.message}>
          <Input id="t-country" placeholder="UK" {...register("country")} />
        </FormField>
      </div>

      <FormField id="t-order" label="Display Order" error={errors.sortOrder?.message}>
        <select
          id="t-order"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register("sortOrder", { valueAsNumber: true })}
        >
          {orderOptions.map((o) => (
            <option key={o.order} value={o.order} disabled={o.takenBy !== null}>
              {o.order}
              {o.takenBy !== null ? ` — used by ${o.takenBy}` : ""}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-neutral-500">
          Starts at 0 and appears first in the carousel. A number already used by another review
          cannot be picked until that review is deleted or moved.
        </p>
      </FormField>

      <EditorActionBar
        dirty={isDirty && !saved}
        busy={isSubmitting || saved}
        submitLabel={mode === "create" ? "Add Review" : "Save Changes"}
        error={status?.type === "error" ? status.message : null}
      />
    </form>
  );
}
