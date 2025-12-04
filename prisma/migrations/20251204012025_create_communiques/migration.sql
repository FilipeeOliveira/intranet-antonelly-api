-- CreateTable
CREATE TABLE "public"."communiques" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "sectorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communiques_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."communiques" ADD CONSTRAINT "communiques_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "public"."sectors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."communiques" ADD CONSTRAINT "communiques_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
