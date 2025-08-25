import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../../infrastructure/repositories/auth.repository';
import { ResetPasswordDto } from '../../domain/dto/reset-password.dto';
import { envConfig } from 'src/config/config';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword, confirmPassword } = resetPasswordDto;

    // Verificar se as senhas coincidem
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Nova senha e confirmação não coincidem');
    }

    // Verificar e decodificar o token
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: envConfig.JWT_SECRET + '_RESET',
      });
    } catch (error) {
      throw new UnauthorizedException('Token de recuperação inválido ou expirado');
    }

    // Verificar se é um token de reset
    if (payload.type !== 'password_reset') {
      throw new UnauthorizedException('Token inválido');
    }

    // Buscar o usuário
    const user = await this.authRepository.findUserById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuário não encontrado ou inativo');
    }

    // Hash da nova senha com salt rounds 12
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Atualizar a senha no banco
    await this.authRepository.updateUserPassword(user.id, hashedNewPassword);

    return {
      message: 'Senha alterada com sucesso. Faça login com sua nova senha.',
    };
  }
}