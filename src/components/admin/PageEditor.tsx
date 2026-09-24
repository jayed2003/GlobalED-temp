"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Controller,
  get,
  useForm,
  useWatch,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Resolver,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Loader2, RotateCcw, Save, Send } from "lucide-react";
import { adminRequest } from "@/lib/admin-fetch";
import { firstMessage, onInvalidForm } from "@/components/admin/form-errors";
import { FormField, Input, Textarea } from "@/components/forms/primitives";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RepeatableFieldList from "@/components/admin/RepeatableFieldList";
import ObjectFieldArray from "@/components/admin/ObjectFieldArray";
import SeoFields from "@/components/admin/SeoFields";
import EditorActionBar from "@/components/admin/ui/EditorActionBar";
import IconPicker from "@/components/admin/ui/IconPicker";
import SectionCard from "@/components/admin/ui/SectionCard";
import { adminButton } from "@/components/admin/ui/buttons";
import { toast } from "@/components/admin/ui/toast";
import { useUnsavedChangesGuard } from "@/components/admin/ui/useUnsavedChangesGuard";
import { pageDef, type PageKey } from "@/lib/pages";
import type { Field, LeafField } from "@/lib/pages/fields";

type Values = FieldValues;

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-neutral-500">{children}</p>;
}

const idFor = (path: string) => `pg-${path.replace(/\./g, "-")}`;
const errorAt = (errors: FieldErrors, path: string) => firstMessage(get(errors, path));

/**
 * Editor for any page in src/lib/pages/defs.ts: one card per section (with
 * a Shown / Hidden switch where the section can be hidden), a Search &
 * sharing card, and Save draft / Preview / Publish.
 */
export default function PageEditor({
  pageKey,
  published,
  draft,
  siteUrl,
}: {
  pageKey: PageKey;
  published: Values;
  draft: Values | null;
  siteUrl: string;
}) {
  const def = pageDef(pageKey);
  const router = useRouter();
  const [hasDraft, setHasDraft] = useState(draft !== null);
  const [publishedValues, setPublishedValues] = useState(published);
  const [busy, setBusy] = useState<null | "draft" | "publish" | "discard">(null);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError: setFieldError,
    formState: { errors, isDirty },
  } = useForm<Values>({
    resolver: zodResolver(def.schema as never) as unknown as Resolver<Values>,
    defaultValues: draft ?? published,
  });

  useUnsavedChangesGuard(isDirty);
  const previewHref = `/api/admin/preview?path=${encodeURIComponent(def.path)}`;

  /** Validate, then save as a draft or publish. Resolves true when saved. */
  const save = (action: "draft" | "publish") =>
    new Promise<boolean>((resolve) => {
      void handleSubmit(
        async (data) => {
          setBusy(action);
          setError(null);
          const result = await adminRequest(`/api/admin/pages/${pageKey}`, { json: { action, content: data } });
          setBusy(null);
          if (!result.ok) {
            if (result.field) setFieldError(result.field, { type: "server", message: result.message });
            setError(result.message);
            return resolve(false);
          }
          reset(data);
          if (action === "draft") {
            setHasDraft(true);
            toast.success("Draft saved — visitors still see the published page", { href: previewHref, linkLabel: "Preview" });
          } else {
            setHasDraft(false);
            setPublishedValues(data);
            toast.success("Published", { href: def.path, linkLabel: "View on site" });
          }
          router.refresh();
          resolve(true);
        },
        (errs) => {
          onInvalidForm((s) => setError(s?.message ?? null))(errs);
          resolve(false);
        },
      )();
    });

  const saveDraft = () => void save("draft");

  const preview = async () => {
    // Open the tab now (inside the click) so pop-up blockers allow it, then point it at the preview.
    const tab = window.open("about:blank", "_blank");
    if (await save("draft")) {
      if (tab) tab.location.href = previewHref;
      else window.open(previewHref, "_self");
    } else {
      tab?.close();
    }
  };

  const discard = async () => {
    if (!window.confirm("Discard the draft? The page goes back to what's published now.")) return;
    setBusy("discard");
    const result = await adminRequest(`/api/admin/pages/${pageKey}`, { json: { action: "discard" } });
    setBusy(null);
    if (!result.ok) return setError(result.message);
    reset(publishedValues);
    setHasDraft(false);
    setError(null);
    toast.success("Draft discarded");
    router.refresh();
  };

  const [heroTitle, heroDescription, seoTitle, seoDescription] = useWatch({
    control,
    name: ["hero.title", "hero.description", "seo.title", "seo.description"],
  }) as (string | undefined)[];

  return (
    <form onSubmit={handleSubmit(() => void save("publish"))} noValidate className="space-y-5">
      {Object.entries(def.sections).map(([key, section]) => {
        const body =
          Object.keys(section.fields).length === 0 ? (
            <p className="text-sm text-neutral-500">Nothing else to edit here.</p>
          ) : (
            Object.entries(section.fields).map(([name, f]) => (
              <FieldControl key={name} path={`${key}.${name}`} field={f} control={control} register={register} errors={errors} />
            ))
          );
        return section.toggle ? (
          <Controller
            key={key}
            control={control}
            name={`${key}.shown`}
            render={({ field }) => (
              <SectionCard
                title={section.title}
                description={section.description}
                visibility={{ shown: field.value !== false, onChange: field.onChange }}
              >
                {body}
              </SectionCard>
            )}
          />
        ) : (
          <SectionCard key={key} title={section.title} description={section.description}>
            {body}
          </SectionCard>
        );
      })}

      <SectionCard title="Search & sharing" description="How this page looks in Google and when it's shared. Empty fields use the page's title and intro.">
        <Controller
          control={control}
          name="seo.ogImage"
          render={({ field }) => (
            <SeoFields
              idPrefix="pg-seo"
              siteUrl={siteUrl}
              path={def.path}
              title={{
                registration: register("seo.title"),
                value: seoTitle ?? "",
                fallback: `${heroTitle || def.title} | GlobalEd`,
                fallbackNote: "using the page title",
                error: errorAt(errors, "seo.title"),
              }}
              description={{
                registration: register("seo.description"),
                value: seoDescription ?? "",
                fallback: heroDescription ?? "",
                fallbackNote: "using the page intro",
                error: errorAt(errors, "seo.description"),
              }}
              ogImage={{
                value: field.value ?? "",
                onChange: field.onChange,
                error: errorAt(errors, "seo.ogImage"),
                fallbackImage: "",
                alt: { registration: register("seo.ogImageAlt"), error: errorAt(errors, "seo.ogImageAlt") },
              }}
            />
          )}
        />
      </SectionCard>

      <EditorActionBar
        dirty={isDirty}
        busy={busy !== null}
        busyLabel={busy === "publish" ? "Publishing…" : "Saving…"}
        submitLabel="Publish"
        submitIcon={<Send size={16} aria-hidden />}
        error={error}
        onShortcut={saveDraft}
      >
        {hasDraft && (
          <button type="button" onClick={discard} disabled={busy !== null} className={adminButton("ghost")}>
            <RotateCcw size={16} aria-hidden /> Discard draft
          </button>
        )}
        <button type="button" onClick={preview} disabled={busy !== null} className={adminButton("secondary")}>
          <Eye size={16} aria-hidden /> Preview
        </button>
        <button type="button" onClick={saveDraft} disabled={busy !== null} title="Save draft (Ctrl+S)" className={adminButton("secondary")}>
          {busy === "draft" ? <Loader2 size={16} aria-hidden className="animate-spin" /> : <Save size={16} aria-hidden />}
          Save draft
        </button>
      </EditorActionBar>
    </form>
  );
}

// ---------------------------------------------------------------------------

function FieldControl({
  path,
  field,
  control,
  register,
  errors,
}: {
  path: string;
  field: Field;
  control: Control<Values>;
  register: UseFormRegister<Values>;
  errors: FieldErrors<Values>;
}) {
  const id = idFor(path);
  switch (field.kind) {
    case "text":
    case "textarea":
      return (
        <FormField id={id} label={field.label} required={field.required} error={errorAt(errors, path)}>
          {field.kind === "text" ? (
            <Input id={id} placeholder={field.placeholder} aria-invalid={!!get(errors, path)} {...register(path)} />
          ) : (
            <Textarea id={id} rows={field.rows} aria-invalid={!!get(errors, path)} {...register(path)} />
          )}
          {field.hint && <Hint>{field.hint}</Hint>}
        </FormField>
      );

    case "image":
      return (
        <Controller
          control={control}
          name={`${path}.src`}
          render={({ field: f }) => (
            <div>
              <ImageUploadField
                label={field.label}
                large={field.large}
                value={f.value ?? ""}
                onChange={f.onChange}
                error={errorAt(errors, `${path}.src`)}
                alt={{ id: `${id}-alt`, registration: register(`${path}.alt`), error: errorAt(errors, `${path}.alt`), required: field.required }}
              />
              {!field.required && f.value && (
                <button type="button" onClick={() => f.onChange("")} className="mt-2 text-xs font-semibold text-red-600 hover:underline">
                  Remove image
                </button>
              )}
              {field.hint && <Hint>{field.hint}</Hint>}
            </div>
          )}
        />
      );

    case "icon":
      return (
        <Controller
          control={control}
          name={path}
          render={({ field: f }) => (
            <div>
              <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-primary-900">
                {field.label}
              </label>
              <IconPicker id={id} value={f.value ?? ""} onChange={f.onChange} invalid={!!get(errors, path)} />
              {errorAt(errors, path) && <p className="mt-1 text-xs font-medium text-red-600">{errorAt(errors, path)}</p>}
            </div>
          )}
        />
      );

    case "list":
      return (
        <Controller
          control={control}
          name={path}
          render={({ field: f }) => (
            <div>
              <RepeatableFieldList
                label={field.label}
                value={f.value ?? []}
                onChange={f.onChange}
                multiline={field.multiline}
                minItems={field.minItems}
                maxItems={field.maxItems}
                error={errorAt(errors, path)}
              />
              {field.hint && <Hint>{field.hint}</Hint>}
            </div>
          )}
        />
      );

    case "repeater":
      return (
        <Controller
          control={control}
          name={path}
          render={({ field: f }) => (
            <div>
              <ObjectFieldArray<Record<string, unknown>>
                label={field.label}
                value={f.value ?? []}
                onChange={f.onChange}
                minItems={field.minItems}
                maxItems={field.maxItems}
                emptyItem={emptyItem(field.fields)}
                error={firstMessage((get(errors, path) as { root?: unknown; message?: unknown } | undefined)?.root) ?? (get(errors, path) as { message?: string } | undefined)?.message}
                renderRow={(item, update, index) => (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(field.fields).map(([name, sub]) => (
                      <RowField
                        key={name}
                        id={`${idFor(path)}-${index}-${name}`}
                        field={sub}
                        value={item[name]}
                        onChange={(v) => update({ [name]: v })}
                        error={(suffix = "") => errorAt(errors, `${path}.${index}.${name}${suffix}`)}
                      />
                    ))}
                  </div>
                )}
              />
              {field.hint && <Hint>{field.hint}</Hint>}
            </div>
          )}
        />
      );
  }
}

function emptyItem(fields: Record<string, LeafField>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(fields).map(([name, f]) => [
      name,
      f.kind === "image" ? { src: "", alt: "" } : f.kind === "icon" ? "GraduationCap" : "",
    ]),
  );
}

/** One field inside a repeater row (controlled, since the row is one value). */
function RowField({
  id,
  field,
  value,
  onChange,
  error,
}: {
  id: string;
  field: LeafField;
  value: unknown;
  onChange: (value: unknown) => void;
  error: (suffix?: string) => string | undefined;
}) {
  const wide = field.kind === "textarea" || field.kind === "image";
  const box = (children: React.ReactNode) => <div className={wide ? "sm:col-span-2" : undefined}>{children}</div>;

  switch (field.kind) {
    case "text":
    case "textarea":
      return box(
        <FormField id={id} label={field.label} required={field.required} error={error()}>
          {field.kind === "text" ? (
            <Input id={id} value={String(value ?? "")} placeholder={field.placeholder} aria-invalid={!!error()} onChange={(e) => onChange(e.target.value)} />
          ) : (
            <Textarea id={id} rows={field.rows} value={String(value ?? "")} aria-invalid={!!error()} onChange={(e) => onChange(e.target.value)} />
          )}
        </FormField>,
      );
    case "icon":
      return box(
        <div>
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-primary-900">
            {field.label}
          </label>
          <IconPicker id={id} value={String(value ?? "")} onChange={onChange} invalid={!!error()} />
          {error() && <p className="mt-1 text-xs font-medium text-red-600">{error()}</p>}
        </div>,
      );
    case "image": {
      const img = (value as { src: string; alt: string } | undefined) ?? { src: "", alt: "" };
      return box(
        <div>
          <ImageUploadField
            label={field.label}
            value={img.src}
            onChange={(src) => onChange({ ...img, src })}
            error={error(".src")}
            alt={{ id: `${id}-alt`, value: img.alt, onChange: (alt) => onChange({ ...img, alt }), error: error(".alt"), required: field.required }}
          />
          {!field.required && img.src && (
            <button type="button" onClick={() => onChange({ src: "", alt: "" })} className="mt-2 text-xs font-semibold text-red-600 hover:underline">
              Remove image
            </button>
          )}
        </div>,
      );
    }
  }
}
