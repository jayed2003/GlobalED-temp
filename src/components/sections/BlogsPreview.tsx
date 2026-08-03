import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import BlogCard from "@/components/cards/BlogCard";
import { ButtonLink } from "@/components/ui/Button";
import { posts } from "@/data/posts";

/** Home "Popular Blogs & News" — latest 3 posts. */
export default function BlogsPreview() {
  const latest = [...posts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Blogs & News"
          title="Popular Blogs & News"
          description="Practical guides on destinations, scholarships, IELTS, and English — written by our counsellors."
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
