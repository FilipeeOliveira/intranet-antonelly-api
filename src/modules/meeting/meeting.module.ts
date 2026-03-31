import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { MeetingController } from "./presentation/controllers/meeting.controller";
import { MeetingService } from "./application/service/meeting.service";
import { MeetingRepository } from "./infrastructure/repositories/meeting.repository";
import { RoomsModule } from "../rooms/rooms.module";

@Module({
  imports: [PrismaModule, AuthModule, RoomsModule],
  controllers: [MeetingController],
  providers: [MeetingService, MeetingRepository],
  exports: [MeetingService, MeetingRepository],
})
export class MeetingModule {}
