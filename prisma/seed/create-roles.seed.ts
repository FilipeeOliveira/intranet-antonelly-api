import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

export async function createRolesSeed() {

    // Criar roles
    const superadminRole = await prisma.role.upsert({
        where: { key: 'SUPERADMIN' },
        update: {},
        create: {
            key: 'SUPERADMIN',
            description: 'Super Administrador - acesso total e irrevogável',
        },
    });

    const adminRole = await prisma.role.upsert({
        where: { key: 'ADMIN' },
        update: {},
        create: {
            key: 'ADMIN',
            description: 'Administrador do sistema - acesso total',
        },
    });

    const gerenteRole = await prisma.role.upsert({
        where: { key: 'GERENTE' },
        update: {},
        create: {
            key: 'GERENTE',
            description: 'Gerente - pode importar documentos e criar avisos',
        },
    });

    const diretorRole = await prisma.role.upsert({
        where: { key: 'DIRETOR' },
        update: {},
        create: {
            key: 'DIRETOR',
            description: 'Diretor - acesso total aos relatórios e gestão',
        },
    });

    const portariaRole = await prisma.role.upsert({
        where: { key: 'PORTARIA' },
        update: {},
        create: {
            key: 'PORTARIA',
            description: 'Portaria - controle de acesso e visitantes',
        },
    });

    const funcionarioRole = await prisma.role.upsert({
        where: { key: 'FUNCIONARIO' },
        update: {},
        create: {
            key: 'FUNCIONARIO',
            description: 'Funcionário - acesso básico ao sistema',
        },
    });

    return { superadminRole, adminRole, gerenteRole, diretorRole, portariaRole, funcionarioRole };
}