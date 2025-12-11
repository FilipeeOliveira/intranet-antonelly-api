import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { CommuniqueQueryDto } from "../../domain/dtos/communique-query.dto";
import { UpdateCommuniqueDto } from "../../domain/dtos/update-communique.dto";

@Injectable()
export class CommuniqueRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any) {
        const createdData = await this.prisma.communique.create({ data });
        let communique = await this.findById(createdData.id);

        return communique;
    }

    async findById(id: string) {
        let communique = await this.prisma.communique.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                severity: true,
                imagePath: true,
                sectorId: true,
                authorId: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: {
                            select: {
                                id: true,
                                key: true,
                                description: true,
                            }
                        },
                        sector: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            }
                        }
                    }
                },
                sector: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    }
                },
            }
        });

        return communique;
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
                include: {
                    author: true,
                    sector: true
                }
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