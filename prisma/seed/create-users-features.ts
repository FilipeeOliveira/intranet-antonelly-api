import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUsersFeatures = async () => {
    const allFeatures = await prisma.feature.findMany();

    // Dar todas as permissões ao Super Administrador
    const superadminUser = await prisma.user.findUnique({
        where: { username: 'superadmin' },
    });

    if (superadminUser) {
        for (const feature of allFeatures) {
            await prisma.userPermission.upsert({
                where: { userId_featureId: { userId: superadminUser.id, featureId: feature.id } },
                update: {},
                create: {
                    userId: superadminUser.id,
                    featureId: feature.id,
                },
            });
        }
    }

    // Dar todas as permissões ao Admin
    const adminUser = await prisma.user.findUnique({
        where: { username: 'admin' },
    });

    if (adminUser) {
        for (const feature of allFeatures) {
            await prisma.userPermission.upsert({
                where: { userId_featureId: { userId: adminUser.id, featureId: feature.id } },
                update: {},
                create: {
                    userId: adminUser.id,
                    featureId: feature.id,
                },
            });
        }
    }

    console.log('✅ Super Admin e Admin receberam todas as permissões.');
}