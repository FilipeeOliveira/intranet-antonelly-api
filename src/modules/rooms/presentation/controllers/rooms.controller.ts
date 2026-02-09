import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthenticateGuard } from "src/modules/auth/presentation/guards/authenticate.guard";
import { Features } from "src/modules/permissions/presentation/guards/features.decorator";
import { PermissionsGuard } from "src/modules/permissions/presentation/guards/permissions.guard";
import { Permissions } from "src/shared/features";
import { RoomsService } from "../../application/services/rooms.service";
import { CreateRoomDto } from "../../domain/dto/create-room.dto";
import { RoomsQueryDto } from "../../domain/dto/rooms-query.dto";
import { UpdateRoomDto } from "../../domain/dto/update-room.dto";

@ApiTags('Gerenciamento de Salas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AuthenticateGuard, PermissionsGuard)
@Controller('rooms')
export class RoomsController {
    constructor(
        private readonly roomsService: RoomsService,
    ) { }

    @Features(Permissions.ROOMS.WRITE)
    @Post()
    @ApiOperation({ summary: 'Criar nova sala' })
    @ApiResponse({ status: 201, description: 'Sala criada com sucesso.' })
    async create(@Body() createRoomDto: CreateRoomDto) {
        return await this.roomsService.create(createRoomDto);
    }

    @Features(Permissions.ROOMS.READ, Permissions.MEETINGS.READ, Permissions.MEETINGS.WRITE)
    @Get()
    @ApiOperation({ summary: 'Listar salas com filtros e paginação' })
    @ApiResponse({ status: 200, description: 'Lista de salas retornada com sucesso.' })
    async findAll(@Query() query: RoomsQueryDto) {
        return await this.roomsService.findAll(query);
    }

    @Features(Permissions.ROOMS.READ, Permissions.MEETINGS.READ, Permissions.MEETINGS.WRITE)
    @Get(':id')
    @ApiOperation({ summary: 'Buscar sala por ID' })
    @ApiResponse({ status: 200, description: 'Sala encontrada com sucesso.' })
    async findById(@Param('id') id: string) {
        return await this.roomsService.findById(id);
    }


    @Features(Permissions.ROOMS.WRITE)
    @Put(':id')
    @ApiOperation({ summary: 'Atualizar sala' })
    @ApiResponse({ status: 200, description: 'Sala atualizada com sucesso.' })
    async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
        return await this.roomsService.update(id, updateRoomDto);
    }

    @Features(Permissions.ROOMS.WRITE)
    @Delete(':id')
    @ApiOperation({ summary: 'Deletar sala' })
    @ApiResponse({ status: 200, description: 'Sala removida com sucesso.' })
    async delete(@Param('id') id: string) {
        return await this.roomsService.delete(id);
    }
}