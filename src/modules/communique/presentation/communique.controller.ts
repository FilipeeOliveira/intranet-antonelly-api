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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthenticateGuard } from "src/modules/auth/presentation/guards/authenticate.guard";
import { imageFileInterceptor } from "src/shared/interceptors/image-file.interceptor";
import { CommuniqueService } from "../application/services/communique.service";
import { CommuniqueQueryDto } from "../domain/dtos/communique-query.dto";
import { CreateCommuniqueDto } from "../domain/dtos/create-communique.dto";

import { Response } from "express";
import * as fs from "fs";
import { basename, join } from "path";
import { Public } from "src/modules/auth/presentation/decorators/public.decorator";
import { JwtAuthGuard } from "src/modules/auth/presentation/guards/jwt-auth.guard";
import { Features } from "src/modules/permissions/presentation/guards/features.decorator";
import { PermissionsGuard } from "src/modules/permissions/presentation/guards/permissions.guard";
import { Permissions } from "src/shared/features";
import { UpdateCommuniqueDto } from "../domain/dtos/update-communique.dto";

@ApiTags("Gestão de Comunicados")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AuthenticateGuard, PermissionsGuard)
@Controller("communiques")
export class CommuniqueController {
  constructor(private readonly communiqueService: CommuniqueService) {}

  @Features(Permissions.COMMUNIQUES.WRITE)
  @Post()
  @UseInterceptors(imageFileInterceptor())
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Criação de comunicado com metadados e imagem",
    type: CreateCommuniqueDto,
    schema: {
      type: "object",
      properties: {
        title: { type: "string", example: "Novo Comunicado" },
        description: { type: "string", example: "Descrição do comunicado." },
        sectorId: {
          type: "string",
          format: "uuid",
          example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        },
        authorId: {
          type: "string",
          format: "uuid",
          example: "z9y8x7w6-v5u4-3210-tsrq-po9876543210",
        },
        severity: { type: "string", example: "alta" },
        image: { type: "string", format: "binary" },
      },
    },
  })
  async createCommunique(@Body() body: CreateCommuniqueDto, @UploadedFile() file?: Express.Multer.File) {
    const imagePath = file?.filename;

    return this.communiqueService.create(body, imagePath);
  }

  @Features(Permissions.COMMUNIQUES.READ)
  @Get(":id")
  async getCommuniqueById(@Param("id") id: string) {
    return this.communiqueService.findById(id);
  }

  @Features(Permissions.COMMUNIQUES.READ)
  @Get()
  async getAllCommuniques(@Query() query: CommuniqueQueryDto) {
    return this.communiqueService.findAll(query);
  }

  // @Features(...Object.values(Permissions.COMMUNIQUES))
  @Public()
  @Get("image/:filename")
  async viewImage(@Param("filename") filename: string, @Res() res: Response) {
    const safeFilename = basename(filename);
    const uploadsDir = join(process.cwd(), "uploads/communiques");
    const imagePath = join(uploadsDir, safeFilename);

    if (!imagePath.startsWith(uploadsDir)) {
      throw new BadRequestException("Acesso inválido.");
    }

    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException("Imagem não encontrada.");
    }

    return res.sendFile(imagePath);
  }

  @Features(Permissions.COMMUNIQUES.WRITE)
  @Put(":id")
  @UseInterceptors(imageFileInterceptor())
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Criação de comunicado com metadados e imagem",
    type: UpdateCommuniqueDto,
    schema: {
      type: "object",
      properties: {
        title: { type: "string", example: "Novo Comunicado" },
        description: { type: "string", example: "Descrição do comunicado." },
        sectorId: {
          type: "string",
          format: "uuid",
          example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        },
        authorId: {
          type: "string",
          format: "uuid",
          example: "z9y8x7w6-v5u4-3210-tsrq-po9876543210",
        },
        severity: { type: "string", example: "alta" },
        image: { type: "string", format: "binary" },
      },
    },
  })
  async updateCommunique(
    @Param("id") id: string,
    @Body() body: UpdateCommuniqueDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file?.filename;

    return this.communiqueService.update(id, body, imagePath);
  }

  @Features(Permissions.COMMUNIQUES.WRITE)
  @Delete(":id")
  async deleteCommunique(@Param("id") id: string) {
    return this.communiqueService.delete(id);
  }
}
