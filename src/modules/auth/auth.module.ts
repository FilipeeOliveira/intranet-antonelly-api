import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { AuthService } from './application/services/auth.service';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { ValidateUserUseCase } from './application/use-cases/validate-user.use-case';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthGuard } from './presentation/guards/auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    // Infrastructure
    AuthRepository,
    AuthService,
    LoginUseCase,
    ValidateUserUseCase,
    
    // Presentation
    AuthGuard,
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}