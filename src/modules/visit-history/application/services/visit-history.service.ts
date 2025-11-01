import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { VisitHistory } from '@prisma/client';
import { CompanyRepository } from 'src/modules/companies/infrastructure/repositories/company.repository';
import { getCurrentUtcDate } from 'src/shared/utils/getCurrentUtcDate';
import { getLocalDateToUtcDate } from 'src/shared/utils/getLocalDateToUtcDate';
import { CreateVisitHistoryDto } from '../../domain/dto/create-visit-history.dto';
import { CreateVisitScheduleDto } from '../../domain/dto/create-visit-schedule.dto';
import { UpdateVisitHistoryDto } from '../../domain/dto/update-visit-history.dto';
import { VisitHistoryQueryDto } from '../../domain/dto/visit-history-query.dto';
import { VisitHistoryStatus } from '../../domain/enums/VisitHistoryStatus';
import { VisitHistoryRepository } from '../../infrastructure/respositories/visit-history.repository';
import moment from 'moment';

@Injectable()
export class VisitHistoryService {
  constructor(
    private readonly visitHistoryRepository: VisitHistoryRepository,
    private readonly companyRepository: CompanyRepository
  ) { }

  async create(dto: CreateVisitHistoryDto): Promise<VisitHistory> {

    const companyExists = await this.companyRepository.findById(dto.companyId);
    if (!companyExists) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    return await this.visitHistoryRepository.create({
      name: dto.visitorName,
      cpf: dto?.visitorCpf,
      phone: dto?.visitorPhone,
      description: dto.description,
      companyId: dto.companyId,
      status: VisitHistoryStatus.PRESENT,
      arrivedAt: dto.arrivedAt ? getLocalDateToUtcDate(dto.arrivedAt) : getCurrentUtcDate()
    });
  }

  async createVisitSchedule(dto: CreateVisitScheduleDto): Promise<VisitHistory> {

    const companyExists = await this.companyRepository.findById(dto.companyId);
    if (!companyExists) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    const schedule = await this.visitHistoryRepository.create({
      name: dto.visitorName,
      cpf: dto?.visitorCpf,
      phone: dto?.visitorPhone,
      description: dto.description,
      arrivedAt: getLocalDateToUtcDate(new Date(`${dto.date}T${dto.time}:00`)),
      companyId: dto.companyId,
      status: VisitHistoryStatus.SCHEDULED,
      isScheduled: true,
    });

    return schedule;
  }

  async startVisit(visitHistoryId: string): Promise<VisitHistory> {
    // Verificar se já existe uma visita em andamento (sem saída)
    const isVisitStarted = await this.visitHistoryRepository.findById(visitHistoryId);

    if (isVisitStarted.status === VisitHistoryStatus.PRESENT) {
      throw new BadRequestException('Esta visita já está em andamento.');
    }

    return this.visitHistoryRepository.update(visitHistoryId, {
      ...isVisitStarted,
      status: VisitHistoryStatus.PRESENT,
      arrivedAt: getCurrentUtcDate(),
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

    await this.visitHistoryRepository.update(isVisitStarted.id, { status: VisitHistoryStatus.LEFT });

    return this.visitHistoryRepository.update(isVisitStarted.id, {
      leftAt: getCurrentUtcDate(),
    });
  }

  async findAll(query?: VisitHistoryQueryDto) {
    return await this.visitHistoryRepository.findAll(query);
  }

  async findById(id: string): Promise<VisitHistory> {
    const history = await this.visitHistoryRepository.findById(id);
    if (!history) throw new NotFoundException('Histórico não encontrado.');
    return history;
  }

  async update(id: string, dto: UpdateVisitHistoryDto): Promise<VisitHistory> {
    const history = await this.visitHistoryRepository.findById(id);
    if (!history) throw new NotFoundException('Histórico não encontrado.');

    console.log({ dto });

    return this.visitHistoryRepository.update(id, {
      name: dto.visitorName,
      cpf: dto.visitorCpf,
      phone: dto.visitorPhone,
      description: dto.description,
      arrivedAt: dto.arrivedAt ? getLocalDateToUtcDate(dto.arrivedAt) : history.arrivedAt,
      leftAt: dto.leftAt ? getLocalDateToUtcDate(dto.leftAt) : history.leftAt,
      companyId: dto.companyId,
    });
  }

  async cancelScheduledVisit(id: string): Promise<VisitHistory> {
    const history = await this.visitHistoryRepository.findById(id);
    if (!history) throw new NotFoundException('Histórico não encontrado.');

    if (history.status !== VisitHistoryStatus.SCHEDULED) {
      throw new BadRequestException('Apenas visitas agendadas podem ser canceladas.');
    }

    return this.visitHistoryRepository.update(id, {
      status: VisitHistoryStatus.CANCELED,
    });
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
