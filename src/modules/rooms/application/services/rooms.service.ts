import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRoomDto } from "../../domain/dto/create-room.dto";
import { UpdateRoomDto } from "../../domain/dto/update-room.dto";
import { RoomsQueryDto } from "../../domain/dto/rooms-query.dto";
import { RoomsRepository } from "../../infrastructure/repositories/rooms.repository";

@Injectable()
export class RoomsService {
    constructor(
        private readonly roomsRepository: RoomsRepository,
    ) { }

    async create(data: CreateRoomDto) {
        return this.roomsRepository.create(data);
    }

    async update(id: string, data: UpdateRoomDto) {
        const room = await this.roomsRepository.findById(id);
        if (!room) throw new NotFoundException('Sala não encontrada.');
        return this.roomsRepository.update(id, data);
    }

    async findAll(query: RoomsQueryDto) {
        return this.roomsRepository.findAll(query);
    }

    async findById(id: string) {
        const room = await this.roomsRepository.findById(id);
        if (!room) throw new NotFoundException('Sala não encontrada.');
        return room;
    }

    async delete(id: string) {
        const room = await this.roomsRepository.findById(id);
        if (!room) throw new NotFoundException('Sala não encontrada.');
        return this.roomsRepository.delete(id);
    }
}
