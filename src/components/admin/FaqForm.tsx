"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminRequest } from "@/lib/admin-fetch";
import { onInvalidForm, showServerError } from "@/components/admin/form-errors";
import { FormField, Input, Select, Textarea } from "@/components/forms/primitives";
import EditorActionBar from "@/components/admin/ui/EditorActionBar";
import SectionCard from "@/components/admin/ui/SectionCard";
import Toggle from "@/components/admin/ui/Toggle";
import { useUnsavedChangesGuard } from "@/components/admin/ui/useUnsavedChangesGuard";
import { toast } from "@/components/admin/ui/toast";
import { FAQ_CATEGORIES, faqSchema, type FaqFormValues } from "@/lib/validation/faq";

const emptyValues: FaqFormValues = { question: "", answer: "", category: "GENERAL", showOnServices: false, shown: true };

function SwitchRow({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-primary-900">{title}</p>
        <p className="text-xs text-neutral-500">{hint}</p>
      </div>
      {children}
    </div>
  );
}

/** Add / edit a question on the FAQs page. */
export default function FaqForm({ mode, faqId, defaultValues }: { mode: "create" | "edit"; faqId?: string; defaultValues?: FaqFormValues }) {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FaqFormValues>({ resolver: zodResolver(faqSchema), defaultValues: defaultValues ?? emptyValues });
  useUnsavedChangesGuard(isDirty && !saved);

  const onSubmit = async (data: FaqFormValues) => {
    setStatus(null);
    const result = await adminRequest(mode === "create" ? "/api/admin/faqs" : `/api/admin/faqs/${faqId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      json: data,
    });
    if (!result.ok) return showServerError(result, setError, setStatus);
    setSaved(true);
    toast.success(mode === "create" ? "Question added" : "Changes saved", { href: "/faqs", linkLabel: "View on site" });
    router.push("/admin/faqs");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalidForm(setStatus))} noValidate className="space-y-5">
      <SectionCard title="Question and answer">
        <FormField id="fq-question" label="Question" required error={errors.question?.message}>
          <Input id="fq-question" aria-invalid={!!errors.question} {...register("question")} />
        </FormField>
        <FormField id="fq-answer" label="Answer" required error={errors.answer?.message}>
          <Textarea id="fq-answer" rows={6} aria-invalid={!!errors.answer} {...register("answer")} />
        </FormField>
        <FormField id="fq-category" label="Category" required error={errors.category?.message}>
          <Select id="fq-category" {...register("category")}>
            {FAQ_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
          <p className="mt-1 text-xs text-neutral-500">Visitors can filter the FAQs page by category.</p>
        </FormField>
      </SectionCard>

      <SectionCard title="Where it appears">
        <Controller
          control={control}
          name="shown"
          render={({ field }) => (
            <SwitchRow title="Show on the FAQs page" hint="Hidden questions stay here for later.">
              <Toggle checked={field.value} onChange={field.onChange} label="Show this question on the FAQs page" onLabel="Shown" offLabel="Hidden" />
            </SwitchRow>
          )}
        />
        <Controller
          control={control}
          name="showOnServices"
          render={({ field }) => (
            <SwitchRow title="Also show on the Services page" hint="Listed under “Common Questions About Our Services”.">
              <Toggle checked={field.value} onChange={field.onChange} label="Also show this question on the Services page" onLabel="Yes" offLabel="No" />
            </SwitchRow>
          )}
        />
      </SectionCard>

      <EditorActionBar
        dirty={isDirty && !saved}
        busy={isSubmitting || saved}
        submitLabel={mode === "create" ? "Add Question" : "Save Changes"}
        error={status?.type === "error" ? status.message : null}
      />
    </form>
  );
}
