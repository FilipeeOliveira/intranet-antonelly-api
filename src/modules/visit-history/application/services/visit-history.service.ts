import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { VisitHistory } from "@prisma/client";
import { CompanyRepository } from "src/modules/companies/infrastructure/repositories/company.repository";
import { getCurrentUtcDate } from "src/shared/utils/getCurrentUtcDate";
import { getLocalDateToUtcDate } from "src/shared/utils/getLocalDateToUtcDate";
import { CreateVisitHistoryDto } from "../../domain/dto/create-visit-history.dto";
import { CreateVisitScheduleDto } from "../../domain/dto/create-visit-schedule.dto";
import { SaveVisitorTermDto } from '../../domain/dto/save-visitor-term.dto';
import { UpdateVisitHistoryDto } from "../../domain/dto/update-visit-history.dto";
import { VisitHistoryQueryDto } from "../../domain/dto/visit-history-query.dto";
import { VisitHistoryStatus } from "../../domain/enums/VisitHistoryStatus";
import { VisitHistoryRepository } from "../../infrastructure/respositories/visit-history.repository";

@Injectable()
export class VisitHistoryService {
  constructor(
    private readonly visitHistoryRepository: VisitHistoryRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async create(dto: CreateVisitHistoryDto): Promise<VisitHistory> {
    const cpf = dto?.visitorCpf?.trim() || undefined;
    const phone = dto?.visitorPhone?.trim() || null;

    if (dto.companyId) {
      const companyExists = await this.companyRepository.findById(dto.companyId);
      if (!companyExists) {
        throw new NotFoundException("Empresa não encontrada.");
      }
    }

    if (cpf) {
      const visitorAlreadyPresent = await this.visitHistoryRepository.findVisitorPresentByCpf({
        cpf,
      });
      if (visitorAlreadyPresent) {
        throw new BadRequestException("O visitante já está presente na empresa.");
      }

      const visitorAlreadyScheduled = await this.visitHistoryRepository.findVisitorScheduledByCpf({
        cpf,
      });
      if (visitorAlreadyScheduled) {
        throw new BadRequestException("O visitante já possui um agendamento para essa data.");
      }
    }

    return await this.visitHistoryRepository.create({
      name: dto.visitorName,
      cpf: cpf ?? null,
      phone,
      description: dto.description,
      companyId: dto?.companyId && dto.companyId.length ? dto.companyId : null,
      status: VisitHistoryStatus.PRESENT,
      arrivedAt: dto.arrivedAt ? getLocalDateToUtcDate(dto.arrivedAt) : getCurrentUtcDate(),
    });
  }

  async createVisitSchedule(dto: CreateVisitScheduleDto): Promise<VisitHistory> {
    const cpf = dto?.visitorCpf?.trim() || undefined;
    const phone = dto?.visitorPhone?.trim() || null;

    if (dto.companyId) {
      const companyExists = await this.companyRepository.findById(dto.companyId);
      if (!companyExists) {
        throw new NotFoundException("Empresa não encontrada.");
      }
    }

    if (cpf) {
      const visitorAlreadyPresent = await this.visitHistoryRepository.findVisitorPresentByCpf({
        cpf,
        startDate: getLocalDateToUtcDate(new Date(`${dto.date}T00:00:00`)),
        endDate: getLocalDateToUtcDate(new Date(`${dto.date}T23:59:59`)),
      });
      if (visitorAlreadyPresent) {
        throw new BadRequestException("O visitante já está presente na empresa.");
      }

      const visitorAlreadyScheduled = await this.visitHistoryRepository.findVisitorScheduledByCpf({
        cpf,
        startDate: getLocalDateToUtcDate(new Date(`${dto.date}T00:00:00`)),
        endDate: getLocalDateToUtcDate(new Date(`${dto.date}T23:59:59`)),
      });

      if (visitorAlreadyScheduled) {
        throw new BadRequestException("O visitante já possui um agendamento para essa data.");
      }
    }

    const schedule = await this.visitHistoryRepository.create({
      name: dto.visitorName,
      cpf: cpf ?? null,
      phone,
      description: dto.description,
      arrivedAt: getLocalDateToUtcDate(new Date(`${dto.date}T${dto.time}:00`)),
      companyId: dto?.companyId && dto.companyId.length ? dto.companyId : null,
      status: VisitHistoryStatus.SCHEDULED,
      isScheduled: true,
    });

    return schedule;
  }

  async getTotalCount(): Promise<{
    totalPresent: number;
    totalScheduled: number;
    totalLeft: number;
  }> {
    const [totalPresent, totalScheduled, totalLeft] = await Promise.all([
      this.visitHistoryRepository.count({ status: VisitHistoryStatus.PRESENT }),
      this.visitHistoryRepository.count({
        status: VisitHistoryStatus.SCHEDULED,
      }),
      this.visitHistoryRepository.count({ status: VisitHistoryStatus.LEFT }),
    ]);

    return {
      totalPresent,
      totalScheduled,
      totalLeft,
    };
  }

  async startVisit(visitHistoryId: string): Promise<VisitHistory> {
    // Verificar se já existe uma visita em andamento (sem saída)
    const isVisitStarted = await this.visitHistoryRepository.findById(visitHistoryId);

    if (isVisitStarted.status === VisitHistoryStatus.PRESENT) {
      throw new BadRequestException("Esta visita já está em andamento.");
    }

    return this.visitHistoryRepository.update(visitHistoryId, {
      status: VisitHistoryStatus.PRESENT,
      arrivedAt: getCurrentUtcDate(),
    });
  }

  async endVisit(visitHistoryId: string): Promise<VisitHistory> {
    const isVisitStarted = await this.visitHistoryRepository.findById(visitHistoryId);
    if (!isVisitStarted) {
      throw new NotFoundException("A visita não foi encontrada.");
    }

    if (isVisitStarted.leftAt) {
      throw new BadRequestException("Esta visita já foi finalizada.");
    }

    return this.visitHistoryRepository.update(isVisitStarted.id, {
      status: VisitHistoryStatus.LEFT,
      leftAt: getCurrentUtcDate(),
    });
  }

  async findAll(query?: VisitHistoryQueryDto) {
    return await this.visitHistoryRepository.findAll(query);
  }

  async findById(id: string) {
    const history = await this.visitHistoryRepository.findById(id);
    if (!history) throw new NotFoundException("Histórico não encontrado.");

    return {
      ...history,
      signature: history.signature ? `data:image/png;base64,${history.signature}` : null,
    };
  }

  async update(id: string, dto: UpdateVisitHistoryDto): Promise<VisitHistory> {
    const history = await this.visitHistoryRepository.findById(id);
    if (!history) throw new NotFoundException("Histórico não encontrado.");

    const updateDto: Partial<VisitHistory> = {
      name: dto.visitorName !== undefined ? dto.visitorName : history.name,
      cpf: dto.visitorCpf !== undefined ? dto.visitorCpf : history.cpf,
      phone: dto.visitorPhone !== undefined ? dto.visitorPhone : history.phone,
      description: dto.description !== undefined ? dto.description : history.description,
      companyId: dto.companyId !== undefined ? dto.companyId : history.companyId,
    };

    if (dto.arrivedAt) {
      updateDto.arrivedAt = getLocalDateToUtcDate(dto.arrivedAt);
    }

    if (dto.leftAt) {
      updateDto.leftAt = getLocalDateToUtcDate(dto.leftAt);
    }

    return this.visitHistoryRepository.update(id, updateDto);
  }

  async cancelScheduledVisit(id: string): Promise<{ message: string }> {
    const history = await this.visitHistoryRepository.findById(id);
    if (!history) throw new NotFoundException("Histórico não encontrado.");

    if (history.status !== VisitHistoryStatus.SCHEDULED) {
      throw new BadRequestException("Apenas visitas agendadas podem ser canceladas.");
    }

    await this.visitHistoryRepository.delete(id);

    return { message: 'Visita cancelada e removida com sucesso.' };
  }

  async saveTermSignature(visitId: string, dto: SaveVisitorTermDto): Promise<{ id: string; signedAt: Date; hasSignature: boolean }> {
    const visit = await this.visitHistoryRepository.findById(visitId);

    if (!visit) throw new NotFoundException('Registro de visita não encontrado');

    if (visit.status !== VisitHistoryStatus.PRESENT) {
      throw new BadRequestException('A visita não está em andamento para assinatura');
    }

    if (!dto.signature?.startsWith('data:image/png;base64,')) {
      throw new BadRequestException('Assinatura inválida ou ausente');
    }

    if (dto.signature.length > 500_000) {
      throw new BadRequestException('Assinatura excede o tamanho permitido');
    }

    const signedAt = new Date(dto.signedAt);

    if (isNaN(signedAt.getTime())) {
      throw new BadRequestException('Data de assinatura inválida');
    }

    const base64 = dto.signature.replace('data:image/png;base64,', '');

    await this.visitHistoryRepository.update(visitId, {
      signature: base64,
      signedAt,
    });

    return { id: visit.id, signedAt, hasSignature: true };
  }

  async delete(id: string): Promise<VisitHistory> {
    const history = await this.visitHistoryRepository.findById(id);
    if (!history) throw new NotFoundException("Histórico não encontrado.");

    return this.visitHistoryRepository.delete(id);
  }

  /**
   * Retorna visitantes presentes e visitantes de hoje
   */
  async getVisitorsActivity() {
    const now = getCurrentUtcDate();
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setUTCHours(23, 59, 59, 999);

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
