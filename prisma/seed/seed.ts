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

  

  // Setores
  const setores = ['RH', 'TI', 'Financeiro', 'Diretoria', 'Operações', 'Marketing', 'Segurança'];

  let sectorRecords = {};

  for (const setorName of setores) {
    const sector = await prisma.sector.upsert({
      where: { name: setorName },
      update: {},
      create: { name: setorName },
    });

    sectorRecords[setorName] = sector;
  }
  console.log('🏢 Setores criados.');

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

  // Criar páginas
  const usuariosPage = await prisma.page.upsert({
    where: { name: 'USUARIOS' },
    update: {},
    create: {
      name: 'USUARIOS',
      features: {
        create: [
          { key: 'VIEW_USERS', description: 'Listar usuários' },
          { key: 'CREATE_USER', description: 'Criar usuário' },
          { key: 'UPDATE_USER', description: 'Editar usuário' },
          { key: 'DELETE_USER', description: 'Excluir usuário' },
        ],
      },
    },
  });

  const portariaPage = await prisma.page.upsert({
    where: { name: 'PORTARIA' },
    update: {},
    create: {
      name: 'PORTARIA',
      features: {
        create: [
          { key: 'VIEW_VISITORS', description: 'Visualizar visitantes' },
          { key: 'REGISTER_VISITOR', description: 'Registrar novo visitante' },
          { key: 'EXIT_VISITOR', description: 'Registrar saída de visitante' },
        ],
      },
    },
  });

  const procedimentosPage = await prisma.page.upsert({
    where: { name: 'PROCEDIMENTOS' },
    update: {},
    create: {
      name: 'PROCEDIMENTOS',
      features: {
        create: [
          { key: 'VIEW_PROCEDURES', description: 'Visualizar procedimentos' },
          { key: 'CREATE_PROCEDURE', description: 'Criar novo procedimento' },
          { key: 'UPDATE_PROCEDURE', description: 'Editar procedimento' },
          { key: 'DELETE_PROCEDURE', description: 'Excluir procedimento' },
        ],
      },
    },
  });

  console.log('📄 Páginas e features criadas:');
  console.log(`🧑‍💼 Usuários -> ${usuariosPage.id}`);
  console.log(`🚪 Portaria -> ${portariaPage.id}`);
  console.log(`📑 Procedimentos -> ${procedimentosPage.id}`);

  // Empresas
  const companies = [
    { name: 'ACME Corp', description: 'Fornecedor de equipamentos' },
    { name: 'Tech Solutions', description: 'Consultoria em TI' },
    { name: 'Global Finance', description: 'Serviços financeiros' },
    { name: 'Logística Rápida', description: 'Transporte e logística' },
    { name: 'Marketing Plus', description: 'Agência de marketing digital' },
  ];

  for (const company of companies) {
    await prisma.companie.upsert({
      where: { name: company.name },
      update: {},
      create: company,
    });
  }

  console.log('🏢 Empresas criadas.');

  // Visitantes
  const visitors = [
    { name: 'João da Silva', email: 'joao.silva@acme.com', companie: 'ACME Corp' },
    { name: 'Maria Oliveira', email: 'maria.oliveira@techsolutions.com', companie: 'Tech Solutions' },
    { name: 'Carlos Souza', email: 'carlos.souza@globalfinance.com', companie: 'Global Finance' },
    { name: 'Ana Lima', email: 'ana.lima@logisticarapida.com', companie: 'Logística Rápida' },
    { name: 'Pedro Santos', email: 'pedro.santos@marketingplus.com', companie: 'Marketing Plus' },
  ];

  for (const v of visitors) {
    const company = await prisma.companie.findUnique({ where: { name: v.companie } });

    if (company) {
      await prisma.visitor.upsert({
        where: { email: v.email },
        update: {},
        create: {
          name: v.name,
          email: v.email,
          companieId: company.id,
        },
      });
    }
  }

  console.log('👥 Visitantes criados.');
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