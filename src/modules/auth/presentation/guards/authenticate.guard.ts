import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '../../domain/entities/role.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { envConfig } from 'src/config/config';

@Injectable()
export class AuthenticateGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {


    if (envConfig.MODE === 'dev') {
      console.log('Development mode: skipping role checks');
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();

    if (!requiredRoles) {
      return true;
    }

    if (!user) {
      return false;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}