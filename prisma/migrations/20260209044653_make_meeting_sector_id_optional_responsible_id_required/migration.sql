/*
  Warnings:

  - Made the column `responsibleId` on table `meeting_schedule` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."meeting_schedule" DROP CONSTRAINT "meeting_schedule_responsibleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."meeting_schedule" DROP CONSTRAINT "meeting_schedule_sectorId_fkey";

-- AlterTable
ALTER TABLE "public"."meeting_schedule" ALTER COLUMN "sectorId" DROP NOT NULL,
ALTER COLUMN "responsibleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."meeting_schedule" ADD CONSTRAINT "meeting_schedule_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "public"."sectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meeting_schedule" ADD CONSTRAINT "meeting_schedule_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
