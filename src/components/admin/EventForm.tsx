"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { FormField, FormStatus, Input, Select, SubmitButton, Textarea } from "@/components/forms/primitives";
import ImageUploadField from "@/components/admin/ImageUploadField";
import GalleryUploadField from "@/components/admin/GalleryUploadField";
import { eventSchema, type EventFormValues } from "@/lib/validation/event";

const emptyValues: EventFormValues = {
  slug: "",
  title: "",
  status: "upcoming",
  date: new Date().toISOString().split("T")[0],
  time: "",
  venue: "",
  bannerImage: "",
  description: "",
  gallery: [],
};

export default function EventForm({
  mode,
  eventId,
  defaultValues,
}: {
  mode: "create" | "edit";
  eventId?: string;
  defaultValues?: EventFormValues;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: defaultValues ?? emptyValues,
  });

  const onSubmit = async (data: EventFormValues) => {
    setStatus(null);
    try {
      const url = mode === "create" ? "/api/admin/events" : `/api/admin/events/${eventId}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong");
      }
      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="e-slug" label="Slug" required error={errors.slug?.message}>
          <Input id="e-slug" placeholder="global-education-expo-2026" {...register("slug")} />
        </FormField>
        <FormField id="e-title" label="Title" required error={errors.title?.message}>
          <Input id="e-title" {...register("title")} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField id="e-status" label="Status" required error={errors.status?.message}>
          <Select id="e-status" {...register("status")}>
            <option value="upcoming">Upcoming</option>
            <option value="previous">Previous</option>
          </Select>
        </FormField>
        <FormField id="e-date" label="Date" required error={errors.date?.message}>
          <Input id="e-date" type="date" {...register("date")} />
        </FormField>
        <FormField id="e-time" label="Time" required error={errors.time?.message}>
          <Input id="e-time" placeholder="10:00 AM – 5:00 PM" {...register("time")} />
        </FormField>
      </div>

      <FormField id="e-venue" label="Venue" required error={errors.venue?.message}>
        <Input id="e-venue" {...register("venue")} />
      </FormField>

      <Controller
        control={control}
        name="bannerImage"
        render={({ field }) => (
          <ImageUploadField
            label="Banner Image"
            value={field.value}
            onChange={field.onChange}
            error={errors.bannerImage?.message}
          />
        )}
      />

      <FormField id="e-description" label="Description" required error={errors.description?.message}>
        <Textarea id="e-description" rows={5} {...register("description")} />
      </FormField>

      <Controller
        control={control}
        name="gallery"
        render={({ field }) => (
          <GalleryUploadField label="Photo Gallery (for previous events)" value={field.value} onChange={field.onChange} />
        )}
      />

      <SubmitButton loading={isSubmitting}>
        <Save size={18} aria-hidden />
        {mode === "create" ? "Create Event" : "Save Changes"}
      </SubmitButton>

      <FormStatus status={status?.type ?? null} message={status?.message} />
    </form>
  );
}
