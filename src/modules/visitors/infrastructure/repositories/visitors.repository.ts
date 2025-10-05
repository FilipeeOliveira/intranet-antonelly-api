import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { VisitorsQueryDto } from '../../domain/dto/visitors-query.dto';
import { VisitorStatus } from '../../domain/dto/create-visitors.dto';

@Injectable()
export class VisitorRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: VisitorsQueryDto) {
    const { page, limit, search, status, companieId, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;
    if (companieId) where.companieId = companieId;

    const orderBy: any = {};
    orderBy[sortBy || 'createdAt'] = sortOrder || 'asc';

    const [visitors, total] = await Promise.all([
      this.prisma.visitor.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { companie: true },
      }),
      this.prisma.visitor.count({ where }),
    ]);

    return {
      data: visitors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return this.prisma.visitor.findUnique({
      where: { id },
      include: { companie: true },
    });
  }

  async findByCompanie(companieId: string, query: VisitorsQueryDto) {
    const { page, limit, search, status, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: any = { companieId };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search, mode: 'insensitive' } },
        { cnpj: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;

    const orderBy: any = {};
    orderBy[sortBy || 'createdAt'] = sortOrder || 'asc';

    const [visitors, total] = await Promise.all([
      this.prisma.visitor.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { companie: true },
      }),
      this.prisma.visitor.count({ where }),
    ]);

    return {
      data: visitors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }


  async create(data: { name: string; email?: string; cpf?: string; companieId?: string; status?: VisitorStatus }) {
    return this.prisma.visitor.create({
      data,
      include: { companie: true },
    });
  }

  async update(id: string, data: Partial<{ name: string; email?: string; cpf?: string; cnpj?: string; companieId?: string; status?: VisitorStatus }>) {
    return this.prisma.visitor.update({
      where: { id },
      data,
      include: { companie: true },
    });
  }

  async delete(id: string) {
    return this.prisma.visitor.delete({
      where: { id },
    });
  }
}
