-- CreateTable
CREATE TABLE "public"."pages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."features" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "pageId" TEXT NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_permissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pages_name_key" ON "public"."pages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "features_key_key" ON "public"."features"("key");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_userId_featureId_key" ON "public"."user_permissions"("userId", "featureId");

-- AddForeignKey
ALTER TABLE "public"."features" ADD CONSTRAINT "features_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "public"."pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_permissions" ADD CONSTRAINT "user_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_permissions" ADD CONSTRAINT "user_permissions_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "public"."features"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
