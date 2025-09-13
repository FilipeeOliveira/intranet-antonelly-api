import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';


@Injectable()
export class PermissionsService {
    constructor(private prisma: PrismaService) { }

    async getAllPagesWithFeatures() {
        return this.prisma.page.findMany({
            include: { features: true },
        });
    }

    // permissions.service.ts
    async setUserPermissions(userId: string, featureIds: string[]) {
        // Remove todas as permissões antigas
        await this.prisma.userPermission.deleteMany({
            where: { userId },
        });

        // Insere as novas
        const data = featureIds.map((featureId) => ({ userId, featureId }));

        await this.prisma.userPermission.createMany({
            data,
            skipDuplicates: true,
        });

        // Retorna as permissões atualizadas
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: { permissions: { include: { feature: { include: { page: true } } } } },
        });
    }


    async getUserPermissions(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                permissions: {
                    include: { feature: { include: { page: true } } },
                },
            },
        });

        // Converter em formato JSON estruturado
        const pages: Record<string, any> = {};

        user.permissions.forEach((p) => {
            const pageName = p.feature.page.name;
            if (!pages[pageName]) {
                pages[pageName] = {
                    allowed: true,
                    features: {},
                };
            }
            pages[pageName].features[p.feature.key] = true;
        });

        return { pages };
    }

    async assignFeature(userId: string, featureId: string) {
        return this.prisma.userPermission.create({
            data: { userId, featureId },
        });
    }

    async revokeFeature(userId: string, featureId: string) {
        return this.prisma.userPermission.deleteMany({
            where: { userId, featureId },
        });
    }
}
