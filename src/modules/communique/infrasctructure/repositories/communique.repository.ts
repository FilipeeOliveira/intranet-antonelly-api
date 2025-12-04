import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { CommuniqueQueryDto } from "../../domain/dtos/communique-query.dto";
import { UpdateCommuniqueDto } from "../../domain/dtos/update-communique.dto";

@Injectable()
export class CommuniqueRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.communique.create({ data });
    }

    async findById(id: string) {
        return this.prisma.communique.findUnique({ where: { id } });
    }

    async findAll(query: CommuniqueQueryDto) {
        const { page, limit, search, sector, sectorId, sortBy, sortOrder } = query;

        const skip = (page - 1) * limit;

        // Construir filtros
        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                {
                    author: {
                        name: {
                            contains: search, mode: 'insensitive',
                        }
                    }
                },
                { severity: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Prioriza filtro por sectorId (UUID) se fornecido
        if (sectorId) {
            where.sectorId = sectorId;
        }
        else if (sector) {
            // Caso contrário, filtra por nome do setor
            where.sector = {
                name: {
                    contains: sector, mode: 'insensitive',
                }
            };
        }

        // Construir ordenação
        const orderBy: any = {};
        orderBy[sortBy || 'title'] = sortOrder || 'asc';

        const [communiques, total] = await Promise.all([
            this.prisma.communique.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: { sector: true },
            }),
            this.prisma.communique.count({ where }),
        ]);

        return {
            data: communiques,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async update(id: string, data: UpdateCommuniqueDto) {

        return this.prisma.communique.update({ where: { id }, data });
    }

    async delete(id: string) {
        return this.prisma.communique.delete({ where: { id } });
    }
}