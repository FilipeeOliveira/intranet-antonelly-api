import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthenticateGuard } from "src/modules/auth/presentation/guards/authenticate.guard";
import { Features } from "src/modules/permissions/presentation/guards/features.decorator";
import { PermissionsGuard } from "src/modules/permissions/presentation/guards/permissions.guard";
import { Permissions } from "src/shared/features";
import { CompanyService } from "../../application/services/companie.service";
import { CompaniesQueryDto } from "../../domain/dto/companies-query.dto";
import { CreateCompanyDto } from "../../domain/dto/create-company.dto";
import { UpdateCompanyDto } from "../../domain/dto/update-companie.dto";

@ApiTags("Empresas")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), AuthenticateGuard, PermissionsGuard)
@Controller("companies")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Features(Permissions.COMPANIES.WRITE, Permissions.VISIT_HISTORY_GENERAL.WRITE)
  @Post()
  @ApiOperation({ summary: "Criar nova empresa" })
  @ApiResponse({ status: 201, description: "Empresa criada com sucesso." })
  async create(@Body() dto: CreateCompanyDto) {
    return this.companyService.create(dto);
  }

  @Features(Permissions.COMPANIES.READ, Permissions.VISIT_HISTORY_GENERAL.READ, Permissions.VISIT_HISTORY_GENERAL.WRITE)
  @Get()
  @ApiOperation({ summary: "Listar empresas com filtros e paginação" })
  @ApiResponse({
    status: 200,
    description: "Lista de empresas retornada com sucesso.",
  })
  async findAll(@Query() query: CompaniesQueryDto) {
    return this.companyService.findAll(query);
  }

  @Features(Permissions.COMPANIES.READ, Permissions.VISIT_HISTORY_GENERAL.READ, Permissions.VISIT_HISTORY_GENERAL.WRITE)
  @Get(":id")
  @ApiOperation({ summary: "Buscar empresa por ID" })
  @ApiResponse({ status: 200, description: "Empresa encontrada." })
  @ApiResponse({ status: 404, description: "Empresa não encontrada." })
  async findById(@Param("id") id: string) {
    return this.companyService.findById(id);
  }

  @Features(Permissions.COMPANIES.WRITE, Permissions.VISIT_HISTORY_GENERAL.WRITE)
  @Put(":id")
  @ApiOperation({ summary: "Atualizar empresa" })
  @ApiResponse({ status: 200, description: "Empresa atualizada com sucesso." })
  async update(@Param("id") id: string, @Body() dto: UpdateCompanyDto) {
    return this.companyService.update(id, dto);
  }

  @Features(Permissions.COMPANIES.WRITE, Permissions.VISIT_HISTORY_GENERAL.WRITE)
  @Delete(":id")
  @ApiOperation({ summary: "Deletar empresa" })
  @ApiResponse({ status: 200, description: "Empresa removida com sucesso." })
  async delete(@Param("id") id: string) {
    return this.companyService.delete(id);
  }
}
