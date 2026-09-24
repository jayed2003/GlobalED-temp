"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminRequest } from "@/lib/admin-fetch";
import { onInvalidForm, showServerError } from "@/components/admin/form-errors";
import { FormField, Input, Textarea } from "@/components/forms/primitives";
import EditorActionBar from "@/components/admin/ui/EditorActionBar";
import SectionCard from "@/components/admin/ui/SectionCard";
import { useUnsavedChangesGuard } from "@/components/admin/ui/useUnsavedChangesGuard";
import { toast } from "@/components/admin/ui/toast";
import { siteSettingsSchema, type SiteSettingsFormValues } from "@/lib/validation/settings";

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-neutral-500">{children}</p>;
}

/** Admin → Settings → Site settings. */
export default function SiteSettingsForm({ defaultValues }: { defaultValues: SiteSettingsFormValues }) {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues,
  });

  useUnsavedChangesGuard(isDirty);

  const onSubmit = async (data: SiteSettingsFormValues) => {
    setStatus(null);
    const result = await adminRequest("/api/admin/settings", { method: "PATCH", json: data });
    if (!result.ok) return showServerError(result, setError, setStatus);
    reset(data);
    toast.success("Site settings saved", { href: "/", linkLabel: "View on site" });
    router.refresh();
  };

  const field = (name: keyof SiteSettingsFormValues, label: string, opts: { required?: boolean; placeholder?: string; hint?: string; type?: string } = {}) => (
    <FormField id={`s-${name}`} label={label} required={opts.required} error={errors[name]?.message}>
      <Input id={`s-${name}`} type={opts.type} placeholder={opts.placeholder} aria-invalid={!!errors[name]} {...register(name)} />
      {opts.hint && <Hint>{opts.hint}</Hint>}
    </FormField>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalidForm(setStatus))} noValidate className="space-y-5">
      <SectionCard title="Brand" description="The name and tagline used across the site and on the default social share image.">
        <div className="grid gap-5 sm:grid-cols-2">
          {field("brandName", "Brand name", { required: true })}
          {field("tagline", "Tagline", { required: true })}
        </div>
      </SectionCard>

      <SectionCard title="Contact" description="Shown in the top bar, the footer, the contact page and the WhatsApp button.">
        <div className="grid gap-5 sm:grid-cols-2">
          {field("phone", "Phone (hotline)", { required: true, placeholder: "019555 44772" })}
          {field("email", "Email", { required: true, type: "email", placeholder: "info@globaled.io" })}
          {field("whatsapp", "WhatsApp number", {
            required: true,
            placeholder: "8801955544772",
            hint: "With the country code (880…), no spaces or +. The WhatsApp buttons open a chat with this number.",
          })}
        </div>
      </SectionCard>

      <SectionCard title="Social media" description="Icons in the top bar and footer. Leave a link empty to hide that icon.">
        <div className="grid gap-5 sm:grid-cols-2">
          {field("facebookUrl", "Facebook", { placeholder: "https://facebook.com/…" })}
          {field("instagramUrl", "Instagram", { placeholder: "https://instagram.com/…" })}
          {field("linkedinUrl", "LinkedIn", { placeholder: "https://linkedin.com/company/…" })}
          {field("youtubeUrl", "YouTube", { placeholder: "https://youtube.com/@…" })}
        </div>
      </SectionCard>

      <SectionCard title="Key numbers" description="Shown on the home page, Our Success and the consultation page — e.g. 500+ or 90%.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {field("statStudentsPlaced", "Students placed", { required: true })}
          {field("statPartnerUniversities", "Partner universities", { required: true })}
          {field("statVisaSuccessRate", "Visa success rate", { required: true })}
          {field("statYearsOfExperience", "Years of experience", { required: true })}
        </div>
      </SectionCard>

      <SectionCard title="Footer" description="The short description under the logo in the footer.">
        <FormField id="s-footerBlurb" label="About text" error={errors.footerBlurb?.message}>
          <Textarea id="s-footerBlurb" rows={3} aria-invalid={!!errors.footerBlurb} {...register("footerBlurb")} />
        </FormField>
      </SectionCard>

      <SectionCard
        title="Call-to-action banner"
        description="The blue banner near the bottom of most pages. Its buttons (Get Started Free, WhatsApp Us) stay as designed."
      >
        {field("ctaTitle", "Title", { required: true })}
        <FormField id="s-ctaText" label="Text" required error={errors.ctaText?.message}>
          <Textarea id="s-ctaText" rows={2} aria-invalid={!!errors.ctaText} {...register("ctaText")} />
        </FormField>
        <div className="rounded-lg bg-neutral-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Home page version (points to the FAQs)</p>
          <div className="space-y-5">
            {field("faqCtaTitle", "Title", { required: true })}
            <FormField id="s-faqCtaText" label="Text" required error={errors.faqCtaText?.message}>
              <Textarea id="s-faqCtaText" rows={2} aria-invalid={!!errors.faqCtaText} {...register("faqCtaText")} />
            </FormField>
          </div>
        </div>
      </SectionCard>

      <EditorActionBar
        dirty={isDirty}
        busy={isSubmitting}
        submitLabel="Save settings"
        error={status?.type === "error" ? status.message : null}
      />
    </form>
  );
}
