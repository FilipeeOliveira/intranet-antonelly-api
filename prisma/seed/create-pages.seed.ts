import { PrismaClient } from "@prisma/client";
import { Permissions } from "../../src/shared/features";

const prisma = new PrismaClient();

export async function createPagesSeed() {

    const usersPage = await prisma.page.upsert({
        where: { name: 'USUÁRIOS' },
        update: {},
        create: {
            name: 'USUÁRIOS',
            features: {
                create: [
                    {
                        key: Permissions.USERS.READ,
                        prettyName: 'Visualizar Usuários',
                        description: 'Permite visualizar todas as informações desta página, incluindo listagem de usuários, detalhes individuais e seu status.'
                    },
                    {
                        key: Permissions.USERS.WRITE,
                        prettyName: 'Ações de escrita de Usuários',
                        description: 'Permite realizar ações de criação, atualização e exclusão de usuários no sistema.'
                    },
                ]
            }
        }
    });


    const companiesPage = await prisma.page.upsert({
        where: { name: 'EMPRESAS' },
        update: {},
        create: {
            name: 'EMPRESAS',
            features: {
                create: [
                    {
                        key: Permissions.COMPANIES.READ,
                        prettyName: 'Visualizar Empresas',
                        description: 'Permite visualizar todas as informações desta página, incluindo listagem de empresas, detalhes individuais e dados relacionados.'
                    },
                    {
                        key: Permissions.COMPANIES.WRITE,
                        prettyName: 'Ações de escrita de Empresas',
                        description: 'Permite realizar ações de criação, atualização e exclusão de empresas no sistema.'
                    },
                ]
            }
        }
    });

    const communiquesPage = await prisma.page.upsert({
        where: { name: 'COMUNICADOS' },
        update: {},
        create: {
            name: 'COMUNICADOS',
            features: {
                create: [
                    {
                        key: Permissions.COMMUNIQUES.READ,
                        prettyName: 'Visualizar Comunicados',
                        description: 'Permite visualizar todas as informações desta página, incluindo listagens, detalhes individuais e quaisquer dados relacionados a comunicados.'
                    },
                    {
                        key: Permissions.COMMUNIQUES.WRITE,
                        prettyName: 'Ações de escrita de Comunicados',
                        description: 'Permite realizar ações de criação, atualização e exclusão de comunicados no sistema.'
                    },
                ],
            },
        },
    });

    const visitorHistoryPage = await prisma.page.upsert({
        where: { name: 'PORTARIA' },
        update: {},
        create: {
            name: 'PORTARIA',
            features: {
                create: [
                    // 🔹 VISIT HISTORY GENERAL FEATURES
                    {
                        key: Permissions.VISIT_HISTORY_GENERAL.READ,
                        prettyName: 'Visualizar Visitas',
                        description: 'Permite visualizar todas as informações desta página, incluindo listagem de agendamentos, históricos, visitantes presentes, detalhes individuais e dados complementares.'
                    },
                    {
                        key: Permissions.VISIT_HISTORY_GENERAL.WRITE,
                        prettyName: 'Ações de escrita de Visitas',
                        description: 'Permite realizar ações de criação, atualização e exclusão de agendamentos e registros de visitantes no sistema.'
                    }
                ]
            }
        },
    });

    const procedimentosPage = await prisma.page.upsert({
        where: { name: 'PROCEDIMENTOS' },
        update: {},
        create: {
            name: 'PROCEDIMENTOS',
            features: {
                create: [
                    {
                        key: Permissions.DOCUMENTS.READ,
                        prettyName: 'Visualizar Documentos',
                        description: 'Permite visualizar todas as informações desta página, incluindo listagens, pré-visualizações e detalhes de documentos.'
                    },
                    {
                        key: Permissions.DOCUMENTS.WRITE,
                        prettyName: 'Ações de escrita de Documentos',
                        description: 'Permite realizar ações de criação, atualização e exclusão de documentos no sistema.'
                    },
                ],
            },
        },
    });

    const meetingsPage = await prisma.page.upsert({
        where: { name: 'RESERVAS_DE_SALAS' },
        update: {},
        create: {
            name: 'RESERVAS_DE_SALAS',
            features: {
                create: [
                    {
                        key: Permissions.MEETINGS.READ,
                        prettyName: 'Visualizar Reuniões',
                        description: 'Permite visualizar todas as informações desta página, incluindo a listagem de reuniões, detalhes individuais e dados complementares.'
                    },
                    {
                        key: Permissions.MEETINGS.WRITE,
                        prettyName: 'Ações de escrita de Reuniões',
                        description: 'Permite realizar ações de criação, atualização e exclusão de reuniões no sistema.'
                    },
                ]
            }
        }
    });

    const sectorsPage = await prisma.page.upsert({
        where: { name: 'SETORES' },
        update: {},
        create: {
            name: 'SETORES',
            features: {
                create: [
                    {
                        key: Permissions.SECTORS.READ,
                        prettyName: 'Visualizar Setores',
                        description: 'Permite visualizar todas as informações desta página, incluindo listagens de setores, detalhes individuais e dados relacionados.'
                    },
                    {
                        key: Permissions.SECTORS.WRITE,
                        prettyName: 'Ações de escrita de Setores',
                        description: 'Permite realizar ações de criação, atualização e exclusão de setores no sistema.'
                    },
                ],
            },
        },
    });

    const roomsPage = await prisma.page.upsert({
        where: { name: 'SALAS' },
        update: {},
        create: {
            name: 'SALAS',
            features: {
                create: [
                    {
                        key: Permissions.ROOMS.READ,
                        prettyName: 'Visualizar Salas',
                        description: 'Permite visualizar todas as informações desta página, incluindo listagem de salas, detalhes individuais e características relacionadas.'
                    },
                    {
                        key: Permissions.ROOMS.WRITE,
                        prettyName: 'Ações de escrita de Salas',
                        description: 'Permite realizar ações de criação, atualização e exclusão de salas no sistema.'
                    },
                ],
            },
        },
    });

    const permissionsPage = await prisma.page.upsert({
        where: { name: 'PERMISSÕES' },
        update: {},
        create: {
            name: 'PERMISSÕES',
            features: {
                create: [
                    {
                        key: Permissions.PERMISSIONS.READ,
                        prettyName: 'Visualizar Permissões',
                        description: 'Permite visualizar todas as informações desta página, incluindo listagens e detalhes de permissões atribuídas.'
                    },
                    {
                        key: Permissions.PERMISSIONS.WRITE,
                        prettyName: 'Ações de escrita de Permissões',
                        description: 'Permite modificar as permissões dos usuários, incluindo atribuição e revogação de features.'
                    },
                ]
            }
        }
    });


    console.log('📄 Páginas e features criadas:');
    console.log(`🧑‍💼 Usuários -> ${usersPage.id}`);
    console.log(`📑 Procedimentos -> ${procedimentosPage.id}`);
    console.log(`🏢 Empresas -> ${companiesPage.id}`);
    console.log(`📢 Comunicados -> ${communiquesPage.id}`);
    console.log(`🚪 Portaria (Visitantes) -> ${visitorHistoryPage.id}`);
    console.log(`📚 Reuniões -> ${meetingsPage.id}`);
    console.log(`🏭 Setores -> ${sectorsPage.id}`);
    console.log(`🏢 Salas -> ${roomsPage.id}`);
    console.log(`🔐 Permissões -> ${permissionsPage.id}`);

    return [
        usersPage,
        companiesPage,
        communiquesPage,
        meetingsPage,
        sectorsPage,
        roomsPage,
        permissionsPage,
        visitorHistoryPage,
        procedimentosPage
    ];
}
