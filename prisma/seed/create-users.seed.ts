import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export async function createUsersSeed({ rolesCreated, sectorRecords }: { rolesCreated: any; sectorRecords: any }) {

    const { superadminRole } = rolesCreated;

    const SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME;
    const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL;
    const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD;
    const PASSWORD_SALTS = parseInt(process.env.PASSWORD_SALTS, 10);

    // Hash das senhas
    const superadminPasswordHashed = await bcrypt.hash(SUPERADMIN_PASSWORD, PASSWORD_SALTS);

    // Criar usuário Super Administrador
    const superadminUser = await prisma.user.upsert({
        where: { email: 'superadmin@empresa.com' },
        update: {},
        create: {
            name: 'Super Administrador',
            email: SUPERADMIN_EMAIL,
            username: SUPERADMIN_USERNAME,
            password: superadminPasswordHashed,
            sectorId: sectorRecords['TI'].id,
            roleId: superadminRole.id,
        },
    });


    console.log('✅ Seed concluído!');
    console.log('👥 Usuários criados:');
    console.log(`📧 Super Admin: ${SUPERADMIN_EMAIL} (senha: ${SUPERADMIN_PASSWORD})`);

    return [
        superadminUser
    ];
}