"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { submitLeadForm } from "@/lib/formSubmit";
import { contactSchema, type ContactFormInput } from "@/lib/validation/public-forms";
import TurnstileWidget from "./TurnstileWidget";
import { FormField, FormStatus, Honeypot, Input, SubmitButton, Textarea } from "./primitives";

// The same schema object validates this form and /api/contact.
type FormData = z.output<typeof contactSchema>;

/** General enquiry form on the contact page. */
export default function ContactForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput, unknown, FormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormData) => {
    setStatus(null);
    if (data.company) {
      setStatus({ type: "success", message: "Thank you for contacting GlobalEd. We will respond as soon as possible." });
      return;
    }
    if (!turnstileToken) {
      setStatus({ type: "error", message: "Please complete the security check above the button." });
      return;
    }
    const result = await submitLeadForm("/api/contact", { ...data, company: "", turnstileToken });
    // Tokens are single-use: get a fresh challenge whatever the outcome.
    setTurnstileReset((n) => n + 1);
    setStatus({
      type: result.success ? "success" : "error",
      message: result.success
        ? "Thank you for contacting GlobalEd. We will respond as soon as possible."
        : result.message,
    });
    if (result.success) reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5">
      <Honeypot registration={register("company")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="ct-name" label="Your Name" required error={errors.name?.message}>
          <Input id="ct-name" type="text" placeholder="Your name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
        </FormField>
        <FormField id="ct-email" label="Email Address" required error={errors.email?.message}>
          <Input id="ct-email" type="email" placeholder="you@example.com" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        </FormField>
      </div>

      <FormField id="ct-subject" label="Subject" required error={errors.subject?.message}>
        <Input id="ct-subject" type="text" placeholder="What is this about?" aria-invalid={!!errors.subject} {...register("subject")} />
      </FormField>

      <FormField id="ct-message" label="Message" required error={errors.message?.message}>
        <Textarea id="ct-message" placeholder="Write your message…" aria-invalid={!!errors.message} {...register("message")} />
      </FormField>

      <TurnstileWidget action="contact" resetKey={turnstileReset} onToken={setTurnstileToken} />

      <SubmitButton loading={isSubmitting}>
        <Send size={18} aria-hidden />
        Send Message
      </SubmitButton>

      <FormStatus status={status?.type ?? null} message={status?.message} />
    </form>
  );
}
