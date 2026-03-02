import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StatusEncomenda } from '@prisma/client';
import { EncomendasRepository } from '../../infrastructure/repositories/encomendas.repository';
import { CreateEncomendaDto } from '../../domain/dto/create-encomenda.dto';
import { UpdateEncomendaDto } from '../../domain/dto/update-encomenda.dto';
import { RegistrarEntregaDto } from '../../domain/dto/registrar-entrega.dto';
import { RegistrarDevolucaoDto } from '../../domain/dto/registrar-devolucao.dto';
import { ListEncomendasDto } from '../../domain/dto/list-encomendas.dto';

const ROLES_COM_ACESSO_TOTAL = ['PORTARIA', 'ADMIN', 'SUPERADMIN'];

@Injectable()
export class EncomendasService {
  constructor(private readonly encomendasRepository: EncomendasRepository) {}

  async create(dto: CreateEncomendaDto, user: { name: string }) {
    const numeroProtocolo = await this.gerarNumeroProtocolo();

    return this.encomendasRepository.create({
      numeroProtocolo,
      tipo: dto.tipo,
      remetente: dto.remetente,
      transportadora: dto.transportadora,
      codigoRastreio: dto.codigoRastreio,
      descricao: dto.descricao,
      destinatarioNome: dto.destinatarioNome,
      destinatarioSetor: dto.destinatarioSetor,
      destinatarioEmail: dto.destinatarioEmail,
      dataRecebimento: new Date(),
      recebidoPor: user.name,
      observacoes: dto.observacoes,
    });
  }

  async findAll(query: ListEncomendasDto, user: { role: string; email: string }) {
    const extraWhere = this.buildUserFilter(user);
    return this.encomendasRepository.findAll(query, extraWhere);
  }

  async findById(id: string, user: { role: string; email: string }) {
    const encomenda = await this.encomendasRepository.findById(id);

    if (!encomenda) {
      throw new NotFoundException('Encomenda não encontrada.');
    }

    if (
      !ROLES_COM_ACESSO_TOTAL.includes(user.role) &&
      encomenda.destinatarioEmail.toLowerCase() !== user.email.toLowerCase()
    ) {
      throw new ForbiddenException('Você não tem permissão para acessar esta encomenda.');
    }

    return encomenda;
  }

  async registrarEntrega(id: string, dto: RegistrarEntregaDto, user: { name: string }) {
    const encomenda = await this.encomendasRepository.findById(id);

    if (!encomenda) {
      throw new NotFoundException('Encomenda não encontrada.');
    }

    if (encomenda.status !== StatusEncomenda.AGUARDANDO_RETIRADA) {
      throw new ConflictException(
        `Não é possível registrar entrega: encomenda está com status "${encomenda.status}".`,
      );
    }

    return this.encomendasRepository.update(id, {
      status: StatusEncomenda.ENTREGUE,
      dataEntrega: new Date(),
      entreguePara: dto.entreguePara,
      entreguePor: user.name,
    });
  }

  async registrarDevolucao(id: string, dto: RegistrarDevolucaoDto) {
    const encomenda = await this.encomendasRepository.findById(id);

    if (!encomenda) {
      throw new NotFoundException('Encomenda não encontrada.');
    }

    if (encomenda.status !== StatusEncomenda.AGUARDANDO_RETIRADA) {
      throw new ConflictException(
        `Não é possível registrar devolução: encomenda está com status "${encomenda.status}".`,
      );
    }

    return this.encomendasRepository.update(id, {
      status: StatusEncomenda.DEVOLVIDO,
      observacoes: dto.observacoes ?? encomenda.observacoes,
    });
  }

  async update(id: string, dto: UpdateEncomendaDto) {
    const encomenda = await this.encomendasRepository.findById(id);

    if (!encomenda) {
      throw new NotFoundException('Encomenda não encontrada.');
    }

    return this.encomendasRepository.update(id, dto);
  }

  async delete(id: string) {
    const encomenda = await this.encomendasRepository.findById(id);

    if (!encomenda) {
      throw new NotFoundException('Encomenda não encontrada.');
    }

    return this.encomendasRepository.delete(id);
  }

  private async gerarNumeroProtocolo(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.encomendasRepository.countByYear(year);
    const seq = String(count + 1).padStart(4, '0');
    return `ENC-${year}-${seq}`;
  }

  private buildUserFilter(user: { role: string; email: string }) {
    if (ROLES_COM_ACESSO_TOTAL.includes(user.role)) {
      return {};
    }
    return { destinatarioEmail: { equals: user.email, mode: 'insensitive' as const } };
  }
}
