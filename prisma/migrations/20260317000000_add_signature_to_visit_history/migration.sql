-- AlterTable
ALTER TABLE "visit_history" ADD COLUMN "signature" TEXT,
ADD COLUMN "signedAt" TIMESTAMPTZ;
