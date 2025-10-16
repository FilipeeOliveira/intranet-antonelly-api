import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { VisitHistory } from '@prisma/client';
import { CreateVisitHistoryDto } from '../../domain/dto/create-visit-history.dto';
import { CreateVisitScheduleDto } from '../../domain/dto/create-visit-schedule.dto';
import { UpdateVisitHistoryDto } from '../../domain/dto/update-visit-history.dto';
import { VisitHistoryQueryDto } from '../../domain/dto/visit-history-query.dto';
import { VisitHistoryStatus } from '../../domain/enums/VisitHistoryStatus';
import { VisitHistoryRepository } from '../../infrastructure/respositories/visit-history.repository';

@Injectable()
export class VisitHistoryService {
  constructor(
    private readonly visitHistoryRepository: VisitHistoryRepository,
  ) { }

  async create(dto: CreateVisitHistoryDto): Promise<VisitHistory> {
    return await this.visitHistoryRepository.create({
      visitorName: dto.visitorName,
      visitorCpf: dto.visitorCpf,
      visitorPhone: dto.visitorPhone,
      description: dto.description,
      companyId: dto.companyId,
      arrivedAt: dto.arrivedAt || new Date(),
      leftAt: dto.leftAt,
    });
  }


  async createVisitSchedule(dto: CreateVisitScheduleDto): Promise<VisitHistory> {

    const schedule = await this.visitHistoryRepository.create({
      visitorName: dto.visitorName,
      visitorCpf: dto.visitorCpf,
      visitorPhone: dto.visitorPhone,
      description: dto.description,
      arrivedAt: new Date(`${dto.date}T${dto.time}:00`),
      companyId: dto.companyId,
      isScheduled: true,
    });

    return schedule;
  }

  async startVisit(visitHistoryId: string): Promise<VisitHistory> {
    // Verificar se já existe uma visita em andamento (sem saída)
    const isVisitStarted = await this.visitHistoryRepository.findById(visitHistoryId);

    if (isVisitStarted && !isVisitStarted.leftAt) {
      throw new BadRequestException('Esta visita já está em andamento.');
    }

    return this.visitHistoryRepository.update(visitHistoryId, {
      ...isVisitStarted,
      status: VisitHistoryStatus.PRESENT,
      arrivedAt: new Date(),
    });
  }

  async endVisit(visitHistoryId: string): Promise<VisitHistory> {
    const isVisitStarted = await this.visitHistoryRepository.findById(visitHistoryId);
    if (!isVisitStarted) {
      throw new NotFoundException('A visita não foi encontrada.');
    }

    if (isVisitStarted.leftAt) {
      throw new BadRequestException('Esta visita já foi finalizada.');
    }

    await this.visitHistoryRepository.update(isVisitStarted.id, { status: VisitHistoryStatus.FINISHED });

    return this.visitHistoryRepository.update(isVisitStarted.id, {
      leftAt: new Date(),
    });
  }

  async findAll(query: VisitHistoryQueryDto) {
    return this.visitHistoryRepository.findAll(query);
  }

  async findById(id: string): Promise<VisitHistory> {
    const history = await this.visitHistoryRepository.findById(id);
    if (!history) throw new NotFoundException('Histórico não encontrado.');
    return history;
  }

  async update(id: string, dto: UpdateVisitHistoryDto): Promise<VisitHistory> {
    const history = await this.visitHistoryRepository.findById(id);
    if (!history) throw new NotFoundException('Histórico não encontrado.');

    return this.visitHistoryRepository.update(id, dto);
  }

  async delete(id: string): Promise<VisitHistory> {
    const history = await this.visitHistoryRepository.findById(id);
    if (!history) throw new NotFoundException('Histórico não encontrado.');

    return this.visitHistoryRepository.delete(id);
  }

  /**
  * Retorna visitantes presentes e visitantes de hoje
  */
  async getVisitorsActivity() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Visitantes Presentes: último histórico sem saída
    const visitorsPresent = await this.visitHistoryRepository.findVisitorsPresent();

    // Visitantes Hoje: qualquer entrada registrada hoje
    const visitorsToday = await this.visitHistoryRepository.findVisitorsByDateRange(startOfDay, endOfDay);

    return {
      present: visitorsPresent,
      today: visitorsToday,
    };
  }
}
