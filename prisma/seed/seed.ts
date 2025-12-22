import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { createCommuniquesSeed } from './create-communiques.seed';
import { createCompaniesSeed } from './create-companies.seed';
import { createMeetingScheduleSeed } from './create-meeting-schedule.seed';
import { createPagesSeed } from './create-pages.seed';

import { createRoleFeaturesSeed } from './create-roles-features.seed';
import { createRolesSeed } from './create-roles.seed';
import { createRoomsSeed } from './create-rooms.seed';
import { createSectorsSeed } from './create-sectors.seed';
import { createUsersFeatures } from './create-users-features';
import { createUsersSeed } from './create-users.seed';
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
  const meetingScheduleCreated = await createMeetingScheduleSeed();
  const usersFeaturesCreated = await createUsersFeatures();
  const communiquesCreated = await createCommuniquesSeed();
  const roleFeatures = await createRoleFeaturesSeed();

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