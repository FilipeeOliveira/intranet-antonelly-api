import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CommuniqueQueryDto } from "../../domain/dtos/communique-query.dto";
import { CreateCommuniqueDto } from "../../domain/dtos/create-communique.dto";
import { UpdateCommuniqueDto } from "../../domain/dtos/update-communique.dto";
import { CommuniqueRepository } from "../../infrasctructure/repositories/communique.repository";

import { promises as fs } from "fs";
import * as path from "path";
import { join } from "path";
import { envConfig } from "src/config/config";
import { SectorRepository } from "src/modules/sectors/infrastructure/repositories/sector.repository";
import { UsersRepository } from "src/modules/users/infrastructure/repositories/users.repository";
import { CommuniquesGateway } from "../../infrasctructure/gateways/communiques.gateway";
import { EmailService } from "src/modules/email/application/services/email.service";
import { SendEmailCommuniqueBySector } from "../use-cases/send-email-communique-by-sector";

@Injectable()
export class CommuniqueService {
    constructor(
        private readonly communiqueRepository: CommuniqueRepository,
        private readonly sectorRepository: SectorRepository,
        private readonly userRepository: UsersRepository,
        private readonly communiquesGateway: CommuniquesGateway,
        private readonly emailService: EmailService,
        private readonly sendEmailCommuniqueBySector: SendEmailCommuniqueBySector,
    ) { }

    async create(data: CreateCommuniqueDto, filename: string) {
        const communique = await this.communiqueRepository.create({
            ...data,
            imagePath: `/uploads/communiques/${filename}`,
            imageUrl: envConfig.API_URL + `/api/v1/communiques/image/${filename}`,
        });

        this.sendEmailCommuniqueBySector.execute(
            communique.sectorId,
            {
                title: communique.title,
                description: communique.description,
                severity: communique.severity,
                imageUrl: communique.imagePath,
                sector: communique.sector,
                author: communique.author,
                createdAt: communique.createdAt.toISOString(),
            }
        );

        this.communiquesGateway.emitCreated(communique);

        return communique;
    }

    async findById(id: string) {
        return this.communiqueRepository.findById(id);
    }

    async findAll(filters: CommuniqueQueryDto) {
        return this.communiqueRepository.findAll(filters);
    }


    async update(
        id: string,
        dto: Partial<UpdateCommuniqueDto>,
        imagePath?: string
    ) {
        try {
            // 1. Buscar comunicado (JÁ COM RELATIONS)
            const communique = await this.communiqueRepository.findById(id)
            if (!communique) {
                throw new NotFoundException('Comunicado não encontrado.')
            }

            // 2. Montar dados de update (fallback para valores atuais)
            const updateData: any = {
                ...dto,
                sectorId: dto.sectorId ?? communique.sectorId,
                authorId: dto.authorId ?? communique.authorId,
            }

            // 3. Validar setor SOMENTE se enviado
            if (dto.sectorId) {
                const sector = await this.sectorRepository.findById(dto.sectorId)
                if (!sector) {
                    throw new BadRequestException(
                        'Setor não encontrado. Verifique o ID do setor.'
                    )
                }
            }

            // 4. Validar autor SOMENTE se enviado
            if (dto.authorId) {
                const author = await this.userRepository.findById(dto.authorId)
                if (!author) {
                    throw new BadRequestException(
                        'Autor não encontrado. Verifique o ID do autor.'
                    )
                }
            }

            // 5. Nova imagem (se existir)
            if (imagePath) {
                const validExtensions = ['.png', '.jpg', '.jpeg', '.webp']
                const ext = path.extname(imagePath).toLowerCase()

                if (!validExtensions.includes(ext)) {
                    throw new BadRequestException(
                        'Apenas imagens PNG, JPG, JPEG ou WEBP são permitidas.'
                    )
                }

                // Remove imagem antiga
                if (communique.imagePath) {
                    const oldImagePath = join(process.cwd(), communique.imagePath)
                    try {
                        await fs.unlink(oldImagePath)
                    } catch (err) {
                        console.warn('Não foi possível deletar a imagem antiga:', err)
                    }
                }

                updateData.imagePath = `/uploads/communiques/${imagePath}`
                updateData.imageUrl = envConfig.API_URL + `/api/v1/communiques/image/${imagePath}`
            }

            // 6. Limpar undefined
            for (const key in updateData) {
                if (updateData[key] === undefined) {
                    delete updateData[key]
                }
            }

            // 7. Persistir no banco
            await this.communiqueRepository.update(id, updateData)

            // 8. MERGE EM MEMÓRIA (preserva relations)
            const updatedCommunique = {
                ...communique,   // mantém relations
                ...updateData,   // sobrescreve campos simples
            }

            const response = {
                ...updatedCommunique,
                imageName: updatedCommunique.imagePath
                    ? path.basename(updatedCommunique.imagePath)
                    : null,
            }

            // 9. Emitir evento WS com objeto COMPLETO
            this.communiquesGateway.emitUpdated(response)

            return response
        } catch (error) {
            console.error('Erro ao atualizar comunicado:', error)

            if (error instanceof HttpException) throw error

            throw new InternalServerErrorException('Erro ao atualizar comunicado.')
        }
    }


    async delete(id: string) {

        const communique = await this.communiqueRepository.findById(id);
        if (!communique) throw new NotFoundException("Comunicado não encontrado.");

        // Remover imagem associada
        if (communique.imagePath) {
            const imagePath = join(process.cwd(), communique.imagePath);
            try {
                await fs.unlink(imagePath);
            }
            catch (err) {
                console.warn("Não foi possível deletar a imagem do comunicado:", err);
            }
        }

        this.communiquesGateway.emitDeleted(id);

        return this.communiqueRepository.delete(id);
    }

}