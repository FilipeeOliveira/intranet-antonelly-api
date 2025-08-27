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
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { existsSync, unlinkSync } from "fs";
import { diskStorage } from "multer";
import { DocumentsService } from "../../application/services/documents.service";
import { CreateDocumentDto } from "../../domain/dto/create-document.dto";
import { DocumentQueryDto } from "../../domain/dto/document-query.dto";
import { extname } from "path";

@ApiTags("Gestão de Documentos")
@Controller("documents")
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    // Criar documento com PDF
    @Post()
    @UseInterceptors(
        FileInterceptor("document", {
            storage: diskStorage({
                destination: "./uploads/documents",
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                    callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (file.mimetype === "application/pdf") {
                    callback(null, true);
                } else {
                    callback(new BadRequestException("Somente arquivos PDF são permitidos!"), false);
                }
            },
            limits: { fileSize: 5 * 1024 * 1024 }, // até 5MB
        })
    )
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
    @UseInterceptors(
        FileInterceptor("document", {
            storage: diskStorage({
                destination: "./uploads/documents",
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                    callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (file.mimetype === "application/pdf") callback(null, true);
                else callback(new BadRequestException("Somente arquivos PDF são permitidos!"), false);
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        })
    )
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
    @ApiOperation({ summary: "Deletar documento e arquivo físico" })
    @ApiResponse({ status: 200, description: "Documento removido com sucesso." })
    async deleteDocument(@Param("id") id: string) {
        return this.documentsService.delete(id);
    }
}
