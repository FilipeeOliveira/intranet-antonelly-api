import { BadRequestException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { MeetingRepository } from "../../infrastructure/repositories/meeting.repository";
import { MeetingStatus } from "../../domain/enums/MeetingStatus";
import { CreateMeetingDto } from "../../domain/dto/create-meeting.dto";
import { UpdateMeetingDto } from "../../domain/dto/update-meeting.dto";
import { MeetingQueryDto } from "../../domain/dto/meeting-query.dto";
import { RoomsService } from "src/modules/rooms/application/services/rooms.service";
import moment, { Moment } from "moment";

@Injectable()
export class MeetingService {
  constructor(
    private readonly meetingRepository: MeetingRepository,
    private readonly roomsService: RoomsService,
  ) {}

  /**
   * Retorna o momento atual usando o padrão utc(true) do sistema.
   * Isolado em método para facilitar mock nos testes.
   */
  protected getNow(): Moment {
    return moment().utc(true);
  }

  async create(dto: CreateMeetingDto) {
    const dateObj = new Date(`${dto.date}T00:00:00.000Z`);

    try {
      const room = await this.roomsService.findById(dto.roomId);
      if (!room) throw new BadRequestException("Sala informada não existe.");

      if (dto.startTime >= dto.endTime) {
        throw new BadRequestException("O horário de término deve ser posterior ao horário de início.");
      }

      const conflict = await this.meetingRepository.findConflict(dateObj, dto.startTime, dto.endTime, dto.roomId);
      if (conflict) {
        throw new BadRequestException(
          `Conflito com outra reunião: ${conflict.subject} (${conflict.startTime} - ${conflict.endTime})`,
        );
      }

      return this.meetingRepository.create({
        ...dto,
        date: dateObj,
        status: MeetingStatus.SCHEDULED,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Erro interno no servidor.", 500);
    }
  }

  async start(id: string) {
    try {
      const meeting = await this.meetingRepository.findById(id);
      if (!meeting) throw new NotFoundException("Reunião não encontrada.");

      if (meeting.status !== MeetingStatus.SCHEDULED) {
        throw new BadRequestException("A reunião já foi encerrada ou cancelada.");
      }

      const now = this.getNow();
      const meetingDate = moment.utc(meeting.date);

      if (!now.isSame(meetingDate, "day")) {
        throw new BadRequestException("A reunião só pode ser iniciada no dia agendado.");
      }

      const currentTime = now.format("HH:mm");

      if (currentTime < meeting.startTime) {
        throw new BadRequestException("A reunião ainda não pode ser iniciada.");
      }

      if (currentTime >= meeting.endTime) {
        throw new BadRequestException("A reunião só pode ser iniciada dentro da janela agendada.");
      }

      return this.meetingRepository.update(id, {
        status: MeetingStatus.IN_PROGRESS,
        actualStartAt: now.toDate(),
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Erro interno no servidor.", 500);
    }
  }

  async finish(id: string) {
    try {
      const meeting = await this.meetingRepository.findById(id);
      if (!meeting) throw new NotFoundException("Reunião não encontrada.");

      if (meeting.status !== MeetingStatus.IN_PROGRESS) {
        throw new BadRequestException("Só é possível finalizar reuniões em andamento.");
      }

      return this.meetingRepository.update(id, {
        status: MeetingStatus.COMPLETED,
        actualEndAt: this.getNow().toDate(),
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Erro interno no servidor.", 500);
    }
  }

  /**
   * Executado pelo cron a cada minuto — apenas encerra reuniões que ultrapassaram o endTime.
   * NÃO inicia reuniões automaticamente.
   */
  async updateMeetingsStatus(currentDate: Date) {
    try {
      const currentTime = moment(currentDate).utc(true).format("HH:mm");

      const [inProgressMeetings, scheduledMeetings] = await Promise.all([
        this.meetingRepository.findInProgressPastEndTime(currentDate, currentTime),
        this.meetingRepository.findScheduledPastEndTime(currentDate, currentTime),
      ]);

      const now = moment(currentDate).utc(true).toDate();

      for (const meeting of inProgressMeetings) {
        await this.meetingRepository.update(meeting.id, {
          status: MeetingStatus.COMPLETED,
          actualEndAt: meeting.actualEndAt ?? now,
        });
      }

      for (const meeting of scheduledMeetings) {
        await this.meetingRepository.update(meeting.id, {
          status: MeetingStatus.COMPLETED,
        });
      }
    } catch (error) {
      console.error("Error updating meetings status:", error);
      throw new HttpException("Erro interno no servidor.", 500);
    }
  }

  async update(id: string, dto: UpdateMeetingDto) {
    try {
      const meeting = await this.meetingRepository.findById(id);
      if (!meeting) throw new NotFoundException("Reunião não encontrada.");

      if (meeting.status !== MeetingStatus.SCHEDULED) {
        throw new BadRequestException("Só é possível editar reuniões agendadas.");
      }

      const dateObj = dto.date ? new Date(`${dto.date}T00:00:00.000Z`) : meeting.date;
      const startTime = dto.startTime ?? meeting.startTime;
      const endTime = dto.endTime ?? meeting.endTime;

      if (startTime >= endTime) {
        throw new BadRequestException("O horário de término deve ser posterior ao horário de início.");
      }

      if (dto.roomId) {
        const room = await this.roomsService.findById(dto.roomId);
        if (!room) throw new BadRequestException("Sala informada não existe.");
      }

      const roomId = dto.roomId ?? meeting.roomId;
      const conflict = await this.meetingRepository.findConflict(dateObj, startTime, endTime, roomId, id);
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
        status: undefined,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Erro interno no servidor.", 500);
    }
  }

  async delete(id: string) {
    try {
      const meeting = await this.meetingRepository.findById(id);
      if (!meeting) throw new NotFoundException("Reunião não encontrada.");

      if (meeting.status !== MeetingStatus.SCHEDULED) {
        throw new BadRequestException("Só é possível cancelar reuniões agendadas.");
      }

      return this.meetingRepository.cancel(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Erro interno no servidor.", 500);
    }
  }

  async findAll(query: MeetingQueryDto) {
    return this.meetingRepository.findAll(query);
  }

  async findById(id: string) {
    const meeting = await this.meetingRepository.findById(id);
    if (!meeting) throw new NotFoundException("Reunião não encontrada.");
    return meeting;
  }

  async findToday() {
    return this.meetingRepository.findToday();
  }
}
