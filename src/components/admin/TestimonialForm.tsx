"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { FormField, FormStatus, Input, SubmitButton } from "@/components/forms/primitives";
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

  // Every number from 0 up to one past the highest used, plus this review's own current value.
  const ownOrder = defaultValues.sortOrder;
  const takenByOrder = new Map(takenOrders.map((t) => [t.order, t.name]));
  const maxOrder = Math.max(ownOrder, ...takenOrders.map((t) => t.order), -1) + 1;
  const orderOptions = Array.from({ length: maxOrder + 1 }, (_, order) => ({
    order,
    takenBy: takenByOrder.get(order) ?? null,
  }));

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues,
  });

  const onSubmit = async (data: TestimonialFormValues) => {
    setStatus(null);
    try {
      const url = mode === "create" ? "/api/admin/testimonials" : `/api/admin/testimonials/${testimonialId}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong");
      }
      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <Controller
        control={control}
        name="reviewImage"
        render={({ field }) => (
          <ImageUploadField
            label="Review Image"
            value={field.value}
            onChange={field.onChange}
            error={errors.reviewImage?.message}
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

      <SubmitButton loading={isSubmitting}>
        <Save size={18} aria-hidden />
        {mode === "create" ? "Add Review" : "Save Changes"}
      </SubmitButton>

      <FormStatus status={status?.type ?? null} message={status?.message} />
    </form>
  );
}
