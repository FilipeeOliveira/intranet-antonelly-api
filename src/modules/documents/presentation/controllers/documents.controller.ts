import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { createHash } from "crypto";
import { Response } from "express";
import { createReadStream, existsSync, statSync } from "fs";
import { join } from "path";
import { AuthenticateGuard } from "src/modules/auth/presentation/guards/authenticate.guard";
import { Features } from "src/modules/permissions/presentation/guards/features.decorator";
import { PermissionsGuard } from "src/modules/permissions/presentation/guards/permissions.guard";
import { Permissions } from "src/shared/features";
import { pdfFileInterceptor } from "src/shared/interceptors/pdf-file.interceptor";
import { DocumentsService } from "../../application/services/documents.service";
import { CreateDocumentDto } from "../../domain/dto/create-document.dto";
import { DocumentQueryDto } from "../../domain/dto/document-query.dto";

@ApiTags("Gestão de Documentos")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), AuthenticateGuard, PermissionsGuard)
@Controller("documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Features(Permissions.DOCUMENTS.WRITE)
  @Post()
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
        description: {
          type: "string",
          example: "Procedimento interno de segurança",
          nullable: true,
        },
        department: { type: "string", example: "RH" },
        document: { type: "string", format: "binary" },
      },
    },
  })
  @ApiOperation({ summary: "Criar novo documento com upload de PDF" })
  @ApiResponse({ status: 201, description: "Documento criado com sucesso." })
  @ApiResponse({
    status: 400,
    description: "Arquivo inválido ou dados incompletos.",
  })
  async createDocument(@Body() createDocumentDto: CreateDocumentDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Arquivo PDF é obrigatório!");
    }
    return this.documentsService.create(createDocumentDto, file.path);
  }

  // Listar documentos
  @Features(Permissions.DOCUMENTS.READ)
  @Get()
  @ApiOperation({ summary: "Listar documentos com filtros e paginação" })
  @ApiResponse({
    status: 200,
    description: "Lista de documentos retornada com sucesso.",
  })
  async findAll(@Query() query: DocumentQueryDto) {
    return this.documentsService.findAll(query);
  }

  // Buscar documento por ID
  @Features(Permissions.DOCUMENTS.READ)
  @Get(":id")
  @ApiOperation({ summary: "Buscar documento por ID" })
  @ApiResponse({ status: 200, description: "Documento encontrado." })
  @ApiResponse({ status: 404, description: "Documento não encontrado." })
  async findOne(@Param("id") id: string) {
    return this.documentsService.findById(id);
  }

  @Features(Permissions.DOCUMENTS.READ)
  @Get(":id/download")
  async downloadDocument(@Param("id") id: string, @Res() res: Response) {
    const document = await this.documentsService.findById(id);
    if (!document) {
      throw new NotFoundException("Documento não encontrado");
    }

    const filePath = document.filePath;
    const filename = `${document.title}.pdf`;
    const encodedFilename = encodeURIComponent(filename);

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`);
    res.setHeader("Content-Type", "application/pdf");

    const fileStream = createReadStream(join(process.cwd(), filePath));
    fileStream.pipe(res);
  }

  @Features(Permissions.DOCUMENTS.READ)
  @Get(":id/view")
  @ApiOperation({ summary: "Visualizar documento PDF inline no navegador" })
  @ApiResponse({
    status: 200,
    description: "PDF retornado para visualização inline.",
    schema: { type: "string", format: "binary" },
  })
  @ApiResponse({
    status: 404,
    description: "Documento ou arquivo não encontrado.",
  })
  @ApiResponse({ status: 500, description: "Erro ao processar arquivo." })
  async viewDocument(@Param("id") id: string, @Res() res: Response) {
    // Busca documento no banco de dados
    const document = await this.documentsService.findById(id);
    if (!document) {
      throw new NotFoundException("Documento não encontrado no sistema");
    }

    const fullPath = join(process.cwd(), document.filePath);

    // Valida se arquivo físico existe
    if (!existsSync(fullPath)) {
      throw new NotFoundException(`Arquivo físico não encontrado: ${document.filePath}`);
    }

    try {
      // Obtém informações do arquivo para cache
      const stats = statSync(fullPath);
      const fileSize = stats.size;
      const lastModified = stats.mtime.toUTCString();

      // Gera ETag baseado no path e última modificação
      const etag = createHash("md5").update(`${document.filePath}-${stats.mtime.getTime()}`).digest("hex");

      // Headers para visualização inline no navegador
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${document.title}.pdf"`);
      res.setHeader("Content-Length", fileSize);

      // Headers de cache (1 hora)
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.setHeader("ETag", etag);
      res.setHeader("Last-Modified", lastModified);

      // Streaming do arquivo
      const fileStream = createReadStream(fullPath);
      fileStream.pipe(res);
    } catch (error) {
      throw new NotFoundException(`Erro ao processar arquivo: ${error.message}`);
    }
  }

  @Features(Permissions.DOCUMENTS.READ)
  @Get("history/:id")
  @ApiOperation({ summary: "Obter histórico de versões de um documento" })
  @ApiResponse({
    status: 200,
    description: "Histórico de versões retornado com sucesso.",
  })
  @ApiResponse({ status: 404, description: "Documento não encontrado." })
  async getDocumentHistory(@Param("id") id: string) {
    return this.documentsService.getHistory(id);
  }

  @Features(Permissions.DOCUMENTS.READ)
  @Get("history/:id/view")
  @ApiOperation({
    summary: "Visualizar documento PDF antigo inline no navegador",
  })
  @ApiResponse({
    status: 200,
    description: "PDF retornado para visualização inline.",
    schema: { type: "string", format: "binary" },
  })
  @ApiResponse({
    status: 404,
    description: "Documento ou arquivo não encontrado.",
  })
  @ApiResponse({ status: 500, description: "Erro ao processar arquivo." })
  async viewDocumentHistory(@Param("id") id: string, @Res() res: Response) {
    // Busca documento no banco de dados
    const document = await this.documentsService.findHistoryById(id);
    if (!document) {
      throw new NotFoundException("Documento não encontrado no sistema");
    }

    const fullPath = join(process.cwd(), document.filePath);

    // Valida se arquivo físico existe
    if (!existsSync(fullPath)) {
      throw new NotFoundException(`Arquivo físico não encontrado: ${document.filePath}`);
    }

    try {
      // Obtém informações do arquivo para cache
      const stats = statSync(fullPath);
      const fileSize = stats.size;
      const lastModified = stats.mtime.toUTCString();

      // Gera ETag baseado no path e última modificação
      const etag = createHash("md5").update(`${document.filePath}-${stats.mtime.getTime()}`).digest("hex");

      // Headers para visualização inline no navegador
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${document.title}.pdf"`);
      res.setHeader("Content-Length", fileSize);

      // Headers de cache (1 hora)
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.setHeader("ETag", etag);
      res.setHeader("Last-Modified", lastModified);

      // Streaming do arquivo
      const fileStream = createReadStream(fullPath);
      fileStream.pipe(res);
    } catch (error) {
      throw new NotFoundException(`Erro ao processar arquivo: ${error.message}`);
    }
  }

  @Features(Permissions.DOCUMENTS.READ)
  @Get("history/:id/download")
  async downloadDocumentHistory(@Param("id") id: string, @Res() res: Response) {
    const document = await this.documentsService.findHistoryById(id);
    if (!document) {
      throw new NotFoundException("Documento não encontrado");
    }

    const filePath = document.filePath;
    const filename = `${document.title}.pdf`;
    const encodedFilename = encodeURIComponent(filename);

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`);
    res.setHeader("Content-Type", "application/pdf");

    const fileStream = createReadStream(join(process.cwd(), filePath));
    fileStream.pipe(res);
  }

  @Features(Permissions.DOCUMENTS.WRITE)
  @Put(":id")
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
        versionNote: {
          type: "string",
          description: "Nota da versão (obrigatório quando um novo arquivo é enviado)",
        },
      },
    },
  })
  @ApiOperation({ summary: "Atualizar documento com dados e/ou upload de PDF" })
  @ApiResponse({
    status: 200,
    description: "Documento atualizado com sucesso.",
  })
  async updateDocument(
    @Param("id") id: string,
    @Body() updateDto: Partial<CreateDocumentDto & { versionNote?: string }>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const filePath = file?.path;
    return this.documentsService.update(id, updateDto, filePath);
  }

  @Features(Permissions.DOCUMENTS.WRITE)
  @Delete(":id")
  @ApiOperation({ summary: "Deletar documento e arquivo físico" })
  @ApiResponse({ status: 200, description: "Documento removido com sucesso." })
  async deleteDocument(@Param("id") id: string) {
    return this.documentsService.delete(id);
  }
}
