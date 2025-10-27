/*
  Warnings:

  - You are about to drop the column `visitorCpf` on the `visit_history` table. All the data in the column will be lost.
  - You are about to drop the column `visitorName` on the `visit_history` table. All the data in the column will be lost.
  - You are about to drop the column `visitorPhone` on the `visit_history` table. All the data in the column will be lost.
  - Added the required column `name` to the `visit_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."visit_history" DROP COLUMN "visitorCpf",
DROP COLUMN "visitorName",
DROP COLUMN "visitorPhone",
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT;
