import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { FEATURES_KEY } from './features.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredFeatures = this.reflector.get<string[]>(
            FEATURES_KEY,
            context.getHandler(),
        );

        if (!requiredFeatures || requiredFeatures.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) throw new ForbiddenException('Usuário não autenticado');

        const userPerms = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                permissions: { include: { feature: true } },
            },
        });

        if (!userPerms) throw new ForbiddenException('Usuário não encontrado');

        const userFeatures = userPerms.permissions.map((p) => p.feature.key);

        // 🔹 Opção 1: precisa ter pelo menos UMA das features
        const hasAtLeastOne = requiredFeatures.some((f) =>
            userFeatures.includes(f),
        );
        
        // 🔹 Opção 2: precisa ter TODAS as features
        // const hasAll = requiredFeatures.every((f) => userFeatures.includes(f));
        if (!hasAtLeastOne)
            throw new ForbiddenException('Você não tem permissão para acessar este recurso/ação');

        return true;
    }
}
