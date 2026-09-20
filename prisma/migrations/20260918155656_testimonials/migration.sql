-- AlterEnum
ALTER TYPE "AdminPermission" ADD VALUE 'TESTIMONIALS';

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "reviewImage" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "country" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);
