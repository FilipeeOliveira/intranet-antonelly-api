import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { AuthService } from './application/services/auth.service';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { ValidateUserUseCase } from './application/use-cases/validate-user.use-case';
import { ForgotPasswordUseCase } from './application/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { ChangeTemporaryPasswordUseCase } from './application/use-cases/change-temporary-password.use-case';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthGuard } from './presentation/guards/auth.guard';
import { TemporaryPasswordGuard } from './presentation/guards/temporary-password.guard';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
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
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    LogoutUseCase,
    ChangeTemporaryPasswordUseCase,
    
    // Infrastructure
    JwtStrategy,
    
    // Presentation
    AuthGuard,
    TemporaryPasswordGuard,
  ],
  exports: [AuthService, AuthGuard, TemporaryPasswordGuard, AuthRepository],
})
export class AuthModule {}