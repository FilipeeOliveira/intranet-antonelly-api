import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUsersFeatures = async () => {
    const allFeatures = await prisma.feature.findMany();

    const adminUser = await prisma.user.findUnique({
        where: { username: 'admin' },
    });

    if (adminUser) {
        for (const feature of allFeatures) {
            await prisma.userPermission.create({
                data: {
                    userId: adminUser.id,
                    featureId: feature.id,
                },
            });
        }
    }

    console.log('✅ Usuário admin recebeu todas as permissões. Caso queira conceder permissões específicas para outros usuários, use o ADMIN para isso.');
}