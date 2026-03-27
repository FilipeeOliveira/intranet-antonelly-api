import { Module } from "@nestjs/common";
import { MeetingModule } from "../meeting/meeting.module";
import { MeetingCron } from "./meeting-cron";

@Module({
  imports: [MeetingModule],
  providers: [MeetingCron],
  exports: [MeetingCron],
})
export class CronjobsModule {}
