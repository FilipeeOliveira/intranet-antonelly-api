import { PrismaClient } from "@prisma/client";
import { Permissions } from "../../src/shared/features";

const prisma = new PrismaClient();

export async function createPagesSeed() {

    const usersPage = await prisma.page.upsert({
        where: { name: 'USERS' },
        update: {},
        create: {
            name: 'USERS',
            features: {
                create: [
                    {
                        key: Permissions.USERS.READ,
                        prettyName: 'Visualizar Usuário',
                        description: 'Permite visualizar informações individuais de um usuário.'
                    },
                    {
                        key: Permissions.USERS.READ_ALL,
                        prettyName: 'Listar Usuários',
                        description: 'Exibe a lista completa de usuários cadastrados.'
                    },
                    {
                        key: Permissions.USERS.READ_BY_ID,
                        prettyName: 'Ver Usuário por ID',
                        description: 'Permite visualizar detalhes de um usuário específico.'
                    },
                    {
                        key: Permissions.USERS.CREATE,
                        prettyName: 'Criar Usuário',
                        description: 'Autoriza cadastrar novos usuários.'
                    },
                    {
                        key: Permissions.USERS.UPDATE,
                        prettyName: 'Editar Usuário',
                        description: 'Permite atualizar informações de usuários existentes.'
                    },
                    {
                        key: Permissions.USERS.DELETE,
                        prettyName: 'Excluir Usuário',
                        description: 'Autoriza excluir permanentemente um usuário.'
                    },
                ],
            },
        },
    });

    const companiesPage = await prisma.page.upsert({
        where: { name: 'COMPANIES' },
        update: {},
        create: {
            name: 'COMPANIES',
            features: {
                create: [
                    {
                        key: Permissions.COMPANIES.READ,
                        prettyName: 'Visualizar Empresa',
                        description: 'Permite visualizar informações individuais de uma empresa.'
                    },
                    {
                        key: Permissions.COMPANIES.READ_ALL,
                        prettyName: 'Listar Empresas',
                        description: 'Autoriza visualizar a lista completa de empresas cadastradas no sistema.'
                    },
                    {
                        key: Permissions.COMPANIES.READ_BY_ID,
                        prettyName: 'Ver Empresa por ID',
                        description: 'Permite visualizar detalhes específicos de uma empresa.'
                    },
                    {
                        key: Permissions.COMPANIES.CREATE,
                        prettyName: 'Criar Empresa',
                        description: 'Autoriza o cadastro de novas empresas no sistema.'
                    },
                    {
                        key: Permissions.COMPANIES.UPDATE,
                        prettyName: 'Editar Empresa',
                        description: 'Permite atualizar informações de empresas cadastradas.'
                    },
                    {
                        key: Permissions.COMPANIES.DELETE,
                        prettyName: 'Excluir Empresa',
                        description: 'Autoriza a remoção permanente de uma empresa.'
                    },
                ],
            },
        },
    });

    const communiquesPage = await prisma.page.upsert({
        where: { name: 'COMMUNIQUES' },
        update: {},
        create: {
            name: 'COMMUNIQUES',
            features: {
                create: [
                    {
                        key: Permissions.COMMUNIQUES.READ,
                        prettyName: 'Visualizar Comunicado',
                        description: 'Permite visualizar um comunicado individual.'
                    },
                    {
                        key: Permissions.COMMUNIQUES.READ_ALL,
                        prettyName: 'Listar Comunicados',
                        description: 'Exibe a lista completa de comunicados cadastrados.'
                    },
                    {
                        key: Permissions.COMMUNIQUES.READ_BY_ID,
                        prettyName: 'Ver Comunicado por ID',
                        description: 'Permite consultar detalhes de um comunicado específico.'
                    },
                    {
                        key: Permissions.COMMUNIQUES.CREATE,
                        prettyName: 'Criar Comunicado',
                        description: 'Autoriza o registro de um novo comunicado no sistema.'
                    },
                    {
                        key: Permissions.COMMUNIQUES.UPDATE,
                        prettyName: 'Editar Comunicado',
                        description: 'Permite atualizar o conteúdo de comunicados existentes.'
                    },
                    {
                        key: Permissions.COMMUNIQUES.DELETE,
                        prettyName: 'Excluir Comunicado',
                        description: 'Autoriza a exclusão permanente de um comunicado.'
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

                    // 🔹 VISIT SCHEDULE FEATURES
                    {
                        key: Permissions.VISIT_SCHEDULES.READ,
                        prettyName: "Ver Agendamentos",
                        description: "Permite visualizar agendamentos individuais de visitantes."
                    },
                    {
                        key: Permissions.VISIT_SCHEDULES.READ_ALL,
                        prettyName: "Listar Todos Agendamentos",
                        description: "Exibe toda a lista de agendamentos feitos para visitantes."
                    },
                    {
                        key: Permissions.VISIT_SCHEDULES.READ_BY_ID,
                        prettyName: "Ver Agendamento por ID",
                        description: "Permite visualizar detalhes de um agendamento específico."
                    },
                    {
                        key: Permissions.VISIT_SCHEDULES.CREATE,
                        prettyName: "Criar Agendamento",
                        description: "Autoriza o registro de novos agendamentos de visitantes."
                    },
                    {
                        key: Permissions.VISIT_SCHEDULES.UPDATE,
                        prettyName: "Atualizar Agendamento",
                        description: "Permite editar informações de um agendamento existente."
                    },
                    {
                        key: Permissions.VISIT_SCHEDULES.DELETE,
                        prettyName: "Excluir Agendamento",
                        description: "Autoriza remover um agendamento do sistema."
                    },
                    {
                        key: Permissions.VISIT_SCHEDULES.CONFIRM_PRESENCE,
                        prettyName: "Confirmar Presença",
                        description: "Permite confirmar a chegada do visitante na recepção."
                    },
                    {
                        key: Permissions.VISIT_SCHEDULES.CANCEL,
                        prettyName: "Cancelar Agendamento",
                        description: "Permite cancelar um agendamento previamente criado."
                    },

                    // 🔹 VISIT PRESENTS FEATURES (Presença dos Visitantes)
                    {
                        key: Permissions.VISIT_PRESENTS.READ,
                        prettyName: "Ver Presenças",
                        description: "Permite visualizar registros individuais de presença."
                    },
                    {
                        key: Permissions.VISIT_PRESENTS.READ_ALL,
                        prettyName: "Listar Todas as Presenças",
                        description: "Exibe a lista de visitantes presentes no prédio."
                    },
                    {
                        key: Permissions.VISIT_PRESENTS.READ_BY_ID,
                        prettyName: "Ver Presença por ID",
                        description: "Permite visualizar detalhes de uma presença específica."
                    },
                    {
                        key: Permissions.VISIT_PRESENTS.CREATE,
                        prettyName: "Registrar Presença",
                        description: "Autoriza registrar que um visitante chegou ao local."
                    },
                    {
                        key: Permissions.VISIT_PRESENTS.UPDATE,
                        prettyName: "Atualizar Registro de Presença",
                        description: "Permite editar dados de um registro de presença."
                    },
                    {
                        key: Permissions.VISIT_PRESENTS.DELETE,
                        prettyName: "Remover Registro de Presença",
                        description: "Autoriza excluir um registro de presença."
                    },
                    {
                        key: Permissions.VISIT_PRESENTS.CONFIRM_EXIT,
                        prettyName: "Confirmar Saída",
                        description: "Permite registrar que um visitante deixou o local."
                    },

                    // 🔹 VISIT HISTORY FEATURES (Histórico final de visitas)
                    {
                        key: Permissions.VISIT_HISTORY.READ_ALL,
                        prettyName: "Listar Histórico Completo",
                        description: "Exibe todo o histórico de visitas concluídas."
                    },
                    {
                        key: Permissions.VISIT_HISTORY.READ_BY_ID,
                        prettyName: "Ver Histórico por ID",
                        description: "Permite visualizar detalhes de uma visita específica."
                    },
                    {
                        key: Permissions.VISIT_HISTORY.CREATE,
                        prettyName: "Criar Registro no Histórico",
                        description: "Autoriza registrar manualmente uma visita no histórico."
                    },
                    {
                        key: Permissions.VISIT_HISTORY.UPDATE,
                        prettyName: "Atualizar Registro no Histórico",
                        description: "Permite editar informações de uma visita armazenada no histórico."
                    },
                    {
                        key: Permissions.VISIT_HISTORY.DELETE,
                        prettyName: "Excluir Registro de Histórico",
                        description: "Autoriza excluir registros do histórico de visitas."
                    },
                    {
                        key: Permissions.VISIT_HISTORY.EXPORT,
                        prettyName: "Exportar Histórico",
                        description: "Permite gerar relatórios/exportações do histórico de visitas."
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
                        prettyName: 'Visualizar Documento',
                        description: 'Permite visualizar um documento individual.'
                    },
                    {
                        key: Permissions.DOCUMENTS.READ_ALL,
                        prettyName: 'Listar Documentos',
                        description: 'Exibe a lista completa de documentos cadastrados.'
                    },
                    {
                        key: Permissions.DOCUMENTS.READ_BY_ID,
                        prettyName: 'Ver Documento por ID',
                        description: 'Permite visualizar detalhes específicos de um documento.'
                    },
                    {
                        key: Permissions.DOCUMENTS.CREATE,
                        prettyName: 'Criar Documento',
                        description: 'Autoriza cadastrar novos documentos no sistema.'
                    },
                    {
                        key: Permissions.DOCUMENTS.UPDATE,
                        prettyName: 'Editar Documento',
                        description: 'Permite atualizar informações de documentos existentes.'
                    },
                    {
                        key: Permissions.DOCUMENTS.DELETE,
                        prettyName: 'Excluir Documento',
                        description: 'Autoriza a exclusão permanente de documentos.'
                    },
                ],
            },
        },
    });

    const meetingsPage = await prisma.page.upsert({
        where: { name: 'MEETINGS' },
        update: {},
        create: {
            name: 'MEETINGS',
            features: {
                create: [
                    {
                        key: Permissions.MEETINGS.READ,
                        prettyName: 'Visualizar Reunião',
                        description: 'Permite visualizar uma reunião individual.'
                    },
                    {
                        key: Permissions.MEETINGS.READ_ALL,
                        prettyName: 'Listar Reuniões',
                        description: 'Exibe a lista completa de reuniões cadastradas.'
                    },
                    {
                        key: Permissions.MEETINGS.READ_BY_ID,
                        prettyName: 'Ver Reunião por ID',
                        description: 'Permite consultar os detalhes de uma reunião específica.'
                    },
                    {
                        key: Permissions.MEETINGS.CREATE,
                        prettyName: 'Criar Reunião',
                        description: 'Autoriza o agendamento ou criação de reuniões.'
                    },
                    {
                        key: Permissions.MEETINGS.UPDATE,
                        prettyName: 'Editar Reunião',
                        description: 'Permite atualizar informações de reuniões existentes.'
                    },
                    {
                        key: Permissions.MEETINGS.DELETE,
                        prettyName: 'Excluir Reunião',
                        description: 'Autoriza remover permanentemente uma reunião.'
                    },
                ],
            },
        },
    });

    const sectorsPage = await prisma.page.upsert({
        where: { name: 'SECTORS' },
        update: {},
        create: {
            name: 'SECTORS',
            features: {
                create: [
                    {
                        key: Permissions.SECTORS.READ,
                        prettyName: 'Visualizar Setor',
                        description: 'Permite visualizar informações individuais de um setor.'
                    },
                    {
                        key: Permissions.SECTORS.READ_ALL,
                        prettyName: 'Listar Setores',
                        description: 'Exibe a lista completa de setores cadastrados.'
                    },
                    {
                        key: Permissions.SECTORS.READ_BY_ID,
                        prettyName: 'Ver Setor por ID',
                        description: 'Permite visualizar detalhes de um setor específico.'
                    },
                    {
                        key: Permissions.SECTORS.CREATE,
                        prettyName: 'Criar Setor',
                        description: 'Autoriza cadastrar novos setores no sistema.'
                    },
                    {
                        key: Permissions.SECTORS.UPDATE,
                        prettyName: 'Editar Setor',
                        description: 'Permite atualizar informações de setores existentes.'
                    },
                    {
                        key: Permissions.SECTORS.DELETE,
                        prettyName: 'Excluir Setor',
                        description: 'Autoriza excluir um setor permanentemente.'
                    },
                ],
            },
        },
    });

    const roomsPage = await prisma.page.upsert({
        where: { name: 'ROOMS' },
        update: {},
        create: {
            name: 'ROOMS',
            features: {
                create: [
                    {
                        key: Permissions.ROOMS.READ,
                        prettyName: 'Visualizar Sala',
                        description: 'Permite visualizar informações individuais de uma sala.'
                    },
                    {
                        key: Permissions.ROOMS.READ_ALL,
                        prettyName: 'Listar Salas',
                        description: 'Exibe a lista completa de salas cadastradas.'
                    },
                    {
                        key: Permissions.ROOMS.READ_BY_ID,
                        prettyName: 'Ver Sala por ID',
                        description: 'Permite consultar detalhes de uma sala específica.'
                    },
                    {
                        key: Permissions.ROOMS.CREATE,
                        prettyName: 'Criar Sala',
                        description: 'Autoriza cadastrar novas salas no sistema.'
                    },
                    {
                        key: Permissions.ROOMS.UPDATE,
                        prettyName: 'Editar Sala',
                        description: 'Permite atualizar informações de salas existentes.'
                    },
                    {
                        key: Permissions.ROOMS.DELETE,
                        prettyName: 'Excluir Sala',
                        description: 'Autoriza remover permanentemente uma sala.'
                    },
                ],
            },
        },
    });

    const permissionsPage = await prisma.page.upsert({
        where: { name: 'PERMISSIONS' },
        update: {},
        create: {
            name: 'PERMISSIONS',
            features: {
                create: [
                    {
                        key: Permissions.PERMISSIONS.READ,
                        prettyName: 'Visualizar Permissão',
                        description: 'Permite visualizar dados de uma permissão específica.'
                    },
                    {
                        key: Permissions.PERMISSIONS.READ_ALL,
                        prettyName: 'Listar Permissões',
                        description: 'Exibe todas as permissões existentes no sistema.'
                    },
                    {
                        key: Permissions.PERMISSIONS.READ_BY_ID,
                        prettyName: 'Ver Permissão por ID',
                        description: 'Permite visualizar detalhes de uma permissão.'
                    },
                    {
                        key: Permissions.PERMISSIONS.CREATE,
                        prettyName: 'Criar Permissão',
                        description: 'Autoriza cadastrar novas permissões.'
                    },
                    {
                        key: Permissions.PERMISSIONS.UPDATE,
                        prettyName: 'Editar Permissão',
                        description: 'Permite atualizar permissões existentes.'
                    },
                    {
                        key: Permissions.PERMISSIONS.DELETE,
                        prettyName: 'Excluir Permissão',
                        description: 'Autoriza remover permanentemente uma permissão.'
                    },
                ],
            },
        },
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
