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
import { FormField, Input, Textarea } from "@/components/forms/primitives";
import RepeatableFieldList from "@/components/admin/RepeatableFieldList";
import ObjectFieldArray from "@/components/admin/ObjectFieldArray";
import CourseSlugPicker from "@/components/admin/CourseSlugPicker";
import { ieltsContentSchema, type IeltsContentFormValues } from "@/lib/validation/ielts";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details open className="rounded-xl border border-neutral-200 bg-white p-6">
      <summary className="cursor-pointer font-heading text-lg font-bold text-primary-900">{title}</summary>
      <div className="mt-5 space-y-5">{children}</div>
    </details>
  );
}

export default function IeltsContentForm({
  defaultValues,
  courses,
}: {
  defaultValues: IeltsContentFormValues;
  courses: { slug: string; title: string }[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    setError,
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<IeltsContentFormValues>({
    resolver: zodResolver(ieltsContentSchema),
    defaultValues,
  });

  useUnsavedChangesGuard(isDirty);

  const onSubmit = async (data: IeltsContentFormValues) => {
    setStatus(null);
    const result = await adminRequest("/api/admin/ielts", { method: "PATCH", json: data });
    if (!result.ok) return showServerError(result, setError, setStatus);
    reset(data); // saved: nothing unsaved any more
    toast.success("IELTS content saved", { href: "/ielts", linkLabel: "View on site" });
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalidForm(setStatus))} noValidate className="space-y-5">
      <Section title="What is IELTS?">
        <FormField id="wi-title" label="Title" required error={errors.whatIsIelts?.title?.message}>
          <Input id="wi-title" {...register("whatIsIelts.title")} />
        </FormField>
        <FormField id="wi-body" label="Body" required error={errors.whatIsIelts?.body?.message}>
          <Textarea id="wi-body" rows={4} {...register("whatIsIelts.body")} />
        </FormField>
        <Controller
          control={control}
          name="whatIsIelts.points"
          render={({ field, fieldState }) => (
            <RepeatableFieldList label="Key Points" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
      </Section>

      <Section title="Why IELTS?">
        <FormField id="wy-title" label="Title" required error={errors.whyIelts?.title?.message}>
          <Input id="wy-title" {...register("whyIelts.title")} />
        </FormField>
        <FormField id="wy-body" label="Body" required error={errors.whyIelts?.body?.message}>
          <Textarea id="wy-body" rows={4} {...register("whyIelts.body")} />
        </FormField>
        <Controller
          control={control}
          name="whyIelts.reasons"
          render={({ field, fieldState }) => (
            <ObjectFieldArray
              label="Reasons"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              emptyItem={{ title: "", description: "" }}
              renderRow={(item, update) => (
                <div className="space-y-2">
                  <Input placeholder="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
                  <Textarea
                    placeholder="Description"
                    rows={2}
                    value={item.description}
                    onChange={(e) => update({ description: e.target.value })}
                  />
                </div>
              )}
            />
          )}
        />
      </Section>

      <Section title="Why Choose GlobalEd?">
        <FormField id="wg-title" label="Title" required error={errors.whyGlobaled?.title?.message}>
          <Input id="wg-title" {...register("whyGlobaled.title")} />
        </FormField>
        <FormField id="wg-body" label="Body" required error={errors.whyGlobaled?.body?.message}>
          <Textarea id="wg-body" rows={4} {...register("whyGlobaled.body")} />
        </FormField>
        <Controller
          control={control}
          name="whyGlobaled.usps"
          render={({ field, fieldState }) => (
            <ObjectFieldArray
              label="USPs"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              emptyItem={{ title: "", description: "" }}
              renderRow={(item, update) => (
                <div className="space-y-2">
                  <Input placeholder="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
                  <Textarea
                    placeholder="Description"
                    rows={2}
                    value={item.description}
                    onChange={(e) => update({ description: e.target.value })}
                  />
                </div>
              )}
            />
          )}
        />
        <Controller
          control={control}
          name="whyGlobaled.freeServices"
          render={({ field, fieldState }) => (
            <ObjectFieldArray
              label="Free Services"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              emptyItem={{ title: "", description: "", points: [], ctaLabel: "" }}
              renderRow={(item, update) => (
                <div className="space-y-3">
                  <Input placeholder="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
                  <Textarea
                    placeholder="Description"
                    rows={2}
                    value={item.description}
                    onChange={(e) => update({ description: e.target.value })}
                  />
                  <RepeatableFieldList
                    label="Included Points"
                    value={item.points}
                    onChange={(points) => update({ points })}
                  />
                  <Input
                    placeholder="Button label (e.g. Book Your Free Assessment)"
                    value={item.ctaLabel}
                    onChange={(e) => update({ ctaLabel: e.target.value })}
                  />
                </div>
              )}
            />
          )}
        />
      </Section>

      <Section title="IELTS Preparation Program">
        <FormField id="pr-title" label="Title" required error={errors.preparation?.title?.message}>
          <Input id="pr-title" {...register("preparation.title")} />
        </FormField>
        <FormField id="pr-body" label="Body" required error={errors.preparation?.body?.message}>
          <Textarea id="pr-body" rows={4} {...register("preparation.body")} />
        </FormField>
        <Controller
          control={control}
          name="preparation.skillAreas"
          render={({ field, fieldState }) => (
            <ObjectFieldArray
              label="Skill Areas"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              emptyItem={{ skill: "", points: [] }}
              renderRow={(item, update) => (
                <div className="space-y-3">
                  <Input placeholder="Skill (e.g. Listening)" value={item.skill} onChange={(e) => update({ skill: e.target.value })} />
                  <RepeatableFieldList label="Points" value={item.points} onChange={(points) => update({ points })} />
                </div>
              )}
            />
          )}
        />
        <Controller
          control={control}
          name="preparation.courseSlugs"
          render={({ field }) => (
            <CourseSlugPicker
              label="Linked Preparation Courses"
              value={field.value}
              onChange={field.onChange}
              courses={courses}
            />
          )}
        />
      </Section>

      <Section title="IELTS Progress Tracker">
        <FormField id="pt-title" label="Title" required error={errors.progressTracker?.title?.message}>
          <Input id="pt-title" {...register("progressTracker.title")} />
        </FormField>
        <FormField id="pt-body" label="Body" required error={errors.progressTracker?.body?.message}>
          <Textarea id="pt-body" rows={4} {...register("progressTracker.body")} />
        </FormField>
        <Controller
          control={control}
          name="progressTracker.trackItems"
          render={({ field, fieldState }) => (
            <RepeatableFieldList label="What We Track" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <Controller
          control={control}
          name="progressTracker.benefits"
          render={({ field, fieldState }) => (
            <RepeatableFieldList label="Benefits" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
      </Section>

      <Section title="Student Success Stories">
        <FormField id="ss-title" label="Title" required error={errors.successStories?.title?.message}>
          <Input id="ss-title" {...register("successStories.title")} />
        </FormField>
        <FormField id="ss-body" label="Body" required error={errors.successStories?.body?.message}>
          <Textarea id="ss-body" rows={4} {...register("successStories.body")} />
        </FormField>
        <Controller
          control={control}
          name="successStories.achievements"
          render={({ field, fieldState }) => (
            <ObjectFieldArray
              label="Achievements"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              emptyItem={{ band: "", outcome: "" }}
              renderRow={(item, update) => (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input placeholder="Band (e.g. 8.5)" value={item.band} onChange={(e) => update({ band: e.target.value })} />
                  <Input placeholder="Outcome" value={item.outcome} onChange={(e) => update({ outcome: e.target.value })} />
                </div>
              )}
            />
          )}
        />
        <Controller
          control={control}
          name="successStories.quotes"
          render={({ field, fieldState }) => (
            <RepeatableFieldList label="Student Quotes" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
      </Section>

      <EditorActionBar
        dirty={isDirty}
        busy={isSubmitting}
        submitLabel={"Save IELTS Content"}
        error={status?.type === "error" ? status.message : null}
      />
    </form>
  );
}
