-- DropForeignKey
ALTER TABLE "public"."communiques" DROP CONSTRAINT "communiques_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."meeting_schedule" DROP CONSTRAINT "meeting_schedule_responsibleId_fkey";

-- AlterTable
ALTER TABLE "public"."communiques" ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."meeting_schedule" ALTER COLUMN "responsibleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."meeting_schedule" ADD CONSTRAINT "meeting_schedule_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."communiques" ADD CONSTRAINT "communiques_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
