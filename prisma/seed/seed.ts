import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Criar roles
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
      setor: 'TI',
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
      setor: 'Operações',
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
      setor: 'Diretoria',
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
      setor: 'Segurança',
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
      setor: 'Operações',
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