import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

export interface Feature {
    id: string
    prettyName: string
    key: string
    description: string
    pageId: string
}

// Interface para Page (agrupamento de features)
export interface Page {
    id: string
    name: string
    features: Feature[]
}

// Response completo da listagem de páginas com features
export interface PagesWithFeaturesResponse {
    data: Page[]
    total: number
    page: number
    limit: number
    totalPages: number
}


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

    async getUserFeatures(userId: string): Promise<Feature[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { permissions: { include: { feature: true } } },
        });

        return user?.permissions.map((p) => p.feature) || [];
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

    async assingManyFeatures(userId: string, featureIds: string[]) {
        const data = featureIds.map((featureId) => ({ userId, featureId }));
        return this.prisma.userPermission.createMany({
            data,
            skipDuplicates: true,
        });
    }

    async revokeFeature(userId: string, featureId: string) {
        return this.prisma.userPermission.deleteMany({
            where: { userId, featureId },
        });
    }

    async revokeManyFeatures(userId: string, featureIds: string[]) {
        return this.prisma.userPermission.deleteMany({
            where: {
                userId,
                featureId: { in: featureIds },
            },
        });
    }
}