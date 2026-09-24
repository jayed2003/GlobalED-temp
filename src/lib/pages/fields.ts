import { z } from "zod";
import { plainText } from "@/lib/validation/public-forms";
import { imageAlt } from "@/lib/validation/image-alt";
import { imageUrl, optionalImageUrl } from "@/lib/validation/image-url";
import { isSiteIcon } from "@/lib/icons";

/**
 * Building blocks for editable pages (see defs.ts). A page is a fixed layout
 * made of sections; each section has fields. Every field carries its own
 * validation (the Zod schema), what the editor shows (label, hint, limits)
 * and — through the schema — the type the public page reads. One definition
 * drives the admin form, the API validation and the site.
 *
 * All text is plain text (no HTML). Images are uploads of ours, with alt text.
 */

interface Common {
  label: string;
  /** Help line under the field. */
  hint?: string;
}

export interface TextField extends Common {
  kind: "text";
  max: number;
  required: boolean;
  placeholder?: string;
  schema: z.ZodType<string, string>;
}

export interface TextareaField extends Common {
  kind: "textarea";
  max: number;
  required: boolean;
  rows: number;
  schema: z.ZodType<string, string>;
}

export interface ImageField extends Common {
  kind: "image";
  required: boolean;
  /** Big 16:9 preview (hero images). */
  large: boolean;
  schema: z.ZodType<{ src: string; alt: string }, { src: string; alt: string }>;
}

export interface IconField extends Common {
  kind: "icon";
  schema: z.ZodType<string, string>;
}

/** A list of short texts (e.g. trust points, story paragraphs). */
export interface ListField extends Common {
  kind: "list";
  itemLabel: string;
  multiline: boolean;
  minItems: number;
  maxItems: number;
  schema: z.ZodType<string[], string[]>;
}

export type LeafField = TextField | TextareaField | ImageField | IconField;

/** A list of small records (e.g. steps: title + text + icon). */
export interface RepeaterField<F extends Record<string, LeafField> = Record<string, LeafField>> extends Common {
  kind: "repeater";
  itemLabel: string;
  fields: F;
  minItems: number;
  maxItems: number;
  schema: z.ZodType<FieldsValue<F>[], FieldsValue<F>[]>;
}

export type Field = LeafField | ListField | RepeaterField;

type ValueOf<T> = T extends { schema: z.ZodType<infer V> } ? V : never;
export type FieldsValue<F extends Record<string, Field>> = { [K in keyof F]: ValueOf<F[K]> };

function shapeOf(fields: Record<string, Field>) {
  return Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.schema]));
}

// ---------------------------------------------------------------------------
// Field helpers

type TextOptions = { label: string; max: number; required?: boolean; hint?: string; placeholder?: string };

export function text(o: TextOptions): TextField {
  const required = o.required ?? true;
  return {
    kind: "text",
    ...o,
    required,
    schema: plainText({ min: required ? 1 : 0, max: o.max, minMessage: `Enter the ${o.label.toLowerCase()}` }),
  };
}

export function textarea(o: TextOptions & { rows?: number }): TextareaField {
  const required = o.required ?? true;
  return {
    kind: "textarea",
    ...o,
    required,
    rows: o.rows ?? 3,
    schema: plainText({ min: required ? 1 : 0, max: o.max, minMessage: `Enter the ${o.label.toLowerCase()}` }),
  };
}

export function image(o: { label: string; hint?: string; required?: boolean; large?: boolean }): ImageField {
  const required = o.required ?? true;
  return {
    kind: "image",
    ...o,
    required,
    large: o.large ?? false,
    schema: z
      .object({
        src: required ? imageUrl(`Upload the ${o.label.toLowerCase()}`) : optionalImageUrl(),
        alt: imageAlt(false),
      })
      .superRefine((v, ctx) => {
        if (v.src && !v.alt.trim()) {
          ctx.addIssue({ code: "custom", path: ["alt"], message: "Describe the image (alt text) for visitors who can't see it" });
        }
      }),
  };
}

export function icon(o: { label: string; hint?: string }): IconField {
  return {
    kind: "icon",
    ...o,
    schema: z.string().refine(isSiteIcon, "Choose an icon"),
  };
}

export function list(o: {
  label: string;
  itemLabel: string;
  max: number;
  hint?: string;
  multiline?: boolean;
  minItems?: number;
  maxItems?: number;
}): ListField {
  const minItems = o.minItems ?? 1;
  const maxItems = o.maxItems ?? 12;
  return {
    kind: "list",
    label: o.label,
    hint: o.hint,
    itemLabel: o.itemLabel,
    multiline: o.multiline ?? false,
    minItems,
    maxItems,
    schema: z
      .array(plainText({ min: 1, max: o.max, minMessage: `Fill in or remove the empty ${o.itemLabel.toLowerCase()}` }))
      .min(minItems, `Add at least ${minItems} ${o.itemLabel.toLowerCase()}${minItems > 1 ? "s" : ""}`)
      .max(maxItems, `Up to ${maxItems} ${o.itemLabel.toLowerCase()}s`),
  };
}

export function repeater<const F extends Record<string, LeafField>>(o: {
  label: string;
  itemLabel: string;
  fields: F;
  hint?: string;
  minItems?: number;
  maxItems?: number;
}): RepeaterField<F> {
  const minItems = o.minItems ?? 1;
  const maxItems = o.maxItems ?? 12;
  return {
    kind: "repeater",
    ...o,
    minItems,
    maxItems,
    schema: z
      .array(z.object(shapeOf(o.fields)))
      .min(minItems, `Add at least ${minItems} ${o.itemLabel.toLowerCase()}${minItems > 1 ? "s" : ""}`)
      .max(maxItems, `Up to ${maxItems} ${o.itemLabel.toLowerCase()}s`) as unknown as z.ZodType<FieldsValue<F>[], FieldsValue<F>[]>,
  };
}

// ---------------------------------------------------------------------------
// Sections and pages

export interface Section<F extends Record<string, Field> = Record<string, Field>, T extends boolean = boolean> {
  title: string;
  description?: string;
  /** Has a "Shown / Hidden on site" switch (value in `shown`). */
  toggle: T;
  fields: F;
  schema: z.ZodType<SectionValue<F, T>, SectionValue<F, T>>;
}

export type SectionValue<F extends Record<string, Field>, T extends boolean> = FieldsValue<F> &
  (T extends true ? { shown: boolean } : unknown);

export function section<const F extends Record<string, Field>, const T extends boolean = false>(o: {
  title: string;
  description?: string;
  toggle?: T;
  fields: F;
}): Section<F, T> {
  const toggle = (o.toggle ?? false) as T;
  return {
    ...o,
    toggle,
    schema: z.object({ ...shapeOf(o.fields), ...(toggle ? { shown: z.boolean() } : {}) }) as unknown as z.ZodType<
      SectionValue<F, T>,
      SectionValue<F, T>
    >,
  };
}

/** SEO for a page: the full title shown in Google, description, and share image. */
export const seoSchema = z
  .object({
    title: plainText({ max: 70, maxMessage: "Keep the SEO title under 70 characters (search engines show about 60)" }),
    description: plainText({ max: 200, maxMessage: "Keep the meta description under 200 characters (search engines show about 156)" }),
    ogImage: optionalImageUrl().refine((url) => !/\.svg(\?|$)/i.test(url), "Social networks don't show SVG images — upload a JPG or WebP"),
    ogImageAlt: imageAlt(false),
  })
  .superRefine((v, ctx) => {
    if (v.ogImage && !v.ogImageAlt) {
      ctx.addIssue({ code: "custom", path: ["ogImageAlt"], message: "Describe the image (alt text) for visitors who can't see it" });
    }
  });
export type SeoValue = z.output<typeof seoSchema>;

export interface PageDef<S extends Record<string, Section> = Record<string, Section>> {
  key: string;
  /** Name in the admin list, e.g. "Home" or "About › Our Team". */
  title: string;
  /** Public path, e.g. "/about/our-team". */
  path: string;
  /** Admin list grouping. */
  group: "Home" | "About" | "Contact & booking" | "Listing pages" | "IELTS";
  /** One line in the admin list: what's editable here. */
  summary: string;
  sections: S;
  schema: z.ZodType<PageValue<S>, PageValue<S>>;
}

export type PageValue<S extends Record<string, Section>> = { [K in keyof S]: ValueOf<S[K]> } & { seo: SeoValue };

export function definePage<const S extends Record<string, Section>>(o: Omit<PageDef<S>, "schema">): PageDef<S> {
  const shape = Object.fromEntries(Object.entries(o.sections).map(([key, s]) => [key, s.schema]));
  return {
    ...o,
    schema: z.object({ ...shape, seo: seoSchema }) as unknown as z.ZodType<PageValue<S>, PageValue<S>>,
  };
}
