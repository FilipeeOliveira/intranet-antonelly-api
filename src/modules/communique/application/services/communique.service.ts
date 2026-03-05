import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CommuniqueQueryDto } from "../../domain/dtos/communique-query.dto";
import { CreateCommuniqueDto } from "../../domain/dtos/create-communique.dto";
import { UpdateCommuniqueDto } from "../../domain/dtos/update-communique.dto";
import { CommuniqueRepository } from "../../infrasctructure/repositories/communique.repository";

import { promises as fs } from "fs";
import * as path from "path";
import { join } from "path";
import { SectorRepository } from "src/modules/sectors/infrastructure/repositories/sector.repository";
import { UsersRepository } from "src/modules/users/infrastructure/repositories/users.repository";
import { CommuniquesGateway } from "../../infrasctructure/gateways/communiques.gateway";
import { SendEmailCommuniqueBySector } from "../use-cases/send-email-communique-by-sector";
import { SendNotificationAboutCommunique } from "../use-cases/send-notification-about-communique";

@Injectable()
export class CommuniqueService {
  constructor(
    private readonly communiqueRepository: CommuniqueRepository,
    private readonly sectorRepository: SectorRepository,
    private readonly userRepository: UsersRepository,
    private readonly communiquesGateway: CommuniquesGateway,
    private readonly sendNotificationAboutCommunique: SendNotificationAboutCommunique,
    private readonly sendEmailCommuniqueBySector: SendEmailCommuniqueBySector,
  ) {}

  async create(data: CreateCommuniqueDto, filename?: string) {
    const communique = await this.communiqueRepository.create({
      ...data,
      imagePath: filename ? `/uploads/communiques/${filename}` : null,
      imageUrl: filename ? `/api/v1/communiques/image/${filename}` : null,
    });

    void this.sendEmailCommuniqueBySector
      .execute(communique.sectorId, {
        title: communique.title,
        description: communique.description,
        severity: communique.severity,
        imageUrl: communique.imageUrl,
        sector: communique.sector,
        author: communique.author,
        createdAt: communique.createdAt.toISOString(),
      })
      .catch((err) => console.error("[CommuniqueService] Falha ao enviar email do comunicado:", err));

    try {
      this.communiquesGateway.emitCreated(communique);
    } catch (err) {
      console.error("[CommuniqueService] Falha ao emitir evento WebSocket (created):", err);
    }

    void this.sendNotificationAboutCommunique
      .execute({
        title: communique.title,
        description: communique.description,
        severity: communique.severity,
      })
      .catch((err) => console.error("[CommuniqueService] Falha ao enviar notificação do comunicado:", err));

    return communique;
  }

  async findById(id: string) {
    return this.communiqueRepository.findById(id);
  }

  async findAll(filters: CommuniqueQueryDto) {
    return this.communiqueRepository.findAll(filters);
  }

  async update(id: string, dto: Partial<UpdateCommuniqueDto>, imagePath?: string) {
    try {
      // 1. Buscar comunicado (JÁ COM RELATIONS)
      const communique = await this.communiqueRepository.findById(id);
      if (!communique) {
        throw new NotFoundException("Comunicado não encontrado.");
      }

      // 2. Montar dados de update (fallback para valores atuais)
      const updateData: Partial<UpdateCommuniqueDto> & {
        imagePath?: string | null;
        imageUrl?: string | null;
      } = {
        ...dto,
        sectorId: dto.sectorId ?? communique.sectorId,
        authorId: dto.authorId ?? communique.authorId,
      };

      // 3. Validar setor SOMENTE se enviado
      let updatedSector = communique.sector;
      if (dto.sectorId) {
        const sector = await this.sectorRepository.findById(dto.sectorId);
        if (!sector) {
          throw new BadRequestException("Setor não encontrado. Verifique o ID do setor.");
        }
        updatedSector = sector;
      }

      // 4. Validar autor SOMENTE se enviado
      let updatedAuthor = communique.author;
      if (dto.authorId) {
        const author = await this.userRepository.findById(dto.authorId);
        if (!author) {
          throw new BadRequestException("Autor não encontrado. Verifique o ID do autor.");
        }
        updatedAuthor = author as typeof communique.author;
      }

      // 5. Nova imagem (se existir)
      if (imagePath) {
        const validExtensions = [".png", ".jpg", ".jpeg", ".webp"];
        const ext = path.extname(imagePath).toLowerCase();

        if (!validExtensions.includes(ext)) {
          throw new BadRequestException("Apenas imagens PNG, JPG, JPEG ou WEBP são permitidas.");
        }

        // Remove imagem antiga
        if (communique.imagePath) {
          const oldImagePath = join(process.cwd(), communique.imagePath);
          try {
            await fs.unlink(oldImagePath);
          } catch (err) {
            console.warn("Não foi possível deletar a imagem antiga:", err);
          }
        }

        updateData.imagePath = `/uploads/communiques/${imagePath}`;
        updateData.imageUrl = `/api/v1/communiques/image/${imagePath}`;
      } else if (dto.removeImage === "true" && communique.imagePath) {
        // Remover imagem sem substituir
        const oldImagePath = join(process.cwd(), communique.imagePath);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.warn("Não foi possível deletar a imagem:", err);
        }
        updateData.imagePath = null;
        updateData.imageUrl = null;
      }

      // 6. Limpar undefined e campos que não existem no schema
      for (const key in updateData) {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      }
      delete updateData.removeImage;

      // 7. Persistir no banco
      await this.communiqueRepository.update(id, updateData);

      // 8. MERGE EM MEMÓRIA (preserva relations)
      const updatedCommunique = {
        ...communique, // mantém relations
        ...updateData, // sobrescreve campos simples
        sector: updatedSector,
        author: updatedAuthor,
      };

      const response = {
        ...updatedCommunique,
        imageName: updatedCommunique.imagePath ? path.basename(updatedCommunique.imagePath) : null,
      };

      // 9. Emitir evento WS com objeto COMPLETO
      try {
        this.communiquesGateway.emitUpdated(response);
      } catch (err) {
        console.error("[CommuniqueService] Falha ao emitir evento WebSocket (updated):", err);
      }

      void this.sendEmailCommuniqueBySector
        .execute(updatedCommunique.sectorId, {
          title: `${updatedCommunique.title}`,
          description: updatedCommunique.description,
          severity: updatedCommunique.severity,
          imageUrl: updatedCommunique.imageUrl,
          sector: updatedCommunique.sector,
          author: updatedCommunique.author,
          createdAt: updatedCommunique.createdAt.toISOString(),
          isUpdate: true,
        })
        .catch((err) => console.error("[CommuniqueService] Falha ao enviar email de atualização do comunicado:", err));

      return response;
    } catch (error) {
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
      } catch (err) {
        console.warn("Não foi possível deletar a imagem do comunicado:", err);
      }
    }

    try {
      this.communiquesGateway.emitDeleted(id);
    } catch (err) {
      console.error("[CommuniqueService] Falha ao emitir evento WebSocket (deleted):", err);
    }

    return this.communiqueRepository.delete(id);
  }
}
