import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    @Inject('IAuthRepository') 
    private readonly authRepository: IAuthRepository,
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