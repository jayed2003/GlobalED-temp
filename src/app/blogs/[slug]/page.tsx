import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Share2, User } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";
import CtaBanner from "@/components/sections/CtaBanner";
import BlogCard from "@/components/cards/BlogCard";
import SectionHeading from "@/components/ui/SectionHeading";
import JsonLd from "@/components/ui/JsonLd";
import { posts } from "@/data/posts";
import { blogCategoryLabels, formatDate } from "@/lib/labels";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.globaled.com.bd";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = posts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  const shareUrl = `${SITE_URL}/blogs/${post.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          image: `${SITE_URL}${post.coverImage}`,
          author: { "@type": "Organization", name: post.author },
          datePublished: post.publishedAt,
        }}
      />

      <article>
        {/* Header */}
        <section className="bg-primary-950 py-14 sm:py-20">
          <Container className="max-w-3xl">
            <Breadcrumb
              items={[{ label: "Blogs", href: "/blogs" }, { label: post.title }]}
            />
            <span className="mt-5 inline-block rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-primary-950">
              {blogCategoryLabels[post.category]}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-primary-200">
              <span className="flex items-center gap-1.5">
                <User size={15} aria-hidden /> {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={15} aria-hidden /> {formatDate(post.publishedAt)}
              </span>
            </div>
          </Container>
        </section>

        {/* Cover */}
        <Container className="max-w-4xl">
          <div className="relative -mt-8 aspect-video overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        </Container>

        {/* Content */}
        <Container className="max-w-3xl py-12">
          <div className="space-y-5 leading-relaxed text-neutral-700">
            {post.content.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Share */}
          <div className="mt-10 flex items-center gap-3 border-t border-neutral-200 pt-6">
            <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-600">
              <Share2 size={16} aria-hidden /> Share:
            </span>
            {[
              {
                label: "Facebook",
                href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
              },
              {
                label: "LinkedIn",
                href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
              },
              {
                label: "X",
                href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`,
              },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm text-neutral-600 transition-colors hover:border-primary-300 hover:text-primary-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </Container>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-primary-50 py-16 sm:py-20">
          <Container>
            <SectionHeading title="Related Articles" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
