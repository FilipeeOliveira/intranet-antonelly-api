import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from '../../infrastructure/repositories/company.repository';
import { CreateCompanyDto } from '../../domain/dto/create-company.dto';
import { UpdateCompanyDto } from '../../domain/dto/update-companie.dto';
import { CompaniesQueryDto } from '../../domain/dto/companies-query.dto';

export interface Company {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable()
export class CompanyService {
    constructor(private readonly companyRepository: CompanyRepository) { }

    async create(dto: CreateCompanyDto): Promise<Company> {
        return this.companyRepository.create(dto);
    }

    async findAll(query: CompaniesQueryDto) {
        return this.companyRepository.findAll(query);
    }

    async findById(id: string): Promise<Company> {
        const company = await this.companyRepository.findById(id);
        if (!company) throw new NotFoundException('Empresa não encontrada.');
        return company;
    }

    async update(id: string, dto: UpdateCompanyDto): Promise<Company> {
        const company = await this.companyRepository.findById(id);
        if (!company) throw new NotFoundException('Empresa não encontrada.');
        return this.companyRepository.update(id, dto);
    }

    async delete(id: string): Promise<Company> {
        const company = await this.companyRepository.findById(id);
        if (!company) throw new NotFoundException('Empresa não encontrada.');
        return this.companyRepository.delete(id);
    }
}
