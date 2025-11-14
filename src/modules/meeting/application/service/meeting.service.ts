import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { MeetingRepository, MeetingStatus } from '../../infrastructure/repositories/meeting.repository';
import { CreateMeetingDto } from '../../domain/dto/create-meeting.dto';
import { UpdateMeetingDto } from '../../domain/dto/update-meeting.dto';
import { MeetingQueryDto } from '../../domain/dto/meeting-query.dto';
import { SectorService } from 'src/modules/sectors/application/services/sector.service';
import { RoomsService } from 'src/modules/rooms/application/services/rooms.service';
import { UsersService } from 'src/modules/users/application/services/users.service';

@Injectable()
export class MeetingService {
    constructor(
        private readonly meetingRepository: MeetingRepository,
        private readonly roomsService: RoomsService,
        private readonly sectorService: SectorService,
        private readonly usersService: UsersService,
    ) { }

    async create(dto: CreateMeetingDto) {
        const dateObj = new Date(`${dto.date}T00:00:00.000Z`);

        try {
            const room = await this.roomsService.findById(dto.roomId);
            if (!room) {
                throw new BadRequestException('Sala informada não existe.');
            }

            const sector = await this.sectorService.findById(dto.sectorId);
            if (!sector) {
                throw new BadRequestException('Setor informado não existe.');
            }

            const user = dto.responsibleId ? await this.usersService.findById(dto.responsibleId) : null;
            if (dto?.responsibleId && !user) {
                throw new BadRequestException('Usuário informado não existe.');
            }

            if (dto.startTime >= dto.endTime) {
                throw new BadRequestException(
                    'O horário de término deve ser posterior ao horário de início.',
                );
            }

            const conflict = await this.meetingRepository.findConflict(
                dateObj,
                dto.startTime,
                dto.endTime,
            );

            if (conflict) {
                throw new BadRequestException(
                    `Conflito com outra reunião: ${conflict.subject} (${conflict.startTime} - ${conflict.endTime})`,
                );
            }

            dto.status = MeetingStatus.SCHEDULED;

            return this.meetingRepository.create({
                ...dto,
                responsibleId: dto.responsibleId ? user.id : null,
                date: dateObj,
            });
        }
        catch (error) {

            if (error instanceof HttpException) throw error;

            throw new HttpException('Erro interno no servidor.', 500);
        }
    }

    async update(id: string, dto: UpdateMeetingDto) {
        try {
            const meeting = await this.meetingRepository.findById(id);
            if (!meeting) throw new NotFoundException('Reunião não encontrada.');

            const dateObj = dto.date
                ? new Date(`${dto.date}T00:00:00.000Z`)
                : meeting.date;

            const startTime = dto.startTime ?? meeting.startTime;
            const endTime = dto.endTime ?? meeting.endTime;

            if (startTime >= endTime) {
                throw new BadRequestException(
                    'O horário de término deve ser posterior ao horário de início.',
                );
            }

            if (dto.roomId) {
                const room = await this.roomsService.findById(dto.roomId);
                if (!room) {
                    throw new BadRequestException('Sala informada não existe.');
                }
            }

            if (dto.sectorId) {
                const sector = await this.sectorService.findById(dto.sectorId);
                if (!sector) {
                    throw new BadRequestException('Setor informado não existe.');
                }
            }

            const conflict = await this.meetingRepository.findConflict(
                dateObj,
                startTime,
                endTime,
                id,
            );

            if (conflict) {
                throw new BadRequestException(
                    `Conflito com outra reunião: ${conflict.subject} (${conflict.startTime} - ${conflict.endTime})`,
                );
            }

            return this.meetingRepository.update(id, {
                ...dto,
                date: dateObj,
                startTime,
                endTime,
            });
        }
        catch (error) {
            console.error('Error updating meeting:', error);
            if (error instanceof HttpException) throw error;
            throw new HttpException('Erro interno no servidor.', 500);
        }
    }


    async findAll(query: MeetingQueryDto) {
        return this.meetingRepository.findAll(query);
    }

    async findById(id: string) {
        const meeting = await this.meetingRepository.findById(id);
        if (!meeting) {
            throw new NotFoundException('Reunião não encontrada.');
        }
        return meeting;
    }

    async delete(id: string) {
        const meeting = await this.meetingRepository.findById(id);
        if (!meeting) throw new NotFoundException('Reunião não encontrada.');
        return this.meetingRepository.delete(id);
    }

    async findToday() {
        return this.meetingRepository.findToday();
    }
}
