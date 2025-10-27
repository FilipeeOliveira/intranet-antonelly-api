import { PrismaClient } from '@prisma/client';
import moment from 'moment';
import { getCurrentUtcDate } from '../../src/shared/utils/getCurrentUtcDate';
import { VisitHistoryStatus } from '../../src/modules/visit-history/domain/enums/VisitHistoryStatus';

const prisma = new PrismaClient();

export async function createVisitHistorySeed() {

    const firstCompanie = await prisma.companie.findFirst();

    const visitorsPresent = [
        { "name": "Gabriel Monteiro", "cpf": "17283946501" },
        { "name": "Larissa Duarte", "cpf": "38492015762" },
        { "name": "Rafael Menezes", "cpf": "59281734690" },
        { "name": "Camila Albuquerque", "cpf": "70538419275" },
        { "name": "Thiago Pires", "cpf": "81029374651" },
        { "name": "Juliana Nogueira", "cpf": "93647281035" },
        { "name": "Lucas Cardoso", "cpf": "10829374560" },
        { "name": "Isabela Rocha", "cpf": "21938465702" },
        { "name": "Fernando Campos", "cpf": "32476581943" },
        { "name": "Mariana Tavares", "cpf": "43829176058" },
        { "name": "André Figueiredo", "cpf": "54728391067" },
        { "name": "Patrícia Lima", "cpf": "65917348209" },
        { "name": "Rodrigo Moreira", "cpf": "76392058174" },
        { "name": "Beatriz Martins", "cpf": "87910423658" },
        { "name": "Eduardo Fonseca", "cpf": "98172634509" },
        { "name": "Renata Oliveira", "cpf": "10293847561" },
        { "name": "Fábio Costa", "cpf": "21436587092" },
        { "name": "Bruna Fernandes", "cpf": "32819047564" },
        { "name": "Caio Moura", "cpf": "43928715083" },
        { "name": "Letícia Ribeiro", "cpf": "54098172634" },
        { "name": "Vinícius Azevedo", "cpf": "65739204815" },
        { "name": "Natália Soares", "cpf": "76392018452" },
        { "name": "Matheus Castro", "cpf": "87261039547" },
        { "name": "Amanda Mendes", "cpf": "98402716359" },
        { "name": "Gustavo Carvalho", "cpf": "10928347560" },
        { "name": "Luana Freitas", "cpf": "21398475026" },
        { "name": "Felipe Barbosa", "cpf": "32417589062" },
        { "name": "Carolina Andrade", "cpf": "43819276054" },
        { "name": "Henrique Vieira", "cpf": "54908172365" },
        { "name": "Sabrina Rezende", "cpf": "65098237140" }
    ];

    for (const visitorData of visitorsPresent) {
        await prisma.visitHistory.create({
            data: {
                name: visitorData.name,
                cpf: visitorData.cpf,
                status: VisitHistoryStatus.PRESENT, // PRESENTE
                arrivedAt: getCurrentUtcDate(),
                leftAt: null,
                companie: {
                    connect: { id: firstCompanie.id }
                }
            }
        });
    }

    console.log('🚪 Visitantes presentes registrados com sucesso!')

    const visitorsSchedulled = [
        { "name": "Pedro Almeida", "cpf": "76182049513" },
        { "name": "Tatiane Correia", "cpf": "89271354026" },
        { "name": "Marcelo Bastos", "cpf": "10497283651" },
        { "name": "Vanessa Mourão", "cpf": "21560394782" },
        { "name": "Diego Furtado", "cpf": "32687194057" },
        { "name": "Carla Nascimento", "cpf": "43725981603" },
        { "name": "Bruno Siqueira", "cpf": "54862039741" },
        { "name": "Larissa Teixeira", "cpf": "65913820476" },
        { "name": "João Victor Santos", "cpf": "76029481350" },
        { "name": "Bianca Dantas", "cpf": "87135942068" },
        { "name": "Felipe Duarte", "cpf": "98274610352" },
        { "name": "Priscila Reis", "cpf": "19385726041" },
        { "name": "Leonardo Moretti", "cpf": "20496871530" },
        { "name": "Caroline Prado", "cpf": "31507982647" },
        { "name": "Igor Paiva", "cpf": "42658093712" },
        { "name": "Nicole Vasconcelos", "cpf": "53769104825" },
        { "name": "Ricardo Amaral", "cpf": "64870215938" },
        { "name": "Fernanda Dias", "cpf": "75981326040" },
        { "name": "Matheus Silveira", "cpf": "86092437159" },
        { "name": "Débora Carvalho", "cpf": "97103548267" },
        { "name": "Renan Gonçalves", "cpf": "18214659370" },
        { "name": "Patrícia Mello", "cpf": "29325760481" },
        { "name": "Alexandre Pimentel", "cpf": "30436871592" },
        { "name": "Juliana Araujo", "cpf": "41547982603" },
        { "name": "Caio Torres", "cpf": "52658093714" },
        { "name": "Thaís Campos", "cpf": "63769104825" },
        { "name": "André Barbosa", "cpf": "74870215936" },
        { "name": "Michele Farias", "cpf": "85981326049" },
        { "name": "Vinícius Almeida", "cpf": "96092437152" },
        { "name": "Tatiane Ribeiro", "cpf": "07103548268" }
    ];

    for (const visitorData of visitorsSchedulled) {
        await prisma.visitHistory.create({
            data: {
                name: visitorData.name,
                cpf: visitorData.cpf,
                status: VisitHistoryStatus.SCHEDULED,
                isScheduled: true,
                arrivedAt: generateRandomVisitTimes().arrivedAt,
                leftAt: null,
                companie: {
                    connect: { id: firstCompanie.id }
                }
            }
        });
    }

    console.log('📅 Visitantes agendados registrados com sucesso!')

    const visitorsLeft = [
        { "name": "Hugo Martins", "cpf": "19027384651" },
        { "name": "Paula Ferreira", "cpf": "28139475026" },
        { "name": "Sérgio Antunes", "cpf": "37280596413" },
        { "name": "Adriana Lemos", "cpf": "46391857204" },
        { "name": "Murilo Gonçalves", "cpf": "55402968371" },
        { "name": "Tatiana Moreira", "cpf": "64513079285" },
        { "name": "Eduardo Brito", "cpf": "73624180359" },
        { "name": "Letícia Antunes", "cpf": "82735291460" },
        { "name": "Guilherme Viana", "cpf": "91846302578" },
        { "name": "Isadora Matos", "cpf": "02957413682" },
        { "name": "Alex Monteiro", "cpf": "13068524791" },
        { "name": "Priscila Nogueira", "cpf": "24179635809" },
        { "name": "Rodrigo Amaral", "cpf": "35280746910" },
        { "name": "Michele Tavares", "cpf": "46391857024" },
        { "name": "Renato Sousa", "cpf": "57402968137" },
        { "name": "Carolina Monteiro", "cpf": "68513079248" },
        { "name": "Vinícius Farias", "cpf": "79624180357" },
        { "name": "Aline Rocha", "cpf": "80735291463" },
        { "name": "Daniel Campos", "cpf": "91846302579" },
        { "name": "Bruna Almeida", "cpf": "02957413684" },
        { "name": "Felipe Duarte", "cpf": "13068524792" },
        { "name": "Larissa Moura", "cpf": "24179635807" },
        { "name": "Caio Moretti", "cpf": "35280746918" },
        { "name": "Renata Paiva", "cpf": "46391857029" },
        { "name": "Fernando Braga", "cpf": "57402968139" },
        { "name": "Natália Ribeiro", "cpf": "68513079286" },
        { "name": "Thiago Costa", "cpf": "79624180358" },
        { "name": "Amanda Pires", "cpf": "80735291464" },
        { "name": "Rogério Lima", "cpf": "91846302577" },
        { "name": "Camila Duarte", "cpf": "02957413683" }
    ];

    for (const visitorData of visitorsLeft) {

        const { arrivedAt, leftAt } = generateRandomVisitTimes();

        await prisma.visitHistory.create({
            data: {
                name: visitorData.name,
                cpf: visitorData.cpf,
                status: VisitHistoryStatus.LEFT, // SAIU
                arrivedAt,
                leftAt,
                companie: {
                    connect: { id: firstCompanie.id }
                }
            }
        });
    }

    console.log('🏃‍♂️ Visitantes que saíram registrados com sucesso!')
}

function generateRandomVisitTimes() {
    const now = moment();
    const arrivedAt = moment(now).subtract(Math.floor(Math.random() * 180) + 30, 'minutes');
    const leftAt = moment(arrivedAt).add(Math.floor(Math.random() * 120) + 30, 'minutes');
    return { arrivedAt: arrivedAt.toDate(), leftAt: leftAt.toDate() };
}