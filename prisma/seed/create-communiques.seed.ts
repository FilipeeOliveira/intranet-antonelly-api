import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

import * as dotenv from 'dotenv';
dotenv.config();

export async function createCommuniquesSeed() {

  if (process.env.MODE !== 'dev') return;

  const users = await prisma.user.findMany({
    include: { sector: true },
  })

  if (users.length === 0) {
    throw new Error(
      'Nenhum usuário encontrado. Crie usuários antes de rodar este seed.'
    )
  }

  const severities = ['INFO', 'WARNING']

  const titles = [
    'Manutenção Programada do Sistema',
    'Atualização de Segurança',
    'Instabilidade Temporária',
    'Nova Funcionalidade Disponível',
    'Aviso Importante aos Usuários',
    'Mudança de Horário de Atendimento',
    'Atualização de Política Interna',
    'Melhoria de Performance',
    'Interrupção Programada',
    'Comunicado Geral',
  ]

  const descriptions = [
    'O sistema passará por manutenção para melhorias de desempenho e segurança.',
    'Identificamos uma instabilidade temporária que está sendo corrigida.',
    'Uma nova funcionalidade foi disponibilizada para todos os usuários.',
    'Haverá uma interrupção programada para atualização de servidores.',
    'Por favor, fiquem atentos às próximas comunicações oficiais.',
  ]

  const communiquesData = Array.from({ length: 30 }).map((_, index) => {
    const author = users[index % users.length]

    return {
      title: titles[index % titles.length],
      description: descriptions[index % descriptions.length],
      severity: severities[index % severities.length],
      authorId: author.id,
      sectorId: author.sectorId,
      imagePath: '/uploads/communiques/1765916768275-859146728.png', // Exemplo de imagem
      imageUrl: '/api/v1/communiques/image/1765916831539-992297317.png', // Exemplo de URL
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)
      ),
    }
  })

  await prisma.communique.createMany({
    data: communiquesData,
  })

  console.log(`📣 ${communiquesData.length} comunicados criados com sucesso.`)

  return communiquesData
}
