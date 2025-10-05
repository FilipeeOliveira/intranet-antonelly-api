-- AlterTable
ALTER TABLE "public"."meeting_schedule" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;

-- DropEnum
DROP TYPE "public"."MeetingDuration";

-- DropEnum
DROP TYPE "public"."MeetingPriority";

-- DropEnum
DROP TYPE "public"."MeetingReminder";

-- DropEnum
DROP TYPE "public"."MeetingType";
