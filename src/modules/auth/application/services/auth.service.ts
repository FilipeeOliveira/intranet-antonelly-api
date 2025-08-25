import { Injectable } from '@nestjs/common';
import { LoginUseCase } from '../use-cases/login.use-case';
import { ValidateUserUseCase } from '../use-cases/validate-user.use-case';
import { IAuthService } from '../../domain/services/auth.service.interface';
import { AuthResponseDto } from '../../domain/dto/auth-reponse.dto';
import { LoginDto } from '../../domain/dto/login.dto';


@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly validateUserUseCase: ValidateUserUseCase,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.loginUseCase.execute(loginDto);
  }

  async validateUser(payload: any): Promise<any> {
    return this.validateUserUseCase.execute(payload);
  }
}