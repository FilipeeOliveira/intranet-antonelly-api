import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto, UserProfileDto } from '../../domain/dto/auth-reponse.dto';
import { LoginDto } from '../../domain/dto/login.dto';
import { AuthRepository } from '../../infrastructure/repositories/auth.repository';


@Injectable()
export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) { }

  async execute(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authRepository.findUserByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role.key,
    };

    try {
      const token = this.jwtService.sign(payload, {
        
      });

      const userProfile: UserProfileDto = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username || undefined,
        setor: user.setor || undefined,
        role: user.role.key,
      };

      return {
        access_token: token,
        user: userProfile,
      };
    }
    catch (e) {
      console.error(e)
    }
  }
}