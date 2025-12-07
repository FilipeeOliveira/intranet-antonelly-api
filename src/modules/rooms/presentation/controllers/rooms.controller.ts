import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Features } from "src/modules/permissions/presentation/guards/features.decorator";
import { Permissions } from "src/shared/features";
import { RoomsService } from "../../application/services/rooms.service";
import { CreateRoomDto } from "../../domain/dto/create-room.dto";
import { RoomsQueryDto } from "../../domain/dto/rooms-query.dto";
import { UpdateRoomDto } from "../../domain/dto/update-room.dto";

@ApiTags('Gerenciamento de Salas')
@Controller('rooms')
export class RoomsController {
    constructor(
        private readonly roomsService: RoomsService,
    ) { }

    @Features(Permissions.ROOMS.CREATE)
    @Post()
    @ApiOperation({ summary: 'Criar nova sala' })
    @ApiResponse({ status: 201, description: 'Sala criada com sucesso.' })
    async create(@Body() createRoomDto: CreateRoomDto) {
        return await this.roomsService.create(createRoomDto);
    }

    @Features(Permissions.ROOMS.READ_ALL, Permissions.ROOMS.READ)
    @Get()
    @ApiOperation({ summary: 'Listar salas com filtros e paginação' })
    @ApiResponse({ status: 200, description: 'Lista de salas retornada com sucesso.' })
    async findAll(@Query() query: RoomsQueryDto) {
        return await this.roomsService.findAll(query);
    }

    @Features(Permissions.ROOMS.READ_BY_ID, Permissions.ROOMS.READ)
    @Get(':id')
    @ApiOperation({ summary: 'Buscar sala por ID' })
    @ApiResponse({ status: 200, description: 'Sala encontrada com sucesso.' })
    async findById(@Param('id') id: string) {
        return await this.roomsService.findById(id);
    }


    @Features(Permissions.ROOMS.UPDATE)
    @Put(':id')
    @ApiOperation({ summary: 'Atualizar sala' })
    @ApiResponse({ status: 200, description: 'Sala atualizada com sucesso.' })
    async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
        return await this.roomsService.update(id, updateRoomDto);
    }

    @Features(Permissions.ROOMS.DELETE)
    @Delete(':id')
    @ApiOperation({ summary: 'Deletar sala' })
    @ApiResponse({ status: 200, description: 'Sala removida com sucesso.' })
    async delete(@Param('id') id: string) {
        return await this.roomsService.delete(id);
    }
}