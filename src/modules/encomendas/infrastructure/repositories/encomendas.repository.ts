import { Injectable } from '@nestjs/common';
import { Encomenda, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ListEncomendasDto } from '../../domain/dto/list-encomendas.dto';

@Injectable()
export class EncomendasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EncomendaCreateInput): Promise<Encomenda> {
    return this.prisma.encomenda.create({ data });
  }

  async findAll(query: ListEncomendasDto, extraWhere?: Prisma.EncomendaWhereInput) {
    const { page = 1, limit = 10, search, status, destinatarioEmail, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.EncomendaWhereInput = { ...extraWhere };

    if (status) {
      where.status = status;
    }

    if (destinatarioEmail) {
      where.destinatarioEmail = { equals: destinatarioEmail, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { remetente: { contains: search, mode: 'insensitive' } },
        { destinatarioNome: { contains: search, mode: 'insensitive' } },
        { codigoRastreio: { contains: search, mode: 'insensitive' } },
        { numeroProtocolo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.EncomendaOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder ?? 'desc' }
      : { createdAt: 'desc' };

    const [data, total] = await Promise.all([
      this.prisma.encomenda.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.encomenda.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Encomenda | null> {
    return this.prisma.encomenda.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.EncomendaUpdateInput): Promise<Encomenda> {
    return this.prisma.encomenda.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Encomenda> {
    return this.prisma.encomenda.delete({ where: { id } });
  }

  async countByYear(year: number): Promise<number> {
    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);
    return this.prisma.encomenda.count({
      where: { createdAt: { gte: start, lt: end } },
    });
  }
}
