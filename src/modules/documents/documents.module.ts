import { Module } from '@nestjs/common';
import { DocumentsService } from './application/services/documents.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DocumentRepository } from './infrastructure/repositories/document.repository';
import { DocumentsController } from './presentation/controllers/documents.controller';

@Module({
    imports: [PrismaModule],
    controllers: [DocumentsController],
    providers: [
        DocumentRepository,
        DocumentsService,
    ],
})
export class DocumentsModule {}
