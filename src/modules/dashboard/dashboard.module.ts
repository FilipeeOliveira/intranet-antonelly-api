import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { DashboardService } from './application/services/dashboard.service';
import { DashboardController } from './presentation/controllers/dashboard.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
