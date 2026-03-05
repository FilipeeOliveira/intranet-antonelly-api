import { Injectable, NotFoundException } from "@nestjs/common";
import { SectorRepository } from "../../infrastructure/repositories/sector.repository";
import { CreateSectorDto } from "../../domain/dto/create-sector.dto";
import { UpdateSectorDto } from "../../domain/dto/update-sector.dto";
import { SectorQueryDto } from "../../domain/dto/sector-query.dto";

export interface Sector {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class SectorService {
  constructor(private readonly sectorRepository: SectorRepository) {}

  async create(dto: CreateSectorDto): Promise<Sector> {
    return this.sectorRepository.create(dto);
  }

  async findAll(query: SectorQueryDto) {
    return this.sectorRepository.findAll(query);
  }

  async findById(id: string): Promise<Sector> {
    const sector = await this.sectorRepository.findById(id);
    if (!sector) throw new NotFoundException("Setor não encontrado.");
    return sector;
  }

  async update(id: string, dto: UpdateSectorDto): Promise<Sector> {
    const sector = await this.sectorRepository.findById(id);
    if (!sector) throw new NotFoundException("Setor não encontrado.");
    return this.sectorRepository.update(id, dto);
  }

  async delete(id: string): Promise<Sector> {
    const sector = await this.sectorRepository.findById(id);
    if (!sector) throw new NotFoundException("Setor não encontrado.");
    return this.sectorRepository.delete(id);
  }
}
