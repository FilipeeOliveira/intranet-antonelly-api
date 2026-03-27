import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { RolesService } from "./application/roles.service";
import { RolesRepository } from "./infrastructure/repositories/roles.repository";
import { RolesController } from "./presentation/roles.controller";

@Module({
  imports: [PrismaModule],
  controllers: [RolesController],
  providers: [RolesRepository, RolesService],
  exports: [RolesRepository, RolesService],
})
export class RolesModule {}
