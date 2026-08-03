"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { branches } from "@/data/branches";
import { destinations } from "@/data/destinations";
import { courses } from "@/data/courses";
import { submitLeadForm } from "@/lib/formSubmit";
import { FormField, FormStatus, Honeypot, Input, Select, SubmitButton, Textarea } from "./primitives";

const phoneRegex = /^(\+?880|0)1[3-9]\d{8}$/;

const schema = z.object({
  name: z.string().min(2, "Please enter your full name").max(100),
  phone: z.string().regex(phoneRegex, "Enter a valid BD number (e.g. 017XXXXXXXX)"),
  email: z.string().email("Enter a valid email address"),
  branch: z.string().min(1, "Please choose your nearest branch"),
  destination: z.string().min(1, "Please choose a destination"),
  studyLevel: z.string().min(1, "Please choose your study level"),
  ieltsStatus: z.string().optional(),
  funding: z.string().optional(),
  course: z.string().optional(),
  message: z.string().max(1000, "Message must be under 1000 characters").optional(),
  consent: z.boolean().refine((v) => v === true, "Please agree to be contacted"),
  company: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

/** Free Consultation lead form (PFEC-style smart dropdowns). */
export default function ConsultationForm({
  defaultDestination,
  defaultCourse,
}: {
  defaultDestination?: string;
  defaultCourse?: string;
}) {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      destination: defaultDestination ?? "",
      course: defaultCourse ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setStatus(null);
    // Honeypot filled â†’ silently accept (spam bot)
    if (data.company) {
      setStatus({ type: "success", message: "Thank you! Our counsellor will contact you within 24 hours." });
      return;
    }
    const result = await submitLeadForm({
      form: "Free Consultation",
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, String(value ?? "")]),
      ),
    });
    setStatus({ type: result.success ? "success" : "error", message: result.message });
    if (result.success) reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5">
      <Honeypot registration={register("company")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="c-name" label="Full Name" required error={errors.name?.message}>
          <Input id="c-name" type="text" placeholder="Your full name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
        </FormField>
        <FormField id="c-phone" label="Phone Number" required error={errors.phone?.message}>
          <Input id="c-phone" type="tel" placeholder="01XXXXXXXXX" autoComplete="tel" aria-invalid={!!errors.phone} {...register("phone")} />
        </FormField>
      </div>

      <FormField id="c-email" label="Email Address" required error={errors.email?.message}>
        <Input id="c-email" type="email" placeholder="you@example.com" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="c-branch" label="Nearest Branch" required error={errors.branch?.message}>
          <Select id="c-branch" aria-invalid={!!errors.branch} {...register("branch")}>
            <option value="">Select a branch</option>
            {branches.map((branch) => (
              <option key={branch.name} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField id="c-destination" label="Preferred Destination" required error={errors.destination?.message}>
          <Select id="c-destination" aria-invalid={!!errors.destination} {...register("destination")}>
            <option value="">Select a country</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.name}>
                {d.name}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </Select>
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="c-level" label="Study Level" required error={errors.studyLevel?.message}>
          <Select id="c-level" aria-invalid={!!errors.studyLevel} {...register("studyLevel")}>
            <option value="">Select your level</option>
            <option value="HSC / A-Level completed">HSC / A-Level completed</option>
            <option value="Bachelor's">Bachelor&apos;s degree</option>
            <option value="Master's">Master&apos;s degree</option>
            <option value="PhD">PhD</option>
          </Select>
        </FormField>
        <FormField id="c-ielts" label="IELTS Status" error={errors.ieltsStatus?.message}>
          <Select id="c-ielts" {...register("ieltsStatus")}>
            <option value="">Select your status</option>
            <option value="I have my score">I have my score</option>
            <option value="Exam scheduled / awaiting result">Exam scheduled / awaiting result</option>
            <option value="Not taken yet">Not taken yet</option>
            <option value="Planning to retake">Planning to retake</option>
          </Select>
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="c-funding" label="Funding Plan" error={errors.funding?.message}>
          <Select id="c-funding" {...register("funding")}>
            <option value="">How will you fund your studies?</option>
            <option value="Self-funded">Self-funded</option>
            <option value="Family-funded">Family-funded</option>
            <option value="Education loan">Education loan</option>
            <option value="Seeking scholarship">Seeking scholarship</option>
          </Select>
        </FormField>
        <FormField id="c-course" label="Interested Course" error={errors.course?.message}>
          <Select id="c-course" {...register("course")}>
            <option value="">Optional â€” choose a course</option>
            {courses.map((course) => (
              <option key={course.slug} value={course.title}>
                {course.title}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField id="c-message" label="Your Message" error={errors.message?.message}>
        <Textarea id="c-message" placeholder="Tell us about your study abroad goalsâ€¦" aria-invalid={!!errors.message} {...register("message")} />
      </FormField>

      <div>
        <label className="flex items-start gap-2.5 text-sm text-neutral-600">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 accent-primary-700"
            aria-invalid={!!errors.consent}
            {...register("consent")}
          />
          I agree to be contacted by GlobalEd about my enquiry.
        </label>
        {errors.consent && (
          <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.consent.message}
          </p>
        )}
      </div>

      <SubmitButton loading={isSubmitting}>
        <Send size={18} aria-hidden />
        Book My Free Consultation
      </SubmitButton>

      <FormStatus status={status?.type ?? null} message={status?.message} />
    </form>
  );
}
