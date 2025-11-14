import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { addDays } from "date-fns";
import { CreateMeetingDto } from "../../src/modules/meeting/domain/dto/create-meeting.dto";
import { MeetingStatus } from "../../src/modules/meeting/infrastructure/repositories/meeting.repository";

const prisma = new PrismaClient();

interface Meeting extends CreateMeetingDto {
    id: string;
    status: number;
}

export async function createMeetingScheduleSeed() {

    const subjects = [
        'Revisão de Sprint',
        'Planejamento de Sprint',
        'Reunião com Cliente',
        'Daily Standup',
        'Revisão de Código',
        'Treinamento Interno',
        'Reunião de Arquitetura',
        'Feedback Individual',
        'Kickoff de Projeto',
        'Sync Backend',
        'Reunião de Segurança',
        'Teste de Integração',
        'Auditoria Interna',
        'Reunião de Performance',
        'Encerramento de Sprint',
    ];

    const sectors = (await prisma.sector.findMany()).map(s => s.id);
    const rooms = (await prisma.room.findMany()).map(r => r.id);
    const users = (await prisma.user.findMany()).map(u => u.id);

    if (sectors.length === 0 || rooms.length === 0 || users.length === 0) {
        console.log('⚠️ Setores, salas ou usuários insuficientes para criar reuniões.');
        return [];
    }

    const meetings: Meeting[] = [];
    const meetingsPerDayLimit = 5; // máximo de reuniões por dia
    const baseDate = new Date();

    let currentDay = 0;
    let dailyMeetings: { start: number; end: number }[] = [];

    for (let i = 0; i < 15; i++) {
        // Se o dia atual atingiu o limite de reuniões, passa para o próximo dia
        if (dailyMeetings.length >= meetingsPerDayLimit) {
            currentDay++;
            dailyMeetings = [];
        }

        // Formatar para  ISO-8601 DateTime.
        const formattedDate = addDays(baseDate, currentDay);

        // Gerar horário não conflituoso (em intervalos de 1h)
        let startHour = 9;
        let endHour = 10;
        const occupiedHours = dailyMeetings.map(m => m.start);

        while (occupiedHours.includes(startHour)) {
            startHour++;
            endHour++;
            if (endHour > 17) {
                // se não couber mais, força próximo dia
                currentDay++;
                dailyMeetings = [];
                startHour = 9;
                endHour = 10;
                break;
            }
        }

        const startTime = `${startHour.toString().padStart(2, '0')}:00`;
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;

        // Salvar horário ocupado para evitar conflito
        dailyMeetings.push({ start: startHour, end: endHour });

        // Criar a reunião
        meetings.push({
            id: randomUUID(),
            subject: subjects[i],
            description: `Descrição automática para ${subjects[i]}`,
            date: formattedDate.toISOString(),
            startTime,
            endTime,
            roomId: rooms[i % rooms.length],
            sectorId: sectors[i % sectors.length],
            responsibleId: users[i % users.length],
            status: Object.values(MeetingStatus).filter(v => typeof v === 'number')[i % Object.values(MeetingStatus).length] as number,
        });

    }

    for (const meeting of meetings) {
        await prisma.meetingSchedule.upsert({
            where: { id: meeting.id },
            update: {},
            create: {
                ...meeting,
                status: meeting.status,
            },
        });
    }

    console.log(`📅 ${meetings.length} reuniões criadas dinamicamente sem conflitos.`);
    console.table(meetings.map(m => ({
        subject: m.subject,
        date: m.date,
        start: m.startTime,
        end: m.endTime
    })));

    return meetings;
}
