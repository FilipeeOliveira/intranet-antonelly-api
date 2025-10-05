import { PrismaClient, Sector } from '@prisma/client';

const prisma = new PrismaClient();

export async function createSectorsSeed() {
    const setores = ['RH', 'TI', 'Financeiro', 'Diretoria', 'Operações', 'Marketing', 'Segurança'] as const;

    let sectorRecords: { [key in typeof setores[number]]?: Sector } = {};


    for (const setorName of setores) {
        const sector = await prisma.sector.upsert({
            where: { name: setorName },
            update: {},
            create: { name: setorName },
        });

        sectorRecords[setorName] = sector;
    }
    console.log('🏢 Setores criados.');

    return sectorRecords;
}