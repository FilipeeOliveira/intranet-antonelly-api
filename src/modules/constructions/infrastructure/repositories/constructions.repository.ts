import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { FilterConstructionDto } from "../../domain/dto/filter-construction.dto";

@Injectable()
export class ConstructionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filters: FilterConstructionDto) {
    const { search, category, status, orderBy, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ConstructionWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { client: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) where.status = status;
    if (category) where.category = category;

    const sortMap: Record<string, Prisma.ConstructionOrderByWithRelationInput> = {
      date: { createdAt: "desc" },
      name: { name: "asc" },
      status: { status: "asc" },
    };

    const [data, total] = await Promise.all([
      this.prisma.construction.findMany({
        where,
        orderBy: sortMap[orderBy || "date"],
        skip,
        take: limit,
      }),
      this.prisma.construction.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    return this.prisma.construction.findUnique({ where: { id } });
  }

  async create(data: Prisma.ConstructionCreateInput) {
    return this.prisma.construction.create({ data });
  }

  async update(id: string, data: Prisma.ConstructionUpdateInput) {
    return this.prisma.construction.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.construction.delete({ where: { id } });
  }
}
