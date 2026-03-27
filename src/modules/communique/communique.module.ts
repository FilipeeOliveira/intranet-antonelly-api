import { Module } from "@nestjs/common";
import { EmailModule } from "../email/email.module";
import { PrismaModule } from "../prisma/prisma.module";
import { SectorsModule } from "../sectors/sectors.module";
import { UsersModule } from "../users/users.module";
import { CommuniqueService } from "./application/services/communique.service";
import { CommuniquesGateway } from "./infrasctructure/gateways/communiques.gateway";
import { CommuniqueRepository } from "./infrasctructure/repositories/communique.repository";
import { CommuniqueController } from "./presentation/communique.controller";
import { SendEmailCommuniqueBySector } from "./application/use-cases/send-email-communique-by-sector";
import { NotificationModule } from "../notification/notification.module";
import { SendNotificationAboutCommunique } from "./application/use-cases/send-notification-about-communique";

@Module({
  imports: [EmailModule, PrismaModule, SectorsModule, UsersModule, NotificationModule],
  controllers: [CommuniqueController],
  providers: [
    CommuniqueService,
    CommuniqueRepository,
    CommuniquesGateway,
    SendEmailCommuniqueBySector,
    SendNotificationAboutCommunique,
  ],
  exports: [CommuniqueService, SendEmailCommuniqueBySector, SendNotificationAboutCommunique],
})
export class CommuniqueModule {}
