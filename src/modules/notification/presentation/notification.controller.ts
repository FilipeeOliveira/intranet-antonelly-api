import { Body, Controller, Get, Patch, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Notification } from "@prisma/client";
import { PaginatedResponseDto } from "src/common/dto/paginated-response.dto";
import { NotificationService } from "../application/notification.service";
import { MarkAsReadDto } from "../domain/dto/mark-as-read.dto";
import { NotificationQueryDto } from "../domain/dto/notification-query.dto";

@ApiTags('Notificações')
@Controller('notifications')
export class NotificationController {

    constructor(
        private readonly notificationService: NotificationService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Listar notificações com filtros e paginação' })
    @ApiResponse({ status: 200, description: 'Lista de notificações retornada com sucesso.' })
    async getAll(@Query() query: NotificationQueryDto): Promise<PaginatedResponseDto<Notification>> {
        const [
            notifications,
            total,
        ] = await Promise.all([
            this.notificationService.findAll(query),
            this.notificationService.countAll(query),
        ]);

        return {
            total,
            totalPages: Math.ceil(total / (query.limit || 10)),
            currentPage: query.page || 1,
            perPage: query.limit || 10,
            data: notifications,
        };
    }

    @Patch('/mark-as-read')
    @ApiOperation({ summary: 'Marcar notificações como lida' })
    @ApiResponse({ status: 200, description: 'Notificações marcadas como lidas com sucesso.' })
    async markAsRead(@Body() body: MarkAsReadDto) {
        await this.notificationService.markManyAsRead(body.notificationIds);
        return;
    }
}