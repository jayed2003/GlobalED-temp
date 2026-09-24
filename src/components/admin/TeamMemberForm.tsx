"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminRequest } from "@/lib/admin-fetch";
import { onInvalidForm, showServerError } from "@/components/admin/form-errors";
import { FormField, Input, Select, Textarea } from "@/components/forms/primitives";
import ImageUploadField from "@/components/admin/ImageUploadField";
import EditorActionBar from "@/components/admin/ui/EditorActionBar";
import SectionCard from "@/components/admin/ui/SectionCard";
import Toggle from "@/components/admin/ui/Toggle";
import { useUnsavedChangesGuard } from "@/components/admin/ui/useUnsavedChangesGuard";
import { toast } from "@/components/admin/ui/toast";
import { teamMemberSchema, type TeamMemberFormValues } from "@/lib/validation/team";

const emptyValues: TeamMemberFormValues = { name: "", role: "", photo: "", photoAlt: "", bio: "", group: "TEAM", shown: true };

/** Add / edit a person on the Our Team page. */
export default function TeamMemberForm({
  mode,
  memberId,
  defaultValues,
}: {
  mode: "create" | "edit";
  memberId?: string;
  defaultValues?: TeamMemberFormValues;
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
  } = useForm<TeamMemberFormValues>({ resolver: zodResolver(teamMemberSchema), defaultValues: defaultValues ?? emptyValues });
  useUnsavedChangesGuard(isDirty && !saved);

  const onSubmit = async (data: TeamMemberFormValues) => {
    setStatus(null);
    const result = await adminRequest(mode === "create" ? "/api/admin/team" : `/api/admin/team/${memberId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      json: data,
    });
    if (!result.ok) return showServerError(result, setError, setStatus);
    setSaved(true);
    toast.success(mode === "create" ? "Person added" : "Changes saved", { href: "/about/our-team", linkLabel: "View on site" });
    router.push("/admin/team");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalidForm(setStatus))} noValidate className="space-y-5">
      <SectionCard title="Person">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="tm-name" label="Name" required error={errors.name?.message}>
            <Input id="tm-name" aria-invalid={!!errors.name} {...register("name")} />
          </FormField>
          <FormField id="tm-role" label="Role" required error={errors.role?.message}>
            <Input id="tm-role" placeholder="e.g. Head of Counselling" aria-invalid={!!errors.role} {...register("role")} />
          </FormField>
        </div>
        <FormField id="tm-group" label="Shown under" required error={errors.group?.message}>
          <Select id="tm-group" {...register("group")}>
            <option value="TEAM">Team — “Meet the People Behind Your Success”</option>
            <option value="BOARD">Board of Directors</option>
          </Select>
        </FormField>
        <Controller
          control={control}
          name="photo"
          render={({ field }) => (
            <ImageUploadField
              label="Photo"
              value={field.value}
              onChange={field.onChange}
              error={errors.photo?.message}
              alt={{
                id: "tm-photo-alt",
                registration: register("photoAlt"),
                error: errors.photoAlt?.message,
                required: true,
                placeholder: "e.g. Sarah Ahmed, Head of Counselling at GlobalEd",
              }}
            />
          )}
        />
        <p className="-mt-2 text-xs text-neutral-500">Shown square — a head-and-shoulders photo works best.</p>
        <FormField id="tm-bio" label="Short bio" error={errors.bio?.message}>
          <Textarea id="tm-bio" rows={2} aria-invalid={!!errors.bio} {...register("bio")} />
          <p className="mt-1 text-xs text-neutral-500">Optional, one line under the role.</p>
        </FormField>
        <Controller
          control={control}
          name="shown"
          render={({ field }) => (
            <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-primary-900">Show on the Our Team page</p>
                <p className="text-xs text-neutral-500">Hidden people stay here for later.</p>
              </div>
              <Toggle checked={field.value} onChange={field.onChange} label="Show this person on the Our Team page" onLabel="Shown" offLabel="Hidden" />
            </div>
          )}
        />
      </SectionCard>

      <EditorActionBar
        dirty={isDirty && !saved}
        busy={isSubmitting || saved}
        submitLabel={mode === "create" ? "Add Person" : "Save Changes"}
        error={status?.type === "error" ? status.message : null}
      />
    </form>
  );
}
