import { Module } from '@nestjs/common';
import { DocumentsService } from './application/services/documents.service';
import { DocumentsController } from './presentation/controllers/documents.controller';

@Module({
    controllers: [DocumentsController],
    providers: [DocumentsService],
})
export class DocumentsModule {}
