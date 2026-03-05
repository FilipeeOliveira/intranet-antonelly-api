import { Module } from "@nestjs/common";
import { DocumentsService } from "./application/services/documents.service";
import { PrismaModule } from "../prisma/prisma.module";
import { DocumentRepository } from "./infrastructure/repositories/document.repository";
import { DocumentsController } from "./presentation/controllers/documents.controller";
import { SectorRepository } from "../sectors/infrastructure/repositories/sector.repository";
import { DocumentHistoryRepository } from "./infrastructure/repositories/document-history.repository";

@Module({
  imports: [PrismaModule],
  controllers: [DocumentsController],
  providers: [DocumentRepository, SectorRepository, DocumentsService, DocumentHistoryRepository],
})
export class DocumentsModule {}
