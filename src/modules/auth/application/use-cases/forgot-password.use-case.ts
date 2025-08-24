import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../../infrastructure/repositories/auth.repository';
import { ForgotPasswordDto } from '../../domain/dto/forgot-password.dto';
import { envConfig } from 'src/config/config';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string; resetToken?: string }> {
    const user = await this.authRepository.findUserByEmail(forgotPasswordDto.email);

    if (!user) {
      throw new NotFoundException('Email não encontrado no sistema');
    }

    if (!user.isActive) {
      throw new NotFoundException('Usuário inativo');
    }

    // Gerar token de recuperação com expiração de 15 minutos
    const resetPayload = {
      sub: user.id,
      email: user.email,
      type: 'password_reset',
    };

    const resetToken = this.jwtService.sign(resetPayload, { 
      expiresIn: '15m',
      secret: envConfig.JWT_SECRET + '_RESET', // Secret diferente para maior segurança
    });

    // Em produção, aqui enviaria o email
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message: 'Se o email existir no sistema, um link de recuperação será enviado.',
      // Remover resetToken em produção - apenas para desenvolvimento/testes
      resetToken, 
    };
  }
}