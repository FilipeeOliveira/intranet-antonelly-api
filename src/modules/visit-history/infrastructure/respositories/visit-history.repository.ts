import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { VisitHistoryQueryDto } from '../../domain/dto/visit-history-query.dto';
import { VisitHistory } from '@prisma/client';

@Injectable()
export class VisitHistoryRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: VisitHistoryQueryDto) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { visitor: { name: { contains: search, mode: 'insensitive' } } },
        { visitor: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const orderBy: any = {};
    orderBy[sortBy || 'arrivedAt'] = sortOrder || 'desc';

    const [histories, total] = await Promise.all([
      this.prisma.visitHistory.findMany({
        where,
        skip,
        take: limit,
        orderBy,

      }),
      this.prisma.visitHistory.count({ where }),
    ]);

    return {
      data: histories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findLastVisitByCpf(visitorCpf: string) {
    return this.prisma.visitHistory.findFirst({
      where: { visitorCpf },
      orderBy: { arrivedAt: 'desc' },
    });
  }


  async findById(id: string) {
    return this.prisma.visitHistory.findUnique({
      where: { id },
    });
  }

  async create(data: Partial<sz>) {

    return await this.prisma.visitHistory.create({
      data: {
        description: data.description,
        visitorCpf: data.visitorCpf,
        visitorName: data.visitorName,
        visitorPhone: data.visitorPhone,
        arrivedAt: data.arrivedAt,
        leftAt: data.leftAt,
      },
    });
  }

  async update(id: string, data: Partial<VisitHistory>) {
    return this.prisma.visitHistory.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.visitHistory.delete({
      where: { id },
    });
  }

  async findVisitorsPresent() {
    return this.prisma.visitHistory.findMany({
      where: {
        leftAt: null,
      },
    });
  }

  async findVisitorsByDateRange(start: Date, end: Date) {
    return this.prisma.visitHistory.findMany({
      where: {
        arrivedAt: {
          gte: start,
          lte: end,
        },
      },
    });
  }
}
