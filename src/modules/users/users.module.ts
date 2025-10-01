import { Module } from '@nestjs/common';
import { EmailService } from '../../shared/services/email.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SectorsModule } from '../sectors/sectors.module';
import { UsersService } from './application/services/users.service';
import { UsersRepository } from './infrastructure/repositories/users.repository';
import { UsersController } from './presentation/controllers/users.controller';

@Module({
  imports: [PrismaModule, AuthModule, SectorsModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    EmailService,
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}