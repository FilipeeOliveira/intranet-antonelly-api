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

@Injectable()
export class CommuniqueService {
    constructor(
        private readonly communiqueRepository: CommuniqueRepository,
        private readonly sectorRepository: SectorRepository,
        private readonly userRepository: UsersRepository,
    ) { }

    async create(data: CreateCommuniqueDto, filename: string) {
        return this.communiqueRepository.create({
            ...data,
            imagePath: `/uploads/communiques/${filename}`,
            imageUrl: envConfig.API_URL + `api/v1/communiques/image/${filename}`,
        });
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
            // 1. Buscar comunicado
            const communique = await this.communiqueRepository.findById(id);
            if (!communique) throw new NotFoundException("Comunicado não encontrado.");

            const updateData: any = {
                ...dto,
                sectorId: dto.sectorId ? dto.sectorId : communique.sectorId,
                authorId: dto.authorId ? dto.authorId : communique.authorId,
            };


            // 2. Validar setor SOMENTE SE foi enviado no DTO
            if (dto.sectorId) {
                const sector = await this.sectorRepository.findById(dto.sectorId);

                if (!sector) {
                    throw new BadRequestException("Setor não encontrado. Verifique o ID do setor.");
                }

                updateData.sectorId = dto.sectorId;
            }

            if (dto.authorId) {
                const author = await this.userRepository.findById(dto.authorId);

                if (!author) {
                    throw new BadRequestException("Autor não encontrado. Verifique o ID do autor.");
                }

                updateData.authorId = dto.authorId;
            }

            // 3. Se existir nova imagem — validar e substituir
            if (imagePath) {

                // Valida extensão
                const validExtensions = [".png", ".jpg", ".jpeg", ".webp"];
                const ext = path.extname(imagePath).toLowerCase();

                if (!validExtensions.includes(ext)) {
                    throw new BadRequestException("Apenas imagens PNG, JPG, JPEG ou WEBP são permitidas.");
                }

                // Remover imagem antiga se existir
                if (communique.imagePath) {
                    const oldImagePath = join(process.cwd(), communique.imagePath);

                    try {
                        await fs.unlink(oldImagePath);
                    } catch (err) {
                        console.warn("Não foi possível deletar a imagem antiga:", err);
                    }
                }

                // Atualiza caminho da nova imagem
                updateData.imagePath = `/uploads/communiques/${imagePath}`;
            }


            for (const key in updateData) {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            }

            // 4. Atualizar no repositório
            const updated = await this.communiqueRepository.update(id, updateData);

            // 5. Retorno com nome da imagem extraído automaticamente
            return {
                ...updated,
                imageName: updated.imagePath ? path.basename(updated.imagePath) : null,
            };
        }
        catch (error) {

            console.error("Erro ao atualizar comunicado:", error);

            if (error instanceof HttpException) throw error;

            throw new InternalServerErrorException("Erro ao atualizar comunicado.");
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

        return this.communiqueRepository.delete(id);
    }

}