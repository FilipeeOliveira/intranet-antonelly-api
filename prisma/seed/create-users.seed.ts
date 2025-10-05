import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function createUsersSeed({ rolesCreated, sectorRecords }: { rolesCreated: any; sectorRecords: any }) {

    const { adminRole, gerenteRole, diretorRole, portariaRole, funcionarioRole } = rolesCreated;

    // Hash das senhas
    const hashedPassword = await bcrypt.hash('AdminPass@123', 12);

    // Criar usuários de exemplo
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@empresa.com' },
        update: {},
        create: {
            name: 'Administrador',
            email: 'admin@empresa.com',
            username: 'admin',
            password: hashedPassword,
            sectorId: sectorRecords['TI'].id,
            roleId: adminRole.id,
        },
    });

    const gerenteUser = await prisma.user.upsert({
        where: { email: 'gerente@empresa.com' },
        update: {},
        create: {
            name: 'João Gerente',
            email: 'gerente@empresa.com',
            username: 'joao.gerente',
            password: hashedPassword,
            sectorId: sectorRecords['Operações'].id,
            roleId: gerenteRole.id,
        },
    });

    const diretorUser = await prisma.user.upsert({
        where: { email: 'diretor@empresa.com' },
        update: {},
        create: {
            name: 'Carlos Diretor',
            email: 'diretor@empresa.com',
            username: 'carlos.diretor',
            password: hashedPassword,
            sectorId: sectorRecords['Diretoria'].id,
            roleId: diretorRole.id,
        },
    });

    const portariaUser = await prisma.user.upsert({
        where: { email: 'portaria@empresa.com' },
        update: {},
        create: {
            name: 'Ana Portaria',
            email: 'portaria@empresa.com',
            username: 'ana.portaria',
            password: hashedPassword,
            sectorId: sectorRecords['Segurança'].id,
            roleId: portariaRole.id,
        },
    });

    const funcionarioUser = await prisma.user.upsert({
        where: { email: 'funcionario@empresa.com' },
        update: {},
        create: {
            name: 'José Funcionário',
            email: 'funcionario@empresa.com',
            username: 'jose.funcionario',
            password: hashedPassword,
            sectorId: sectorRecords['Operações'].id,
            roleId: funcionarioRole.id,
        },
    });

    console.log('✅ Seed concluído!');
    console.log('👥 Usuários criados:');
    console.log(`📧 Admin: admin@empresa.com (senha: AdminPass@123)`);
    console.log(`📧 Diretor: diretor@empresa.com (senha: AdminPass@123)`);
    console.log(`📧 Gerente: gerente@empresa.com (senha: AdminPass@123)`);
    console.log(`📧 Portaria: portaria@empresa.com (senha: AdminPass@123)`);
    console.log(`📧 Funcionário: funcionario@empresa.com (senha: AdminPass@123)`);

    return [
        adminUser,
        gerenteUser,
        diretorUser,
        portariaUser,
        funcionarioUser,
    ];
}