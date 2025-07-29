import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';

// Domain
import { IAuthRepository } from './domain/repositories/auth.repository.interface';
import { IAuthService } from './domain/services/auth.service.interface';

// Infrastructure
import { AuthRepository } from './infrastructure/repositories/auth.repository';

// Application
import { AuthService } from './application/services/auth.service';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { ValidateUserUseCase } from './application/use-cases/validate-user.use-case';

// Presentation
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
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    
    // Application
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
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