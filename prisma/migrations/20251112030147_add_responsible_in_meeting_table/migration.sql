-- AlterTable
ALTER TABLE "public"."meeting_schedule" ADD COLUMN     "responsibleId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."meeting_schedule" ADD CONSTRAINT "meeting_schedule_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
