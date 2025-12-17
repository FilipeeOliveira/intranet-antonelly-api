import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { MeetingQueryDto } from '../../domain/dto/meeting-query.dto';
import moment from 'moment';

export enum MeetingStatus {
    SCHEDULED = 1,   // agendada
    IN_PROGRESS = 2, // em andamento
    COMPLETED = 3,   // concluída
}

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
                        startTime: { lt: endTime },
                        endTime: { gt: startTime },
                    },
                ],
            },
        });
    }

    async findAll(query: MeetingQueryDto) {
        const { page = 1, limit = 10, search, sortBy, sortOrder, roomId, status, startDate } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.OR = [
                { subject: { contains: search, mode: 'insensitive' } },
                { Sector: { name: { contains: search, mode: 'insensitive' } } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (roomId) {
            where.roomId = roomId;
        }

        if (status) {
            where.status = status;
        }

        if (startDate) {
            const endDate = moment(startDate).endOf('day').toDate(); // Evita que traga dados de dias posteriores.
            where.date = { gte: moment(startDate).startOf('day').toDate(), lte: endDate };
        }

        const orderBy: any = [
            { [sortBy || 'createdAt']: sortOrder || 'desc' },
            { id: 'desc' } // torna a ordenação estável
        ];

        const [meetings, total] = await Promise.all([
            this.prisma.meetingSchedule.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    Sector: true,
                    Room: true,
                    Responsible: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            sector: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true
                                }
                            },
                            role: {
                                select: {
                                    id: true,
                                    key: true,
                                    description: true,
                                }
                            }
                        },
                    },
                },
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

    async findMeetingsByStatus(args: {
        date: Date, hour: string, status: MeetingStatus
    }) {
        const { date, hour, status } = args;
        const initialDate = moment(date).utc(true).startOf('day').toDate();
        const finalDate = moment(date).utc(true).endOf('day').toDate();

        const where: any = {
            date: {
                gte: initialDate,
                lte: finalDate,
            },
            status,
        };

        switch (status) {
            case MeetingStatus.SCHEDULED:
                Object.assign(where, {
                    startTime: { gte: hour, lte: hour },
                });
                break;

            case MeetingStatus.IN_PROGRESS:
                Object.assign(where, {
                    endTime: { gte: hour, lte: hour },
                });
                break;
        }

        return this.prisma.meetingSchedule.findMany({ where });
    }



    async findById(id: string) {
        return this.prisma.meetingSchedule.findUnique({
            where: { id },
            include: {
                Sector: true,
                Room: true,
                Responsible: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: {
                            select: {
                                id: true,
                                key: true,
                                description: true,
                            }
                        }
                    },
                },
            },
        });
    }

    async create(data: any) {
        return this.prisma.meetingSchedule.create({
            data,
        });
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.prisma.meetingSchedule.findMany({
            where: {
                date: today,
            },
            orderBy: { startTime: 'asc' },
            include: {
                Sector: true,
                Room: true,
                Responsible: true,
            },
        });
    }
}
