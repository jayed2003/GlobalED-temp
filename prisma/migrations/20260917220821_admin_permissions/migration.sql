-- CreateEnum
CREATE TYPE "AdminPermission" AS ENUM ('DESTINATIONS', 'COURSES', 'BLOGS', 'EVENTS', 'IELTS', 'LEADS');

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "permissions" "AdminPermission"[];
