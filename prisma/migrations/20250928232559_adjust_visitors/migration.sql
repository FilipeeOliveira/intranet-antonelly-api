/*
  Warnings:

  - You are about to drop the column `arrivedAt` on the `visitors` table. All the data in the column will be lost.
  - You are about to drop the column `leftAt` on the `visitors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."visitors" DROP COLUMN "arrivedAt",
DROP COLUMN "leftAt",
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;
