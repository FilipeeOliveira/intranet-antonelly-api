import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { VisitHistoryController } from './presentation/controllers/visit-history.controller';
import { VisitHistoryRepository } from './infrastructure/respositories/visit-history.repository';
import { VisitHistoryService } from './application/services/visit-history.service';
import { CompaniesModule } from '../companies/companies.module';

@Module({
    imports: [
        PrismaModule, 
        AuthModule,
        CompaniesModule
    ],
    controllers: [VisitHistoryController],
    providers: [
        VisitHistoryService,
        VisitHistoryRepository,
    ],
    exports: [
        VisitHistoryService,
        VisitHistoryRepository,
    ],
})
export class VisitHistoryModule { }
