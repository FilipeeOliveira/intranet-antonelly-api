import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SectorsModule } from '../sectors/sectors.module';
import { UsersService } from './application/services/users.service';
import { UsersRepository } from './infrastructure/repositories/users.repository';
import { UsersController } from './presentation/controllers/users.controller';
import { SendWelcomeEmailUseCase } from './application/use-cases/send-welcome-email.use-case';
import { RolesModule } from '../roles/roles.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    SectorsModule,
    EmailModule,
    RolesModule,
    PermissionsModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    SendWelcomeEmailUseCase,
  ],
  exports: [
    UsersService,
    UsersRepository,
    SendWelcomeEmailUseCase,
  ],
})
export class UsersModule { }