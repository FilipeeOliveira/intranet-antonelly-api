import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Criar roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrador do sistema - acesso total',
    },
  });

  const gerenteRole = await prisma.role.upsert({
    where: { name: 'GERENTE' },
    update: {},
    create: {
      name: 'GERENTE',
      description: 'Gerente - pode importar documentos e criar avisos',
    },
  });

  const padraoRole = await prisma.role.upsert({
    where: { name: 'PADRAO' },
    update: {},
    create: {
      name: 'PADRAO',
      description: 'Usuário padrão - apenas leitura',
    },
  });

  // Hash das senhas
  const hashedPassword = await bcrypt.hash('123456', 10);

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

  const usuarioUser = await prisma.user.upsert({
    where: { email: 'usuario@empresa.com' },
    update: {},
    create: {
      name: 'Maria Usuária',
      email: 'usuario@empresa.com',
      username: 'maria.usuario',
      password: hashedPassword,
      setor: 'Vendas',
      roleId: padraoRole.id,
    },
  });

  console.log('✅ Seed concluído!');
  console.log('👥 Usuários criados:');
  console.log(`📧 Admin: admin@empresa.com (senha: 123456)`);
  console.log(`📧 Gerente: gerente@empresa.com (senha: 123456)`);
  console.log(`📧 Usuário: usuario@empresa.com (senha: 123456)`);
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