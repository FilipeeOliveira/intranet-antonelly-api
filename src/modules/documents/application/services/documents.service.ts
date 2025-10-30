import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto, DocumentStatus } from '../../domain/dto/create-document.dto';
import { DocumentRepository } from '../../infrastructure/repositories/document.repository';
import { DocumentQueryDto } from '../../domain/dto/document-query.dto';
import { SectorRepository } from '../../../sectors/infrastructure/repositories/sector.repository';
import path, { join } from 'path';
import { unlink } from 'fs/promises';

export interface Document {
    id: string;
    title: string;
    description?: string;
    sectorId: string;
    filePath: string;
    version: string;
    status: DocumentStatus;
}

@Injectable()
export class DocumentsService {
    constructor(
        private readonly documentRepository: DocumentRepository,
        private readonly sectorRepository: SectorRepository
    ) { }

    async create(dto: CreateDocumentDto, filePath: string): Promise<{ fileName: string } & Document> {
        if (!filePath.endsWith('.pdf')) {
            throw new BadRequestException('Apenas arquivos PDF são permitidos.');
        }

        const sector = await this.sectorRepository.findById(dto.sectorId);
        if (!sector) {
            throw new BadRequestException('Setor não encontrado. Verifique se o ID do setor está correto.');
        }

        const document = await this.documentRepository.create({
            title: dto.title,
            description: dto.description,
            sectorId: dto.sectorId,
            filePath,
        });

        return {
            ...document,
            fileName: path.basename(filePath),
            status: document.status as DocumentStatus,
        };
    }

    async approveDocument(id: string): Promise<Document> {
        const document = await this.documentRepository.findById(id);
        if (!document) {
            throw new NotFoundException('Documento não encontrado.');
        }

        const updatedDocument = await this.documentRepository.update(id, { status: DocumentStatus.APPROVED });

        return {
            ...updatedDocument,
            status: updatedDocument.status as DocumentStatus,
        };
    }

    async findAll(query: DocumentQueryDto): Promise<{ data: (Document & { fileName: string })[]; total: number; page: number; limit: number; totalPages: number }> {
        const { data, total, page, limit, totalPages } = await this.documentRepository.findAll(query);
        return {
            data: data.map(doc => ({
                ...doc,
                status: doc.status as DocumentStatus,
                fileName: doc.filePath ? path.basename(doc.filePath) : null,
            })),
            total,
            page,
            limit,
            totalPages,
        };
    }

    async findById(id: string): Promise<(Document & { fileName: string })> {
        const document = await this.documentRepository.findById(id);
        if (!document) {
            throw new NotFoundException('Documento não encontrado.');
        }
        
        return {
            ...document,
            fileName: document.filePath ? path.basename(document.filePath) : null,
            status: document.status as DocumentStatus,
        };
    }

    async update(id: string, dto: Partial<CreateDocumentDto>, filePath?: string): Promise<(Document & { fileName: string })> {
        
        // Adicionar a lógica para atualizar a versão do documento se um novo arquivo for enviado.
        
        const document = await this.documentRepository.findById(id);
        if (!document) throw new NotFoundException('Documento não encontrado.');

        if (dto.sectorId) {
            const sector = await this.sectorRepository.findById(dto.sectorId);
            if (!sector) {
                throw new BadRequestException('Setor não encontrado. Verifique se o ID do setor está correto.');
            }
        }

        const updateData: any = { ...dto };

        if (filePath) {
            if (!filePath.endsWith('.pdf')) throw new BadRequestException('Apenas arquivos PDF são permitidos.');

            // Apaga o arquivo antigo se existir
            if (document.filePath) {
                try {
                    await unlink(join(process.cwd(), document.filePath));
                } catch (err) {
                    console.error(err, '[DocumentsService]');
                }
            }

            updateData.filePath = filePath;
        }

        const updatedDocument = await this.documentRepository.update(id, updateData);
        return { ...updatedDocument, fileName: updatedDocument.filePath ? path.basename(updatedDocument.filePath) : null, status: updatedDocument.status as DocumentStatus };
    }

    async delete(id: string): Promise<Document> {
        const document = await this.documentRepository.findById(id);
        if (!document) throw new NotFoundException('Documento não encontrado.');

        // Apaga o arquivo físico
        if (document.filePath) {
            try {
                await unlink(join(process.cwd(), document.filePath));
            } catch (err) {
                console.error(err, '[DocumentsService]');
            }
        }

        const deletedDocument = await this.documentRepository.delete(id);
        return { ...deletedDocument, status: deletedDocument.status as DocumentStatus };
    }
}
