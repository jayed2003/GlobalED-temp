-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "CourseCategory" AS ENUM ('IELTS', 'ENGLISH', 'OTHER_LANGUAGES');

-- CreateEnum
CREATE TYPE "BlogCategory" AS ENUM ('COUNTRY_WISE', 'SCHOLARSHIPS', 'IELTS', 'ENGLISH');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'PREVIOUS');

-- CreateEnum
CREATE TYPE "LeadFormType" AS ENUM ('GENERAL', 'IELTS');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "flagImage" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "whyStudyHere" TEXT[],
    "tuitionRange" TEXT NOT NULL,
    "livingCost" TEXT NOT NULL,
    "scholarships" TEXT[],
    "visaInfo" TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DestinationUniversity" (
    "id" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DestinationUniversity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DestinationFaq" (
    "id" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "q" TEXT NOT NULL,
    "a" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DestinationFaq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "CourseCategory" NOT NULL,
    "image" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "curriculum" TEXT[],
    "duration" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "badge" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IeltsContent" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "whatIsIeltsTitle" TEXT NOT NULL,
    "whatIsIeltsBody" TEXT NOT NULL,
    "whatIsIeltsPoints" TEXT[],
    "whyIeltsTitle" TEXT NOT NULL,
    "whyIeltsBody" TEXT NOT NULL,
    "whyIeltsReasons" JSONB NOT NULL,
    "whyGlobaledTitle" TEXT NOT NULL,
    "whyGlobaledBody" TEXT NOT NULL,
    "whyGlobaledUsps" JSONB NOT NULL,
    "whyGlobaledFreeServices" JSONB NOT NULL,
    "preparationTitle" TEXT NOT NULL,
    "preparationBody" TEXT NOT NULL,
    "preparationSkillAreas" JSONB NOT NULL,
    "progressTrackerTitle" TEXT NOT NULL,
    "progressTrackerBody" TEXT NOT NULL,
    "progressTrackerTrackItems" TEXT[],
    "progressTrackerBenefits" TEXT[],
    "successStoriesTitle" TEXT NOT NULL,
    "successStoriesBody" TEXT NOT NULL,
    "successStoriesAchievements" JSONB NOT NULL,
    "successStoriesQuotes" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IeltsContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IeltsPreparationCourse" (
    "id" TEXT NOT NULL,
    "ieltsContentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "IeltsPreparationCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "BlogCategory" NOT NULL,
    "coverImage" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "bannerImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "gallery" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "formType" "LeadFormType" NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "destinationId" TEXT,
    "destinationOther" TEXT,
    "studyLevel" TEXT,
    "ieltsStatus" TEXT,
    "funding" TEXT,
    "courseId" TEXT,
    "preferredDate" TIMESTAMP(3),
    "message" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "IeltsPreparationCourse_ieltsContentId_courseId_key" ON "IeltsPreparationCourse"("ieltsContentId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EventItem_slug_key" ON "EventItem"("slug");

-- AddForeignKey
ALTER TABLE "DestinationUniversity" ADD CONSTRAINT "DestinationUniversity_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationFaq" ADD CONSTRAINT "DestinationFaq_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IeltsPreparationCourse" ADD CONSTRAINT "IeltsPreparationCourse_ieltsContentId_fkey" FOREIGN KEY ("ieltsContentId") REFERENCES "IeltsContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IeltsPreparationCourse" ADD CONSTRAINT "IeltsPreparationCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
