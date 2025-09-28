import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SectorQueryDto } from '../../domain/dto/sector-query.dto';

@Injectable()
export class SectorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: SectorQueryDto) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const orderBy: any = {};
    orderBy[sortBy || 'name'] = sortOrder || 'asc';

    const [sectors, total] = await Promise.all([
      this.prisma.sector.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { documents: true },
      }),
      this.prisma.sector.count({ where }),
    ]);

    return {
      data: sectors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return this.prisma.sector.findUnique({
      where: { id },
      include: { documents: true },
    });
  }

  async create(data: { name: string; description?: string }) {
    return this.prisma.sector.create({ data });
  }

  async update(id: string, data: Partial<{ name: string; description: string }>) {
    return this.prisma.sector.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.sector.delete({
      where: { id },
    });
  }
}
