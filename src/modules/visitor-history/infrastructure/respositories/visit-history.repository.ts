import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { VisitHistoryQueryDto } from '../../domain/dto/visit-history-query.dto';

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
        include: { visitor: true },
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

  async findLastVisitByVisitor(visitorId: string) {
    return this.prisma.visitHistory.findFirst({
      where: { visitorId },
      orderBy: { arrivedAt: 'desc' },
      include: { visitor: true },
    });
  }


  async findById(id: string) {
    return this.prisma.visitHistory.findUnique({
      where: { id },
      include: { visitor: true },
    });
  }

  async create(data: { visitorId: string; arrivedAt?: Date; leftAt?: Date }) {
    return this.prisma.visitHistory.create({
      data,
      include: { visitor: true },
    });
  }

  async update(id: string, data: Partial<{ arrivedAt: Date; leftAt: Date }>) {
    return this.prisma.visitHistory.update({
      where: { id },
      data,
      include: { visitor: true },
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
      include: { visitor: true },
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
      include: { visitor: true },
    });
  }
}
