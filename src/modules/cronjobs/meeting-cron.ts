import { Injectable, Logger } from "@nestjs/common";
import { MeetingService } from "../meeting/application/service/meeting.service";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class MeetingCron {
  private readonly logger = new Logger(MeetingCron.name);

  constructor(private readonly meetingService: MeetingService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleStatusUpdate() {
    this.logger.log("CronJob - Running reservation status update cron...");

    const now = new Date();

    await this.meetingService.updateMeetingsStatus(now);

    this.logger.log("Meeting status update completed.");
  }
}
