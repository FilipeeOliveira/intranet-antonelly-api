import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticateGuard } from 'src/modules/auth/presentation/guards/authenticate.guard';
import { Features } from 'src/modules/permissions/presentation/guards/features.decorator';
import { PermissionsGuard } from 'src/modules/permissions/presentation/guards/permissions.guard';
import { Permissions } from 'src/shared/features';
import { SectorService } from '../../application/services/sector.service';
import { CreateSectorDto } from '../../domain/dto/create-sector.dto';
import { SectorQueryDto } from '../../domain/dto/sector-query.dto';
import { UpdateSectorDto } from '../../domain/dto/update-sector.dto';

const NESTED_PERMISSIONS = [
    Permissions.COMMUNIQUES.WRITE,
    Permissions.COMMUNIQUES.READ,
    Permissions.DOCUMENTS.WRITE,
    Permissions.DOCUMENTS.READ
];

@ApiTags('Gestão de Setores')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AuthenticateGuard, PermissionsGuard)
@Controller('sectors')
export class SectorController {
    constructor(private readonly sectorService: SectorService) { }



    @Features(Permissions.SECTORS.WRITE, ...NESTED_PERMISSIONS)
    @Post()
    @ApiOperation({ summary: 'Criar novo setor' })
    @ApiResponse({ status: 201, description: 'Setor criado com sucesso.' })
    async create(@Body() dto: CreateSectorDto) {
        return this.sectorService.create(dto);
    }

    @Features(Permissions.SECTORS.READ, ...NESTED_PERMISSIONS)
    @Get()
    @ApiOperation({ summary: 'Listar setores com filtros e paginação' })
    @ApiResponse({ status: 200, description: 'Lista de setores retornada com sucesso.' })
    async findAll(@Query() query: SectorQueryDto) {
        return this.sectorService.findAll(query);
    }

    @Features(Permissions.SECTORS.READ, ...NESTED_PERMISSIONS)
    @Get(':id')
    @ApiOperation({ summary: 'Buscar setor por ID' })
    @ApiResponse({ status: 200, description: 'Setor encontrado.' })
    @ApiResponse({ status: 404, description: 'Setor não encontrado.' })
    async findById(@Param('id') id: string) {
        return this.sectorService.findById(id);
    }

    @Features(Permissions.SECTORS.WRITE)
    @Put(':id')
    @ApiOperation({ summary: 'Atualizar setor' })
    @ApiResponse({ status: 200, description: 'Setor atualizado com sucesso.' })
    async update(@Param('id') id: string, @Body() dto: UpdateSectorDto) {
        return this.sectorService.update(id, dto);
    }

    @Features(Permissions.SECTORS.WRITE)
    @Delete(':id')
    @ApiOperation({ summary: 'Deletar setor' })
    @ApiResponse({ status: 200, description: 'Setor removido com sucesso.' })
    async delete(@Param('id') id: string) {
        return this.sectorService.delete(id);
    }
}
