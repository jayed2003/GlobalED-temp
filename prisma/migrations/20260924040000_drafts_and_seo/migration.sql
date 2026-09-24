-- Drafts and SEO for destinations, courses and events; drafts for blog posts.
-- Additive only: every existing row defaults to PUBLISHED with empty SEO
-- fields (= use the record's own title, text and image), so nothing changes
-- on the site.

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "publishStatus" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED';

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "metaDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ogImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ogImageAlt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "publishStatus" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN     "seoTitle" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "metaDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ogImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ogImageAlt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "publishStatus" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN     "seoTitle" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "EventItem" ADD COLUMN     "metaDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ogImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ogImageAlt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "publishStatus" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN     "seoTitle" TEXT NOT NULL DEFAULT '';
