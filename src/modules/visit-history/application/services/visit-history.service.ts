import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateVisitHistoryDto } from '../../domain/dto/create-visit-history.dto';
import { UpdateVisitHistoryDto } from '../../domain/dto/update-visit-history.dto';
import { VisitHistoryQueryDto } from '../../domain/dto/visit-history-query.dto';
import { VisitHistoryRepository } from '../../infrastructure/respositories/visit-history.repository';
import { VisitorRepository } from 'src/modules/visitors/infrastructure/repositories/visitors.repository';
import { VisitorStatus } from 'src/modules/visitors/domain/dto/create-visitors.dto';
import { CreateVisitScheduleDto } from '../../domain/dto/create-visit-schedule.dto';

export interface VisitHistory {
  id: string;
  visitorId: string;
  arrivedAt: Date;
  leftAt?: Date;
}

@Injectable()
export class VisitHistoryService {
  constructor(
    private readonly visitHistoryRepository: VisitHistoryRepository,
    private readonly visitorRepository: VisitorRepository
  ) { }

  async create(dto: CreateVisitHistoryDto): Promise<VisitHistory> {
    return await this.visitHistoryRepository.create({
      visitorId: dto.visitorId,
      arrivedAt: dto.arrivedAt || new Date(),
      leftAt: dto.leftAt,
    });
  }


  async createVisitSchedule(dto: CreateVisitScheduleDto): Promise<VisitHistory> {

    const visitorExist = await this.visitorRepository.findByCpf(dto.cpf);
    if (!visitorExist) throw new BadRequestException('Visitante com esse CPF não encontrado.')

    const schedule = await this.visitHistoryRepository.create({
      ...dto,
      isScheduled: true,
    });

    return schedule;
  }

  async startVisit(visitorId: string): Promise<VisitHistory> {
    // Verificar se já existe uma visita em andamento (sem saída)
    const lastVisit = await this.visitHistoryRepository.findLastVisitByVisitor(visitorId);
    if (lastVisit && !lastVisit.leftAt) {
      throw new BadRequestException('Este visitante já possui uma visita em andamento.');
    }

    // Atualizar status do visitante para PRESENTE
    await this.visitorRepository.update(visitorId, { status: VisitorStatus.PRESENT });

    return this.visitHistoryRepository.create({
      visitorId,
      arrivedAt: new Date(),
    });
  }

  async endVisit(visitorId: string): Promise<VisitHistory> {
    const lastVisit = await this.visitHistoryRepository.findLastVisitByVisitor(visitorId);
    if (!lastVisit) {
      throw new NotFoundException('Nenhuma visita encontrada para este visitante.');
    }

    if (lastVisit.leftAt) {
      throw new BadRequestException('A última visita já foi finalizada.');
    }

    await this.visitorRepository.update(visitorId, { status: VisitorStatus.LEFT });

    return this.visitHistoryRepository.update(lastVisit.id, {
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
