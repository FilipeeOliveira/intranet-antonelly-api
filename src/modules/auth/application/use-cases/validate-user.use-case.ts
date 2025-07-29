import {Injectable } from '@nestjs/common';
import { AuthRepository } from '../../infrastructure/repositories/auth.repository';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(payload: any) {
    const user = await this.authRepository.findUserById(payload.sub);
    
    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
      setor: user.setor,
    };
  }
}