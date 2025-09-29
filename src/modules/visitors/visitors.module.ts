import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { VisitorsController } from './presentation/controllers/visitors.controller';
import { VisitorsService } from './application/services/visitors.service';
import { VisitorRepository } from './infrastructure/repositories/visitors.repository';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [VisitorsController],
    providers: [
        VisitorsService, 
        VisitorRepository,
    ],
    exports: [
        VisitorsService,
        VisitorRepository,
    ],
})
export class VisitorsModule { }
