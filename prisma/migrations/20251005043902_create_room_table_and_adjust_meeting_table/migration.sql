/*
  Warnings:

  - You are about to drop the column `duration` on the `meeting_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `meeting_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `participants` on the `meeting_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `meeting_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `reminder` on the `meeting_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `meeting_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `meeting_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `cnpj` on the `visitors` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnpj]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cnpj` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `meeting_schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectorId` to the `meeting_schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `meeting_schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."visitors_cnpj_key";

-- AlterTable
ALTER TABLE "public"."companies" ADD COLUMN     "cnpj" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."features" ADD COLUMN     "prettyName" TEXT;

-- AlterTable
ALTER TABLE "public"."meeting_schedule" DROP COLUMN "duration",
DROP COLUMN "location",
DROP COLUMN "participants",
DROP COLUMN "priority",
DROP COLUMN "reminder",
DROP COLUMN "time",
DROP COLUMN "type",
ADD COLUMN     "roomId" TEXT NOT NULL,
ADD COLUMN     "sectorId" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."visit_history" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."visitors" DROP COLUMN "cnpj",
ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "public"."rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "capacity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_name_key" ON "public"."rooms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "companies_cnpj_key" ON "public"."companies"("cnpj");

-- AddForeignKey
ALTER TABLE "public"."meeting_schedule" ADD CONSTRAINT "meeting_schedule_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "public"."sectors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meeting_schedule" ADD CONSTRAINT "meeting_schedule_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
