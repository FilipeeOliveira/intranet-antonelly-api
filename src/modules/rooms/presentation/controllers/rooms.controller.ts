import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RoomsService } from "../../application/services/rooms.service";
import { CreateRoomDto } from "../../domain/dto/create-room.dto";
import { RoomsQueryDto } from "../../domain/dto/rooms-query.dto";

@ApiTags('Gerenciamento de Salas')
@Controller('rooms')
export class RoomsController {
    constructor(
        private readonly roomsService: RoomsService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Criar nova sala' })
    @ApiResponse({ status: 201, description: 'Sala criada com sucesso.' })
    async create(@Body() createRoomDto: CreateRoomDto) {
        return await this.roomsService.create(createRoomDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar salas com filtros e paginação' })
    @ApiResponse({ status: 200, description: 'Lista de salas retornada com sucesso.' })
    async findAll(@Query() query: RoomsQueryDto) {
        return await this.roomsService.findAll(query);
    }

}