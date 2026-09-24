-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "brandName" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "facebookUrl" TEXT NOT NULL DEFAULT '',
    "instagramUrl" TEXT NOT NULL DEFAULT '',
    "linkedinUrl" TEXT NOT NULL DEFAULT '',
    "youtubeUrl" TEXT NOT NULL DEFAULT '',
    "footerBlurb" TEXT NOT NULL DEFAULT '',
    "statStudentsPlaced" TEXT NOT NULL,
    "statPartnerUniversities" TEXT NOT NULL,
    "statVisaSuccessRate" TEXT NOT NULL,
    "statYearsOfExperience" TEXT NOT NULL,
    "ctaTitle" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL,
    "faqCtaTitle" TEXT NOT NULL,
    "faqCtaText" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phones" TEXT[],
    "email" TEXT NOT NULL,
    "hours" TEXT NOT NULL,
    "mapEmbedUrl" TEXT NOT NULL DEFAULT '',
    "shown" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branch_name_key" ON "Branch"("name");


-- Today's content, so the site looks the same the moment this is deployed.
INSERT INTO "SiteSettings" ("id", "brandName", "tagline", "phone", "email", "whatsapp", "facebookUrl", "instagramUrl", "linkedinUrl", "youtubeUrl", "footerBlurb", "statStudentsPlaced", "statPartnerUniversities", "statVisaSuccessRate", "statYearsOfExperience", "ctaTitle", "ctaText", "faqCtaTitle", "faqCtaText", "updatedAt")
VALUES ('main', 'GlobalEd', 'IELTS & Study Abroad Consultancy', '019555 44772', 'info@globaled.io', '8801955544772', 'https://facebook.com/GoWithGlobalEd', 'https://instagram.com/GoWithGlobalEd', 'https://linkedin.com/company/GoWithGlobalEd', 'https://youtube.com/@GoWithGlobalEd', 'Bangladesh''s trusted consultancy for IELTS preparation and study abroad — guiding students to 13 destinations with honest, end-to-end support.', '500+', '10+', '90%', '7+', 'Book Your Free Consultation Today', 'Talk to an expert counsellor about your study abroad plan — completely free, no obligations.', 'Have Questions?', 'Find answers to common questions about IELTS, visas, and studying abroad — or reach out directly.', CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Branch" ("id", "name", "address", "phones", "email", "hours", "mapEmbedUrl", "shown", "sortOrder", "updatedAt")
VALUES ('br_panthapath', 'Panthapath (Head Office)', '69/E Panthapath, Dhaka-1205', ARRAY['019555 44772']::TEXT[], 'info@globaled.io', 'Sat–Fri, 9:00 AM – 8:00 PM', 'https://www.google.com/maps?q=GlobalEd+-+Panthapath&ll=23.7505209,90.3882206&z=17&output=embed', true, 0, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "Branch" ("id", "name", "address", "phones", "email", "hours", "mapEmbedUrl", "shown", "sortOrder", "updatedAt")
VALUES ('br_uttara', 'Uttara', 'Hossain Tower, Level-05, Sector-07, Uttara, Dhaka-1230', ARRAY['019555 44772']::TEXT[], 'info@globaled.io', 'Sat–Fri, 9:00 AM – 8:00 PM', 'https://www.google.com/maps?q=GlobalEd+Uttara&ll=23.8736187,90.4001127&z=17&output=embed', true, 1, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "Branch" ("id", "name", "address", "phones", "email", "hours", "mapEmbedUrl", "shown", "sortOrder", "updatedAt")
VALUES ('br_banasree', 'Banasree', '46/6 Block-M, Banasree, Khilgaon, Dhaka', ARRAY['019555 44772']::TEXT[], 'info@globaled.io', 'Sat–Fri, 9:00 AM – 8:00 PM', 'https://www.google.com/maps?q=GlobalEd+Banasree&ll=23.7583557,90.4474437&z=17&output=embed', true, 2, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;

