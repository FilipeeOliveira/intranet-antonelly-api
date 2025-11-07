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
        { "name": "Sabrina Rezende", "cpf": "65098237140" },

        { "name": "Gabriel Monteiro - Extra 1", "cpf": "17283946601" },
        { "name": "Larissa Duarte - Extra 2", "cpf": "38492015863" },
        { "name": "Rafael Menezes - Extra 3", "cpf": "59281734793" },
        { "name": "Camila Albuquerque - Extra 4", "cpf": "70538419379" },
        { "name": "Thiago Pires - Extra 5", "cpf": "81029374756" },
        { "name": "Juliana Nogueira - Extra 6", "cpf": "93647281141" },
        { "name": "Lucas Cardoso - Extra 7", "cpf": "10829374668" },
        { "name": "Isabela Rocha - Extra 8", "cpf": "21938465811" },
        { "name": "Fernando Campos - Extra 9", "cpf": "32476582053" },
        { "name": "Mariana Tavares - Extra 10", "cpf": "43829176169" },
        { "name": "André Figueiredo - Extra 11", "cpf": "54728391179" },
        { "name": "Patrícia Lima - Extra 12", "cpf": "65917348322" },
        { "name": "Rodrigo Moreira - Extra 13", "cpf": "76392058288" },
        { "name": "Beatriz Martins - Extra 14", "cpf": "87910423773" },
        { "name": "Eduardo Fonseca - Extra 15", "cpf": "98172634625" },
        { "name": "Renata Oliveira - Extra 16", "cpf": "10293847678" },
        { "name": "Fábio Costa - Extra 17", "cpf": "21436587208" },
        { "name": "Bruna Fernandes - Extra 18", "cpf": "32819047681" },
        { "name": "Caio Moura - Extra 19", "cpf": "43928715201" },
        { "name": "Letícia Ribeiro - Extra 20", "cpf": "54098172753" },
        { "name": "Vinícius Azevedo - Extra 21", "cpf": "65739204935" },
        { "name": "Natália Soares - Extra 22", "cpf": "76392018573" },
        { "name": "Matheus Castro - Extra 23", "cpf": "87261039669" },
        { "name": "Amanda Mendes - Extra 24", "cpf": "98402716482" },
        { "name": "Gustavo Carvalho - Extra 25", "cpf": "10928347684" },
        { "name": "Luana Freitas - Extra 26", "cpf": "21398475151" },
        { "name": "Felipe Barbosa - Extra 27", "cpf": "32417589188" },
        { "name": "Carolina Andrade - Extra 28", "cpf": "43819276181" },
        { "name": "Henrique Vieira - Extra 29", "cpf": "54908172493" },
        { "name": "Sabrina Rezende - Extra 30", "cpf": "65098237269" },
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
  { "name": "Tatiane Ribeiro", "cpf": "07103548268" },

  { "name": "Pedro Almeida - Extra 1", "cpf": "76182049713" },
  { "name": "Tatiane Correia - Extra 2", "cpf": "89271354228" },
  { "name": "Marcelo Bastos - Extra 3", "cpf": "10497283854" },
  { "name": "Vanessa Mourão - Extra 4", "cpf": "21560394986" },
  { "name": "Diego Furtado - Extra 5", "cpf": "32687194262" },
  { "name": "Carla Nascimento - Extra 6", "cpf": "43725981809" },
  { "name": "Bruno Siqueira - Extra 7", "cpf": "54862039948" },
  { "name": "Larissa Teixeira - Extra 8", "cpf": "65913820684" },
  { "name": "João Victor Santos - Extra 9", "cpf": "76029481559" },
  { "name": "Bianca Dantas - Extra 10", "cpf": "87135942278" },
  { "name": "Felipe Duarte - Extra 11", "cpf": "98274610563" },
  { "name": "Priscila Reis - Extra 12", "cpf": "19385726253" },
  { "name": "Leonardo Moretti - Extra 13", "cpf": "20496871743" },
  { "name": "Caroline Prado - Extra 14", "cpf": "31507982861" },
  { "name": "Igor Paiva - Extra 15", "cpf": "42658093927" },
  { "name": "Nicole Vasconcelos - Extra 16", "cpf": "53769105041" },
  { "name": "Ricardo Amaral - Extra 17", "cpf": "64870216155" },
  { "name": "Fernanda Dias - Extra 18", "cpf": "75981326258" },
  { "name": "Matheus Silveira - Extra 19", "cpf": "86092437379" },
  { "name": "Débora Carvalho - Extra 20", "cpf": "97103548488" },
  { "name": "Renan Gonçalves - Extra 21", "cpf": "18214659592" },
  { "name": "Patrícia Mello - Extra 22", "cpf": "29325760704" },
  { "name": "Alexandre Pimentel - Extra 23", "cpf": "30436871816" },
  { "name": "Juliana Araujo - Extra 24", "cpf": "41547982828" },
  { "name": "Caio Torres - Extra 25", "cpf": "52658093938" },
  { "name": "Thaís Campos - Extra 26", "cpf": "63769105053" },
  { "name": "André Barbosa - Extra 27", "cpf": "74870216169" },
  { "name": "Michele Farias - Extra 28", "cpf": "85981326275" },
  { "name": "Vinícius Almeida - Extra 29", "cpf": "96092437382" },
  { "name": "Tatiane Ribeiro - Extra 30", "cpf": "07103548498" },
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
  { "name": "Camila Duarte", "cpf": "02957413683" },

  { "name": "Hugo Martins - Extra 1", "cpf": "19027384851" },
  { "name": "Paula Ferreira - Extra 2", "cpf": "28139475228" },
  { "name": "Sérgio Antunes - Extra 3", "cpf": "37280596616" },
  { "name": "Adriana Lemos - Extra 4", "cpf": "46391857408" },
  { "name": "Murilo Gonçalves - Extra 5", "cpf": "55402968576" },
  { "name": "Tatiana Moreira - Extra 6", "cpf": "64513079491" },
  { "name": "Eduardo Brito - Extra 7", "cpf": "73624180566" },
  { "name": "Letícia Antunes - Extra 8", "cpf": "82735291668" },
  { "name": "Guilherme Viana - Extra 9", "cpf": "91846302787" },
  { "name": "Isadora Matos - Extra 10", "cpf": "02957413892" },
  { "name": "Alex Monteiro - Extra 11", "cpf": "13068524903" },
  { "name": "Priscila Nogueira - Extra 12", "cpf": "24179636021" },
  { "name": "Rodrigo Amaral - Extra 13", "cpf": "35280747123" },
  { "name": "Michele Tavares - Extra 14", "cpf": "46391857238" },
  { "name": "Renato Sousa - Extra 15", "cpf": "57402968352" },
  { "name": "Carolina Monteiro - Extra 16", "cpf": "68513079462" },
  { "name": "Vinícius Farias - Extra 17", "cpf": "79624180573" },
  { "name": "Aline Rocha - Extra 18", "cpf": "80735291679" },
  { "name": "Daniel Campos - Extra 19", "cpf": "91846302799" },
  { "name": "Bruna Almeida - Extra 20", "cpf": "02957413904" },
  { "name": "Felipe Duarte - Extra 21", "cpf": "13068525014" },
  { "name": "Larissa Moura - Extra 22", "cpf": "24179636118" },
  { "name": "Caio Moretti - Extra 23", "cpf": "35280747231" },
  { "name": "Renata Paiva - Extra 24", "cpf": "46391857349" },
  { "name": "Fernando Braga - Extra 25", "cpf": "57402968460" },
  { "name": "Natália Ribeiro - Extra 26", "cpf": "68513079594" },
  { "name": "Thiago Costa - Extra 27", "cpf": "79624180686" },
  { "name": "Amanda Pires - Extra 28", "cpf": "80735291790" },
  { "name": "Rogério Lima - Extra 29", "cpf": "91846302888" },
  { "name": "Camila Duarte - Extra 30", "cpf": "02957414013" },
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