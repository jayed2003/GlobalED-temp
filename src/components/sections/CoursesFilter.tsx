"use client";

import { useState } from "react";
import CourseCard from "@/components/cards/CourseCard";
import type { Course } from "@/types";
import { cn } from "@/lib/utils";

const filters = [
  { key: "all", label: "All Courses" },
  { key: "ielts", label: "IELTS" },
  { key: "english", label: "English" },
  { key: "other-languages", label: "Other Languages" },
] as const;

/** Course grid with category filter chips. */
export default function CoursesFilter({ courses }: { courses: Course[] }) {
  const [active, setActive] = useState<(typeof filters)[number]["key"]>("all");

  const visible =
    active === "all" ? courses : courses.filter((c) => c.category === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter courses">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            role="tab"
            aria-selected={active === filter.key}
            onClick={() => setActive(filter.key)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              active === filter.key
                ? "bg-primary-700 text-white"
                : "bg-white text-neutral-600 hover:bg-primary-50 hover:text-primary-700 border border-neutral-200",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </div>
  );
}
