import { BadRequestException, Injectable } from "@nestjs/common";
import { NotificationRepository } from "../infrastructure/repositories/notification.repository";
import { NotificationQueryDto } from "../domain/dto/notification-query.dto";

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationRepository: NotificationRepository
    ) { }


    async findAll(filters?: NotificationQueryDto) {

        if (filters?.sortBy && !['title', 'createdAt', 'updatedAt'].includes(filters.sortBy)) {
            throw new BadRequestException('Campo de ordenação inválido.');
        }

        if (filters?.sortOrder && !['asc', 'desc'].includes(filters.sortOrder)) {
            throw new BadRequestException('Ordem de ordenação inválida.');
        }

        if (filters?.page && filters.page < 1) {
            throw new BadRequestException('Número da página inválido. Deve ser maior ou igual a 1.');
        }

        if (filters?.limit && (filters.limit < 1 || filters.limit > 100)) {
            throw new BadRequestException('Limite por página inválido. Deve estar entre 1 e 100.');
        }

        return this.notificationRepository.findAll(filters);
    }

    async countAll(filters?: NotificationQueryDto) {
        return this.notificationRepository.countAll(filters);
    }

    async findById(id: string) {
        return this.notificationRepository.findById(id);
    }

    async create(data: {
        title: string;
        description: string;
        severity: string;
    }) {
        return this.notificationRepository.create(data);
    }

    async markManyAsRead(ids: string[]) {
        return this.notificationRepository.markManyAsRead(ids);
    }

    async markAsRead(id: string) {
        return this.notificationRepository.update(id, { read: true });
    }

    async markAsUnread(id: string) {
        return this.notificationRepository.update(id, { read: false });
    }

    async update(
        id: string,
        data: {
            title?: string;
            description?: string;
            severity?: string;
        },
    ) {
        return this.notificationRepository.update(id, data);
    }

    async delete(id: string) {
        return this.notificationRepository.delete(id);
    }

}