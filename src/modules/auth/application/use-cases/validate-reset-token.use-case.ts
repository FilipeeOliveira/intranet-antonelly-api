import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthRepository } from "../../infrastructure/repositories/auth.repository";
import { ValidateResetTokenDto } from "../../domain/dto/validate-reset-token.dto";
import { envConfig } from "src/config/config";

@Injectable()
export class ValidateResetTokenUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(validateResetTokenDto: ValidateResetTokenDto): Promise<{
    valid: boolean;
    message: string;
    expiresAt?: string;
  }> {
    const { token } = validateResetTokenDto;

    // Verificar e decodificar o token
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: envConfig.JWT_SECRET + "_RESET",
      });
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new UnauthorizedException("Token de recuperação expirado. Solicite um novo link.");
      }
      throw new UnauthorizedException("Token de recuperação inválido");
    }

    // Verificar se é um token de reset
    if (payload.type !== "password_reset") {
      throw new UnauthorizedException("Token inválido");
    }

    // Verificar se o usuário existe e está ativo
    const user = await this.authRepository.findUserById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException("Usuário não encontrado ou inativo");
    }

    // Calcular tempo de expiração restante
    const expiresAt = new Date(payload.exp * 1000).toISOString();

    return {
      valid: true,
      message: "Token válido",
      expiresAt,
    };
  }
}
