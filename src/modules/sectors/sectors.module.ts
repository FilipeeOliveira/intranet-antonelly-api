import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";
import { SectorController } from "./presentation/controllers/sector.controller";
import { SectorRepository } from "./infrastructure/repositories/sector.repository";
import { SectorService } from "./application/services/sector.service";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [SectorController],
  providers: [SectorRepository, SectorService],
  exports: [SectorService, SectorRepository],
})
export class SectorsModule {}
