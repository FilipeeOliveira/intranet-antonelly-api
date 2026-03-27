import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateCommuniqueDto {
  @ApiProperty({
    description: "Título do comunicado",
    example: "Comunicado Importante",
  })
  @IsString({ message: "Título deve ser uma string" })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: "Descrição do comunicado",
    example: "Este é um comunicado importante para todos os funcionários.",
  })
  @IsString({ message: "Descrição deve ser uma string" })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Nível de severidade do comunicado",
    example: "INFO",
  })
  @IsString({ message: "Severity deve ser uma string" })
  @IsOptional()
  severity?: string;

  @ApiProperty({
    description: "ID do autor do comunicado",
    example: "uuid-do-autor",
  })
  @IsString({ message: "AuthorId deve ser uma string" })
  @IsOptional()
  authorId?: string;

  @ApiProperty({
    description: "ID do setor relacionado ao comunicado",
    example: "uuid-do-setor",
  })
  @IsString({ message: "sectorId deve ser uma string" })
  @IsOptional()
  sectorId?: string;

  @ApiProperty({
    description: "Imagem do comunicado",
    type: "string",
    format: "binary",
  })
  image?: Express.Multer.File;

  @ApiProperty({
    description: 'Remove a imagem do comunicado (enviar "true" para remover)',
    example: "true",
    required: false,
  })
  @IsString()
  @IsOptional()
  removeImage?: string;
}
