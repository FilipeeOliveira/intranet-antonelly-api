import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto, DocumentStatus } from '../../domain/dto/create-document.dto';
import { DocumentRepository } from '../../infrastructure/repositories/document.repository';
import { DocumentQueryDto } from '../../domain/dto/document-query.dto';
import { SectorRepository } from '../../../sectors/infrastructure/repositories/sector.repository';
import path, { join } from 'path';
import { existsSync, statSync, promises } from 'fs';
import { DocumentHistoryRepository } from '../../infrastructure/repositories/document-history.repository';

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
        private readonly documentHistoryRepository: DocumentHistoryRepository,
        private readonly sectorRepository: SectorRepository
    ) { }

    private getFileSize(filePath: string): number | null {
        if (!filePath) return null;
        const fullPath = join(process.cwd(), filePath);
        if (existsSync(fullPath)) {
            return statSync(fullPath).size;
        }
        return null;
    }

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

    async findAll(query: DocumentQueryDto): Promise<{ data: (Document & { fileName: string; fileSize: number | null })[]; total: number; page: number; limit: number; totalPages: number }> {
        const { data, total, page, limit, totalPages } = await this.documentRepository.findAll(query);
        return {
            data: data.map(doc => ({
                ...doc,
                status: doc.status as DocumentStatus,
                fileName: doc.filePath ? path.basename(doc.filePath) : null,
                fileSize: this.getFileSize(doc.filePath),
            })),
            total,
            page,
            limit,
            totalPages,
        };
    }

    async getHistory(id: string): Promise<(Document & { fileName: string; fileSize: number | null })[]> {
        const document = await this.documentRepository.findById(id);
        if (!document) {
            throw new NotFoundException('Documento não encontrado.');
        }

        const historyRecords = await this.documentHistoryRepository.findHistoryByDocumentId(id);

        return historyRecords.map(record => ({
            ...record,
            sectorId: document.sectorId,
            fileName: record.filePath ? path.basename(record.filePath) : null,
            fileSize: this.getFileSize(record.filePath),
            status: record.status as DocumentStatus,
        }));

    }

    async findHistoryById(id: string): Promise<(Document & { fileName: string; fileSize: number | null })> {
        const historyRecord = await this.documentHistoryRepository.findById(id);
        if (!historyRecord) {
            throw new NotFoundException('Registro de histórico não encontrado.');
        }
        
        const document = await this.documentRepository.findById(historyRecord.documentId);
        if (!document) {
            throw new NotFoundException('Documento pai não encontrado.');
        }
        
        return {
            ...historyRecord,
            sectorId: document.sectorId,
            fileName: historyRecord.filePath ? path.basename(historyRecord.filePath) : null,
            fileSize: this.getFileSize(historyRecord.filePath),
            status: historyRecord.status as DocumentStatus,
        };
    }

    async findById(id: string): Promise<(Document & { fileName: string; fileSize: number | null })> {
        const document = await this.documentRepository.findById(id);
        if (!document) {
            throw new NotFoundException('Documento não encontrado.');
        }

        return {
            ...document,
            fileName: document.filePath ? path.basename(document.filePath) : null,
            fileSize: this.getFileSize(document.filePath),
            status: document.status as DocumentStatus,
        };
    }

    async update(id: string, dto: Partial<CreateDocumentDto>, filePath?: string): Promise<(Document & { fileName: string })> {

        const document = await this.documentRepository.findById(id);
        if (!document) throw new NotFoundException('Documento não encontrado.');

        if (dto.sectorId) {
            const sector = await this.sectorRepository.findById(dto.sectorId);
            if (!sector) {
                throw new BadRequestException('Setor não encontrado. Verifique se o ID do setor está correto.');
            }
        }
        
        const updateData: any = { ...dto };

        // SE EXISTIR UM NOVO ARQUIVO → CRIA HISTÓRICO
        if (filePath) {
            if (!filePath.endsWith('.pdf')) {
                throw new BadRequestException('Apenas arquivos PDF são permitidos.');
            }

            // 1. Salvar o arquivo antigo na pasta history
            if (document.filePath) {
                const oldPath = join(process.cwd(), document.filePath);
                const historyDir = join(process.cwd(), 'uploads/documents/history');

                const oldFileName = path.basename(document.filePath);
                const historyPath = join(historyDir, oldFileName);

                // garantir diretório
                await promises.mkdir(historyDir, { recursive: true });

                try {
                    await promises.rename(oldPath, historyPath);
                } catch (err) {
                    console.error('Erro ao mover arquivo antigo para histórico:', err);
                }

                // 2. Criar histórico no banco
                await this.documentRepository.createHistory({
                    documentId: document.id,
                    title: document.title,
                    description: document.description,
                    filePath: `uploads/documents/history/${oldFileName}`,
                    version: document.version,
                    status: document.status,
                });
            }

            // 3. Atualiza documento com o novo arquivo
            updateData.filePath = filePath;

            // 4. Incrementa versão (formato: 1.0 -> 1.1 -> ... -> 1.9 -> 2.0)
            const [major, minor = '0'] = document.version.split('.');
            const currentMinor = parseInt(minor);

            if (currentMinor >= 9) {
                // Se chegou em .9, incrementa o major e reseta minor para 0
                updateData.version = `${parseInt(major) + 1}.0`;
            } else {
                // Caso contrário, apenas incrementa o minor
                updateData.version = `${major}.${currentMinor + 1}`;
            }
        }

        const updatedDocument = await this.documentRepository.update(id, updateData);

        return {
            ...updatedDocument,
            fileName: updatedDocument.filePath ? path.basename(updatedDocument.filePath) : null,
            status: updatedDocument.status as DocumentStatus,
        };
    }


    async updateLegacy(id: string, dto: Partial<CreateDocumentDto>, filePath?: string): Promise<(Document & { fileName: string })> {

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
                    await promises.unlink(join(process.cwd(), document.filePath));
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
                await promises.unlink(join(process.cwd(), document.filePath));
            } catch (err) {
                console.error(err, '[DocumentsService]');
            }
        }

        const deletedDocument = await this.documentRepository.delete(id);
        return { ...deletedDocument, status: deletedDocument.status as DocumentStatus };
    }
}
