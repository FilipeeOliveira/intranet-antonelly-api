import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { EncomendasService } from './application/services/encomendas.service';
import { EncomendasRepository } from './infrastructure/repositories/encomendas.repository';
import { EncomendasController } from './presentation/controllers/encomendas.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [EncomendasController],
  providers: [EncomendasService, EncomendasRepository],
  exports: [EncomendasService, EncomendasRepository],
})
export class EncomendasModule {}
