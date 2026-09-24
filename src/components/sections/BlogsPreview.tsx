import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import BlogCard from "@/components/cards/BlogCard";
import { ButtonLink } from "@/components/ui/Button";
import { getAllPosts } from "@/lib/content/blog";
import type { HeadingContent } from "@/lib/pages";

/** Home "Popular Blogs & News" — latest 3 posts. */
export default async function BlogsPreview({ heading }: { heading: HeadingContent }) {
  const posts = await getAllPosts();
  const latest = [...posts]
    .sort((a, b) => (b.publishedAtIso ?? b.publishedAt).localeCompare(a.publishedAtIso ?? a.publishedAt))
    .slice(0, 3);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={heading.eyebrow}
          title={heading.title}
          description={heading.description}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/blogs" variant="outline">
            View All Blogs
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
