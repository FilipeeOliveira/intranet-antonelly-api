import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthRepository } from "../../infrastructure/repositories/auth.repository";
import { ForgotPasswordDto } from "../../domain/dto/forgot-password.dto";
import { EmailService } from "src/modules/email/application/services/email.service";
import { envConfig } from "src/config/config";

@Injectable()
export class ForgotPasswordUseCase {
  private readonly logger = new Logger(ForgotPasswordUseCase.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async execute(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string; resetToken?: string }> {
    const user = await this.authRepository.findUserByEmail(forgotPasswordDto.email);

    if (!user) {
      throw new NotFoundException("Email não encontrado no sistema");
    }

    if (!user.isActive) {
      throw new NotFoundException("Usuário inativo");
    }

    // Gerar token de recuperação com expiração de 15 minutos
    const resetPayload = {
      sub: user.id,
      email: user.email,
      type: "password_reset",
    };

    const resetToken = this.jwtService.sign(resetPayload, {
      expiresIn: envConfig.RESET_TOKEN_EXPIRES_IN,
      secret: envConfig.JWT_SECRET + "_RESET", // Secret diferente para maior segurança
    });

    // Montar link de recuperação
    const resetLink = `${envConfig.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Enviar email de recuperação de senha
    try {
      await this.emailService.sendForgotPasswordEmail(user.email, {
        name: user.name,
        resetLink,
      });
      this.logger.log(`Email de recuperação enviado para: ${user.email}`);
    } catch (error) {
      this.logger.error(`Falha ao enviar email de recuperação para: ${user.email}`, error);
      // Não lançamos erro para não revelar se o email existe ou não
    }

    return {
      message: "Se o email existir no sistema, um link de recuperação será enviado.",
      // Retorna resetToken apenas em modo de desenvolvimento para facilitar testes
      ...(envConfig.MODE === "dev" && { resetToken }),
    };
  }
}
