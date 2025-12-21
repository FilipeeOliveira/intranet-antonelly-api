import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { NotificationService } from "./application/notification.service";
import { NotificationRepository } from "./infrastructure/repositories/notification.repository";

@Module({
    imports: [
        PrismaModule
    ],
    controllers: [],
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