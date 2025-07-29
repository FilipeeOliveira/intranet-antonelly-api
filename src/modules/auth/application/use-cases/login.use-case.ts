import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { AuthResponseDto, UserProfileDto } from '../../domain/dto/auth-reponse.dto';
import { LoginDto } from '../../domain/dto/login.dto';


@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IAuthRepository') 
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

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
      role: user.role.name,
    };

    const token = this.jwtService.sign(payload);

    const userProfile: UserProfileDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username || undefined,
      setor: user.setor || undefined,
      role: user.role.name,
    };

    return {
      access_token: token,
      user: userProfile,
    };
  }
}