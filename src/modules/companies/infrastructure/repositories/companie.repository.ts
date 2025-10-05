import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CompanieQueryDto } from '../../domain/dto/companie-query.dto';
import { CreateCompanieDto } from '../../domain/dto/create-companie.dto';
import { UpdateCompanieDto } from '../../domain/dto/update-companie.dto';

@Injectable()
export class CompanieRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: CompanieQueryDto) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const orderBy: any = {};
    orderBy[sortBy || 'name'] = sortOrder || 'asc';

    const [companies, total] = await Promise.all([
      this.prisma.companie.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { visitors: true },
      }),
      this.prisma.companie.count({ where }),
    ]);

    return {
      data: companies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return this.prisma.companie.findUnique({
      where: { id },
      include: { visitors: true },
    });
  }

  async create(data: CreateCompanieDto) {
    return this.prisma.companie.create({ data });
  }

  async update(id: string, data: UpdateCompanieDto) {
    return this.prisma.companie.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.companie.delete({
      where: { id },
    });
  }
}
