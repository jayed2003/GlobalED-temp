import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import BlogsFilter from "@/components/sections/BlogsFilter";
import Container from "@/components/layout/Container";
import { getAllPosts } from "@/lib/content/blog";
import { editablePageMetadata, getPage } from "@/lib/content/pages";

export async function generateMetadata(): Promise<Metadata> {
  return editablePageMetadata("blogs", await getPage("blogs"));
}

export default async function BlogsPage() {
  const page = await getPage("blogs");
  const posts = await getAllPosts();
  return (
    <>
      <PageHero
        title={page.hero.title}
        description={page.hero.description}
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
