import { Injectable } from "@nestjs/common";
import { NotificationRepository } from "../infrastructure/repositories/notification.repository";

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationRepository: NotificationRepository
    ) { }

 
}