import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { addDays } from "date-fns";
import { MeetingStatus } from "../../src/modules/meeting/domain/enums/MeetingStatus";

import * as dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export async function createMeetingScheduleSeed() {
  if (process.env.MODE !== "dev") return;

  const subjects = [
    "Revisão de Sprint",
    "Planejamento de Sprint",
    "Reunião com Cliente",
    "Daily Standup",
    "Revisão de Código",
    "Treinamento Interno",
    "Reunião de Arquitetura",
    "Feedback Individual",
    "Kickoff de Projeto",
    "Sync Backend",
    "Reunião de Segurança",
    "Teste de Integração",
    "Auditoria Interna",
    "Reunião de Performance",
    "Encerramento de Sprint",
  ];

  const sectors = ["TI", "RH", "Financeiro", "Operações", "Jurídico"];
  const responsibles = ["Filipe Oliveira", "Ana Lima", "Carlos Souza", "Maria Costa", "João Silva"];

  const rooms = (await prisma.room.findMany()).map((r) => r.id);

  if (rooms.length === 0) {
    console.log("⚠️ Nenhuma sala encontrada. Crie salas antes de rodar o seed de reuniões.");
    return [];
  }

  const meetings: any[] = [];
  const meetingsPerDayLimit = 5;
  const baseDate = new Date();

  let currentDay = 0;
  let dailyMeetings: { start: number; end: number }[] = [];

  for (let i = 0; i < 15; i++) {
    if (dailyMeetings.length >= meetingsPerDayLimit) {
      currentDay++;
      dailyMeetings = [];
    }

    const formattedDate = addDays(baseDate, currentDay);

    let startHour = 9;
    let endHour = 10;
    const occupiedHours = dailyMeetings.map((m) => m.start);

    while (occupiedHours.includes(startHour)) {
      startHour++;
      endHour++;
      if (endHour > 17) {
        currentDay++;
        dailyMeetings = [];
        startHour = 9;
        endHour = 10;
        break;
      }
    }

    const startTime = `${startHour.toString().padStart(2, "0")}:00`;
    const endTime = `${endHour.toString().padStart(2, "0")}:00`;

    dailyMeetings.push({ start: startHour, end: endHour });

    meetings.push({
      id: randomUUID(),
      subject: subjects[i],
      description: `Descrição automática para ${subjects[i]}`,
      sector: sectors[i % sectors.length],
      responsible: responsibles[i % responsibles.length],
      date: new Date(`${formattedDate.toISOString().split("T")[0]}T00:00:00.000Z`),
      startTime,
      endTime,
      roomId: rooms[i % rooms.length],
      status: MeetingStatus.SCHEDULED,
    });
  }

  for (const meeting of meetings) {
    await prisma.meetingSchedule.upsert({
      where: { id: meeting.id },
      update: {},
      create: meeting,
    });
  }

  console.log(`📅 ${meetings.length} reuniões criadas.`);
  console.table(
    meetings.map((m) => ({
      subject: m.subject,
      sector: m.sector,
      responsible: m.responsible,
      date: m.date.toISOString().split("T")[0],
      start: m.startTime,
      end: m.endTime,
    })),
  );

  return meetings;
}
