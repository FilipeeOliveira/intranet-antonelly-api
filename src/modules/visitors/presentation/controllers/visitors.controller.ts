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
  @ApiBody({ type: CreateVisitorDto })
  @ApiOperation({
    summary: "Registrar novo visitante",
    description: "Registra um novo visitante. Deve fornecer pelo menos um dos seguintes: email, CPF ou CNPJ. Status: 1 = presente, 2 = saiu."
  })
  @ApiResponse({
    status: 201,
    description: "Visitante criado com sucesso.",
    schema: {
      example: {
        id: "uuid-do-visitante",
        name: "João da Silva",
        email: "joao@email.com",
        cpf: null,
        cnpj: null,
        companieId: "uuid-da-empresa",
        status: 1,
        createdAt: "2024-01-01T00:00:00.000Z",
        companie: {
          id: "uuid-da-empresa",
          name: "ACME Corp"
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: "Dados inválidos ou incompletos. Deve fornecer pelo menos email, CPF ou CNPJ." })
  async createVisitor(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorsService.create(createVisitorDto);
  }

  // Listar visitantes
  @Get()
  @ApiOperation({
    summary: "Listar visitantes com filtros e paginação",
    description: "Lista visitantes com busca por nome, email, CPF ou CNPJ. Status: 1 = presente, 2 = saiu."
  })
  @ApiResponse({
    status: 200,
    description: "Lista de visitantes retornada com sucesso.",
    schema: {
      example: {
        data: [
          {
            id: "uuid-do-visitante",
            name: "João da Silva",
            email: "joao@email.com",
            cpf: null,
            cnpj: null,
            companieId: "uuid-da-empresa",
            status: 1,
            createdAt: "2024-01-01T00:00:00.000Z",
            companie: {
              id: "uuid-da-empresa",
              name: "ACME Corp"
            }
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    }
  })
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

  // Marcar visitante como saiu
  @Put(":id/exit")
  @ApiOperation({
    summary: "Marcar visitante como saiu",
    description: "Marca um visitante como saiu (status = 2)."
  })
  @ApiResponse({
    status: 200,
    description: "Visitante marcado como saiu com sucesso.",
    schema: {
      example: {
        id: "uuid-do-visitante",
        name: "João da Silva",
        email: "joao@email.com",
        cpf: null,
        cnpj: null,
        companieId: "uuid-da-empresa",
        status: 2,
        createdAt: "2024-01-01T00:00:00.000Z",
        companie: {
          id: "uuid-da-empresa",
          name: "ACME Corp"
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: "Visitante não encontrado." })
  async markAsLeft(@Param("id") id: string) {
    return this.visitorsService.markAsLeft(id);
  }

  // Atualizar visitante
  @Put(":id")
  @ApiBody({ type: UpdateVisitorDto })
  @ApiOperation({
    summary: "Atualizar dados do visitante",
    description: "Atualiza dados do visitante. Status: 1 = presente, 2 = saiu."
  })
  @ApiResponse({
    status: 200,
    description: "Visitante atualizado com sucesso.",
    schema: {
      example: {
        id: "uuid-do-visitante",
        name: "João da Silva Atualizado",
        email: "joao.novo@email.com",
        cpf: "12345678901",
        cnpj: null,
        companieId: "uuid-da-empresa",
        status: 2,
        createdAt: "2024-01-01T00:00:00.000Z",
        companie: {
          id: "uuid-da-empresa",
          name: "ACME Corp"
        }
      }
    }
  })
  async updateVisitor(
    @Param("id") id: string,
    @Body() updateDto: UpdateVisitorDto
  ) {
    return this.visitorsService.update(id, updateDto);
  }

  // Remover visitante
  @Delete(":id")
  @ApiOperation({ summary: "Remover visitante" })
  @ApiResponse({ status: 200, description: "Visitante removido com sucesso." })
  async deleteVisitor(@Param("id") id: string) {
    return this.visitorsService.delete(id);
  }
}
