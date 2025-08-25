import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { extname } from "path";

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/documents', // pasta onde vai salvar
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                // Aceita apenas PDF e Word
                if (
                    file.mimetype === 'application/pdf' ||
                    file.mimetype === 'application/msword' ||
                    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ) {
                    callback(null, true);
                } else {
                    callback(
                        new BadRequestException('Somente arquivos PDF ou Word são permitidos!'),
                        false,
                    );
                }
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // até 5MB
            },
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Arquivo inválido!');
        }
        return {
            message: 'Upload realizado com sucesso!',
            fileName: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
        };
    }
}