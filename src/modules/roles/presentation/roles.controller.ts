import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesService } from "../application/roles.service";
import { CreateRoleDto } from "../domain/dto/create-role.dto";
import { RoleQueryDto } from "../domain/dto/role-query.dto";
import { UpdateRoleDto } from "../domain/dto/update-role.dto";
@ApiTags("Funções e Permissões")
@ApiBearerAuth()
@Controller("roles")
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get()
    @ApiOperation({ summary: "Listar roles com filtros e paginação" })
    @ApiResponse({ status: HttpStatus.OK, description: "Lista de roles retornada com sucesso" })
    async findAll(@Query() query: RoleQueryDto) {
        return this.rolesService.findAll(query);
    }

    @Get(":id")
    @ApiOperation({ summary: "Buscar role por ID" })
    @ApiResponse({ status: HttpStatus.OK, description: "Role encontrada" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Role não encontrada" })
    async findById(@Param("id") id: string) {
        return this.rolesService.findById(id);
    }

    @Post()
    @ApiOperation({ summary: "Criar nova role" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Role criada com sucesso" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Role inválida ou já existente" })
    async create(@Body() dto: CreateRoleDto) {
        return this.rolesService.create(dto);
    }

    @Patch(":id")
    @ApiOperation({ summary: "Atualizar role" })
    @ApiResponse({ status: HttpStatus.OK, description: "Role atualizada com sucesso" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Role não encontrada" })
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateRoleDto,
    ) {
        return this.rolesService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Remover role" })
    @ApiResponse({ status: HttpStatus.OK, description: "Role removida com sucesso" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Role não encontrada" })
    async delete(@Param("id") id: string) {
        return this.rolesService.delete(id);
    }
}
