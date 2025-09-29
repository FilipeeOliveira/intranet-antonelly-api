import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanieRepository } from '../../infrastructure/repositories/companie.repository';
import { CreateCompanieDto } from '../../domain/dto/create-companie.dto';
import { UpdateCompanieDto } from '../../domain/dto/update-companie.dto';
import { CompanieQueryDto } from '../../domain/dto/companie-query.dto';

export interface Companie {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable()
export class CompanieService {
    constructor(private readonly companieRepository: CompanieRepository) { }

    async create(dto: CreateCompanieDto): Promise<Companie> {
        return this.companieRepository.create(dto);
    }

    async findAll(query: CompanieQueryDto) {
        return this.companieRepository.findAll(query);
    }

    async findById(id: string): Promise<Companie> {
        const companie = await this.companieRepository.findById(id);
        if (!companie) throw new NotFoundException('Empresa não encontrada.');
        return companie;
    }

    async update(id: string, dto: UpdateCompanieDto): Promise<Companie> {
        const companie = await this.companieRepository.findById(id);
        if (!companie) throw new NotFoundException('Empresa não encontrada.');
        return this.companieRepository.update(id, dto);
    }

    async delete(id: string): Promise<Companie> {
        const companie = await this.companieRepository.findById(id);
        if (!companie) throw new NotFoundException('Empresa não encontrada.');
        return this.companieRepository.delete(id);
    }
}
