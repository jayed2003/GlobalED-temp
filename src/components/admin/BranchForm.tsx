"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminRequest } from "@/lib/admin-fetch";
import { onInvalidForm, showServerError } from "@/components/admin/form-errors";
import { FormField, Input, Textarea } from "@/components/forms/primitives";
import RepeatableFieldList from "@/components/admin/RepeatableFieldList";
import EditorActionBar from "@/components/admin/ui/EditorActionBar";
import SectionCard from "@/components/admin/ui/SectionCard";
import Toggle from "@/components/admin/ui/Toggle";
import { useUnsavedChangesGuard } from "@/components/admin/ui/useUnsavedChangesGuard";
import { toast } from "@/components/admin/ui/toast";
import { branchSchema, extractMapSrc, isGoogleMapsEmbed, type BranchFormValues } from "@/lib/validation/branch";

const emptyValues: BranchFormValues = {
  name: "",
  address: "",
  phones: [""],
  email: "",
  hours: "Sat–Fri, 9:00 AM – 8:00 PM",
  mapEmbedUrl: "",
  shown: true,
};

/** Add / edit a branch (office). */
export default function BranchForm({
  mode,
  branchId,
  defaultValues,
}: {
  mode: "create" | "edit";
  branchId?: string;
  defaultValues?: BranchFormValues;
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
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: defaultValues ?? emptyValues,
  });

  useUnsavedChangesGuard(isDirty && !saved);
  const mapInput = useWatch({ control, name: "mapEmbedUrl" });
  const mapSrc = extractMapSrc(mapInput ?? "");
  const mapOk = mapSrc !== "" && isGoogleMapsEmbed(mapSrc);

  const onSubmit = async (data: BranchFormValues) => {
    setStatus(null);
    const result = await adminRequest(mode === "create" ? "/api/admin/branches" : `/api/admin/branches/${branchId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      json: data,
    });
    if (!result.ok) return showServerError(result, setError, setStatus);
    setSaved(true);
    toast.success(mode === "create" ? "Branch added" : "Changes saved", { href: "/contact", linkLabel: "View on site" });
    router.push("/admin/branches");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalidForm(setStatus))} noValidate className="space-y-5">
      <SectionCard title="Branch details" description="Shown on the contact page and in the footer, and offered in the booking form.">
        <FormField id="br-name" label="Branch name" required error={errors.name?.message}>
          <Input id="br-name" placeholder="e.g. Uttara" aria-invalid={!!errors.name} {...register("name")} />
          <p className="mt-1 text-xs text-neutral-500">
            Existing leads keep the name they were submitted with, so renaming a branch is safe.
          </p>
        </FormField>
        <FormField id="br-address" label="Address" required error={errors.address?.message}>
          <Textarea id="br-address" rows={2} aria-invalid={!!errors.address} {...register("address")} />
        </FormField>
        <Controller
          control={control}
          name="phones"
          render={({ field }) => (
            <RepeatableFieldList
              label="Phone numbers"
              value={field.value}
              onChange={field.onChange}
              placeholder="019555 44772"
              error={errors.phones?.message ?? errors.phones?.find?.((e) => e?.message)?.message}
            />
          )}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="br-email" label="Email" required error={errors.email?.message}>
            <Input id="br-email" type="email" aria-invalid={!!errors.email} {...register("email")} />
          </FormField>
          <FormField id="br-hours" label="Opening hours" required error={errors.hours?.message}>
            <Input id="br-hours" aria-invalid={!!errors.hours} {...register("hours")} />
          </FormField>
        </div>
        <Controller
          control={control}
          name="shown"
          render={({ field }) => (
            <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-primary-900">Show on the site</p>
                <p className="text-xs text-neutral-500">Hidden branches aren&apos;t listed or offered in the booking form.</p>
              </div>
              <Toggle checked={field.value} onChange={field.onChange} label="Show this branch on the site" onLabel="Shown" offLabel="Hidden" />
            </div>
          )}
        />
      </SectionCard>

      <SectionCard title="Map" description="Optional. A Google map shown on the contact page.">
        <FormField id="br-map" label="Google Maps embed code" error={errors.mapEmbedUrl?.message}>
          <Textarea
            id="br-map"
            rows={3}
            placeholder='<iframe src="https://www.google.com/maps/embed?pb=…"></iframe>'
            aria-invalid={!!errors.mapEmbedUrl}
            {...register("mapEmbedUrl")}
          />
          <p className="mt-1 text-xs text-neutral-500">
            In Google Maps, find the office → <strong>Share</strong> → <strong>Embed a map</strong> → <strong>Copy HTML</strong>, and paste it here.
          </p>
        </FormField>
        {mapOk ? (
          <iframe
            src={mapSrc}
            title="Map preview"
            loading="lazy"
            className="h-56 w-full rounded-lg border border-neutral-200"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          mapInput?.trim() && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              That doesn&apos;t look like a Google Maps embed yet — the preview appears once it does.
            </p>
          )
        )}
      </SectionCard>

      <EditorActionBar
        dirty={isDirty && !saved}
        busy={isSubmitting || saved}
        submitLabel={mode === "create" ? "Add Branch" : "Save Changes"}
        error={status?.type === "error" ? status.message : null}
      />
    </form>
  );
}
