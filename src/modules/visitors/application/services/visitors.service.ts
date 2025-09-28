import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVisitorDto, VisitorStatus } from '../../domain/dto/create-visitors.dto';
import { UpdateVisitorDto } from '../../domain/dto/update-visitors.dto';
import { VisitorsQueryDto } from '../../domain/dto/visitors-query.dto';
import { VisitorRepository } from '../../infrastructure/repositories/visitors.repository';


export interface Visitor {
  id: string;
  name: string;
  email: string;
  companieId: string;
  status: VisitorStatus;
}

@Injectable()
export class VisitorsService {
  constructor(private readonly visitorRepository: VisitorRepository) { }

  async create(dto: CreateVisitorDto): Promise<Visitor> {
    const visitor = await this.visitorRepository.create(dto);
    return {
      ...visitor,
      status: visitor.status as VisitorStatus,
    };
  }

  async markAsLeft(id: string): Promise<Visitor> {
    const visitor = await this.visitorRepository.findById(id);
    if (!visitor) {
      throw new NotFoundException('Visitante não encontrado.');
    }

    const updatedVisitor = await this.visitorRepository.update(id, {
      status: VisitorStatus.LEFT,
    });

    return {
      ...updatedVisitor,
      status: updatedVisitor.status as VisitorStatus,
    };
  }

  async findAll(
    query: VisitorsQueryDto
  ): Promise<{ data: Visitor[]; total: number; page: number; limit: number; totalPages: number }> {
    const { data, total, page, limit, totalPages } = await this.visitorRepository.findAll(query);

    return {
      data: data.map(visitor => ({
        ...visitor,
        status: visitor.status as VisitorStatus,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findById(id: string): Promise<Visitor> {
    const visitor = await this.visitorRepository.findById(id);
    if (!visitor) {
      throw new NotFoundException('Visitante não encontrado.');
    }

    return {
      ...visitor,
      status: visitor.status as VisitorStatus,
    };
  }

  async findByCompanie(companieId: string, query: VisitorsQueryDto) {
    return this.visitorRepository.findByCompanie(companieId, query);
  }



  async update(id: string, dto: UpdateVisitorDto): Promise<Visitor> {
    const visitor = await this.visitorRepository.findById(id);
    if (!visitor) throw new NotFoundException('Visitante não encontrado.');

    const updatedVisitor = await this.visitorRepository.update(id, dto);
    return {
      ...updatedVisitor,
      status: updatedVisitor.status as VisitorStatus,
    };
  }

  async delete(id: string): Promise<Visitor> {
    const visitor = await this.visitorRepository.findById(id);
    if (!visitor) {
      throw new NotFoundException('Visitante não encontrado.');
    }

    const deletedVisitor = await this.visitorRepository.delete(id);

    return {
      ...deletedVisitor,
      status: deletedVisitor.status as VisitorStatus,
    };
  }
}
