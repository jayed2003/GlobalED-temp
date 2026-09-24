"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-fetch";
import EditorActionBar from "@/components/admin/ui/EditorActionBar";
import { useUnsavedChangesGuard } from "@/components/admin/ui/useUnsavedChangesGuard";
import { toast } from "@/components/admin/ui/toast";
import { onInvalidForm, showServerError } from "@/components/admin/form-errors";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, Input, Select, Textarea } from "@/components/forms/primitives";
import ImageUploadField from "@/components/admin/ImageUploadField";
import GalleryUploadField from "@/components/admin/GalleryUploadField";
import { addYears, EARLIEST_CONTENT_DATE, todayInDhaka } from "@/lib/validation/dates";
import { eventSchema, type EventFormValues } from "@/lib/validation/event";

const emptyValues: EventFormValues = {
  slug: "",
  title: "",
  status: "upcoming",
  date: todayInDhaka(),
  time: "",
  venue: "",
  bannerImage: "",
  bannerImageAlt: "",
  description: "",
  gallery: [],
  galleryAlts: [],
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
  // Stays true after a successful save so the button can't be clicked again
  // while the page navigates away (prevents duplicate records).
  const [saved, setSaved] = useState(false);

  const {
    setError,
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: defaultValues ?? emptyValues,
  });
  const eventStatus = useWatch({ control, name: "status" });
  const today = todayInDhaka();

  useUnsavedChangesGuard(isDirty && !saved);

  const onSubmit = async (data: EventFormValues) => {
    setStatus(null);
    const result = await adminRequest(mode === "create" ? "/api/admin/events" : `/api/admin/events/${eventId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      json: data,
    });
    if (!result.ok) return showServerError(result, setError, setStatus);
    setSaved(true);
    toast.success(mode === "create" ? "Event created" : "Changes saved", { href: `/events/${data.slug}`, linkLabel: "View on site" });
    router.push("/admin/events");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalidForm(setStatus))} noValidate className="space-y-8">
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
          <Input
            id="e-date"
            type="date"
            // The date picker only offers dates that match the chosen status.
            min={eventStatus === "upcoming" ? today : EARLIEST_CONTENT_DATE}
            max={eventStatus === "upcoming" ? addYears(today, 3) : today}
            {...register("date")}
          />
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
            alt={{
              id: "e-banner-alt",
              registration: register("bannerImageAlt"),
              error: errors.bannerImageAlt?.message,
              required: true,
              placeholder: "e.g. Students visiting university stalls at the expo",
            }}
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
          <Controller
            control={control}
            name="galleryAlts"
            render={({ field: altsField }) => (
              <GalleryUploadField
                label="Photo Gallery (for previous events)"
                value={field.value}
                onChange={field.onChange}
                alts={altsField.value}
                onAltsChange={altsField.onChange}
                altError={errors.galleryAlts?.message ?? errors.galleryAlts?.root?.message}
              />
            )}
          />
        )}
      />

      <EditorActionBar
        dirty={isDirty && !saved}
        busy={isSubmitting || saved}
        submitLabel={mode === "create" ? "Create Event" : "Save Changes"}
        error={status?.type === "error" ? status.message : null}
      />
    </form>
  );
}
