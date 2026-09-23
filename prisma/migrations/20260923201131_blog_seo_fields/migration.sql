-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "focusKeyword" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "metaDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ogImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ogImageAlt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seoTitle" TEXT NOT NULL DEFAULT '';

