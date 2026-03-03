import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrdersRepository } from '../../infrastructure/repositories/orders.repository';
import { CreateOrderDto } from '../../domain/dto/create-order.dto';
import { UpdateOrderDto } from '../../domain/dto/update-order.dto';
import { RegisterDeliveryDto } from '../../domain/dto/register-delivery.dto';
import { RegisterReturnDto } from '../../domain/dto/register-return.dto';
import { ListOrdersDto } from '../../domain/dto/list-orders.dto';

const ROLES_WITH_FULL_ACCESS = ['PORTARIA', 'ADMIN', 'SUPERADMIN'];

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async create(dto: CreateOrderDto, user: { name: string }) {
    const protocolNumber = await this.generateProtocolNumber();

    return this.ordersRepository.create({
      protocolNumber,
      type: dto.type,
      sender: dto.sender,
      carrier: dto.carrier,
      trackingCode: dto.trackingCode,
      description: dto.description,
      recipientName: dto.recipientName,
      recipientDepartment: dto.recipientDepartment,
      recipientEmail: dto.recipientEmail,
      receivedAt: new Date(),
      receivedBy: dto.receivedBy,
      notes: dto.notes,
    });
  }

  async findAll(query: ListOrdersDto, user: { role: string; email: string }) {
    const extraWhere = this.buildUserFilter(user);
    return this.ordersRepository.findAll(query, extraWhere);
  }

  async findById(id: string, user: { role: string; email: string }) {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new NotFoundException('Encomenda não encontrada.');
    }

    if (
      !ROLES_WITH_FULL_ACCESS.includes(user.role) &&
      order.recipientEmail.toLowerCase() !== user.email.toLowerCase()
    ) {
      throw new ForbiddenException('Você não tem permissão para acessar esta encomenda.');
    }

    return order;
  }

  async registrarEntrega(id: string, dto: RegisterDeliveryDto, user: { name: string }) {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new NotFoundException('Encomenda não encontrada.');
    }

    if (order.status !== OrderStatus.AWAITING_PICKUP) {
      throw new ConflictException(
        `Não é possível registrar entrega: encomenda está com status "${order.status}".`,
      );
    }

    return this.ordersRepository.update(id, {
      status: OrderStatus.DELIVERED,
      deliveredAt: new Date(),
      deliveredTo: dto.deliveredTo,
      deliveredBy: dto.deliveredBy,
    });
  }

  async registrarDevolucao(id: string, dto: RegisterReturnDto) {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new NotFoundException('Encomenda não encontrada.');
    }

    if (order.status !== OrderStatus.AWAITING_PICKUP) {
      throw new ConflictException(
        `Não é possível registrar devolução: encomenda está com status "${order.status}".`,
      );
    }

    return this.ordersRepository.update(id, {
      status: OrderStatus.RETURNED,
      notes: dto.notes ?? order.notes,
    });
  }

  async update(id: string, dto: UpdateOrderDto) {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new NotFoundException('Encomenda não encontrada.');
    }

    return this.ordersRepository.update(id, dto);
  }

  async delete(id: string) {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new NotFoundException('Encomenda não encontrada.');
    }

    return this.ordersRepository.delete(id);
  }

  private async generateProtocolNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.ordersRepository.countByYear(year);
    const seq = String(count + 1).padStart(4, '0');
    return `ORD-${year}-${seq}`;
  }

  private buildUserFilter(user: { role: string; email: string }) {
    if (ROLES_WITH_FULL_ACCESS.includes(user.role)) {
      return {};
    }
    return { recipientEmail: { equals: user.email, mode: 'insensitive' as const } };
  }
}
