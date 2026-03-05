import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { envConfig } from "src/config/config";
import { EmailModule } from "../email/email.module";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthService } from "./application/services/auth.service";
import { ChangeTemporaryPasswordUseCase } from "./application/use-cases/change-temporary-password.use-case";
import { ForgotPasswordUseCase } from "./application/use-cases/forgot-password.use-case";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { LogoutUseCase } from "./application/use-cases/logout.use-case";
import { ResetPasswordUseCase } from "./application/use-cases/reset-password.use-case";
import { ValidateResetTokenUseCase } from "./application/use-cases/validate-reset-token.use-case";
import { ValidateUserUseCase } from "./application/use-cases/validate-user.use-case";
import { AuthRepository } from "./infrastructure/repositories/auth.repository";
import { JwtStrategy } from "./infrastructure/strategies/jwt.strategy";
import { AuthController } from "./presentation/controllers/auth.controller";
import { AuthenticateGuard } from "./presentation/guards/authenticate.guard";
import { TemporaryPasswordGuard } from "./presentation/guards/temporary-password.guard";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: envConfig.JWT_SECRET,
      signOptions: { expiresIn: envConfig.JWT_EXPIRES_IN },
    }),
    PrismaModule,
    EmailModule,
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
    ValidateResetTokenUseCase,
    LogoutUseCase,
    ChangeTemporaryPasswordUseCase,

    // Infrastructure
    JwtStrategy,

    // Presentation
    AuthenticateGuard,
    TemporaryPasswordGuard,
  ],
  exports: [AuthService, AuthenticateGuard, TemporaryPasswordGuard, AuthRepository],
})
export class AuthModule {}
