import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createCompaniesSeed() {
    // Empresas
    const companies = [
        { name: 'ACME Corp', cnpj: '10433218196071', description: 'Fornecedor de equipamentos' },
        { name: 'Tech Solutions', cnpj: '01338908386348', description: 'Consultoria em TI' },
        { name: 'Global Finance', cnpj: '79402654235166', description: 'Serviços financeiros' },
        { name: 'Logística Rápida', cnpj: '16155940781663', description: 'Transporte e logística' },
        { name: 'Marketing Plus', cnpj: '18495931034159', description: 'Agência de marketing digital' },
    ];

    for (const company of companies) {
        await prisma.companie.upsert({
            where: { name: company.name },
            update: {},
            create: company,
        });
    }

    console.log('🏢 Empresas criadas.');
    return companies;
}






