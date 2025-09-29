import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticateGuard } from 'src/modules/auth/presentation/guards/authenticate.guard';
import { CompanieService } from '../../application/services/companie.service';
import { CreateCompanieDto } from '../../domain/dto/create-companie.dto';
import { UpdateCompanieDto } from '../../domain/dto/update-companie.dto';
import { CompanieQueryDto } from '../../domain/dto/companie-query.dto';
import { Roles } from 'src/modules/auth/presentation/decorators/roles.decorator';
import { RoleType } from 'src/modules/auth/domain/entities/role.entity';

@ApiTags('Empresas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AuthenticateGuard)
@Controller('companies')
export class CompanieController {
  constructor(private readonly companieService: CompanieService) {}

  @Post()
  @Roles(RoleType.ADMIN, RoleType.GERENTE)
  @ApiOperation({ summary: 'Criar nova empresa' })
  @ApiResponse({ status: 201, description: 'Empresa criada com sucesso.' })
  async create(@Body() dto: CreateCompanieDto) {
    return this.companieService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar empresas com filtros e paginação' })
  @ApiResponse({ status: 200, description: 'Lista de empresas retornada com sucesso.' })
  async findAll(@Query() query: CompanieQueryDto) {
    return this.companieService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar empresa por ID' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada.' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada.' })
  async findById(@Param('id') id: string) {
    return this.companieService.findById(id);
  }

  @Put(':id')
  @Roles(RoleType.ADMIN, RoleType.GERENTE)
  @ApiOperation({ summary: 'Atualizar empresa' })
  @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso.' })
  async update(@Param('id') id: string, @Body() dto: UpdateCompanieDto) {
    return this.companieService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.GERENTE)
  @ApiOperation({ summary: 'Deletar empresa' })
  @ApiResponse({ status: 200, description: 'Empresa removida com sucesso.' })
  async delete(@Param('id') id: string) {
    return this.companieService.delete(id);
  }
}
