/*
  Warnings:

  - Added the required column `imageUrl` to the `communiques` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."communiques" ADD COLUMN     "imageUrl" TEXT NOT NULL;
