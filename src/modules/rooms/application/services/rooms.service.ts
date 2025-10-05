import { Injectable } from "@nestjs/common";
import { RoomsQueryDto } from "../../domain/dto/rooms-query.dto";
import { RoomsRepository } from "../../infrastructure/repositories/rooms.repository";

@Injectable()
export class RoomsService {
    constructor(
        private readonly roomsRepository: RoomsRepository,
    ) { }

    async create(data: any) {
        return this.roomsRepository.create(data);
    }

    async update(id: string, data: any) {
        return this.roomsRepository.update(id, data);
    }

    async findAll(query: RoomsQueryDto) {
        return this.roomsRepository.findAll(query);
    }

    async findById(id: string) {
        return this.roomsRepository.findById(id);
    }

    async delete(id: string) {
        return this.roomsRepository.delete(id);
    }
}