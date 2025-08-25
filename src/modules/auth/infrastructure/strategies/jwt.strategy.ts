import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envConfig } from 'src/config/config';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authRepository: AuthRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envConfig.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Verificar se token não está na blacklist
    const token = ExtractJwt.fromAuthHeaderAsBearerToken();
    // TODO: Implementar verificação de blacklist se necessário

    // Validar usuário
    const user = await this.authRepository.findUserById(payload.sub);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuário inválido ou inativo');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.key,
      isTemporaryPassword: user.isTemporaryPassword,
    };
  }
}