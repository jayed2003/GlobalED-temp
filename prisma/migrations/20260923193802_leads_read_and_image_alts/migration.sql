-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "flagImageAlt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "heroImageAlt" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "imageAlt" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "coverImageAlt" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "EventItem" ADD COLUMN     "bannerImageAlt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "galleryAlts" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "readAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "reviewImageAlt" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "readAt" TIMESTAMP(3);


-- Backfill: anything already worked on (status moved past NEW) counts as read,
-- so the unread badges start from the same numbers as today's "New" counts.
UPDATE "Lead" SET "readAt" = "updatedAt" WHERE "status" <> 'NEW';
UPDATE "ContactMessage" SET "readAt" = "updatedAt" WHERE "status" <> 'NEW';
