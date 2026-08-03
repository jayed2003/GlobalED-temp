"use client";

import { useState } from "react";
import BlogCard from "@/components/cards/BlogCard";
import { posts } from "@/data/posts";
import { blogCategoryLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

const filters = [
  { key: "all", label: "All Posts" },
  ...Object.entries(blogCategoryLabels).map(([key, label]) => ({ key, label })),
];

/** Blog grid with category filter chips. */
export default function BlogsFilter() {
  const [active, setActive] = useState<string>("all");

  const visible =
    active === "all" ? posts : posts.filter((post) => post.category === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter blogs by category">
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
                : "border border-neutral-200 bg-white text-neutral-600 hover:bg-primary-50 hover:text-primary-700",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-neutral-500">
          No posts in this category yet — check back soon.
        </p>
      )}
    </div>
  );
}
