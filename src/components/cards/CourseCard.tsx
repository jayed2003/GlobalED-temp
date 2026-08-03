import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import type { Course } from "@/types";
import { courseCategoryLabels } from "@/lib/labels";

/** Course card with image, badge, schedule, and price. */
export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {course.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-primary-950">
            {course.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary-500">
          {courseCategoryLabels[course.category]}
        </span>
        <h3 className="mt-1 font-heading text-lg font-semibold text-primary-900">
          {course.title}
        </h3>
        <div className="mt-3 space-y-1.5 text-sm text-neutral-600">
          <p className="flex items-center gap-2">
            <Clock size={14} aria-hidden className="shrink-0 text-primary-500" />
            {course.duration}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays size={14} aria-hidden className="shrink-0 text-primary-500" />
            {course.schedule}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
          <span className="font-heading text-lg font-bold text-primary-700">{course.price}</span>
          <span className="text-sm font-semibold text-accent-600 group-hover:underline">
            View details
          </span>
        </div>
      </div>
    </Link>
  );
}
