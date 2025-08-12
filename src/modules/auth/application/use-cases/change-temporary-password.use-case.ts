import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../../infrastructure/repositories/auth.repository';
import { ChangeTemporaryPasswordDto } from '../../domain/dto/change-temporary-password.dto';

@Injectable()
export class ChangeTemporaryPasswordUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(
    userId: string,
    changePasswordDto: ChangeTemporaryPasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    // Verificar se as senhas coincidem
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Nova senha e confirmação não coincidem');
    }

    // Buscar o usuário
    const user = await this.authRepository.findUserById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuário não encontrado ou inativo');
    }

    // Verificar se realmente tem senha temporária
    if (!user.isTemporaryPassword) {
      throw new BadRequestException('Usuário não possui senha temporária');
    }

    // Verificar senha temporária atual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha temporária atual inválida');
    }

    // Hash da nova senha com salt rounds 12
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Atualizar a senha no banco e marcar como não temporária
    await this.authRepository.updateUserPassword(user.id, hashedNewPassword);
    await this.authRepository.updateTemporaryPasswordFlag(user.id, false);

    return {
      message: 'Senha alterada com sucesso. Agora você pode usar sua nova senha.',
    };
  }
}