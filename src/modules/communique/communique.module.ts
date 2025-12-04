import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { SectorService } from "../sectors/application/services/sector.service";
import { CommuniqueService } from "./application/services/communique.service";
import { CommuniqueRepository } from "./infrasctructure/repositories/communique.repository";
import { CommuniqueController } from "./presentation/communique.controller";
import { SectorsModule } from "../sectors/sectors.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
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
    ],
    exports: [
        CommuniqueService
    ],
})
export class CommuniqueModule { }