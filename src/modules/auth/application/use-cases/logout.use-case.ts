import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../../infrastructure/repositories/auth.repository';

@Injectable()
export class LogoutUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string, userId: string): Promise<{ message: string }> {
    try {
      // Verificar se o token é válido
      const payload = this.jwtService.verify(token);
      
      if (payload.sub !== userId) {
        throw new UnauthorizedException('Token inválido para este usuário');
      }

      // Adicionar token à blacklist
      const expiresAt = new Date(payload.exp * 1000);
      await this.authRepository.blacklistToken(token, userId, expiresAt);

      return {
        message: 'Logout realizado com sucesso',
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}