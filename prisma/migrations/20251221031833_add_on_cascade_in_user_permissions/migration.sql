-- DropForeignKey
ALTER TABLE "public"."user_permissions" DROP CONSTRAINT "user_permissions_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."user_permissions" ADD CONSTRAINT "user_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
