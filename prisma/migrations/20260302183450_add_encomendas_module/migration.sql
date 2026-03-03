-- CreateEnum
CREATE TYPE "public"."OrderType" AS ENUM ('PACKAGE', 'LETTER', 'DOCUMENT', 'PARCEL', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('AWAITING_PICKUP', 'DELIVERED', 'RETURNED');

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" TEXT NOT NULL,
    "protocolNumber" TEXT NOT NULL,
    "type" "public"."OrderType" NOT NULL DEFAULT 'PACKAGE',
    "sender" VARCHAR(255),
    "carrier" VARCHAR(255),
    "trackingCode" VARCHAR(255),
    "description" TEXT,
    "recipientName" VARCHAR(255) NOT NULL,
    "recipientDepartment" VARCHAR(255),
    "recipientEmail" VARCHAR(255) NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "receivedBy" VARCHAR(255) NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'AWAITING_PICKUP',
    "deliveredAt" TIMESTAMP(3),
    "deliveredTo" VARCHAR(255),
    "deliveredBy" VARCHAR(255),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_protocolNumber_key" ON "public"."orders"("protocolNumber");
