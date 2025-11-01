import { Injectable } from '@nestjs/common';
import { VisitHistory } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { VisitHistoryQueryDto } from '../../domain/dto/visit-history-query.dto';
import { VisitHistoryStatusList } from '../../domain/enums/VisitHistoryStatus';

@Injectable()
export class VisitHistoryRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: VisitHistoryQueryDto) {
    const { page, limit, search, sortBy, sortOrder, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { visitor: { name: { contains: search, mode: 'insensitive' } } },
        { visitor: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const orderBy: any = {};
    orderBy[sortBy || 'arrivedAt'] = sortOrder || 'desc';

    const [histories, total] = await Promise.all([
      this.prisma.visitHistory.findMany({
        where,
        skip,
        include: {
          companie: true,
        },
        take: limit,
        orderBy,

      }),
      this.prisma.visitHistory.count({ where }),
    ]);

    return {
      data: histories.map(h => ({
        ...h,
        statusLabel: VisitHistoryStatusList[h.status],
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findLastVisitByCpf(cpf: string) {
    return this.prisma.visitHistory.findFirst({
      where: { cpf },
      orderBy: { arrivedAt: 'desc' },
    });
  }


  async findById(id: string) {
    return this.prisma.visitHistory.findUnique({
      where: { id },
      include: {
        companie: true,
      }
    });
  }

  async create(data: Partial<VisitHistory>) {

    return await this.prisma.visitHistory.create({
      data: {
        description: data.description,
        cpf: data.cpf,
        name: data.name,
        phone: data.phone,
        companyId: data.companyId,
        status: data.status,
        isScheduled: data.isScheduled || false,
        arrivedAt: data.arrivedAt
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
