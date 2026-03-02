import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticateGuard } from 'src/modules/auth/presentation/guards/authenticate.guard';
import { CurrentUser } from 'src/modules/auth/presentation/decorators/current-user.decorator';
import { Features } from 'src/modules/permissions/presentation/guards/features.decorator';
import { PermissionsGuard } from 'src/modules/permissions/presentation/guards/permissions.guard';
import { Permissions } from 'src/shared/features';
import { EncomendasService } from '../../application/services/encomendas.service';
import { CreateEncomendaDto } from '../../domain/dto/create-encomenda.dto';
import { ListEncomendasDto } from '../../domain/dto/list-encomendas.dto';
import { RegistrarDevolucaoDto } from '../../domain/dto/registrar-devolucao.dto';
import { RegistrarEntregaDto } from '../../domain/dto/registrar-entrega.dto';
import { UpdateEncomendaDto } from '../../domain/dto/update-encomenda.dto';

@ApiTags('Encomendas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AuthenticateGuard, PermissionsGuard)
@Controller('encomendas')
export class EncomendasController {
  constructor(private readonly encomendasService: EncomendasService) {}

  @Post()
  @Features(Permissions.ENCOMENDAS.WRITE)
  @ApiOperation({ summary: 'Registrar recebimento de uma nova encomenda' })
  @ApiResponse({ status: 201, description: 'Encomenda registrada com sucesso.' })
  async create(
    @Body() dto: CreateEncomendaDto,
    @CurrentUser() user: { name: string },
  ) {
    return this.encomendasService.create(dto, user);
  }

  @Get()
  @Features(Permissions.ENCOMENDAS.READ)
  @ApiOperation({ summary: 'Listar encomendas (filtrado por permissão de acesso)' })
  @ApiResponse({ status: 200, description: 'Lista de encomendas retornada com sucesso.' })
  async findAll(
    @Query() query: ListEncomendasDto,
    @CurrentUser() user: { role: string; email: string },
  ) {
    return this.encomendasService.findAll(query, user);
  }

  @Get(':id')
  @Features(Permissions.ENCOMENDAS.READ)
  @ApiOperation({ summary: 'Obter encomenda por ID' })
  @ApiResponse({ status: 200, description: 'Encomenda retornada com sucesso.' })
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: { role: string; email: string },
  ) {
    return this.encomendasService.findById(id, user);
  }

  @Patch(':id/registrar-entrega')
  @Features(Permissions.ENCOMENDAS.WRITE)
  @ApiOperation({ summary: 'Registrar entrega da encomenda ao destinatário' })
  @ApiResponse({ status: 200, description: 'Entrega registrada com sucesso.' })
  async registrarEntrega(
    @Param('id') id: string,
    @Body() dto: RegistrarEntregaDto,
    @CurrentUser() user: { name: string },
  ) {
    return this.encomendasService.registrarEntrega(id, dto, user);
  }

  @Patch(':id/registrar-devolucao')
  @Features(Permissions.ENCOMENDAS.WRITE)
  @ApiOperation({ summary: 'Registrar devolução da encomenda ao remetente' })
  @ApiResponse({ status: 200, description: 'Devolução registrada com sucesso.' })
  async registrarDevolucao(
    @Param('id') id: string,
    @Body() dto: RegistrarDevolucaoDto,
  ) {
    return this.encomendasService.registrarDevolucao(id, dto);
  }

  @Put(':id')
  @Features(Permissions.ENCOMENDAS.WRITE)
  @ApiOperation({ summary: 'Atualizar encomenda (Admin)' })
  @ApiResponse({ status: 200, description: 'Encomenda atualizada com sucesso.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEncomendaDto,
  ) {
    return this.encomendasService.update(id, dto);
  }

  @Delete(':id')
  @Features(Permissions.ENCOMENDAS.WRITE)
  @ApiOperation({ summary: 'Remover encomenda (Admin)' })
  @ApiResponse({ status: 200, description: 'Encomenda removida com sucesso.' })
  async delete(@Param('id') id: string) {
    return this.encomendasService.delete(id);
  }
}
