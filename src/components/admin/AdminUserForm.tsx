"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { FormField, FormStatus, Input, SubmitButton } from "@/components/forms/primitives";
import {
  createAdminUserSchema,
  updateAdminUserSchema,
  adminPermissionValues,
  type CreateAdminUserFormValues,
} from "@/lib/validation/admin-user";

const permissionLabels: Record<(typeof adminPermissionValues)[number], string> = {
  DESTINATIONS: "Destinations",
  COURSES: "Courses",
  BLOGS: "Blogs",
  EVENTS: "Events",
  IELTS: "IELTS Content",
  LEADS: "Leads",
  TESTIMONIALS: "Reviews",
};

const emptyValues: CreateAdminUserFormValues = {
  name: "",
  email: "",
  permissions: [],
  password: "",
};

export default function AdminUserForm({
  mode,
  adminId,
  isMasterAccount = false,
  defaultValues,
}: {
  mode: "create" | "edit";
  adminId?: string;
  /** True when editing the one master admin's own account — permissions are moot for it. */
  isMasterAccount?: boolean;
  defaultValues?: CreateAdminUserFormValues;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminUserFormValues>({
    resolver: zodResolver(mode === "create" ? createAdminUserSchema : updateAdminUserSchema),
    defaultValues: defaultValues ?? emptyValues,
  });

  const onSubmit = async (data: CreateAdminUserFormValues) => {
    setStatus(null);
    try {
      const url = mode === "create" ? "/api/admin/admins" : `/api/admin/admins/${adminId}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong");
      }
      router.push("/admin/admins");
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {isMasterAccount && (
        <p className="rounded-lg bg-primary-50 px-4 py-3 text-sm text-primary-700">
          This is the master admin account. It has full access to everything and only it can edit itself.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="a-name" label="Full Name" required error={errors.name?.message}>
          <Input id="a-name" {...register("name")} />
        </FormField>
        <FormField id="a-email" label="Email Address" required error={errors.email?.message}>
          <Input id="a-email" type="email" {...register("email")} />
        </FormField>
      </div>

      <FormField
        id="a-password"
        label={mode === "create" ? "Password" : "New Password"}
        required={mode === "create"}
        error={errors.password?.message}
      >
        <Input
          id="a-password"
          type="password"
          placeholder={mode === "edit" ? "Leave blank to keep current password" : undefined}
          {...register("password")}
        />
      </FormField>

      {!isMasterAccount && (
        <Controller
          control={control}
          name="permissions"
          render={({ field }) => (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary-900">
                Content Permissions
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {adminPermissionValues.map((perm) => (
                  <label key={perm} className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300 accent-primary-700"
                      checked={field.value.includes(perm)}
                      onChange={(e) => {
                        field.onChange(
                          e.target.checked
                            ? [...field.value, perm]
                            : field.value.filter((p) => p !== perm),
                        );
                      }}
                    />
                    {permissionLabels[perm]}
                  </label>
                ))}
              </div>
              {errors.permissions && (
                <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.permissions.message}
                </p>
              )}
            </div>
          )}
        />
      )}

      <SubmitButton loading={isSubmitting}>
        <Save size={18} aria-hidden />
        {mode === "create" ? "Create Admin" : "Save Changes"}
      </SubmitButton>

      <FormStatus status={status?.type ?? null} message={status?.message} />
    </form>
  );
}
