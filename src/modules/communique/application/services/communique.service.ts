import { BadRequestException, Injectable } from "@nestjs/common";
import { CommuniqueRepository } from "../../infrasctructure/repositories/communique.repository";
import { CreateCommuniqueDto } from "../../domain/dtos/create-communique.dto";
import { UpdateCommuniqueDto } from "../../domain/dtos/update-communique.dto";
import { CommuniqueQueryDto } from "../../domain/dtos/communique-query.dto";

@Injectable()
export class CommuniqueService {
    constructor(
        private readonly communiqueRepository: CommuniqueRepository
    ) { }

    async create(data: CreateCommuniqueDto, imagePath: string) {
        return this.communiqueRepository.create({
            ...data,
            imagePath: `/uploads/communiques/${imagePath}`,
        });
    }

    async findById(id: string) {
        return this.communiqueRepository.findById(id);
    }

    async findAll(filters: CommuniqueQueryDto) {
        return this.communiqueRepository.findAll(filters);
    }

    async update(id: string, data: UpdateCommuniqueDto) {
        return this.communiqueRepository.update(id, data);
    }

    async delete(id: string) {
        return this.communiqueRepository.delete(id);
    }
}