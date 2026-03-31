-- Remove foreign key constraints
ALTER TABLE "meeting_schedule" DROP CONSTRAINT IF EXISTS "meeting_schedule_sectorId_fkey";
ALTER TABLE "meeting_schedule" DROP CONSTRAINT IF EXISTS "meeting_schedule_responsibleId_fkey";

-- Remove old FK columns
ALTER TABLE "meeting_schedule" DROP COLUMN IF EXISTS "sectorId";
ALTER TABLE "meeting_schedule" DROP COLUMN IF EXISTS "responsibleId";

-- Add new plain text columns
ALTER TABLE "meeting_schedule" ADD COLUMN "sector" TEXT;
ALTER TABLE "meeting_schedule" ADD COLUMN "responsible" TEXT;

-- Add actual start/end timestamps for manual meeting lifecycle control
ALTER TABLE "meeting_schedule" ADD COLUMN "actualStartAt" TIMESTAMP(3);
ALTER TABLE "meeting_schedule" ADD COLUMN "actualEndAt" TIMESTAMP(3);
