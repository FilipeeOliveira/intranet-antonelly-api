/*
  Warnings:

  - You are about to drop the column `category` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `documents` table. All the data in the column will be lost.
  - Added the required column `sectorId` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."documents" DROP COLUMN "category",
DROP COLUMN "department",
ADD COLUMN     "sectorId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."sectors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sectors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sectors_name_key" ON "public"."sectors"("name");

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "public"."sectors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
