import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConstructionStatus } from "@prisma/client";
import { ConstructionsRepository } from "../../infrastructure/repositories/constructions.repository";
import { CreateConstructionDto } from "../../domain/dto/create-construction.dto";
import { UpdateConstructionDto } from "../../domain/dto/update-construction.dto";
import { FilterConstructionDto } from "../../domain/dto/filter-construction.dto";

interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

const validTransitions: Record<ConstructionStatus, ConstructionStatus[]> = {
  planning: ["in_progress", "cancelled"],
  in_progress: ["paused", "completed", "cancelled"],
  paused: ["in_progress", "cancelled"],
  completed: [],
  cancelled: [],
};

@Injectable()
export class ConstructionsService {
  constructor(private readonly constructionsRepository: ConstructionsRepository) {}

  async findAll(filters: FilterConstructionDto) {
    return this.constructionsRepository.findMany(filters);
  }

  async findOne(id: string) {
    const construction = await this.constructionsRepository.findOne(id);
    if (!construction) throw new NotFoundException("Obra não encontrada");
    return construction;
  }

  async create(dto: CreateConstructionDto, user: UserPayload) {
    this.validateDates(new Date(dto.startDate), new Date(dto.expectedEndDate));

    return this.constructionsRepository.create({
      name: dto.name,
      category: dto.category,
      description: dto.description,
      address: dto.address,
      client: dto.client,
      responsible: dto.responsible,
      startDate: new Date(dto.startDate),
      expectedEndDate: new Date(dto.expectedEndDate),
      contractValue: dto.contractValue,
      status: dto.status,
      imageUrl: dto.imageUrl,
      creator: { connect: { id: user.id } },
    });
  }

  async update(id: string, dto: UpdateConstructionDto) {
    const construction = await this.constructionsRepository.findOne(id);
    if (!construction) throw new NotFoundException("Obra não encontrada");

    const startDate = dto.startDate ? new Date(dto.startDate) : construction.startDate;
    const expectedEndDate = dto.expectedEndDate ? new Date(dto.expectedEndDate) : construction.expectedEndDate;
    this.validateDates(startDate, expectedEndDate);

    return this.constructionsRepository.update(id, {
      name: dto.name,
      category: dto.category,
      description: dto.description,
      address: dto.address,
      client: dto.client,
      responsible: dto.responsible,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      expectedEndDate: dto.expectedEndDate ? new Date(dto.expectedEndDate) : undefined,
      contractValue: dto.contractValue,
      status: dto.status,
      imageUrl: dto.imageUrl,
    });
  }

  async remove(id: string) {
    const construction = await this.constructionsRepository.findOne(id);
    if (!construction) throw new NotFoundException("Obra não encontrada");
    return this.constructionsRepository.delete(id);
  }

  async updateStatus(id: string, newStatus: ConstructionStatus) {
    const construction = await this.constructionsRepository.findOne(id);
    if (!construction) throw new NotFoundException("Obra não encontrada");

    const allowed = validTransitions[construction.status];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(`Transição inválida: ${construction.status} → ${newStatus}`);
    }

    const extra: Record<string, unknown> = {};
    if (newStatus === "completed") extra.actualEndDate = new Date();

    return this.constructionsRepository.update(id, { status: newStatus, ...extra });
  }

  async getProgress(id: string) {
    const construction = await this.constructionsRepository.findOne(id);
    if (!construction) throw new NotFoundException("Obra não encontrada");

    const today = new Date();
    const daysRemaining = Math.ceil((construction.expectedEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      constructionId: id,
      status: construction.status,
      startDate: construction.startDate,
      expectedEndDate: construction.expectedEndDate,
      actualEndDate: construction.actualEndDate,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      contractValue: construction.contractValue ? Number(construction.contractValue) : null,
    };
  }

  private validateDates(startDate: Date, expectedEndDate: Date) {
    if (expectedEndDate <= startDate) {
      throw new BadRequestException("Data fim deve ser posterior à data de início");
    }
  }
}
