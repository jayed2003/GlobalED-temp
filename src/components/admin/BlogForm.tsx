"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-fetch";
import { onInvalidForm, showServerError } from "@/components/admin/form-errors";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { FormField, FormStatus, Input, Select, SubmitButton, Textarea } from "@/components/forms/primitives";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { blogSchema, type BlogFormValues } from "@/lib/validation/blog";
import { EARLIEST_CONTENT_DATE, todayInDhaka } from "@/lib/validation/dates";

const emptyValues: BlogFormValues = {
  slug: "",
  title: "",
  category: "country-wise",
  coverImage: "",
  excerpt: "",
  content: "",
  author: "",
  publishedAt: todayInDhaka(),
  featured: false,
};

export default function BlogForm({
  mode,
  postId,
  defaultValues,
}: {
  mode: "create" | "edit";
  postId?: string;
  defaultValues?: BlogFormValues;
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
    formState: { errors, isSubmitting },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: defaultValues ?? emptyValues,
  });

  const onSubmit = async (data: BlogFormValues) => {
    setStatus(null);
    const result = await adminRequest(mode === "create" ? "/api/admin/blogs" : `/api/admin/blogs/${postId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      json: data,
    });
    if (!result.ok) return showServerError(result, setError, setStatus);
    setSaved(true);
    router.push("/admin/blogs");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalidForm(setStatus))} noValidate className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="b-slug" label="Slug" required error={errors.slug?.message}>
          <Input id="b-slug" placeholder="study-in-uk-guide" {...register("slug")} />
        </FormField>
        <FormField id="b-title" label="Title" required error={errors.title?.message}>
          <Input id="b-title" {...register("title")} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField id="b-category" label="Category" required error={errors.category?.message}>
          <Select id="b-category" {...register("category")}>
            <option value="country-wise">Country-wise</option>
            <option value="scholarships">Scholarships</option>
            <option value="ielts">IELTS</option>
            <option value="english">English</option>
          </Select>
        </FormField>
        <FormField id="b-author" label="Author" required error={errors.author?.message}>
          <Input id="b-author" {...register("author")} />
        </FormField>
        <FormField id="b-date" label="Published Date" required error={errors.publishedAt?.message}>
          <Input id="b-date" type="date" min={EARLIEST_CONTENT_DATE} max={todayInDhaka()} {...register("publishedAt")} />
        </FormField>
      </div>

      <Controller
        control={control}
        name="coverImage"
        render={({ field }) => (
          <ImageUploadField
            label="Cover Image"
            value={field.value}
            onChange={field.onChange}
            error={errors.coverImage?.message}
          />
        )}
      />

      <FormField id="b-excerpt" label="Excerpt" required error={errors.excerpt?.message}>
        <Textarea id="b-excerpt" rows={3} {...register("excerpt")} />
      </FormField>

      <FormField id="b-content" label="Content" required error={errors.content?.message}>
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <RichTextEditor
              id="b-content"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              invalid={!!errors.content}
            />
          )}
        />
      </FormField>

      <label className="flex items-center gap-2.5 text-sm text-neutral-700">
        <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 accent-primary-700" {...register("featured")} />
        Feature this post
      </label>

      <SubmitButton loading={isSubmitting || saved}>
        <Save size={18} aria-hidden />
        {mode === "create" ? "Create Post" : "Save Changes"}
      </SubmitButton>

      <FormStatus status={status?.type ?? null} message={status?.message} />
    </form>
  );
}
