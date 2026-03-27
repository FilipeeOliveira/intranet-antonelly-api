import { Injectable } from "@nestjs/common";
import moment from "moment";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const todayStart = moment.utc().startOf("day").toDate();
    const todayEnd = moment.utc().endOf("day").toDate();
    const yesterdayStart = moment.utc().subtract(1, "day").startOf("day").toDate();
    const yesterdayEnd = moment.utc().subtract(1, "day").endOf("day").toDate();
    const last7DaysStart = moment.utc().subtract(7, "days").startOf("day").toDate();

    const [
      communiquesToday,
      communiquesYesterday,
      communiquesLast7Days,
      documentsToday,
      documentsYesterday,
      visitorsToday,
      visitorsYesterday,
      reservationsToday,
      reservationsYesterday,
    ] = await Promise.all([
      this.prisma.communique.count({
        where: { createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      this.prisma.communique.count({
        where: { createdAt: { gte: yesterdayStart, lte: yesterdayEnd } },
      }),
      this.prisma.communique.count({
        where: { createdAt: { gte: last7DaysStart, lte: todayEnd } },
      }),
      this.prisma.document.count({
        where: { createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      this.prisma.document.count({
        where: { createdAt: { gte: yesterdayStart, lte: yesterdayEnd } },
      }),
      this.prisma.visitHistory.count({
        where: { arrivedAt: { gte: todayStart, lte: todayEnd } },
      }),
      this.prisma.visitHistory.count({
        where: { arrivedAt: { gte: yesterdayStart, lte: yesterdayEnd } },
      }),
      this.prisma.meetingSchedule.count({
        where: { date: { gte: todayStart, lte: todayEnd } },
      }),
      this.prisma.meetingSchedule.count({
        where: { date: { gte: yesterdayStart, lte: yesterdayEnd } },
      }),
    ]);

    return {
      communiques: {
        today: communiquesToday,
        yesterday: communiquesYesterday,
        newLast7Days: communiquesLast7Days,
      },
      documents: {
        today: documentsToday,
        yesterday: documentsYesterday,
      },
      visitorsPresent: {
        today: visitorsToday,
        yesterday: visitorsYesterday,
      },
      reservations: {
        today: reservationsToday,
        yesterday: reservationsYesterday,
      },
    };
  }
}
