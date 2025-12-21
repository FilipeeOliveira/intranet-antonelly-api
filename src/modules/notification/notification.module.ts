import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { NotificationService } from "./application/notification.service";
import { NotificationRepository } from "./infrastructure/repositories/notification.repository";
import { NotificationController } from "./presentation/notification.controller";

@Module({
    imports: [
        PrismaModule
    ],
    controllers: [
        NotificationController
    ],
    providers: [
        NotificationService,
        NotificationRepository
    ],
    exports: [
        NotificationService,
        NotificationRepository
    ],
})
export class NotificationModule { }