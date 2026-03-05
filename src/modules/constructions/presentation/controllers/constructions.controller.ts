import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "src/modules/auth/presentation/decorators/current-user.decorator";
import { AuthenticateGuard } from "src/modules/auth/presentation/guards/authenticate.guard";
import { Features } from "src/modules/permissions/presentation/guards/features.decorator";
import { PermissionsGuard } from "src/modules/permissions/presentation/guards/permissions.guard";
import { Permissions } from "src/shared/features";
import { ConstructionsService } from "../../application/services/constructions.service";
import { CreateConstructionDto } from "../../domain/dto/create-construction.dto";
import { FilterConstructionDto } from "../../domain/dto/filter-construction.dto";
import { UpdateConstructionDto } from "../../domain/dto/update-construction.dto";
import { UpdateConstructionStatusDto } from "../../domain/dto/update-construction-status.dto";

interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

@ApiTags("Obras")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), AuthenticateGuard, PermissionsGuard)
@Controller("constructions")
export class ConstructionsController {
  constructor(private readonly constructionsService: ConstructionsService) {}

  @Features(Permissions.CONSTRUCTIONS.READ)
  @Get()
  @ApiOperation({ summary: "Listar obras com filtros e paginação" })
  @ApiResponse({
    status: 200,
    description: "Lista de obras retornada com sucesso.",
  })
  async findAll(@Query() filters: FilterConstructionDto, @CurrentUser() user: UserPayload) {
    return this.constructionsService.findAll(filters, user);
  }

  @Features(Permissions.CONSTRUCTIONS.READ)
  @Get(":id")
  @ApiOperation({ summary: "Detalhar uma obra" })
  @ApiParam({ name: "id", description: "UUID da obra" })
  @ApiResponse({ status: 200, description: "Obra retornada com sucesso." })
  @ApiResponse({ status: 404, description: "Obra não encontrada." })
  async findOne(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() user: UserPayload) {
    return this.constructionsService.findOne(id, user);
  }

  @Features(Permissions.CONSTRUCTIONS.WRITE)
  @Post()
  @ApiOperation({ summary: "Criar nova obra" })
  @ApiResponse({ status: 201, description: "Obra criada com sucesso." })
  async create(@Body() dto: CreateConstructionDto, @CurrentUser() user: UserPayload) {
    return this.constructionsService.create(dto, user);
  }

  @Features(Permissions.CONSTRUCTIONS.WRITE)
  @Put(":id")
  @ApiOperation({ summary: "Editar obra" })
  @ApiParam({ name: "id", description: "UUID da obra" })
  @ApiResponse({ status: 200, description: "Obra atualizada com sucesso." })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateConstructionDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.constructionsService.update(id, dto, user);
  }

  @Features(Permissions.CONSTRUCTIONS.DELETE)
  @Delete(":id")
  @ApiOperation({ summary: "Excluir obra" })
  @ApiParam({ name: "id", description: "UUID da obra" })
  @ApiResponse({ status: 200, description: "Obra removida com sucesso." })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.constructionsService.remove(id);
  }

  @Features(Permissions.CONSTRUCTIONS.WRITE)
  @Patch(":id/status")
  @ApiOperation({ summary: "Alterar status da obra" })
  @ApiParam({ name: "id", description: "UUID da obra" })
  @ApiResponse({ status: 200, description: "Status alterado com sucesso." })
  async updateStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateConstructionStatusDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.constructionsService.updateStatus(id, dto.status, user);
  }

  @Features(Permissions.CONSTRUCTIONS.READ)
  @Get(":id/progress")
  @ApiOperation({ summary: "Obter progresso calculado da obra" })
  @ApiParam({ name: "id", description: "UUID da obra" })
  @ApiResponse({
    status: 200,
    description: "Dados de progresso retornados com sucesso.",
  })
  async getProgress(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() user: UserPayload) {
    return this.constructionsService.getProgress(id, user);
  }

  @Features(Permissions.CONSTRUCTIONS.WRITE)
  @Post(":id/members/:userId")
  @ApiOperation({ summary: "Adicionar membro à obra" })
  @ApiParam({ name: "id", description: "UUID da obra" })
  @ApiParam({ name: "userId", description: "UUID do usuário a adicionar" })
  @ApiResponse({ status: 201, description: "Membro adicionado com sucesso." })
  async addMember(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("userId", ParseUUIDPipe) userId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.constructionsService.addMember(id, userId, user);
  }

  @Features(Permissions.CONSTRUCTIONS.WRITE)
  @Delete(":id/members/:userId")
  @ApiOperation({ summary: "Remover membro da obra" })
  @ApiParam({ name: "id", description: "UUID da obra" })
  @ApiParam({ name: "userId", description: "UUID do usuário a remover" })
  @ApiResponse({ status: 200, description: "Membro removido com sucesso." })
  async removeMember(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("userId", ParseUUIDPipe) userId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.constructionsService.removeMember(id, userId, user);
  }
}
