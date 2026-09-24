import Link from "next/link";
import CourseCard from "@/components/cards/CourseCard";
import Pagination from "@/components/ui/Pagination";
import type { Course, CourseCategory } from "@/types";
import { cn } from "@/lib/utils";

export const COURSE_FILTERS = [
  { key: "all", label: "All Courses" },
  { key: "ielts", label: "IELTS" },
  { key: "english", label: "English" },
  { key: "other-languages", label: "Other Languages" },
] as const satisfies readonly { key: "all" | CourseCategory; label: string }[];

export type CourseFilter = (typeof COURSE_FILTERS)[number]["key"];

/** The list's address: /courses, /courses?category=ielts, /courses?category=ielts&page=2 … */
export function coursesHref(filter: CourseFilter, page = 1): string {
  const params = new URLSearchParams();
  if (filter !== "all") params.set("category", filter);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/courses?${query}` : "/courses";
}

/**
 * Category links and one page of the course grid. The category and page live
 * in the URL, so a filtered view can be shared and the back button works.
 */
export default function CoursesFilter({
  courses,
  active,
  page,
  totalPages,
}: {
  /** The courses on this page. */
  courses: Course[];
  active: CourseFilter;
  page: number;
  totalPages: number;
}) {
  return (
    <div>
      <nav aria-label="Course categories" className="flex flex-wrap justify-center gap-2">
        {COURSE_FILTERS.map((filter) => (
          <Link
            key={filter.key}
            href={coursesHref(filter.key)}
            // Switching category keeps your place on the page.
            scroll={false}
            aria-current={active === filter.key ? "true" : undefined}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              active === filter.key
                ? "bg-primary-700 text-white"
                : "border border-neutral-200 bg-white text-neutral-600 hover:bg-primary-50 hover:text-primary-700",
            )}
          >
            {filter.label}
          </Link>
        ))}
      </nav>

      {courses.length === 0 ? (
        <p className="mt-10 text-center text-neutral-500">No courses in this category yet.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        href={(n) => `${coursesHref(active, n)}#all-courses`}
        label="Course pages"
      />
    </div>
  );
}
