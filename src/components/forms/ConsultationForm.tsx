"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, BookOpenCheck, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { branches } from "@/data/branches";
import type { Destination, Course } from "@/types";
import { submitLeadForm } from "@/lib/formSubmit";
import { leadFields, phoneRegex } from "@/lib/validation/public-forms";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { FormField, FormStatus, Honeypot, Input, Select, SubmitButton, Textarea } from "./primitives";
import FormProgress from "./FormProgress";
import FormSuccess from "./FormSuccess";

// Field rules are shared with /api/leads (see src/lib/validation/public-forms.ts).
const baseFields = {
  name: leadFields.name,
  phone: leadFields.phone,
  email: leadFields.email,
  branch: leadFields.branch,
  message: leadFields.message.default(""),
  consent: z.boolean().refine((v) => v === true, "Please agree to be contacted"),
  company: leadFields.company.default(""),
  ieltsStatus: leadFields.ieltsStatus.default(""),
  funding: leadFields.funding.default(""),
};

const generalSchema = z.object({
  ...baseFields,
  destination: leadFields.destination(true),
  studyLevel: leadFields.studyLevel(true),
  course: leadFields.course(false).default(""),
  preferredDate: leadFields.preferredDate(false).default(""),
});

const ieltsSchema = z.object({
  ...baseFields,
  destination: leadFields.destination(false).default(""),
  studyLevel: leadFields.studyLevel(false).default(""),
  course: leadFields.course(true),
  preferredDate: leadFields.preferredDate(true),
});

type FormData = {
  name: string;
  phone: string;
  email: string;
  branch: string;
  destination: string;
  studyLevel: string;
  ieltsStatus: string;
  funding: string;
  course: string;
  preferredDate: string;
  message: string;
  consent: boolean;
  company: string;
};

type StepId = "you" | "email" | "where" | "study" | "course" | "finish";

type Step = { id: StepId; label: string; title: string; hint: string; fields: (keyof FormData)[] };

const generalSteps: Step[] = [
  { id: "you", label: "About you", title: "Let's start with the basics", hint: "Tell us who you are and how to reach you.", fields: ["name", "phone"] },
  { id: "email", label: "Email", title: "Where should we send your confirmation?", hint: "We'll email your booking details right away.", fields: ["email"] },
  { id: "where", label: "Location", title: "Where would you like to study?", hint: "Pick your nearest branch and dream destination.", fields: ["branch", "destination"] },
  { id: "study", label: "Your plan", title: "Tell us about your plans", hint: "This helps your counsellor prepare for your session.", fields: ["studyLevel", "ieltsStatus", "funding", "course"] },
  { id: "finish", label: "Finish", title: "Anything else we should know?", hint: "Optional — then you're done!", fields: ["message", "consent"] },
];

const ieltsSteps: Step[] = [
  { id: "you", label: "About you", title: "Let's start with the basics", hint: "Tell us who you are and how to reach you.", fields: ["name", "phone"] },
  { id: "email", label: "Email", title: "Where should we send your confirmation?", hint: "We'll email your booking details right away.", fields: ["email"] },
  { id: "where", label: "Branch & date", title: "When and where?", hint: "Choose your nearest branch and preferred date.", fields: ["branch", "preferredDate"] },
  { id: "course", label: "Course", title: "Which course are you interested in?", hint: "Pick a preparation course or just book the test.", fields: ["course"] },
  { id: "finish", label: "Finish", title: "Anything else we should know?", hint: "Optional — then you're done!", fields: ["message", "consent"] },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Green tick shown inside a field once its value is valid. */
function ValidTick({ show }: { show: boolean }) {
  return (
    <CheckCircle2
      size={18}
      aria-hidden
      className={cn(
        "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-green-500 transition-all duration-300 motion-reduce:transition-none",
        show ? "scale-100 opacity-100" : "scale-50 opacity-0",
      )}
    />
  );
}

/** Unified lead form — covers both the general "Free Consultation" and the IELTS booking flow, as an animated step-by-step wizard. */
export default function ConsultationForm({
  context = "general",
  defaultDestination,
  defaultCourse,
  destinations,
  courses,
}: {
  context?: "general" | "ielts";
  defaultDestination?: string;
  defaultCourse?: string;
  destinations: Pick<Destination, "slug" | "name">[];
  courses: Pick<Course, "slug" | "title" | "category">[];
}) {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [shake, setShake] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);
  const hasNavigated = useRef(false);
  const isIelts = context === "ielts";
  const steps = isIelts ? ieltsSteps : generalSteps;
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(isIelts ? ieltsSchema : generalSchema) as Resolver<FormData>,
    mode: "onBlur",
    defaultValues: {
      destination: defaultDestination ?? "",
      course: defaultCourse ?? "",
    },
  });

  const [name, phone, email] = useWatch({ control, name: ["name", "phone", "email"] });
  const nameOk = (name ?? "").trim().length >= 2;
  const phoneOk = phoneRegex.test(phone ?? "");
  const emailOk = emailRegex.test(email ?? "");

  // Move focus to the first control of the new step (not on first render).
  useEffect(() => {
    if (!hasNavigated.current) return;
    stepRef.current?.querySelector<HTMLElement>("input, select, textarea")?.focus({ preventScroll: true });
  }, [stepIndex]);

  const goTo = (index: number) => {
    hasNavigated.current = true;
    setDirection(index > stepIndex ? "forward" : "back");
    setStatus(null);
    setStepIndex(index);
  };

  const next = async () => {
    const ok = await trigger(step.fields);
    if (!ok) {
      setShake(true);
      return;
    }
    goTo(stepIndex + 1);
  };

  const onSubmit = async (data: FormData) => {
    setStatus(null);
    // Honeypot filled → silently accept (spam bot)
    if (data.company) {
      setSuccess("Thank you! Our counsellor will contact you within 24 hours.");
      return;
    }
    const payload: Record<string, string> = {
      formType: isIelts ? "IELTS" : "GENERAL",
      ...Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value ?? "")])),
    };
    const result = await submitLeadForm(payload);
    if (result.success) {
      setSuccess(result.message);
      reset();
    } else {
      setStatus({ type: "error", message: result.message });
    }
  };

  // If final validation fails on a field from an earlier step, jump back to that step.
  const onInvalid = (invalid: Record<string, unknown>) => {
    const target = steps.findIndex((st) => st.fields.some((f) => f in invalid));
    if (target !== -1 && target !== stepIndex) goTo(target);
    setShake(true);
  };

  const restart = () => {
    setSuccess(null);
    setStatus(null);
    hasNavigated.current = false;
    setDirection("forward");
    setStepIndex(0);
  };

  const courseOptions = isIelts ? courses.filter((c) => c.category === "ielts") : courses;
  const selectedDestination = destinations.find((d) => d.slug === defaultDestination)?.name;
  const selectedCourse = courses.find((c) => c.slug === defaultCourse)?.title;

  if (success) return <FormSuccess message={success} onReset={restart} />;

  const chip = (text?: string) =>
    text ? (
      <p className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-800">
        <CheckCircle2 size={14} aria-hidden className="text-green-600" />
        Pre-selected: {text}
      </p>
    ) : null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isLast) void handleSubmit(onSubmit, onInvalid)(e);
        else void next();
      }}
      noValidate
      className="relative space-y-6"
    >
      <Honeypot registration={register("company")} />

      <FormProgress steps={steps.map((s) => s.label)} current={stepIndex} onGoTo={goTo} />

      <div
        key={step.id}
        ref={stepRef}
        onAnimationEnd={(e) => {
          if (e.animationName === "shake") setShake(false);
        }}
        className={cn(
          "space-y-5",
          direction === "forward" ? "animate-step-forward" : "animate-step-back",
          "motion-reduce:animate-none",
          shake && "animate-shake motion-reduce:animate-none",
        )}
      >
        <div>
          <h3 className="font-heading text-lg font-bold text-primary-900">{step.title}</h3>
          <p className="mt-1 text-sm text-neutral-500">{step.hint}</p>
        </div>

        {step.id === "you" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="c-name" label="Full Name" required error={errors.name?.message}>
              <div className="relative">
                <Input id="c-name" type="text" placeholder="Your full name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
                <ValidTick show={nameOk && !errors.name} />
              </div>
            </FormField>
            <FormField id="c-phone" label="Phone Number" required error={errors.phone?.message}>
              <div className="relative">
                <Input id="c-phone" type="tel" placeholder="01XXXXXXXXX" autoComplete="tel" aria-invalid={!!errors.phone} {...register("phone")} />
                <ValidTick show={phoneOk && !errors.phone} />
              </div>
            </FormField>
          </div>
        )}

        {step.id === "email" && (
          <FormField id="c-email" label="Email Address" required error={errors.email?.message}>
            <div className="relative">
              <Input id="c-email" type="email" placeholder="you@example.com" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
              <ValidTick show={emailOk && !errors.email} />
            </div>
          </FormField>
        )}

        {step.id === "where" && (
          <div className="space-y-5">
            {!isIelts && chip(selectedDestination)}
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

              {isIelts ? (
                <FormField id="c-date" label="Preferred Date" required error={errors.preferredDate?.message}>
                  <Input
                    id="c-date"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    aria-invalid={!!errors.preferredDate}
                    {...register("preferredDate")}
                  />
                </FormField>
              ) : (
                <FormField id="c-destination" label="Preferred Destination" required error={errors.destination?.message}>
                  <Select id="c-destination" aria-invalid={!!errors.destination} {...register("destination")}>
                    <option value="">Select a country</option>
                    {destinations.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name}
                      </option>
                    ))}
                    <option value="not-sure">Not sure yet</option>
                  </Select>
                </FormField>
              )}
            </div>
          </div>
        )}

        {step.id === "study" && (
          <div className="space-y-5">
            {chip(selectedCourse)}
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
                <Select id="c-course" aria-invalid={!!errors.course} {...register("course")}>
                  <option value="">Optional — choose a course</option>
                  {courseOptions.map((course) => (
                    <option key={course.slug} value={course.slug}>
                      {course.title}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
          </div>
        )}

        {step.id === "course" && (
          <div className="space-y-5">
            {chip(selectedCourse)}
            <FormField id="c-course" label="Preferred Course" required error={errors.course?.message}>
              <Select id="c-course" aria-invalid={!!errors.course} {...register("course")}>
                <option value="">Select a course</option>
                {courseOptions.map((course) => (
                  <option key={course.slug} value={course.slug}>
                    {course.title}
                  </option>
                ))}
                <option value="no-course">Only test booking (no course)</option>
              </Select>
            </FormField>
          </div>
        )}

        {step.id === "finish" && (
          <div className="space-y-5">
            <FormField id="c-message" label={isIelts ? "Additional Notes" : "Your Message"} error={errors.message?.message}>
              <Textarea
                id="c-message"
                placeholder={isIelts ? "Anything we should know? (current level, target band, etc.)" : "Tell us about your study abroad goals…"}
                aria-invalid={!!errors.message}
                {...register("message")}
              />
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
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={() => goTo(stepIndex - 1)}
            className={cn(buttonClasses({ variant: "outline", size: "lg" }), "shrink-0")}
          >
            <ArrowLeft size={18} aria-hidden />
            Back
          </button>
        )}
        {isLast ? (
          <div className="flex-1">
            <SubmitButton loading={isSubmitting}>
              {isIelts ? <BookOpenCheck size={18} aria-hidden /> : <Send size={18} aria-hidden />}
              {isIelts ? "Book My IELTS Test" : "Book My Free Consultation"}
            </SubmitButton>
          </div>
        ) : (
          <button type="submit" className={cn(buttonClasses({ size: "lg" }), "flex-1")}>
            Continue
            <ArrowRight size={18} aria-hidden />
          </button>
        )}
      </div>

      <FormStatus status={status?.type ?? null} message={status?.message} />
    </form>
  );
}
