import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { MeetingQueryDto } from '../../domain/dto/meeting-query.dto';

@Injectable()
export class MeetingRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findConflict(date: Date, startTime: string, endTime: string, excludeId?: string) {
        return this.prisma.meetingSchedule.findFirst({
            where: {
                date,
                id: excludeId ? { not: excludeId } : undefined,
                AND: [
                    {
                        OR: [
                            {
                                // começa dentro de outra reunião
                                time: { lt: endTime },
                                endTime: { gt: startTime },
                            }
                        ],
                    },
                ],
            },
        });
    }

    async findAll(query: MeetingQueryDto) {
        const { page, limit, search, type, priority, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.OR = [
                { subject: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (type) where.type = type;
        if (priority) where.priority = priority;

        const orderBy: any = {};
        orderBy[sortBy || 'date'] = sortOrder || 'asc';

        const [meetings, total] = await Promise.all([
            this.prisma.meetingSchedule.findMany({
                where,
                skip,
                take: limit,
                orderBy,
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

    async findById(id: string) {
        return this.prisma.meetingSchedule.findUnique({
            where: { id },
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

    async delete(id: string) {
        return this.prisma.meetingSchedule.delete({
            where: { id },
        });
    }

    async findToday() {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        return this.prisma.meetingSchedule.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            orderBy: { time: 'asc' },
        });
    }

}
