import { Module } from '@nestjs/common';
import { CompanieController } from './presentation/controllers/companie.controller';
import { CompanieService } from './application/services/companie.service';
import { CompanieRepository } from './infrastructure/repositories/companie.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        PrismaModule, AuthModule
    ],
    controllers: [CompanieController],
    providers: [
        CompanieService,
        CompanieRepository
    ],
    exports: [
        CompanieService,
        CompanieRepository
    ],
})
export class CompaniesModule {}
