import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { MeetingQueryDto } from "../../domain/dto/meeting-query.dto";
import { MeetingStatus } from "../../domain/enums/MeetingStatus";
import moment from "moment";

export { MeetingStatus };

@Injectable()
export class MeetingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findConflict(date: Date, startTime: string, endTime: string, roomId: string, excludeId?: string) {
    return this.prisma.meetingSchedule.findFirst({
      where: {
        date,
        roomId,
        id: excludeId ? { not: excludeId } : undefined,
        status: { notIn: [MeetingStatus.CANCELED, MeetingStatus.COMPLETED] },
        AND: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        ],
      },
    });
  }

  async findAll(query: MeetingQueryDto) {
    const { page = 1, limit = 10, search, sortBy, sortOrder, roomId, status, startDate, tab } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: "insensitive" } },
        { sector: { contains: search, mode: "insensitive" } },
        { responsible: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (roomId) {
      where.roomId = roomId;
    }

    if (tab) {
      switch (tab) {
        case "scheduled":
          where.status = MeetingStatus.SCHEDULED;
          break;
        case "in_progress":
          where.status = MeetingStatus.IN_PROGRESS;
          break;
        case "history":
          where.status = { in: [MeetingStatus.COMPLETED, MeetingStatus.CANCELED] };
          break;
      }
    } else if (status) {
      where.status = status;
    }

    if (startDate) {
      const startOfDay = moment.utc(startDate).startOf("day").toDate();
      const endOfDay = moment.utc(startDate).endOf("day").toDate();
      where.date = { gte: startOfDay, lte: endOfDay };
    }

    const orderBy: any = [
      { [sortBy || "createdAt"]: sortOrder || "desc" },
      { id: "desc" },
    ];

    const [meetings, total] = await Promise.all([
      this.prisma.meetingSchedule.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { Room: true },
      }),
      this.prisma.meetingSchedule.count({ where }),
    ]);

    return {
      data: meetings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findInProgressPastEndTime(date: Date, currentTime: string) {
    const startOfDay = moment(date).utc(true).startOf("day").toDate();
    const endOfDay = moment(date).utc(true).endOf("day").toDate();

    return this.prisma.meetingSchedule.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        status: MeetingStatus.IN_PROGRESS,
        endTime: { lte: currentTime },
      },
    });
  }

  async findScheduledPastEndTime(date: Date, currentTime: string) {
    const startOfDay = moment(date).utc(true).startOf("day").toDate();
    const endOfDay = moment(date).utc(true).endOf("day").toDate();

    return this.prisma.meetingSchedule.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        status: MeetingStatus.SCHEDULED,
        endTime: { lte: currentTime },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.meetingSchedule.findUnique({
      where: { id },
      include: { Room: true },
    });
  }

  async create(data: any) {
    return this.prisma.meetingSchedule.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.meetingSchedule.update({
      where: { id },
      data,
    });
  }

  async cancel(id: string) {
    return this.prisma.meetingSchedule.update({
      where: { id },
      data: { status: MeetingStatus.CANCELED },
    });
  }

  async findToday() {
    const startOfDay = moment().utc(true).startOf("day").toDate();
    const endOfDay = moment().utc(true).endOf("day").toDate();

    return this.prisma.meetingSchedule.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: { startTime: "asc" },
      include: { Room: true },
    });
  }
}
