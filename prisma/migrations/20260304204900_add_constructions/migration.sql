-- CreateEnum
CREATE TYPE "public"."ConstructionStatus" AS ENUM ('planning', 'in_progress', 'paused', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."ConstructionCategory" AS ENUM ('OBRAS', 'IP4', 'PORTOS', 'DSM');

-- CreateTable
CREATE TABLE "public"."constructions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."ConstructionCategory" NOT NULL DEFAULT 'OBRAS',
    "description" TEXT,
    "address" TEXT,
    "client" TEXT,
    "responsible" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "expected_end_date" TIMESTAMP(3) NOT NULL,
    "actual_end_date" TIMESTAMP(3),
    "contract_value" DECIMAL(14,2),
    "status" "public"."ConstructionStatus" NOT NULL DEFAULT 'planning',
    "image_url" TEXT,

    CONSTRAINT "constructions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."constructions" ADD CONSTRAINT "constructions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
