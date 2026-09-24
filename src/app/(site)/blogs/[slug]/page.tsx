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
import { getAllPosts, getPostSlugs, getPostBySlug } from "@/lib/content/blog";
import { optimizeBodyImages, sanitizeBlogHtml } from "@/lib/sanitize-html";
import { langOf } from "@/lib/bangla";
import { htmlToText } from "@/lib/rich-text";
import { blogCategoryLabels, formatDate } from "@/lib/labels";
import { recordMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { isOriginalUpload } from "@/lib/images";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return recordMetadata(post, {
    path: `/blogs/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    image: post.coverImage,
    imageAlt: post.coverImageAlt,
    type: "article",
    publishedTime: post.publishedAtIso ?? post.publishedAt,
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getAllPosts();
  const related = allPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);

  const shareUrl = `${SITE_URL}/blogs/${post.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          image: post.coverImage.startsWith("http") ? post.coverImage : `${SITE_URL}${post.coverImage}`,
          author: { "@type": "Organization", name: post.author },
          datePublished: post.publishedAtIso ?? post.publishedAt,
        }}
      />

      <article>
        {/* Header */}
        <section className="bg-primary-950 py-14 sm:py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <Breadcrumb
                items={[{ label: "Blogs", href: "/blogs" }, { label: post.title }]}
              />
              <span className="mt-5 inline-block rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-primary-950">
                {blogCategoryLabels[post.category]}
              </span>
              <h1 lang={langOf(post.title)} className="mt-3 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
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
            </div>
          </Container>
        </section>

        {/* Cover */}
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="relative -mt-8 aspect-video overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={post.coverImage}
                unoptimized={isOriginalUpload(post.coverImage)}
                alt={post.coverImageAlt ?? post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          </div>
        </Container>

        {/* Content */}
        <Container className="py-12">
          {/* Inner max-width: Container's cn() doesn't merge max-w classes. */}
          <div className="mx-auto max-w-3xl">
            {/* Sanitized on save and again here; old plain-text posts become paragraphs. */}
            <div
              lang={langOf(htmlToText(post.content))}
              className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:text-primary-900 prose-a:text-primary-700 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: optimizeBodyImages(sanitizeBlogHtml(post.content)) }}
            />

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
