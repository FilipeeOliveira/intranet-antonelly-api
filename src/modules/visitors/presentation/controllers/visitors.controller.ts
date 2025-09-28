import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RoleType } from "src/modules/auth/domain/entities/role.entity";
import { Roles } from "src/modules/auth/presentation/decorators/roles.decorator";
import { AuthenticateGuard } from "src/modules/auth/presentation/guards/authenticate.guard";
import { VisitorsService } from "../../application/services/visitors.service";
import { CreateVisitorDto } from "../../domain/dto/create-visitors.dto";
import { UpdateVisitorDto } from "../../domain/dto/update-visitors.dto";
import { VisitorsQueryDto } from "../../domain/dto/visitors-query.dto";

@ApiTags("Gestão de Visitantes")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), AuthenticateGuard)
@Controller("visitors")
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) { }

  // Criar visitante
  @Post()
  @Roles(RoleType.ADMIN, RoleType.GERENTE)
  @ApiBody({ type: CreateVisitorDto })
  @ApiOperation({ summary: "Registrar novo visitante" })
  @ApiResponse({ status: 201, description: "Visitante criado com sucesso." })
  @ApiResponse({ status: 400, description: "Dados inválidos ou incompletos." })
  async createVisitor(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorsService.create(createVisitorDto);
  }

  // Listar visitantes
  @Get()
  @ApiOperation({ summary: "Listar visitantes com filtros e paginação" })
  @ApiResponse({ status: 200, description: "Lista de visitantes retornada com sucesso." })
  async findAll(@Query() query: VisitorsQueryDto) {
    return this.visitorsService.findAll(query);
  }

  // Buscar visitante por ID
  @Get(":id")
  @ApiOperation({ summary: "Buscar visitante por ID" })
  @ApiResponse({ status: 200, description: "Visitante encontrado." })
  @ApiResponse({ status: 404, description: "Visitante não encontrado." })
  async findOne(@Param("id") id: string) {
    return this.visitorsService.findById(id);
  }

  @Get("by-companie/:companieId")
  @ApiOperation({ summary: "Listar visitantes de uma empresa específica" })
  @ApiResponse({ status: 200, description: "Lista de visitantes da empresa retornada com sucesso." })
  async findByCompanie(
    @Param("companieId") companieId: string,
    @Query() query: VisitorsQueryDto
  ) {
    return this.visitorsService.findByCompanie(companieId, query);
  }

  // Atualizar visitante
  @Put(":id")
  @Roles(RoleType.ADMIN, RoleType.GERENTE)
  @ApiBody({ type: UpdateVisitorDto })
  @ApiOperation({ summary: "Atualizar dados do visitante" })
  @ApiResponse({ status: 200, description: "Visitante atualizado com sucesso." })
  async updateVisitor(
    @Param("id") id: string,
    @Body() updateDto: UpdateVisitorDto
  ) {
    return this.visitorsService.update(id, updateDto);
  }

  // Remover visitante
  @Delete(":id")
  @Roles(RoleType.ADMIN, RoleType.GERENTE)
  @ApiOperation({ summary: "Remover visitante" })
  @ApiResponse({ status: 200, description: "Visitante removido com sucesso." })
  async deleteVisitor(@Param("id") id: string) {
    return this.visitorsService.delete(id);
  }
}
