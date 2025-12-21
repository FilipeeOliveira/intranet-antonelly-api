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

@Module({
    imports: [
        EmailModule,
        PrismaModule,
        SectorsModule,
        UsersModule
    ],
    controllers: [
        CommuniqueController
    ],
    providers: [
        CommuniqueService,
        CommuniqueRepository,
        CommuniquesGateway,
        SendEmailCommuniqueBySector
    ],
    exports: [
        CommuniqueService,
        SendEmailCommuniqueBySector
    ],
})
export class CommuniqueModule { }