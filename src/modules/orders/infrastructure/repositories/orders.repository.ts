import { Injectable } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ListOrdersDto } from '../../domain/dto/list-orders.dto';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({ data });
  }

  async findAll(query: ListOrdersDto, extraWhere?: Prisma.OrderWhereInput) {
    const { page = 1, limit = 10, search, status, recipientEmail, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = { ...extraWhere };

    if (status) {
      where.status = status;
    }

    if (recipientEmail) {
      where.recipientEmail = { equals: recipientEmail, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { sender: { contains: search, mode: 'insensitive' } },
        { recipientName: { contains: search, mode: 'insensitive' } },
        { trackingCode: { contains: search, mode: 'insensitive' } },
        { protocolNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.OrderOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder ?? 'desc' }
      : { createdAt: 'desc' };

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.OrderUpdateInput): Promise<Order> {
    return this.prisma.order.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Order> {
    return this.prisma.order.delete({ where: { id } });
  }

  async countByYear(year: number): Promise<number> {
    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);
    return this.prisma.order.count({
      where: { createdAt: { gte: start, lt: end } },
    });
  }
}
