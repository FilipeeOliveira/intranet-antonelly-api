/*
  Warnings:

  - You are about to drop the column `arrivedAt` on the `visitors` table. All the data in the column will be lost.
  - You are about to drop the column `leftAt` on the `visitors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."visitors" DROP COLUMN "arrivedAt",
DROP COLUMN "leftAt";

-- CreateTable
CREATE TABLE "public"."visit_history" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "arrivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "visit_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."visit_history" ADD CONSTRAINT "visit_history_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "public"."visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
