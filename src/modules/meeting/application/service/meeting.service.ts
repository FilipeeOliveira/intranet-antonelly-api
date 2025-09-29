import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MeetingRepository } from '../../infrastructure/repositories/meeting.repository';
import { CreateMeetingDto, MeetingDuration } from '../../domain/dto/create-meeting.dto';
import { UpdateMeetingDto } from '../../domain/dto/update-meeting.dto';
import { MeetingQueryDto } from '../../domain/dto/meeting-query.dto';
import { calculateEndTime } from 'src/shared/utils/calculated-end-time.util';

@Injectable()
export class MeetingService {
    constructor(private readonly meetingRepository: MeetingRepository) { }

    async create(dto: CreateMeetingDto) {
        const endTime = calculateEndTime(dto.time, dto.duration);

        const dateObj = new Date(`${dto.date}T00:00:00.000Z`);

        // verificar conflitos
        const conflict = await this.meetingRepository.findConflict(dateObj, dto.time, endTime);
        if (conflict) {
            throw new BadRequestException(
                `Conflito com outra reunião: ${conflict.subject} (${conflict.time} - ${conflict.endTime})`
            );
        }

        // aqui garantimos que "date" seja o objeto Date
        return this.meetingRepository.create({
            ...dto,
            date: dateObj,
            endTime,
        });
    }

    async findAll(query: MeetingQueryDto) {
        return this.meetingRepository.findAll(query);
    }

    async findById(id: string) {
        const meeting = await this.meetingRepository.findById(id);
        if (!meeting) throw new NotFoundException('Reunião não encontrada.');
        return meeting;
    }

    async update(id: string, dto: UpdateMeetingDto) {
        const meeting = await this.meetingRepository.findById(id);
        if (!meeting) throw new NotFoundException('Reunião não encontrada.');

        // usa valores do DTO ou do registro atual
        const dateObj = dto.date ? new Date(`${dto.date}T00:00:00.000Z`) : meeting.date;
        const time = dto.time ?? meeting.time;
        const duration = dto.duration ?? meeting.duration;

        // calcula horário de término
        const endTime = calculateEndTime(time, duration as MeetingDuration);

        // valida conflito
        const conflict = await this.meetingRepository.findConflict(dateObj, time, endTime, id);
        if (conflict) {
            throw new BadRequestException(
                `Conflito com outra reunião: ${conflict.subject} (${conflict.time} - ${conflict.endTime})`
            );
        }

        // monta objeto final sem sobrescrever date errado
        return this.meetingRepository.update(id, {
            ...dto,
            date: dateObj,
            time,
            duration,
            endTime,
        });
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
