import { PrismaService } from "src/modules/prisma/prisma.service";
import { RoomsQueryDto } from "../../domain/dto/rooms-query.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoomsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.room.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.room.update({
      where: { id },
      data,
    });
  }

  async findAll(query: RoomsQueryDto) {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: any = {};
    orderBy[sortBy || "createdAt"] = sortOrder || "desc";

    const [rooms, total] = await Promise.all([
      this.prisma.room.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.room.count({ where }),
    ]);

    return {
      data: rooms,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return this.prisma.room.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    return this.prisma.room.delete({
      where: { id },
    });
  }
}
