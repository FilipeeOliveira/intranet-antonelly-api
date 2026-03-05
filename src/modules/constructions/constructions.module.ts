import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ConstructionsService } from "./application/services/constructions.service";
import { ConstructionsRepository } from "./infrastructure/repositories/constructions.repository";
import { ConstructionsController } from "./presentation/controllers/constructions.controller";

@Module({
  imports: [PrismaModule],
  controllers: [ConstructionsController],
  providers: [ConstructionsService, ConstructionsRepository],
  exports: [ConstructionsService, ConstructionsRepository],
})
export class ConstructionsModule {}
