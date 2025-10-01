/*
  Warnings:

  - You are about to drop the column `setor` on the `users` table. All the data in the column will be lost.
  - Added the required column `sectorId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "setor",
ADD COLUMN     "sectorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "public"."sectors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
