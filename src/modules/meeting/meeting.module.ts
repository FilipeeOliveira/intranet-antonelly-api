import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { MeetingController } from "./presentation/controllers/meeting.controller";
import { MeetingService } from "./application/service/meeting.service";
import { MeetingRepository } from "./infrastructure/repositories/meeting.repository";
import { SectorsModule } from "../sectors/sectors.module";
import { RoomsModule } from "../rooms/rooms.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, SectorsModule, RoomsModule],
  controllers: [MeetingController],
  providers: [MeetingService, MeetingRepository],
  exports: [MeetingService, MeetingRepository],
})
export class MeetingModule {}
