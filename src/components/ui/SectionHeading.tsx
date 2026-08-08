import { cn } from "@/lib/utils";

/** Eyebrow + title + description heading block for page sections. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {eyebrow && (
        <p className="font-secondary text-sm font-semibold uppercase tracking-widest text-accent-800">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 font-heading text-3xl font-bold text-primary-900 sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 leading-relaxed text-neutral-600">{description}</p>}
    </div>
  );
}
