import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CompaniesQueryDto } from '../../domain/dto/companies-query.dto';
import { CreateCompanyDto } from '../../domain/dto/create-company.dto';
import { UpdateCompanyDto } from '../../domain/dto/update-companie.dto';

@Injectable()
export class CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: CompaniesQueryDto) {
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
    });
  }

  async create(data: CreateCompanyDto) {
    return this.prisma.companie.create({ data });
  }

  async update(id: string, data: UpdateCompanyDto) {
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
