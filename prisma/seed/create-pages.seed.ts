import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createPagesSeed() {
    const usuariosPage = await prisma.page.upsert({
        where: { name: 'USUARIOS' },
        update: {},
        create: {
            name: 'USUARIOS',
            features: {
                create: [
                    {
                        key: 'VIEW_USERS',
                        prettyName: 'Listar Usuários',
                        description: 'Permite visualizar a lista completa de usuários cadastrados no sistema, com filtros e opções de busca.'
                    },
                    {
                        key: 'CREATE_USER',
                        prettyName: 'Criar Usuário',
                        description: 'Autoriza o cadastro de novos usuários com suas respectivas informações e permissões de acesso.'
                    },
                    {
                        key: 'UPDATE_USER',
                        prettyName: 'Editar Usuário',
                        description: 'Concede permissão para atualizar dados de usuários existentes, incluindo perfis e senhas.'
                    },
                    {
                        key: 'DELETE_USER',
                        prettyName: 'Excluir Usuário',
                        description: 'Habilita a exclusão de usuários do sistema, removendo seus registros e acessos.'
                    },
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
                    {
                        key: 'VIEW_VISITORS',
                        prettyName: 'Visualizar Visitantes',
                        description: 'Permite visualizar todos os visitantes registrados, bem como seu status de entrada e saída.'
                    },
                    {
                        key: 'REGISTER_VISITOR',
                        prettyName: 'Registrar Visitante',
                        description: 'Autoriza o registro de novos visitantes, incluindo informações pessoais e o motivo da visita.'
                    },
                    {
                        key: 'EXIT_VISITOR',
                        prettyName: 'Registrar Saída',
                        description: 'Permite marcar a saída de um visitante, atualizando o histórico de presença na portaria.'
                    },
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
                    {
                        key: 'VIEW_PROCEDURES',
                        prettyName: 'Visualizar Procedimentos',
                        description: 'Permite consultar todos os procedimentos cadastrados, com informações detalhadas e status atual.'
                    },
                    {
                        key: 'CREATE_PROCEDURE',
                        prettyName: 'Criar Procedimento',
                        description: 'Autoriza o cadastro de novos procedimentos operacionais, definindo título, setor e responsável.'
                    },
                    {
                        key: 'UPDATE_PROCEDURE',
                        prettyName: 'Editar Procedimento',
                        description: 'Habilita a modificação de informações existentes em procedimentos, mantendo o histórico atualizado.'
                    },
                    {
                        key: 'DELETE_PROCEDURE',
                        prettyName: 'Excluir Procedimento',
                        description: 'Permite a exclusão de procedimentos que não são mais válidos ou foram substituídos.'
                    },
                ],
            },
        },
    });

    console.log('📄 Páginas e features criadas:');
    console.log(`🧑‍💼 Usuários -> ${usuariosPage.id}`);
    console.log(`🚪 Portaria -> ${portariaPage.id}`);
    console.log(`📑 Procedimentos -> ${procedimentosPage.id}`);

    return [usuariosPage, portariaPage, procedimentosPage];
}
