import { Injectable } from "@nestjs/common";
import { NotificationService } from "src/modules/notification/application/notification.service";

export interface CommunitToNotificationPayload {
  title: string;
  description: string;
  severity: string;
}

@Injectable()
export class SendNotificationAboutCommunique {
  constructor(private readonly notificationService: NotificationService) {}

  async execute(communique: CommunitToNotificationPayload): Promise<void> {
    const payload: CommunitToNotificationPayload = {
      title: communique.title,
      description: communique.description,
      severity: communique.severity,
    };
    await this.notificationService.create({
      ...payload,
    });
  }
}
