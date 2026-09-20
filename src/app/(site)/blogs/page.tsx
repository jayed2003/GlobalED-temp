import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import BlogsFilter from "@/components/sections/BlogsFilter";
import Container from "@/components/layout/Container";
import { getAllPosts } from "@/lib/content/blog";

export const metadata: Metadata = {
  title: "Blogs & News",
  description:
    "Study abroad guides, scholarship news, IELTS tips, and English learning advice from the GlobalEd team in Bangladesh.",
};

export default async function BlogsPage() {
  const posts = await getAllPosts();
  return (
    <>
      <PageHero
        title="Blogs & News"
        description="Practical guides on destinations, scholarships, IELTS, and English — written by our counsellors and instructors."
        breadcrumb={[{ label: "Blogs & Events" }, { label: "Blogs" }]}
      />
      <section className="py-16 sm:py-20">
        <Container>
          <BlogsFilter posts={posts} />
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
