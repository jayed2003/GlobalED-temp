import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { BlogPost } from "@/types";
import { blogCategoryLabels, formatDate } from "@/lib/labels";
import { langOf } from "@/lib/bangla";

/** Blog card with cover, category badge, date, and excerpt. */
export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-video">
        <Image
          src={post.coverImage}
          alt={post.coverImageAlt ?? post.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-secondary rounded-full bg-primary-50 px-3 py-1 font-semibold text-primary-700">
            {blogCategoryLabels[post.category]}
          </span>
          <span className="flex items-center gap-1 text-neutral-500">
            <CalendarDays size={13} aria-hidden />
            {formatDate(post.publishedAt)}
          </span>
        </div>
        <h3 lang={langOf(post.title)} className="mt-3 line-clamp-2 font-heading text-base font-semibold leading-snug text-primary-900">
          {post.title}
        </h3>
        <p lang={langOf(post.excerpt)} className="mt-2 line-clamp-2 flex-1 text-sm text-neutral-600">
          {post.excerpt}
        </p>
        <span className="mt-4 text-sm font-semibold text-primary-700 group-hover:underline">
          Read more
        </span>
      </div>
    </Link>
  );
}
