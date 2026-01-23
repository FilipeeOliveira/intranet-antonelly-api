-- AlterTable
ALTER TABLE "public"."communiques" ALTER COLUMN "imagePath" DROP NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."notifications" RENAME CONSTRAINT "notification_pkey" TO "notifications_pkey";

-- AlterTable
ALTER TABLE "public"."role_features" RENAME CONSTRAINT "RoleFeature_pkey" TO "role_features_pkey";
