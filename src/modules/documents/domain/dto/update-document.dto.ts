// update-document.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, Matches } from "class-validator";

export enum DocumentStatus {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
}

export class UpdateDocumentDto {
  @ApiProperty({
    description: "Título do procedimento do documento",
    example: "Manual de Segurança do Trabalho",
  })
  @IsString({ message: "Título deve ser uma string" })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: "Descrição detalhada do documento",
    example: "Este documento contém instruções sobre normas de segurança",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Descrição deve ser uma string" })
  description?: string;

  @ApiProperty({
    description: "ID do Setor do documento",
  })
  @IsOptional()
  @IsString({ message: "Setor deve ser uma string" })
  sectorId?: string;

  @ApiProperty({
    description: "Versão do documento",
    example: "1.0",
  })
  @IsOptional()
  @Matches(/^\d+(\.\d+){0,2}$/, {
    message: "Versão deve estar no formato X.Y ou X.Y.Z",
  })
  @IsString({ message: "Versão deve ser uma string" })
  version?: string;

  @ApiProperty({
    description: "Status do documento (definido automaticamente na criação)",
    enum: DocumentStatus,
    example: DocumentStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(DocumentStatus, { message: "Status deve ser um valor válido" })
  status?: DocumentStatus;

  @ApiProperty({
    description: "Arquivo do documento (PDF)",
    type: "string",
    format: "binary",
  })
  @IsOptional()
  document?: Express.Multer.File;

  @ApiProperty({
    description: "Nota da versão (obrigatório quando um novo arquivo é enviado)",
    example: "Correções de formatação e atualização de política",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Nota da versão deve ser uma string" })
  versionNote?: string;
}
