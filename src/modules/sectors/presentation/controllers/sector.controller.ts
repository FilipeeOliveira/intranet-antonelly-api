import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticateGuard } from 'src/modules/auth/presentation/guards/authenticate.guard';
import { SectorService } from '../../application/services/sector.service';
import { CreateSectorDto } from '../../domain/dto/create-sector.dto';
import { UpdateSectorDto } from '../../domain/dto/update-sector.dto';
import { SectorQueryDto } from '../../domain/dto/sector-query.dto';
import { Roles } from 'src/modules/auth/presentation/decorators/roles.decorator';
import { RoleType } from 'src/modules/auth/domain/entities/role.entity';

@ApiTags('Gestão de Setores')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AuthenticateGuard)
@Controller('sectors')
export class SectorController {
    constructor(private readonly sectorService: SectorService) { }

    @Post()
    @ApiOperation({ summary: 'Criar novo setor' })
    @ApiResponse({ status: 201, description: 'Setor criado com sucesso.' })
    async create(@Body() dto: CreateSectorDto) {
        return this.sectorService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar setores com filtros e paginação' })
    @ApiResponse({ status: 200, description: 'Lista de setores retornada com sucesso.' })
    async findAll(@Query() query: SectorQueryDto) {
        return this.sectorService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar setor por ID' })
    @ApiResponse({ status: 200, description: 'Setor encontrado.' })
    @ApiResponse({ status: 404, description: 'Setor não encontrado.' })
    async findById(@Param('id') id: string) {
        return this.sectorService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar setor' })
    @ApiResponse({ status: 200, description: 'Setor atualizado com sucesso.' })
    async update(@Param('id') id: string, @Body() dto: UpdateSectorDto) {
        return this.sectorService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar setor' })
    @ApiResponse({ status: 200, description: 'Setor removido com sucesso.' })
    async delete(@Param('id') id: string) {
        return this.sectorService.delete(id);
    }
}
