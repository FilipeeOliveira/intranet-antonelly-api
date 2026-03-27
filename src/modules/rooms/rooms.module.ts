import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { RoomsService } from "./application/services/rooms.service";
import { RoomsRepository } from "./infrastructure/repositories/rooms.repository";
import { RoomsController } from "./presentation/controllers/rooms.controller";

@Module({
  imports: [PrismaModule],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsRepository],
  exports: [RoomsService, RoomsRepository],
})
export class RoomsModule {}
