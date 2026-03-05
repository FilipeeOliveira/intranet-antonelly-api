import { Module } from "@nestjs/common";
import { PermissionsService } from "./application/services/permissions.service";
import { PermissionsController } from "./presentation/controllers/permissions.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [PermissionsService],
  exports: [PermissionsService],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
