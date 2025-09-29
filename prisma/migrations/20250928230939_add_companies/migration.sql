/*
  Warnings:

  - You are about to drop the column `companie` on the `visitors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."visitors" DROP COLUMN "companie",
ADD COLUMN     "arrivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "companieId" TEXT,
ADD COLUMN     "leftAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'PRESENT';

-- CreateTable
CREATE TABLE "public"."companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "public"."companies"("name");

-- AddForeignKey
ALTER TABLE "public"."visitors" ADD CONSTRAINT "visitors_companieId_fkey" FOREIGN KEY ("companieId") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
