import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DocumentStatus } from '../../domain/dto/create-document.dto';
import { DocumentQueryDto } from '../../domain/dto/document-query.dto';

@Injectable()
export class DocumentHistoryRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(query: DocumentQueryDto) {
        const { page, limit, search, status, sector, sectorId, version, sortBy, sortOrder } = query;

        const skip = (page - 1) * limit;

        // Construir filtros
        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (status) {
            where.status = status;
        }

        // Prioriza filtro por sectorId (UUID) se fornecido
        if (sectorId) {
            where.sectorId = sectorId;
        } else if (sector) {
            // Caso contrário, filtra por nome do setor
            where.sector = {
                name: {
                    contains: sector, mode: 'insensitive',
                }
            };
        }

        if (version) {
            where.version = { contains: version, mode: 'insensitive' };
        }

        // Construir ordenação
        const orderBy: any = {};
        orderBy[sortBy || 'title'] = sortOrder || 'asc';

        const [documents, total] = await Promise.all([
            this.prisma.documentHistory.findMany({
                where,
                skip,
                take: limit,
                orderBy,
            }),
            this.prisma.documentHistory.count({ where }),
        ]);

        return {
            data: documents,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findHistoryByDocumentId(documentId: string) {
        return this.prisma.documentHistory.findMany({
            where: { documentId },
            orderBy: { createdAt: 'desc' },
        });
    }


    async findById(id: string) {
        return this.prisma.documentHistory.findUnique({
            where: { id },
        });
    }

    async create(data: {
        documentId: string;
        title: string;
        description?: string;
        filePath: string;
        version: string;
        status: string;
    }) {
        return this.prisma.documentHistory.create({ data });
    }

    async delete(id: string) {
        return this.prisma.documentHistory.delete({
            where: { id },
        });
    }
}
