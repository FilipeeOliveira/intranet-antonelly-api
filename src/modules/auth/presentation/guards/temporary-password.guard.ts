import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRepository } from '../../infrastructure/repositories/auth.repository';

// Decorator para marcar rotas que precisam verificar senha temporária
export const SKIP_TEMPORARY_PASSWORD_CHECK = 'skipTemporaryPasswordCheck';
export const SkipTemporaryPasswordCheck = () => 
  (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => 
    Reflect.defineMetadata(SKIP_TEMPORARY_PASSWORD_CHECK, true, descriptor ? descriptor.value : target);

@Injectable()
export class TemporaryPasswordGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authRepository: AuthRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verificar se a rota deve pular a verificação
    const skipCheck = this.reflector.getAllAndOverride<boolean>(
      SKIP_TEMPORARY_PASSWORD_CHECK,
      [context.getHandler(), context.getClass()],
    );

    if (skipCheck) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true; // Se não há usuário, deixa o AuthGuard lidar
    }

    // Buscar dados atualizados do usuário
    const userData = await this.authRepository.findUserById(user.id);
    
    if (!userData) {
      return false;
    }

    // Se usuário tem senha temporária, bloquear acesso
    if (userData.isTemporaryPassword) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Você deve alterar sua senha temporária antes de continuar',
        error: 'TEMPORARY_PASSWORD_REQUIRED',
        changePasswordUrl: '/auth/change-temporary-password',
      });
    }

    return true;
  }
}