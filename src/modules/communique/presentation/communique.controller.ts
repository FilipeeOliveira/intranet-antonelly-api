import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthenticateGuard } from "src/modules/auth/presentation/guards/authenticate.guard";
import { CreateCommuniqueDto } from "../domain/dtos/create-communique.dto";
import { CommuniqueQueryDto } from "../domain/dtos/communique-query.dto";
import { CommuniqueService } from "../application/services/communique.service";
import { imageFileInterceptor } from "src/shared/interceptors/image-file.interceptor";

import { Response } from "express";
import { join } from "path";
import * as fs from "fs";

@ApiTags("Gestão de Comunicados")
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AuthenticateGuard)
@Controller('communique')
export class CommuniqueController {

    constructor(
        private readonly communiqueService: CommuniqueService
    ) { }

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
                sectorId: { type: "string", format: "uuid", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
                authorId: { type: "string", format: "uuid", example: "z9y8x7w6-v5u4-3210-tsrq-po9876543210" },
                severity: { type: "string", example: "alta" },
                image: { type: "string", format: "binary" }
            },
        },
    })
    async createCommunique(
        @Body() body: CreateCommuniqueDto,
        @UploadedFile() file: Express.Multer.File

    ) {

        if (!file) throw new BadRequestException("Imagem do comunicado é obrigatória.");

        const imagePath = file.filename;

        return this.communiqueService.create(body, imagePath);
    }

    @Get(':id')
    async getCommuniqueById(
        @Param('id') id: string
    ) {
        return { message: "Detalhes do comunicado!" };
    }


    @Get()
    async getAllCommuniques(
        @Query() query: CommuniqueQueryDto
    ) {
        return this.communiqueService.findAll(query);
    }

    @Get("image/:filename")
    async viewImage(
        @Param("filename") filename: string,
        @Res() res: Response
    ) {
        const imagePath = join(process.cwd(), "uploads/communiques", filename);

        if (!fs.existsSync(imagePath)) {
            throw new NotFoundException("Imagem não encontrada.");
        }

        return res.sendFile(imagePath);
    }

    @Put(':id')
    async updateCommunique() {
        return { message: "Comunicado atualizado com sucesso!" };
    }

    @Delete(':id')
    async deleteCommunique() {
        return { message: "Comunicado deletado com sucesso!" };
    }
}