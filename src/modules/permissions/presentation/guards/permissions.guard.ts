import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector, private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredFeature = this.reflector.get<string>(
            'feature',
            context.getHandler(),
        );
        if (!requiredFeature) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user; // JWT deve popular isso

        const userPerms = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                permissions: { include: { feature: true } },
            },
        });

        const hasFeature = userPerms.permissions.some(
            (p) => p.feature.key === requiredFeature,
        );

        if (!hasFeature) throw new ForbiddenException('No access to feature');
        return true;
    }
}
