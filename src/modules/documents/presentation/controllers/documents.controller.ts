import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { RoleType } from "src/modules/auth/domain/entities/role.entity";
import { Roles } from "src/modules/auth/presentation/decorators/roles.decorator";
import { pdfFileInterceptor } from "src/shared/interceptors/pdf-file.interceptor";
import { DocumentsService } from "../../application/services/documents.service";
import { CreateDocumentDto } from "../../domain/dto/create-document.dto";
import { DocumentQueryDto } from "../../domain/dto/document-query.dto";
import { AuthGuard } from "@nestjs/passport";
import { AuthenticateGuard } from "src/modules/auth/presentation/guards/authenticate.guard";


@ApiTags("Gestão de Documentos")
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AuthenticateGuard)
@Controller("documents")
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post()
    @Roles(RoleType.ADMIN, RoleType.GERENTE)
    @UseInterceptors(pdfFileInterceptor())
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        description: "Criação de documento com metadados e arquivo PDF",
        type: CreateDocumentDto,
        schema: {
            type: "object",
            properties: {
                title: { type: "string", example: "Manual de Segurança" },
                category: { type: "string", example: "Segurança" },
                description: { type: "string", example: "Procedimento interno de segurança", nullable: true },
                department: { type: "string", example: "RH" },
                document: { type: "string", format: "binary" },
            },
        },
    })
    @ApiOperation({ summary: "Criar novo documento com upload de PDF" })
    @ApiResponse({ status: 201, description: "Documento criado com sucesso." })
    @ApiResponse({ status: 400, description: "Arquivo inválido ou dados incompletos." })
    async createDocument(
        @Body() createDocumentDto: CreateDocumentDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) {
            throw new BadRequestException("Arquivo PDF é obrigatório!");
        }
        return this.documentsService.create(createDocumentDto, file.path);
    }

    // Listar documentos
    @Get()
    @ApiOperation({ summary: "Listar documentos com filtros e paginação" })
    @ApiResponse({ status: 200, description: "Lista de documentos retornada com sucesso." })
    async findAll(@Query() query: DocumentQueryDto) {
        return this.documentsService.findAll(query);
    }

    // Buscar documento por ID
    @Get(":id")
    @ApiOperation({ summary: "Buscar documento por ID" })
    @ApiResponse({ status: 200, description: "Documento encontrado." })
    @ApiResponse({ status: 404, description: "Documento não encontrado." })
    async findOne(@Param("id") id: string) {
        return this.documentsService.findById(id);
    }

    @Put(":id")
    @Roles(RoleType.ADMIN, RoleType.GERENTE)
    @UseInterceptors(pdfFileInterceptor())
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        description: "Atualização de documento com metadados e arquivo PDF opcional",
        type: CreateDocumentDto,
        schema: {
            type: "object",
            properties: {
                title: { type: "string" },
                category: { type: "string" },
                description: { type: "string", nullable: true },
                department: { type: "string" },
                document: { type: "string", format: "binary" },
            },
        },
    })
    @ApiOperation({ summary: "Atualizar documento com dados e/ou upload de PDF" })
    @ApiResponse({ status: 200, description: "Documento atualizado com sucesso." })
    async updateDocument(
        @Param("id") id: string,
        @Body() updateDto: Partial<CreateDocumentDto>,
        @UploadedFile() file?: Express.Multer.File
    ) {
        const filePath = file?.path;
        return this.documentsService.update(id, updateDto, filePath);
    }

    @Delete(":id")
    @Roles(RoleType.ADMIN, RoleType.GERENTE)
    @ApiOperation({ summary: "Deletar documento e arquivo físico" })
    @ApiResponse({ status: 200, description: "Documento removido com sucesso." })
    async deleteDocument(@Param("id") id: string) {
        return this.documentsService.delete(id);
    }
}
