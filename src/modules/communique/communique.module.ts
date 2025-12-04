import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { CommuniqueController } from "./presentation/communique.controller";
import { CommuniqueRepository } from "./infrasctructure/repositories/communique.repository";
import { CommuniqueService } from "./application/services/communique.service";

@Module({
    imports: [PrismaModule],
    controllers: [
        CommuniqueController
    ],
    providers: [
        CommuniqueService,
        CommuniqueRepository
    ],
    exports: [
        CommuniqueService
    ],
})
export class CommuniqueModule { }