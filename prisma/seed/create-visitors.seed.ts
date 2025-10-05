import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createVisitorsSeed() {
    // Visitantes
    const visitors = [
        { name: 'João da Silva', email: 'joao.silva@acme.com', cpf: '12845937091', companie: 'ACME Corp', status: 1 },
        { name: 'Maria Oliveira', email: 'maria.oliveira@techsolutions.com', cpf: '70432615800', companie: 'Tech Solutions', status: 1 },
        { name: 'Carlos Souza', email: null, cpf: '12345678901', companie: 'Global Finance', status: 2 },
        { name: 'Ana Lima Ltda', email: null, cpf: null, companie: 'Logística Rápida', status: 1 },
        { name: 'Pedro Santos', email: 'pedro.santos@marketingplus.com', cpf: '70432615800', companie: 'Marketing Plus', status: 2 },
        { name: 'Sandra Costa', email: null, cpf: '98765432100', companie: 'ACME Corp', status: 1 },
        { name: 'Empresa Tech Inovação', email: null, cpf: '27365984107', companie: 'Tech Solutions', status: 1 },
    ];

    for (const v of visitors) {
        const company = await prisma.companie.findUnique({ where: { name: v.companie } });

        if (company) {
            // Verificar se visitante já existe baseado nos campos únicos (cpf)
            let existingVisitor = null;

            if (v.cpf) {
                existingVisitor = await prisma.visitor.findUnique({ where: { cpf: v.cpf } });
            }

            if (!existingVisitor) {
                // Criar novo visitante se não existir
                await prisma.visitor.create({
                    data: {
                        name: v.name,
                        email: v.email,
                        cpf: v.cpf,
                        companieId: company.id,
                        status: v.status,
                    },
                });
            } else {
                console.log(`Visitante ${v.name} já existe, pulando...`);
            }
        }
    }

    console.log('👥 Visitantes criados.');
    return visitors;
}