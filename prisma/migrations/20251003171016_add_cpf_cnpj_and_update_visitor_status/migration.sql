/*
  Warnings:

  - The `status` column on the `visitors` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[cpf]` on the table `visitors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cnpj]` on the table `visitors` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."visitors_email_key";

-- AlterTable
ALTER TABLE "public"."visitors" ADD COLUMN     "cnpj" TEXT,
ADD COLUMN     "cpf" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "visitors_cpf_key" ON "public"."visitors"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "visitors_cnpj_key" ON "public"."visitors"("cnpj");
