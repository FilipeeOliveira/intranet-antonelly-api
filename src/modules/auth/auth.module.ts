import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { AuthService } from './application/services/auth.service';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { ValidateUserUseCase } from './application/use-cases/validate-user.use-case';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';
import { RoleGuard } from './presentation/guards/role.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    // Infrastructure
    AuthRepository,
    AuthService,
    AuthService,
    LoginUseCase,
    ValidateUserUseCase,
    
    // Presentation
    JwtStrategy,
    RoleGuard,
  ],
  exports: [AuthService, RoleGuard],
})
export class AuthModule {}