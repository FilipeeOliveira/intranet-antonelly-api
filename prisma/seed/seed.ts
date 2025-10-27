import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { createRolesSeed } from './create-roles.seed';
import { createSectorsSeed } from './create-sectors.seed';
import { createUsersSeed } from './create-users.seed';
import { createPagesSeed } from './create-pages.seed';
import { createCompaniesSeed } from './create-companies.seed';
import { createRoomsSeed } from './create-rooms.seed';
import { createVisitHistorySeed } from './create-visit-history.seed';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  const rolesCreated = await createRolesSeed();
  const sectorRecords = await createSectorsSeed();
  const usersCreated = await createUsersSeed({ rolesCreated, sectorRecords });
  const pagesCreated = await createPagesSeed();
  const companiesCreated = await createCompaniesSeed();
  const roomsCreated = await createRoomsSeed();
  const visitHistoryCreated = await createVisitHistorySeed();

  console.log('🌱 Seed finalizada com sucesso!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erro no seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });