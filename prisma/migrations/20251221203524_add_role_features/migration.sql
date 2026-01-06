-- CreateTable
CREATE TABLE "public"."role_features" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RoleFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_features_roleId_featureId_key" ON "public"."role_features" ("roleId", "featureId");

-- AddForeignKey
ALTER TABLE "public"."role_features"
ADD CONSTRAINT "role_features_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."role_features"
ADD CONSTRAINT "role_features_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "public"."features" ("id") ON DELETE CASCADE ON UPDATE CASCADE;