// create-document.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum DocumentStatus {
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    APPROVED = 'APPROVED',
}

export class CreateDocumentDto {
    @ApiProperty({
        description: 'Título do procedimento do documento',
        example: 'Manual de Segurança do Trabalho',
    })
    @IsString({ message: 'Título deve ser uma string' })
    @IsNotEmpty({ message: 'Título é obrigatório' })
    title: string;

    @ApiProperty({
        description: 'Categoria do documento',
        example: 'Segurança',
    })
    @IsString({ message: 'Categoria deve ser uma string' })
    @IsNotEmpty({ message: 'Categoria é obrigatória' })
    category: string;

    @ApiProperty({
        description: 'Descrição detalhada do documento',
        example: 'Este documento contém instruções sobre normas de segurança',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Descrição deve ser uma string' })
    description?: string;

    @ApiProperty({
        description: 'Departamento responsável pelo documento',
        example: 'RH',
    })
    @IsString({ message: 'Departamento deve ser uma string' })
    @IsNotEmpty({ message: 'Departamento é obrigatório' })
    department: string;

    @ApiProperty({
        description: 'Status do documento (definido automaticamente na criação)',
        enum: DocumentStatus,
        example: DocumentStatus.PENDING,
        required: false,
    })
    @IsOptional()
    @IsEnum(DocumentStatus, { message: 'Status deve ser um valor válido' })
    status?: DocumentStatus;


    @ApiProperty({
        description: 'Arquivo do documento (PDF)',
        type: 'string',
        format: 'binary',
    })
    document: Express.Multer.File;

}
