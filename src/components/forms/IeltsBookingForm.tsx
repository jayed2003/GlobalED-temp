"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookOpenCheck } from "lucide-react";
import { branches } from "@/data/branches";
import { courses } from "@/data/courses";
import { submitLeadForm } from "@/lib/formSubmit";
import { FormField, FormStatus, Honeypot, Input, Select, SubmitButton, Textarea } from "./primitives";

const phoneRegex = /^(\+?880|0)1[3-9]\d{8}$/;

const schema = z.object({
  name: z.string().min(2, "Please enter your full name").max(100),
  phone: z.string().regex(phoneRegex, "Enter a valid BD number (e.g. 017XXXXXXXX)"),
  email: z.string().email("Enter a valid email address"),
  course: z.string().min(1, "Please choose a course"),
  branch: z.string().min(1, "Please choose a branch"),
  preferredDate: z.string().min(1, "Please pick a preferred date"),
  notes: z.string().max(1000, "Notes must be under 1000 characters").optional(),
  company: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const ieltsCourses = courses.filter((c) => c.category === "ielts");

/** "Book an IELTS Test / Course" lead form â€” embedded on the IELTS hub page. */
export default function IeltsBookingForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormData) => {
    setStatus(null);
    if (data.company) {
      setStatus({ type: "success", message: "Thank you! Our IELTS team will contact you shortly." });
      return;
    }
    const result = await submitLeadForm({
      form: "IELTS Booking",
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
        <FormField id="i-name" label="Full Name" required error={errors.name?.message}>
          <Input id="i-name" type="text" placeholder="Your full name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
        </FormField>
        <FormField id="i-phone" label="Phone Number" required error={errors.phone?.message}>
          <Input id="i-phone" type="tel" placeholder="01XXXXXXXXX" autoComplete="tel" aria-invalid={!!errors.phone} {...register("phone")} />
        </FormField>
      </div>

      <FormField id="i-email" label="Email Address" required error={errors.email?.message}>
        <Input id="i-email" type="email" placeholder="you@example.com" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="i-course" label="Preferred Course" required error={errors.course?.message}>
          <Select id="i-course" aria-invalid={!!errors.course} {...register("course")}>
            <option value="">Select a course</option>
            {ieltsCourses.map((course) => (
              <option key={course.slug} value={course.title}>
                {course.title}
              </option>
            ))}
            <option value="Only test booking">Only test booking (no course)</option>
          </Select>
        </FormField>
        <FormField id="i-branch" label="Preferred Branch" required error={errors.branch?.message}>
          <Select id="i-branch" aria-invalid={!!errors.branch} {...register("branch")}>
            <option value="">Select a branch</option>
            {branches.map((branch) => (
              <option key={branch.name} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField id="i-date" label="Preferred Date" required error={errors.preferredDate?.message}>
        <Input
          id="i-date"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          aria-invalid={!!errors.preferredDate}
          {...register("preferredDate")}
        />
      </FormField>

      <FormField id="i-notes" label="Additional Notes" error={errors.notes?.message}>
        <Textarea id="i-notes" placeholder="Anything we should know? (current level, target band, etc.)" aria-invalid={!!errors.notes} {...register("notes")} />
      </FormField>

      <SubmitButton loading={isSubmitting}>
        <BookOpenCheck size={18} aria-hidden />
        Book My IELTS Test
      </SubmitButton>

      <FormStatus status={status?.type ?? null} message={status?.message} />
    </form>
  );
}
