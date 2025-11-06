import { Injectable } from '@nestjs/common';
import { VisitHistory } from '@prisma/client';
import moment from 'moment';
import { PrismaService } from '../../../prisma/prisma.service';
import { VisitHistoryQueryDto } from '../../domain/dto/visit-history-query.dto';
import { VisitHistoryStatus, VisitHistoryStatusList } from '../../domain/enums/VisitHistoryStatus';

@Injectable()
export class VisitHistoryRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: VisitHistoryQueryDto) {
    const { page, limit, search, sortBy, sortOrder, status, date, time } = query;
    const skip = (page - 1) * limit;

    let where: any = {};
    if (search) {
      where = {
        name: { contains: search, mode: 'insensitive' },
      }
    }

    if (status) {
      where.status = status;
    }

    // Filtro por data e/ou hora
    if (date && time) {
      // Caso Data + Hora
      const start = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').utc(true).startOf('hour');
      const end = moment(start).utc(true).endOf('hour');

      where.arrivedAt = {
        gte: start.toDate(),
        lte: end.toDate(),
      };
    }

    else if (date && !time) {
      // Caso apenas a Data
      const start = moment(date, 'YYYY-MM-DD').utc(true).startOf('day');
      const end = moment(date, 'YYYY-MM-DD').utc(true).endOf('day');

      where.arrivedAt = {
        gte: start.toDate(),
        lte: end.toDate(),
      };
    }
    else if (!date && time) {
      // Caso apenas a Hora (usa o dia atual)
      const today = moment().format('YYYY-MM-DD');
      const start = moment(`${today} ${time}`, 'YYYY-MM-DD HH:mm').utc(true).startOf('hour');
      const end = moment(start).utc(true).endOf('hour');

      where.arrivedAt = {
        gte: start.toDate(),
        lte: end.toDate(),
      };
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

  async count(args: {
    status?: VisitHistoryStatus;

  }): Promise<number> {
    return this.prisma.visitHistory.count({ where: args });
  }

  async findVisitorPresentByCpf(args: {
    cpf: string;
    startDate?: Date;
    endDate?: Date;
  }) {

    const { cpf } = args;
    args.startDate = moment(args.startDate).startOf('day').toDate() || moment().startOf('day').toDate();
    args.endDate = moment(args.endDate).endOf('day').toDate() || moment().endOf('day').toDate();

    return this.prisma.visitHistory.findFirst({
      where: {
        cpf,
        leftAt: null,
        arrivedAt: {
          gte: args.startDate,
          lte: args.endDate,
        },
        status: VisitHistoryStatus.PRESENT,
      },
    });
  }

  async findVisitorScheduledByCpf(args: {
    cpf: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { cpf } = args;
    args.startDate = args.startDate || moment().startOf('day').toDate();
    args.endDate = args.endDate || moment().endOf('day').toDate();

    return this.prisma.visitHistory.findFirst({
      where: {
        cpf,
        leftAt: null,
        arrivedAt: {
          gte: args.startDate,
          lte: args.endDate,
        },
        status: VisitHistoryStatus.SCHEDULED,
      },
    });
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
